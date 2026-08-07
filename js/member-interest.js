/* 회원정보 — 관심 카테고리 칩 클릭 토글 (다중 선택, 데모)
   클릭 → 활성(파란 배경) / 다시 클릭 → 비활성(선만)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  [].slice.call(document.querySelectorAll('.member-interest__chips .member-chip')).forEach(function (chip) {
    chip.addEventListener('click', function () {
      var on = chip.classList.toggle('is-active');
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });
})();
