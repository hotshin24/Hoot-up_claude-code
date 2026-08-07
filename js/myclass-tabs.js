/* 내 클래스 탭 필터 + 클라이언트 페이지네이션 (account-classes.html)
   - .myclass-chip[data-tab] 로 .class-card[data-tabs] 를 필터
   - 3×3(9개) 단위로 페이징, 페이지가 2개 이상일 때만 .pager 노출
   - 페이저 마크업/동작은 사이트 공통 .pager 규칙과 동일 */
(function () {
  var filter = document.querySelector('.myclass-filter');
  var grid = document.querySelector('.myclass-grid');
  if (!filter || !grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.class-card'));
  var chips = Array.prototype.slice.call(filter.querySelectorAll('.myclass-chip'));
  var pager = document.querySelector('[data-myclass-pager]');
  var PAGE_SIZE = 9;

  var tab = 'all';
  var page = 1;

  function matched() {
    return cards.filter(function (c) {
      return (' ' + c.getAttribute('data-tabs') + ' ').indexOf(' ' + tab + ' ') > -1;
    });
  }

  function render() {
    var list = matched();
    var totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;

    var start = (page - 1) * PAGE_SIZE;
    var end = start + PAGE_SIZE;

    cards.forEach(function (c) { c.hidden = true; });
    list.slice(start, end).forEach(function (c) { c.hidden = false; });

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

  // 탭 전환
  filter.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.myclass-chip') : null;
    if (!chip) return;
    tab = chip.getAttribute('data-tab');
    page = 1;
    chips.forEach(function (c) {
      var on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    render();
  });

  // 페이저
  if (pager) {
    pager.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('[data-page]') : null;
      if (!link) return;
      e.preventDefault();
      if (link.getAttribute('aria-disabled') === 'true') return;
      var total = Math.max(1, Math.ceil(matched().length / PAGE_SIZE));
      var val = link.getAttribute('data-page');
      if (val === 'prev') page = Math.max(1, page - 1);
      else if (val === 'next') page = Math.min(total, page + 1);
      else page = parseInt(val, 10) || 1;
      render();
      var top = grid.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  render();
})();
