/* 클래스 목록 카테고리 필터 (+ 선택적 클라이언트 페이지네이션)
   - .class-filter 버튼(data-filter) 으로 .course-grid__item(data-category) 필터
   - [data-client-pager] 가 있으면 전체 목록을 클라이언트에서 페이지네이션
     · 전체(all) : 전 항목을 PAGE_SIZE 단위로 페이징
     · 특정 카테고리 : 전 페이지 통합 대상에서 해당 카테고리만 추려 보여줌(≤PAGE_SIZE면 페이저 숨김) */
(function () {
  var nav = document.querySelector('.class-filter');
  if (!nav) return;

  var grid = document.querySelector('.course-grid');
  if (!grid) return;
  var items = Array.prototype.slice.call(grid.querySelectorAll('.course-grid__item'));
  var buttons = Array.prototype.slice.call(nav.querySelectorAll('.class-filter__btn'));

  var pager = document.querySelector('[data-client-pager]');
  var PAGE_SIZE = pager ? (parseInt(pager.getAttribute('data-page-size'), 10) || 16) : Infinity;

  var filter = 'all';
  var page = 1;

  function filtered() {
    return items.filter(function (li) {
      return filter === 'all' || li.getAttribute('data-category') === filter;
    });
  }

  function render() {
    var list = filtered();
    var totalPages = PAGE_SIZE === Infinity ? 1 : Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;

    var start = (page - 1) * PAGE_SIZE;
    var end = PAGE_SIZE === Infinity ? list.length : start + PAGE_SIZE;

    items.forEach(function (li) { li.setAttribute('hidden', ''); });
    list.slice(start, end).forEach(function (li) { li.removeAttribute('hidden'); });

    renderPager(totalPages);
  }

  function arrow(dir, enabled) {
    var label = dir === 'prev' ? '이전 페이지' : '다음 페이지';
    var icon = dir === 'prev' ? 'chevron-left' : 'chevron-right';
    var dis = enabled ? '' : ' aria-disabled="true"';
    return '<a class="pager__arrow" href="#" data-page="' + dir + '" aria-label="' + label + '"' + dis +
           '><span class="icon icon--' + icon + '"></span></a>';
  }

  function renderPager(totalPages) {
    if (!pager) return;
    if (totalPages <= 1) { pager.setAttribute('hidden', ''); pager.innerHTML = ''; return; }
    pager.removeAttribute('hidden');
    var html = arrow('prev', page > 1);
    for (var n = 1; n <= totalPages; n++) {
      var active = n === page;
      html += '<a class="pager__num' + (active ? ' pager__num--active' : '') + '" href="#" data-page="' + n + '"' +
              (active ? ' aria-current="page"' : '') + '>' + n + '</a>';
    }
    html += arrow('next', page < totalPages);
    pager.innerHTML = html;
  }

  // 카테고리 필터
  nav.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.class-filter__btn') : null;
    if (!btn) return;
    filter = btn.getAttribute('data-filter');
    page = 1;
    buttons.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    render();
  });

  // 클라이언트 페이저
  if (pager) {
    pager.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('[data-page]') : null;
      if (!link) return;
      e.preventDefault();
      if (link.getAttribute('aria-disabled') === 'true') return;
      var val = link.getAttribute('data-page');
      var total = Math.max(1, Math.ceil(filtered().length / PAGE_SIZE));
      if (val === 'prev') page = Math.max(1, page - 1);
      else if (val === 'next') page = Math.min(total, page + 1);
      else page = parseInt(val, 10) || 1;
      render();
      var top = grid.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  render();
})();
