/* 강의 보기 — 커리큘럼 섹션 아코디언 + '봤어요' 토글
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  // 섹션 접기/펼치기 (독립 토글)
  [].slice.call(document.querySelectorAll('.cw-sec__head')).forEach(function (head) {
    head.addEventListener('click', function () {
      var open = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', open ? 'false' : 'true');
      var panel = document.getElementById(head.getAttribute('aria-controls'));
      if (panel) panel.hidden = open;
    });
  });

  // 커리큘럼 사이드 닫기/열기 (페이지 이동 아님) — 재오픈은 우측 레일 '커리큘럼' 항목
  var layout = document.querySelector('.cw__layout');
  var sideCloseBtn = document.querySelector('[data-cw-side-close]');
  var sideToggle = document.querySelector('[data-cw-side-toggle]');
  function setSide(closed) {
    if (!layout) return;
    layout.classList.toggle('is-side-closed', closed);
    if (sideToggle) {
      sideToggle.classList.toggle('is-active', !closed);
      sideToggle.setAttribute('aria-expanded', closed ? 'false' : 'true');
    }
  }
  if (sideCloseBtn) sideCloseBtn.addEventListener('click', function () { setSide(true); });
  if (sideToggle) sideToggle.addEventListener('click', function (e) {
    e.preventDefault();
    setSide(!layout.classList.contains('is-side-closed'));
  });

  // '봤어요' 토글 (데모)
  var seen = document.querySelector('[data-cw-seen]');
  if (seen) {
    seen.addEventListener('click', function () {
      var on = seen.classList.toggle('is-on');
      seen.textContent = on ? '봤어요 ✓' : '봤어요';
    });
  }
})();
