/* 크리에이터 블로그 관리 (creator-blog.html) — 데모 (저장 없음)
   · 작성한 글 5개씩 페이지네이션 (.pager 재사용) — 발행/삭제 시 재계산
   · 발행하기: 제목+내용으로 글 목록 맨 위에 추가 → 1페이지로
   · 수정: 해당 글 제목/카테고리를 작성 폼에 불러오기
   · 삭제: 해당 글 제거
   · 지우기: 작성 폼 비움
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var PAGE_SIZE = 5;

  var list = document.querySelector('[data-blog-list]');
  var pager = document.querySelector('[data-blog-pager]');
  var countEl = document.querySelector('[data-blog-count]');
  var titleIn = document.getElementById('blog-title');
  var catIn = document.getElementById('blog-cat');
  var bodyIn = document.getElementById('blog-content');
  if (!list) return;

  var page = 1;

  function posts() { return [].slice.call(list.querySelectorAll('.blog-post')); }

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
    var all = posts();
    var totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    if (page > totalPages) page = totalPages;
    var start = (page - 1) * PAGE_SIZE;

    all.forEach(function (p, i) {
      p.style.display = (i >= start && i < start + PAGE_SIZE) ? '' : 'none';
      p.classList.remove('blog-post--first');
    });
    var visible = all.filter(function (p) { return p.style.display !== 'none'; });
    if (visible.length) visible[0].classList.add('blog-post--first'); // 페이지 첫 글 상단 구분선 제거

    if (countEl) countEl.textContent = all.length;
    buildPager(totalPages);
  }

  function makePost(cat, title, meta) {
    var li = document.createElement('li');
    li.className = 'blog-post';
    var body = document.createElement('div');
    body.className = 'blog-post__body';
    var c = document.createElement('p'); c.className = 'blog-post__cat'; c.textContent = cat || 'DEVELOPMENT & IT';
    var t = document.createElement('p'); t.className = 'blog-post__title'; t.textContent = title;
    var m = document.createElement('p'); m.className = 'blog-post__meta'; m.textContent = meta;
    body.appendChild(c); body.appendChild(t); body.appendChild(m);
    var act = document.createElement('div');
    act.className = 'blog-post__actions';
    act.innerHTML = '<button class="blog-btn" type="button" data-blog-edit>수정</button>' +
                    '<button class="blog-btn blog-btn--danger" type="button" data-blog-del>삭제</button>';
    li.appendChild(body); li.appendChild(act);
    return li;
  }

  function clearForm() {
    if (titleIn) titleIn.value = '';
    if (bodyIn) bodyIn.value = '';
  }

  // 발행하기
  var publishBtn = document.querySelector('[data-blog-publish]');
  if (publishBtn) {
    publishBtn.addEventListener('click', function () {
      var title = titleIn ? titleIn.value.trim() : '';
      if (!title) { if (titleIn) titleIn.focus(); return; }
      var cat = catIn ? catIn.value.trim() : '';
      list.insertBefore(makePost(cat, title, '방금 · 댓글 0'), list.firstChild);
      page = 1;            // 새 글은 맨 앞 → 1페이지
      render();
      clearForm();
    });
  }

  // 지우기
  var resetBtn = document.querySelector('[data-blog-reset]');
  if (resetBtn) resetBtn.addEventListener('click', clearForm);

  // 목록 액션 (위임)
  list.addEventListener('click', function (e) {
    var del = e.target.closest('[data-blog-del]');
    if (del) { del.closest('.blog-post').remove(); render(); return; }
    var edit = e.target.closest('[data-blog-edit]');
    if (edit) {
      var post = edit.closest('.blog-post');
      if (titleIn) titleIn.value = post.querySelector('.blog-post__title').textContent.trim();
      if (catIn) catIn.value = post.querySelector('.blog-post__cat').childNodes[0].textContent.trim();
      if (titleIn) { titleIn.focus(); titleIn.scrollIntoView({ block: 'center' }); }
      return;
    }
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
