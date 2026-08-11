/* 캐러셀 슬라이더 (네이티브 가로 스크롤 + 좌우 화살표)
   - 대상: .course-list--slider(컬렉션) · .magazine__list(매거진)
   - 화살표(.carousel-btn--prev/next)로 한 카드씩 스크롤(CSS scroll-behavior: smooth)
   - 양 끝에서 화살표 비활성(수동 스크롤과 동기화) */
(function () {
  function init(list, carousel, itemSelector) {
    if (!carousel) return;
    var prev = carousel.querySelector('.carousel-btn--prev');
    var next = carousel.querySelector('.carousel-btn--next');

    function step() {
      var item = list.querySelector(itemSelector);
      if (!item) return list.clientWidth;
      var s = getComputedStyle(list);
      var gap = parseFloat(s.columnGap || s.gap || '0') || 0;
      return item.getBoundingClientRect().width + gap;
    }

    function reflect(pos) {
      var max = list.scrollWidth - list.clientWidth;
      if (prev) {
        var atStart = pos <= 0;
        prev.disabled = atStart;
        prev.setAttribute('aria-disabled', atStart ? 'true' : 'false');
      }
      if (next) {
        var atEnd = pos >= max - 1;
        next.disabled = atEnd;
        next.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
      }
    }

    function go(dir) {
      var max = list.scrollWidth - list.clientWidth;
      var target = Math.max(0, Math.min(list.scrollLeft + dir * step(), max));
      list.scrollLeft = target;   // CSS scroll-behavior: smooth 로 부드럽게 이동
      reflect(target);
    }

    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    list.addEventListener('scroll', function () { reflect(list.scrollLeft); }, { passive: true });
    window.addEventListener('resize', function () { reflect(list.scrollLeft); });
    // 이미지 로드 후 실제 폭이 확정되면 화살표 활성/비활성 상태를 다시 동기화
    window.addEventListener('load', function () { reflect(list.scrollLeft); });
    reflect(0);
  }

  document.querySelectorAll('.course-list--slider').forEach(function (list) {
    init(list, list.closest('.collection__carousel'), '.course-list__item');
  });
  document.querySelectorAll('.magazine__list').forEach(function (list) {
    init(list, list.closest('.magazine__carousel'), '.magazine__item');
  });
  document.querySelectorAll('.mag-classes__list').forEach(function (list) {
    init(list, list.closest('.mag-classes__carousel'), 'li');
  });
})();
