/* 공지사항 — 카테고리 필터 + 더보기 + 아코디언 상세
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
      it.style.display = 'block';
    });
    if (count) count.textContent = '총 ' + visible.length + '건';
    if (more) { more.style.display = (cat === 'all' && !revealAll && visible.length > 6) ? '' : 'none'; }
  }

  // 아코디언: 헤더 클릭 시 해당 상세만 펼침 (한 번에 하나)
  var heads = [].slice.call(wrap.querySelectorAll('.notice__item-head'));
  function closeAll() {
    heads.forEach(function (h) {
      h.setAttribute('aria-expanded', 'false');
      var panel = document.getElementById(h.getAttribute('aria-controls'));
      if (panel) panel.hidden = true;
    });
  }
  heads.forEach(function (head) {
    head.addEventListener('click', function () {
      var isOpen = head.getAttribute('aria-expanded') === 'true';
      closeAll();
      if (!isOpen) {
        head.setAttribute('aria-expanded', 'true');
        var panel = document.getElementById(head.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      }
    });
  });

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
