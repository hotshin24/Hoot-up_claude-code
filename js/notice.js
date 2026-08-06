/* 공지사항 — 카테고리 필터 + 더보기 (전체는 6개까지 노출 후 더보기)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var wrap = document.querySelector('[data-notice-list]');
  if (!wrap) return;

  var items = [].slice.call(wrap.querySelectorAll('.notice__item'));
  var count = document.querySelector('[data-notice-count]');
  var more = document.querySelector('[data-notice-more]');
  var cat = 'all';

  function render() {
    var revealAll = (more && more.classList.contains('is-done'));
    var visible = items.filter(function (it) { return cat === 'all' || it.dataset.cat === cat; });
    items.forEach(function (it) { it.style.display = 'none'; });
    visible.forEach(function (it, idx) {
      // 전체 카테고리에서는 더보기 전까지 6개만
      if (cat === 'all' && !revealAll && idx >= 6) { return; }
      it.style.display = 'flex';
    });
    if (count) count.textContent = '총 ' + visible.length + '건';
    if (more) { more.style.display = (cat === 'all' && !revealAll && visible.length > 6) ? '' : 'none'; }
  }

  document.querySelectorAll('.notice__filter-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.notice__filter-btn').forEach(function (x) {
        x.classList.remove('is-active');
        x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('is-active');
      b.setAttribute('aria-pressed', 'true');
      cat = b.dataset.cat;
      if (more) more.classList.remove('is-done');
      render();
    });
  });

  if (more) {
    more.addEventListener('click', function () { more.classList.add('is-done'); render(); });
  }

  render();
})();
