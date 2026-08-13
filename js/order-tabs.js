/* 주문·결제 내역 (account-orders.html)
   - .order-head__filter .chip[data-tab] 로 .order-row[data-cat] 필터
   - 필터된 내역을 5개씩 페이지네이션 (.pager 디자인 재사용)
   - 헤더 행(.order-row--head)은 항상 표시
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var PAGE_SIZE = 5;

  var filter = document.querySelector('.order-head__filter');
  var table = document.querySelector('.order-table');
  if (!filter || !table) return;

  var rows = Array.prototype.slice.call(table.querySelectorAll('.order-row[data-cat]'));
  var chips = Array.prototype.slice.call(filter.querySelectorAll('.chip'));
  var empty = document.querySelector('[data-order-empty]');
  var pager = document.querySelector('[data-order-pager]');

  var cat = 'all';
  var page = 1;

  function filtered() {
    return rows.filter(function (r) {
      return cat === 'all' || r.getAttribute('data-cat') === cat;
    });
  }

  function arrow(dir, enabled, target) {
    var a = document.createElement('a');
    a.className = 'pager__arrow';
    a.href = '#';
    a.setAttribute('aria-label', dir === 'prev' ? '이전 페이지' : '다음 페이지');
    if (enabled) a.setAttribute('data-page', target);
    else a.setAttribute('aria-disabled', 'true');
    var span = document.createElement('span');
    span.className = 'icon ' + (dir === 'prev' ? 'icon--chevron-left' : 'icon--chevron-right');
    a.appendChild(span);
    return a;
  }

  function buildPager(totalPages) {
    if (!pager) return;
    pager.innerHTML = '';
    if (totalPages <= 1) { pager.hidden = true; return; }
    pager.hidden = false;

    pager.appendChild(arrow('prev', page > 1, page - 1));
    for (var p = 1; p <= totalPages; p++) {
      var a = document.createElement('a');
      a.className = 'pager__num' + (p === page ? ' pager__num--active' : '');
      a.href = '#';
      a.textContent = p;
      a.setAttribute('data-page', p);
      if (p === page) a.setAttribute('aria-current', 'page');
      pager.appendChild(a);
    }
    pager.appendChild(arrow('next', page < totalPages, page + 1));
  }

  function render() {
    var list = filtered();
    var totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;

    var start = (page - 1) * PAGE_SIZE;
    var pageRows = list.slice(start, start + PAGE_SIZE);

    rows.forEach(function (r) { r.hidden = true; r.classList.remove('is-last'); });
    pageRows.forEach(function (r) { r.hidden = false; });
    if (pageRows.length) pageRows[pageRows.length - 1].classList.add('is-last');

    if (empty) empty.hidden = list.length !== 0;
    buildPager(totalPages);
  }

  // 카테고리 필터
  filter.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.chip') : null;
    if (!chip) return;
    chips.forEach(function (c) {
      var on = c === chip;
      c.classList.toggle('chip--active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    cat = chip.getAttribute('data-tab');
    page = 1;              // 필터 바뀌면 1페이지부터
    render();
  });

  // 페이지 이동
  if (pager) {
    pager.addEventListener('click', function (e) {
      e.preventDefault();
      var el = e.target.closest ? e.target.closest('[data-page]') : null;
      if (!el) return;
      var next = parseInt(el.getAttribute('data-page'), 10);
      if (!next || next === page) return;
      page = next;
      render();
      table.scrollIntoView({ block: 'nearest' });
    });
  }

  render();
})();
