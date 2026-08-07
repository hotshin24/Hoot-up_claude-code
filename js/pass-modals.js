/* 올나잇 패스 확인 → 완료 모달 전환 (데모)
   [data-confirm-advance] 클릭 → 현재(확인) 모달을 닫고 data-done-modal 대상(완료) 모달 열기
   열기/닫기(취소·X·배경·Esc)는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  [].slice.call(document.querySelectorAll('[data-confirm-advance]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      var current = btn.closest('.modal');
      var done = document.getElementById(btn.getAttribute('data-done-modal'));
      if (!done) return;
      if (current) current.hidden = true;   // 배경 스크롤 잠금은 완료 모달로 이어짐
      done.hidden = false;
      var close = done.querySelector('[data-modal-close]');
      if (close) close.focus();
    });
  });
})();
