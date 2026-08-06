/* 크리에이터 가이드 — 준비물 체크리스트 토글 (완료 개수 카운트)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var wrap = document.querySelector('[data-checklist]');
  if (!wrap) return;

  var out = document.querySelector('[data-check-done]');
  var btns = wrap.querySelectorAll('.creator-guide__check');

  function sync() {
    var n = wrap.querySelectorAll('.creator-guide__check.is-checked').length;
    if (out) out.textContent = n;
  }

  btns.forEach(function (b) {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      var on = b.classList.toggle('is-checked');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      sync();
    });
  });
})();
