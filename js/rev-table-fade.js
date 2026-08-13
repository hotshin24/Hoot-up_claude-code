/* 정산 내역 표 — 우측 페이드 힌트 (iOS 스크롤바 미노출 대응)
   · .rev-table__scroll 가 가로로 더 스크롤할 게 있으면 .rev-table 에 페이드(::after) 노출
   · 끝까지 스크롤했거나 넘칠 게 없으면 .is-scroll-end 로 페이드 숨김
   defer 로드 → DOM 준비됨 */
(function () {
  "use strict";
  var scrolls = [].slice.call(document.querySelectorAll(".rev-table__scroll"));
  scrolls.forEach(function (sc) {
    var host = sc.closest(".rev-table");
    if (!host) return;
    function update() {
      var atEnd = sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 1;
      var noOverflow = sc.scrollWidth <= sc.clientWidth + 1;
      host.classList.toggle("is-scroll-end", atEnd || noOverflow);
    }
    sc.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    update();
  });
})();
