/* 크리에이터 공개 프로필 — 공개 저장 ↔ 수정하기 토글 (데모)
   · 공개 저장 클릭 → 입력 readonly(보기 모드) + 버튼 '수정하기' + 임시 저장 숨김 + 완료 모달
   · 수정하기 클릭 → 입력 편집 가능 + 버튼 '공개 저장' + 임시 저장 표시 (모달 없음)
   모달 닫기(확인·X·배경·Esc)는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var form = document.querySelector('.pp-form');
  var saveBtn = document.querySelector('[data-pp-savetoggle]');
  var tempBtn = document.querySelector('.pp-savebar__btn--ghost');
  var doneM = document.getElementById('pp-publish-done');
  if (!form || !saveBtn) return;

  function setReadonly(view) {
    form.classList.toggle('is-readonly', view);
    [].forEach.call(form.querySelectorAll('input, textarea'), function (el) {
      if (el.type === 'file') return;                         // 파일 input 제외
      if (el.classList.contains('pp-chip__cb')) { el.disabled = view; return; } // 체크박스는 disabled
      el.readOnly = view;
    });
    saveBtn.textContent = view ? '수정하기' : '공개 저장';
    if (tempBtn) tempBtn.hidden = view;                       // 임시 저장 감춤/표시
  }

  function openDone() {
    if (!doneM) return;
    doneM.hidden = false;
    document.body.style.overflow = 'hidden';
    var c = doneM.querySelector('[data-modal-close]');
    if (c) c.focus();
  }

  saveBtn.addEventListener('click', function () {
    var goingView = !form.classList.contains('is-readonly');
    setReadonly(goingView);
    if (goingView) openDone();   // 공개 저장 시에만 완료 모달
  });

  setReadonly(false);            // 초기: 편집 모드
})();
