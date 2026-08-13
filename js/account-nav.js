/* HOOT UP — 계정 사이드바 아코디언 (LEARNING·PAYMENT·SETTINGS)
   - .account-nav__group 헤더(button[data-acc-trigger]) 클릭 → 해당 그룹 펼침/접힘
   - single-open: 한 번에 하나만 열리고 나머지는 자동으로 접힘
   - 기본 열림(현재 페이지가 속한 섹션)은 HTML(.is-open, aria-expanded)에서 지정
   - creator-nav 는 flat <p> 라벨(트리거 없음)이라 자동 제외 */
(function () {
  "use strict";
  var triggers = [].slice.call(document.querySelectorAll(".account-nav [data-acc-trigger]"));
  if (!triggers.length) return;

  function setOpen(group, open) {
    group.classList.toggle("is-open", open);
    var btn = group.querySelector("[data-acc-trigger]");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  triggers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.closest(".account-nav__group");
      if (!group) return;
      var willOpen = !group.classList.contains("is-open");
      var nav = group.closest(".account-nav");
      [].slice.call(nav.querySelectorAll(".account-nav__group")).forEach(function (g) {
        setOpen(g, g === group ? willOpen : false);
      });
    });
  });
})();
