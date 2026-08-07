/* 알림 설정 — '기본값으로' 초기화 + '알림 설정 저장' 확인→완료 모달 (데모)
   · 기본값으로: 로드 시점(초기 기본값)의 토글 on/off · 방해 금지 시간으로 되돌림
   · 알림 설정 저장: 확인 모달 → 확인 → 완료 모달
   토글 자체 동작은 toggle.js, 모달 열기/닫기는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var resetBtn = document.querySelector('.notify-actions .member-btn--cancel');
  var saveBtn = document.querySelector('.notify-actions .member-btn--save');
  var confirmM = document.getElementById('notify-save-confirm');
  var doneM = document.getElementById('notify-save-done');

  var toggles = [].slice.call(document.querySelectorAll('.account-toggle'));
  var times = [].slice.call(document.querySelectorAll('.dnd__time'));

  // 초기(기본값) 스냅샷 — 저장해도 바뀌지 않음
  var defaults = {
    toggles: toggles.map(function (t) { return t.classList.contains('is-on'); }),
    times: times.map(function (t) { return t.value; })
  };

  function openModal(m) {
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var c = m.querySelector('[data-modal-close]');
    if (c) c.focus();
  }

  // 기본값으로 — 사용자가 바꾼 설정 초기화
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      toggles.forEach(function (t, i) {
        var on = defaults.toggles[i];
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      times.forEach(function (t, i) { t.value = defaults.times[i]; });
    });
  }

  // 알림 설정 저장 — 확인 → 완료
  if (saveBtn && confirmM && doneM) {
    saveBtn.addEventListener('click', function () { openModal(confirmM); });

    var confirmBtn = confirmM.querySelector('[data-notify-confirm]');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        confirmM.hidden = true;      // 배경 스크롤 잠금은 완료 모달로 이어짐
        doneM.hidden = false;
        var c = doneM.querySelector('[data-modal-close]');
        if (c) c.focus();
      });
    }
  }
})();
