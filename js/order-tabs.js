/* 주문·결제 내역 탭 필터 (account-orders.html)
   - .order-head__filter .myclass-chip[data-tab] 로 .order-row[data-cat] 를 필터
   - 헤더 행(.order-row--head)은 항상 표시, 목록이 짧아 페이저 없음 */
(function () {
  var filter = document.querySelector('.order-head__filter');
  var table = document.querySelector('.order-table');
  if (!filter || !table) return;

  var rows = Array.prototype.slice.call(table.querySelectorAll('.order-row[data-cat]'));
  var chips = Array.prototype.slice.call(filter.querySelectorAll('.myclass-chip'));
  var empty = document.querySelector('[data-order-empty]');

  function apply(cat) {
    var visible = [];
    rows.forEach(function (r) {
      var on = cat === 'all' || r.getAttribute('data-cat') === cat;
      r.hidden = !on;
      r.classList.remove('is-last');
      if (on) visible.push(r);
    });
    if (visible.length) visible[visible.length - 1].classList.add('is-last');
    if (empty) empty.hidden = visible.length !== 0;
  }

  filter.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.myclass-chip') : null;
    if (!chip) return;
    chips.forEach(function (c) {
      var on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    apply(chip.getAttribute('data-tab'));
  });

  apply('all');
})();
