/* 수료증 페이지 (account-certificates.html)
   - 받은 졸업모: 정렬(최신순/카테고리별) + 더보기(초기 3개 → 전체) */
(function () {
  var grid = document.querySelector('.cert-got__grid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.cert-diploma'));
  var moreBtn = document.querySelector('[data-cert-more]');
  var sortBtns = Array.prototype.slice.call(document.querySelectorAll('.cert-sort'));
  var INITIAL = 3;
  var shown = INITIAL;
  var mode = 'recent';

  function sorted() {
    var arr = cards.slice();
    if (mode === 'category') {
      arr.sort(function (a, b) {
        return (a.dataset.cat || '').localeCompare(b.dataset.cat || '') ||
               (b.dataset.date || '').localeCompare(a.dataset.date || '');
      });
    } else {
      arr.sort(function (a, b) { return (b.dataset.date || '').localeCompare(a.dataset.date || ''); });
    }
    return arr;
  }

  function render() {
    sorted().forEach(function (c, i) {
      grid.appendChild(c);
      c.hidden = i >= shown;
    });
    if (moreBtn) {
      var remain = cards.length - shown;
      if (remain > 0) { moreBtn.hidden = false; moreBtn.textContent = '졸업모 ' + remain + '개 더 보기'; }
      else moreBtn.hidden = true;
    }
  }

  if (moreBtn) moreBtn.addEventListener('click', function () { shown = cards.length; render(); });

  sortBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-sort');
      sortBtns.forEach(function (x) {
        var on = x === b;
        x.classList.toggle('is-active', on);
        x.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      render();
    });
  });

  render();
})();
