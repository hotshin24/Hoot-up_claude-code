/* ==========================================================================
   HOOT UP — 전체 카테고리 메가 메뉴
   햄버거 버튼 · '전체 카테고리' 링크로 펼치고, 왼쪽 대분류에 hover/클릭 시
   오른쪽 세부 카테고리를 탭처럼 전환한다. (JS 없이도 링크는 동작)
   ========================================================================== */
(function () {
  "use strict";

  var mega = document.getElementById("category-mega");
  if (!mega) return;

  var backdrop = document.querySelector(".mega-backdrop");
  var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-nav-toggle]"));
  var tabs = Array.prototype.slice.call(mega.querySelectorAll(".mega-cat"));
  var panels = Array.prototype.slice.call(mega.querySelectorAll(".mega-sub"));
  var lastTrigger = null;

  if (backdrop) backdrop.hidden = false; // JS 활성화 시 백드롭 사용

  function isOpen() {
    return mega.classList.contains("is-open");
  }

  function openMega(trigger) {
    mega.classList.add("is-open");
    mega.setAttribute("aria-hidden", "false");
    if (backdrop) backdrop.classList.add("is-open");
    toggles.forEach(function (t) { t.setAttribute("aria-expanded", "true"); });
    if (trigger) lastTrigger = trigger;
  }

  function closeMega(returnFocus) {
    mega.classList.remove("is-open");
    mega.setAttribute("aria-hidden", "true");
    if (backdrop) backdrop.classList.remove("is-open");
    toggles.forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
    if (returnFocus && lastTrigger) lastTrigger.focus();
  }

  /* --- 대분류 탭 전환 --- */
  function activate(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    var targetId = tab.getAttribute("aria-controls");
    panels.forEach(function (p) {
      var on = p.id === targetId;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }

  /* --- 트리거(햄버거 · 전체 카테고리) --- */
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (isOpen()) closeMega(false);
      else openMega(btn);
    });
  });

  /* --- 탭 상호작용: hover · focus · click · 방향키 --- */
  tabs.forEach(function (tab, i) {
    tab.addEventListener("mouseenter", function () { activate(tab); });
    tab.addEventListener("focus", function () { activate(tab); });
    tab.addEventListener("click", function () { activate(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next !== null) {
        e.preventDefault();
        tabs[next].focus();
      }
    });
  });

  /* --- 닫기: 백드롭 클릭 · Esc · 세부 링크 이동 --- */
  if (backdrop) {
    backdrop.addEventListener("click", function () { closeMega(false); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) closeMega(true);
  });
  mega.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMega(false); // 실제 페이지 이동 시 닫힘
  });
})();
