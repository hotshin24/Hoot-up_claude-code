/* 회원정보 — 연결된 계정 관리 모달 (프런트 전용 데모)
   소셜 버튼 클릭 → 연결/해제 토글 + 상태 문구 + 목록 행 요약 동기화
   모달 열기/닫기는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var modal = document.getElementById('linked-modal');
  var summary = document.querySelector('[data-linked-summary]');
  if (!modal) return;

  var btns = [].slice.call(modal.querySelectorAll('[data-link]'));

  function syncSummary() {
    if (!summary) return;
    summary.textContent = btns.map(function (b) {
      var on = b.getAttribute('aria-pressed') === 'true';
      return b.getAttribute('data-name') + (on ? ' 연결됨' : ' 미연결');
    }).join(' · ');
  }

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('is-linked', on);
      var state = btn.querySelector('.linked-state');
      if (state) state.textContent = on ? '연결됨' : '미연결';
      syncSummary();
    });
  });
})();
