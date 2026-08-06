/* 범용 표시 모달 — [data-open-modal](aria-controls)로 열기, [data-modal-close]·배경·Esc로 닫기
   (구독/제출 폼 모달은 subscribe-modal.js 가 담당하므로 여기선 제외)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  "use strict";
  var lastFocus = null;

  function open(m) {
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.style.overflow = "hidden";
    var c = m.querySelector("[data-modal-close]");
    if (c) c.focus();
  }
  function close(m) {
    m.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  [].slice.call(document.querySelectorAll("[data-open-modal]")).forEach(function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      var m = document.getElementById(t.getAttribute("aria-controls"));
      if (m) open(m);
    });
  });

  [].slice.call(document.querySelectorAll(".modal")).forEach(function (m) {
    if (m.querySelector("[data-subscribe-form]")) return; // 폼 모달 제외
    m.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); close(m); });
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    [].slice.call(document.querySelectorAll(".modal")).forEach(function (m) {
      if (!m.hidden && !m.querySelector("[data-subscribe-form]")) close(m);
    });
  });
})();
