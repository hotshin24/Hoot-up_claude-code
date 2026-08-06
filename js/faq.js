/* FAQ — 카테고리 탭 필터 + 검색 + 아코디언
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var root = document.querySelector('[data-faq-groups]');
  if (!root) return;

  var groups = [].slice.call(root.querySelectorAll('.hfaq__group'));
  var items = [].slice.call(root.querySelectorAll('.hfaq__item'));
  var empty = root.querySelector('[data-faq-empty]');
  var countEl = document.querySelector('[data-faq-count]');
  var input = document.querySelector('[data-faq-search]');
  var tabs = [].slice.call(document.querySelectorAll('.hfaq__tab'));
  var cat = 'all', kw = '';

  items.forEach(function (it) {
    it._text = (it.querySelector('.hfaq__q-text span:last-child').textContent + ' ' + it.querySelector('.hfaq__answer').textContent).toLowerCase();
  });

  function apply() {
    var total = 0;
    groups.forEach(function (g) {
      var gc = g.dataset.cat, gvis = 0;
      var lis = [].slice.call(g.querySelectorAll('.hfaq__item'));
      lis.forEach(function (it) {
        var ok = (cat === 'all' || gc === cat) && (kw === '' || it._text.indexOf(kw) > -1);
        it.hidden = !ok;
        if (ok) { gvis++; total++; }
      });
      var cnt = g.querySelector('[data-group-count]');
      if (cnt) cnt.textContent = gvis;
      g.hidden = (gvis === 0);
    });
    if (countEl) countEl.textContent = total + '건';
    if (empty) empty.hidden = (total > 0);
  }

  // 아코디언
  root.addEventListener('click', function (e) {
    var btn = e.target.closest('.hfaq__q');
    if (!btn) return;
    var li = btn.closest('.hfaq__item');
    var open = li.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // 필터
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
      t.classList.add('is-active');
      t.setAttribute('aria-pressed', 'true');
      cat = t.dataset.cat;
      apply();
    });
  });

  // 검색
  if (input) input.addEventListener('input', function () { kw = input.value.trim().toLowerCase(); apply(); });

  apply();
})();
