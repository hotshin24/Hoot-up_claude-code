/* 회원 탈퇴 — 확인 모달의 '확인' → 완료 모달로 전환 (데모)
   열기/닫기(취소·X·배경·Esc)는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var confirmM = document.getElementById('withdraw-confirm-modal');
  var doneM = document.getElementById('withdraw-done-modal');
  if (!confirmM || !doneM) return;

  var btn = confirmM.querySelector('[data-withdraw-confirm]');
  if (!btn) return;

  btn.addEventListener('click', function () {
    confirmM.hidden = true;           // 배경 스크롤 잠금은 완료 모달로 이어짐
    doneM.hidden = false;
    var close = doneM.querySelector('[data-modal-close]');
    if (close) close.focus();
  });
})();
