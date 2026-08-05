/* 매거진 아티클 댓글 페이지네이션 (1페이지 5개)
   - .comment-list 항목을 5개씩 페이지 분할, .comment-pager에 페이지 버튼 렌더 */
(function () {
  var list = document.querySelector('.comment-list');
  var pager = document.querySelector('.comment-pager');
  if (!list || !pager) return;

  var items = Array.prototype.slice.call(list.children);
  var SIZE = 5;
  var pages = Math.max(1, Math.ceil(items.length / SIZE));
  var page = 1;

  function render() {
    items.forEach(function (li, i) {
      li.hidden = Math.floor(i / SIZE) !== (page - 1);
      li.classList.remove('is-first');
    });
    var firstVisible = items[(page - 1) * SIZE];
    if (firstVisible) firstVisible.classList.add('is-first');

    // mag-pager와 동일한 마크업/클래스로 렌더 → 페이저 스타일 통일
    var html = '<ul class="mag-pager__list">';
    html += '<li class="mag-pager__item"><button type="button" class="mag-pager__arrow" data-p="prev" aria-label="이전 페이지"' +
            (page === 1 ? ' disabled' : '') +
            '><span class="icon icon--chevron-left" aria-hidden="true"></span></button></li>';
    for (var n = 1; n <= pages; n++) {
      html += '<li class="mag-pager__item"><button type="button" class="mag-pager__num' +
              (n === page ? ' mag-pager__num--active' : '') + '" data-p="' + n + '"' +
              (n === page ? ' aria-current="page"' : '') + '>' + n + '</button></li>';
    }
    html += '<li class="mag-pager__item"><button type="button" class="mag-pager__arrow" data-p="next" aria-label="다음 페이지"' +
            (page === pages ? ' disabled' : '') +
            '><span class="icon icon--chevron-right" aria-hidden="true"></span></button></li>';
    html += '</ul>';
    pager.innerHTML = html;
  }

  pager.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b || b.disabled) return;
    var p = b.getAttribute('data-p');
    if (p === 'prev') page = Math.max(1, page - 1);
    else if (p === 'next') page = Math.min(pages, page + 1);
    else page = parseInt(p, 10) || 1;
    render();
    var sec = document.querySelector('.article-comments');
    if (sec) sec.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  render();
})();
