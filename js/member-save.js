/* 회원정보 — 편집/보기 2단계 (데모)
   · 편집 모드(input 수정 가능): 버튼 '변경사항 저장'
       클릭 → 확인 모달(내용 요약) → 확인 → 완료 모달 + 보기 모드로 전환
   · 보기 모드(값이 리스트로 고정): 버튼 '수정하기'
       클릭 → 다시 편집 모드
   닫기(취소·X·배경·Esc)는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var form = document.querySelector('.member-form');
  var saveBtn = document.querySelector('.member-btn--save');
  var confirmM = document.getElementById('member-save-confirm');
  var doneM = document.getElementById('member-save-done');
  if (!form || !saveBtn || !confirmM || !doneM) return;

  var summary = confirmM.querySelector('[data-save-summary]');
  var cancelBtn = document.querySelector('.member-btn--cancel');
  var editableInputs = ['field-nickname', 'field-name', 'field-phone']; // 이메일은 항상 비활성
  var chipsAll = [].slice.call(document.querySelectorAll('.member-interest__chips .member-chip'));
  var avatar = document.querySelector('.member-photo__avatar');

  // 편집 진입 시점의 값 스냅샷 → 취소 시 복원
  var snapshot = null;
  function takeSnapshot() {
    snapshot = {
      fields: {},
      chips: chipsAll.map(function (c) { return c.classList.contains('is-active'); }),
      avatar: avatar ? avatar.getAttribute('src') : null
    };
    editableInputs.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) snapshot.fields[id] = el.value;
    });
  }
  function restoreSnapshot() {
    if (!snapshot) return;
    editableInputs.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && id in snapshot.fields) el.value = snapshot.fields[id];
    });
    chipsAll.forEach(function (c, i) {
      var on = snapshot.chips[i];
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (avatar && snapshot.avatar != null) avatar.setAttribute('src', snapshot.avatar);
  }

  function setMode(view) {
    form.classList.toggle('is-view', view);
    editableInputs.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.readOnly = view;
    });
    saveBtn.textContent = view ? '수정하기' : '변경사항 저장';
  }

  function openModal(m) {
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var c = m.querySelector('[data-modal-close]');
    if (c) c.focus();
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function buildSummary() {
    if (!summary) return;
    var chips = [].slice.call(
      document.querySelectorAll('.member-interest__chips .member-chip.is-active')
    ).map(function (c) { return c.textContent.trim(); });

    var rows = [
      ['닉네임', val('field-nickname')],
      ['이름', val('field-name')],
      ['이메일', val('field-email')],
      ['휴대폰', val('field-phone')],
      ['관심 카테고리', chips.length ? chips.join(', ') : '없음']
    ];

    summary.innerHTML = '';
    rows.forEach(function (r) {
      var row = document.createElement('div');
      row.className = 'save-summary__row';
      var dt = document.createElement('dt');
      dt.textContent = r[0];
      var dd = document.createElement('dd');
      dd.textContent = r[1];
      row.appendChild(dt);
      row.appendChild(dd);
      summary.appendChild(row);
    });
  }

  saveBtn.addEventListener('click', function () {
    // 보기 모드에서 클릭 → 편집 모드로 복귀 (모달 없음)
    if (form.classList.contains('is-view')) {
      takeSnapshot();          // 편집 전 값 저장 (취소 시 복원용)
      setMode(false);
      var first = document.getElementById('field-nickname');
      if (first) first.focus();
      return;
    }
    // 편집 모드에서 클릭 → 확인 모달
    buildSummary();
    openModal(confirmM);
  });

  var confirmBtn = confirmM.querySelector('[data-save-confirm]');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      confirmM.hidden = true;      // 배경 스크롤 잠금은 완료 모달로 이어짐
      doneM.hidden = false;
      setMode(true);               // 저장 확정 → 보기(리스트) 모드
      var c = doneM.querySelector('[data-modal-close]');
      if (c) c.focus();
    });
  }

  // 취소 → 편집 내용 되돌리고 보기 모드로
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      restoreSnapshot();
      setMode(true);
    });
  }

  setMode(true); // 초기: 보기(리스트) 모드 — '수정하기' 클릭 시 편집
})();
