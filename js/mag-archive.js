/* 매거진 '지난 호에서' 아카이브 더보기
   - 기본 3개 노출, '글 더 보기' 클릭 시 5개씩 펼침
   - 남은 항목이 없으면 버튼 숨김 (JS 없으면 전체 노출 + 버튼 무동작) */
(function () {
  var list = document.querySelector('.mag-archive');
  if (!list) return;

  var moreWrap = list.parentNode.querySelector('.mag-more');
  var btn = moreWrap && moreWrap.querySelector('.mag-btn');
  if (!btn) return;

  var items = Array.prototype.slice.call(list.children);
  var INITIAL = 3;
  var STEP = 5;
  var shown = INITIAL;

  function render() {
    items.forEach(function (li, i) { li.hidden = i >= shown; });
    moreWrap.hidden = shown >= items.length;
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    shown = Math.min(shown + STEP, items.length);
    render();
  });

  render();
})();
