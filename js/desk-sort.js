/* HOOT UP DESK 기사 정렬 · 필터
   - 최신순: 원본 카드 피드(날짜 그룹) + 정적 페이저, 각 byline에 조회수 표기
   - 많이 본 순: window.DESK_NEWS에서 스코프(전체/카테고리) + 기간별 조회수 랭킹을
     클라이언트 페이지네이션으로 표시 (카드 피드·정적 페이저는 숨김)
   - 기간 칩(1주/1개월/3개월/전체): 랭킹을 날짜로 필터. 클릭 시 많이 본 순으로 전환
   - 스코프: .desk-newslist[data-desk-scope] (all | Tech·AI | Career | Data | Development·IT | Interview) */
(function () {
  var sortNav = document.querySelector('.desk-cathead__sort');
  var list = document.querySelector('.desk-newslist');
  if (!sortNav || !list) return;

  var sortLinks = [].slice.call(sortNav.querySelectorAll('.desk-cathead__sortlink'));
  var periodNav = document.querySelector('.desk-period');
  var periodChips = periodNav ? [].slice.call(periodNav.querySelectorAll('.desk-period__chip')) : [];
  var reporterChips = [].slice.call(document.querySelectorAll('.desk-filter__reporter'));
  var scope = list.getAttribute('data-desk-scope') || 'all';

  // 1) 최신순 카드 byline에 조회수 표기 (data-views 기반)
  [].slice.call(list.querySelectorAll('.desk-newsfeat, .desk-newsrow')).forEach(function (a) {
    var v = parseInt(a.dataset.views, 10);
    if (!v) return;
    var byline = a.querySelector('.desk-newsfeat__byline, .desk-newsrow__byline');
    if (byline && !byline.querySelector('.desk-views')) {
      var s = document.createElement('span');
      s.className = 'desk-views';
      s.textContent = ' · 조회 ' + v.toLocaleString('ko-KR');
      byline.appendChild(s);
    }
  });

  // 2) 랭킹 데이터 (스코프 필터, 원본은 이미 조회수 내림차순)
  var allData = (window.DESK_NEWS || []).filter(function (a) {
    return scope === 'all' || a.c === scope;
  });

  // 기간 (오늘 = 데이터 최신 날짜 기준)
  function parseDate(s) { var p = String(s).split('.'); return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1); }
  var refDate = allData.reduce(function (m, a) { var d = parseDate(a.d); return d > m ? d : m; }, new Date(0));
  function activePeriod() {
    var c = periodChips.filter(function (ch) { return ch.classList.contains('desk-period__chip--active'); })[0];
    return c ? c.textContent.trim() : '전체';
  }
  function cutoff(period) {
    var d = new Date(refDate);
    if (period === '1주') d.setDate(d.getDate() - 6);
    else if (period === '1개월') d.setMonth(d.getMonth() - 1);
    else if (period === '3개월') d.setMonth(d.getMonth() - 3);
    else return null; // 전체
    return d;
  }
  function activeReporter() {
    var c = reporterChips.filter(function (ch) { return ch.classList.contains('desk-filter__reporter--active'); })[0];
    return c ? c.textContent.replace(/\s*기자\s*$/, '').trim() : null;
  }
  function currentData() {
    var out = allData;
    var cut = cutoff(activePeriod());
    if (cut) out = out.filter(function (a) { return parseDate(a.d) >= cut; });
    var rep = activeReporter();
    if (rep) out = out.filter(function (a) { return a.w === rep; });
    return out;
  }

  var PER = 20;
  var curPage = 1;

  var ranking = document.createElement('section');
  ranking.className = 'desk-ranking';
  ranking.setAttribute('aria-label', '많이 본 순 랭킹');
  ranking.hidden = true;
  list.parentNode.insertBefore(ranking, list.nextSibling);

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(n) { return n.toLocaleString('ko-KR'); }

  function render() {
    var data = currentData();
    var totalPages = Math.max(1, Math.ceil(data.length / PER));
    if (curPage > totalPages) curPage = totalPages;
    var start = (curPage - 1) * PER;
    var slice = data.slice(start, start + PER);

    var h = '';
    if (!data.length) {
      h = '<p class="desk-ranking__empty">해당 기간에 기사가 없습니다.</p>';
      ranking.innerHTML = h;
      return;
    }
    h += '<ol class="desk-ranking__list">';
    slice.forEach(function (a, i) {
      var rank = start + i + 1;
      h += '<li class="desk-ranking__item' + (rank <= 3 ? ' is-top' : '') + '">'
        +   '<span class="desk-ranking__rank">' + rank + '</span>'
        +   '<a class="desk-ranking__link" href="desk-ai-coding.html">'
        +     '<span class="desk-ranking__title">' + esc(a.t) + '</span>'
        +     '<span class="desk-ranking__meta">' + esc(a.c) + ' · ' + esc(a.w) + ' 기자 · ' + esc(a.d) + '</span>'
        +   '</a>'
        +   '<span class="desk-ranking__views">조회 ' + fmt(a.v) + '</span>'
        + '</li>';
    });
    h += '</ol>';
    if (totalPages > 1) {
      h += '<nav class="pager desk-ranking__pager" aria-label="랭킹 페이지 매김">';
      h += '<a class="pager__arrow" href="#" data-p="prev"' + (curPage === 1 ? ' aria-disabled="true"' : '') + ' aria-label="이전 페이지"><span class="icon icon--chevron-left"></span></a>';
      for (var n = 1; n <= totalPages; n++) {
        h += '<a class="pager__num' + (n === curPage ? ' pager__num--active' : '') + '" href="#" data-p="' + n + '"' + (n === curPage ? ' aria-current="page"' : '') + '>' + n + '</a>';
      }
      h += '<a class="pager__arrow" href="#" data-p="next"' + (curPage === totalPages ? ' aria-disabled="true"' : '') + ' aria-label="다음 페이지"><span class="icon icon--chevron-right"></span></a>';
      h += '</nav>';
    }
    ranking.innerHTML = h;
  }

  ranking.addEventListener('click', function (e) {
    var b = e.target.closest('[data-p]');
    if (!b) return;
    e.preventDefault();
    if (b.getAttribute('aria-disabled') === 'true') return;
    var totalPages = Math.max(1, Math.ceil(currentData().length / PER));
    var p = b.getAttribute('data-p');
    if (p === 'prev') curPage = Math.max(1, curPage - 1);
    else if (p === 'next') curPage = Math.min(totalPages, curPage + 1);
    else curPage = parseInt(p, 10) || 1;
    render();
    ranking.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  function setActiveSort(link) {
    sortLinks.forEach(function (l) {
      var on = l === link;
      l.classList.toggle('desk-cathead__sortlink--active', on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  }
  function showLatest() { ranking.hidden = true; list.style.display = ''; }
  function showPopular() { list.style.display = 'none'; render(); ranking.hidden = false; }

  sortNav.addEventListener('click', function (e) {
    var link = e.target.closest('.desk-cathead__sortlink');
    if (!link) return;
    e.preventDefault();
    if (link.getAttribute('aria-current') === 'true') return;
    setActiveSort(link);
    if (link.textContent.indexOf('많이') > -1) showPopular();
    else showLatest();
  });

  // 기간 칩: 랭킹을 날짜로 필터 + 많이 본 순으로 전환
  if (periodNav) {
    periodNav.addEventListener('click', function (e) {
      var chip = e.target.closest('.desk-period__chip');
      if (!chip) return;
      e.preventDefault();
      periodChips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('desk-period__chip--active', on);
        if (on) c.setAttribute('aria-current', 'true');
        else c.removeAttribute('aria-current');
      });
      curPage = 1;
      var pop = sortLinks.filter(function (l) { return l.textContent.indexOf('많이') > -1; })[0];
      if (pop) setActiveSort(pop);
      showPopular();
    });
  }

  // 기자 칩: 랭킹을 기자별로 필터(토글) + 많이 본 순으로 전환
  reporterChips.forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      e.preventDefault();
      var wasActive = chip.classList.contains('desk-filter__reporter--active');
      reporterChips.forEach(function (c) {
        c.classList.remove('desk-filter__reporter--active');
        c.removeAttribute('aria-current');
      });
      if (!wasActive) { // 같은 칩 재클릭 → 해제(전체 기자)
        chip.classList.add('desk-filter__reporter--active');
        chip.setAttribute('aria-current', 'true');
      }
      curPage = 1;
      var pop = sortLinks.filter(function (l) { return l.textContent.indexOf('많이') > -1; })[0];
      if (pop) setActiveSort(pop);
      showPopular();
    });
  });
})();
