/* 매거진 전체 글 — 더보기 (기본 N개 + 클릭 시 STEP개씩 노출) */
(function () {
  var more = document.querySelector('[data-mag-more]');
  if (!more) return;

  var grid = document.querySelector('.mag-grid--cat');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.children);
  var btn = more.querySelector('.mag-more__btn');
  var shown = parseInt(more.getAttribute('data-initial'), 10) || 9;
  var step = parseInt(more.getAttribute('data-step'), 10) || 6;

  function render() {
    items.forEach(function (li, i) { li.hidden = i >= shown; });
    more.hidden = shown >= items.length;
  }

  if (btn) {
    btn.addEventListener('click', function () {
      shown += step;
      render();
      if (window.announce) window.announce('글 ' + Math.min(shown, items.length) + '개 표시 중');
    });
  }

  render();
})();
