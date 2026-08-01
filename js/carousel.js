/* 컬렉션 캐러셀 슬라이더 (.course-list--slider)
   - 좌우 화살표(.carousel-btn--prev/next)로 한 카드씩 가로 스크롤(CSS scroll-behavior: smooth)
   - 양 끝에서 화살표 비활성 처리 (클릭 직후 목표 위치 기준으로 즉시 반영 + 수동 스크롤 동기화) */
(function () {
  document.querySelectorAll('.course-list--slider').forEach(function (list) {
    var carousel = list.closest('.collection__carousel');
    if (!carousel) return;
    var prev = carousel.querySelector('.carousel-btn--prev');
    var next = carousel.querySelector('.carousel-btn--next');

    function step() {
      var item = list.querySelector('.course-list__item');
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
    reflect(0);
  });
})();
