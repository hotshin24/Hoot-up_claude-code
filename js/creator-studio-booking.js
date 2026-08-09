/* 크리에이터 스튜디오 예약 (creator-studio-booking.html) — 데모
   · '일정 변경' → 예약 박스 아래로 일정 패널(캘린더) 펼침
   · 날짜(예약 가능) 클릭 → 시간 선택 패널 표시 (1시간 단위, 여러 시간대 선택 가능)
   · '이 시간으로 변경' → 다가오는 예약 카드(날짜·시간) 갱신 + 패널 닫힘
   · '예약 취소' 확인 → 완료 모달 + 예약 카드 비우기 (열기/닫기는 modal.js)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var calendar = document.querySelector('[data-stu-calendar]');
  var grid = calendar && calendar.querySelector('.stu-cal__grid');
  if (!calendar || !grid) return;

  // 달력을 여는 버튼들: '일정 변경' + '예약 신청'
  var openers = [].slice.call(document.querySelectorAll('[data-stu-edit], [data-stu-open]'));
  function setExpanded(v) { openers.forEach(function (b) { b.setAttribute('aria-expanded', v ? 'true' : 'false'); }); }
  function openCalendar() {
    calendar.hidden = false;
    setExpanded(true);
    calendar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  var DOW = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  var monthEl = document.querySelector('.stu-booking__month');
  var dayEl = document.querySelector('.stu-booking__day');
  var dowEl = document.querySelector('.stu-booking__dow');
  var titleEl = document.querySelector('[data-stu-booking-title]');

  var times = document.querySelector('[data-stu-times]');
  var timesGrid = document.querySelector('[data-stu-times-grid]');
  var timesDate = document.querySelector('[data-stu-times-date]');
  var timesSummary = document.querySelector('[data-stu-times-summary]');
  var timesConfirm = document.querySelector('[data-stu-times-confirm]');

  var cells = [].slice.call(grid.children);   // pad + day 전체 (요일 계산용)
  var picked = null;                          // { num, dow }

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function fmt(h) { return pad(h) + ':00'; }

  // '일정 변경' · '예약 신청' → 일정 패널 열기
  openers.forEach(function (btn) { btn.addEventListener('click', openCalendar); });

  // 날짜(예약 가능) 선택 → 시간 선택 패널 표시
  grid.addEventListener('click', function (e) {
    var day = e.target.closest('.stu-cal__day--avail');
    if (!day) return;

    grid.querySelectorAll('.is-picked').forEach(function (el) { el.classList.remove('is-picked'); });
    day.classList.add('is-picked');

    var num = parseInt(day.textContent, 10);
    var idx = cells.indexOf(day);
    picked = { num: num, dow: idx >= 0 ? DOW[idx % 7] : '' };

    if (timesDate) timesDate.textContent = '8월 ' + num + '일';
    // 시간 선택 초기화
    if (timesGrid) timesGrid.querySelectorAll('.is-selected').forEach(function (b) { b.classList.remove('is-selected'); });
    updateTimes();
    if (times) times.hidden = false;
    if (times) times.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // 시간 슬롯 토글
  function selectedStarts() {
    if (!timesGrid) return [];
    return [].slice.call(timesGrid.querySelectorAll('.stu-slot.is-selected'))
      .map(function (b) { return parseInt(b.getAttribute('data-start'), 10); })
      .sort(function (a, b) { return a - b; });
  }

  function updateTimes() {
    var starts = selectedStarts();
    if (!starts.length) {
      if (timesSummary) timesSummary.textContent = '선택한 시간이 없습니다';
      if (timesConfirm) timesConfirm.disabled = true;
      return;
    }
    var min = starts[0], max = starts[starts.length - 1] + 1;   // 종료시각 = 마지막 슬롯 +1h
    if (timesSummary) timesSummary.textContent = fmt(min) + ' – ' + fmt(max) + ' · 총 ' + starts.length + '시간';
    if (timesConfirm) timesConfirm.disabled = false;
  }

  if (timesGrid) {
    timesGrid.addEventListener('click', function (e) {
      var slot = e.target.closest('.stu-slot');
      if (!slot) return;
      slot.classList.toggle('is-selected');
      updateTimes();
    });
  }

  // '이 시간으로 변경' → 예약 카드 갱신 + 패널 닫기
  if (timesConfirm) {
    timesConfirm.addEventListener('click', function () {
      var starts = selectedStarts();
      if (!picked || !starts.length) return;
      var min = starts[0], max = starts[starts.length - 1] + 1;

      // 캘린더 '내 예약' 이동
      var prevMine = grid.querySelector('.stu-cal__day--mine');
      if (prevMine) { prevMine.classList.remove('stu-cal__day--mine'); prevMine.classList.add('stu-cal__day--avail'); }
      var pickedEl = grid.querySelector('.is-picked');
      if (pickedEl) { pickedEl.classList.remove('is-picked', 'stu-cal__day--avail'); pickedEl.classList.add('stu-cal__day--mine'); }

      // 다가오는 예약 카드 갱신
      if (monthEl) monthEl.textContent = '8월';
      if (dayEl) dayEl.textContent = pad(picked.num);
      if (dowEl) dowEl.textContent = picked.dow;
      if (titleEl) titleEl.textContent = '강의 촬영 스튜디오 · ' + fmt(min) + ' – ' + fmt(max) + ' (' + starts.length + '시간)';

      // 예약 없는 상태(취소 후)였다면 예약 카드 다시 표시 + 빈 상태 숨김
      if (booking) booking.hidden = false;
      if (empty) empty.hidden = true;

      // 패널 닫기
      calendar.hidden = true;
      setExpanded(false);
      if (times) times.hidden = true;
    });
  }

  // 예약 취소 — 확인 모달의 '예약 취소하기' → 완료 모달 + 예약 카드 비우기
  var cancelConfirm = document.getElementById('stu-cancel-confirm');
  var cancelDone = document.getElementById('stu-cancel-done');
  var booking = document.querySelector('[data-stu-booking]');
  var empty = document.querySelector('[data-stu-empty]');
  var cancelBtn = cancelConfirm && cancelConfirm.querySelector('[data-stu-cancel-confirm]');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      if (booking) booking.hidden = true;
      if (empty) empty.hidden = false;
      if (calendar) { calendar.hidden = true; setExpanded(false); }
      if (cancelConfirm) cancelConfirm.hidden = true;
      if (cancelDone) {
        cancelDone.hidden = false;
        var c = cancelDone.querySelector('[data-modal-close]');
        if (c) c.focus();
      }
    });
  }
})();
