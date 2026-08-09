/* 크리에이터 질문 관리 (creator-questions.html) — 데모
   · 디자인/구조는 creator-reviews.html(rv-*)을 그대로 재사용
   · 필터(전체 / 답변 대기) + 5개씩 페이지네이션 (.pager 재사용)
   · '답변 대기' = 아직 답변이 없는(=답변 입력창이 있는) 질문(.rv-answer 존재)
   · 답변 등록: .rv-answer(입력창) → .rv-reply(내 답변) 로 전환 + '답변 대기' 배지 제거
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var PAGE_SIZE = 5;

  var list = document.querySelector('[data-rv-list]');
  var pager = document.querySelector('[data-rv-pager]');
  var filterBar = document.querySelector('[data-rv-filter]');
  if (!list) return;

  var page = 1;
  var filter = 'all';   // 'all' | 'wait'

  function items() { return [].slice.call(list.querySelectorAll('.rv-item')); }

  // 필터 조건: 'wait' 는 아직 답변이 없는(=답변 입력창이 있는) 질문만
  function matches(el) {
    if (filter === 'wait') return !!el.querySelector('.rv-answer');
    return true;
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
    var shown = items().filter(matches);           // 필터 통과 항목
    var totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    var start = (page - 1) * PAGE_SIZE;

    items().forEach(function (el) { el.style.display = 'none'; });   // 전부 숨김
    shown.forEach(function (el, i) {                                  // 현재 페이지만 노출
      el.style.display = (i >= start && i < start + PAGE_SIZE) ? '' : 'none';
    });
    buildPager(totalPages);
  }

  // 필터 버튼
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-rv-filter-btn]');
      if (!btn) return;
      var next = btn.getAttribute('data-rv-filter-btn');
      if (next === filter) return;
      filter = next;
      page = 1;
      [].forEach.call(filterBar.querySelectorAll('[data-rv-filter-btn]'), function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    });
  }

  // 답변 등록 — .rv-answer(입력창) → .rv-reply(내 답변) 로 전환
  list.addEventListener('click', function (e) {
    var btn = e.target.closest('.rv-answer__btn');
    if (!btn) return;
    var answer = btn.closest('.rv-answer');
    if (!answer) return;
    var input = answer.querySelector('.rv-answer__input');
    var text = input ? input.value.trim() : '';
    if (!text) { if (input) input.focus(); return; }

    var reply = document.createElement('div');
    reply.className = 'rv-reply';
    var label = document.createElement('p');
    label.className = 'rv-reply__label';
    label.textContent = '내 답변';
    var body = document.createElement('p');
    body.className = 'rv-reply__text';
    body.textContent = text;
    reply.appendChild(label);
    reply.appendChild(body);
    answer.replaceWith(reply);

    // '답변 대기' 배지 제거 (더 이상 대기 아님)
    var item = reply.closest('.rv-item');
    var badge = item && item.querySelector('.rv-badge');
    if (badge) badge.remove();
  });

  // 페이지 이동
  if (pager) {
    pager.addEventListener('click', function (e) {
      e.preventDefault();
      var el = e.target.closest('[data-page]');
      if (!el) return;
      var next = parseInt(el.getAttribute('data-page'), 10);
      if (!next || next === page) return;
      page = next;
      render();
      list.scrollIntoView({ block: 'nearest' });
    });
  }

  render();
})();
