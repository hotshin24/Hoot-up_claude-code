/* HOOT UP DESK — 뉴스레터 구독 모달
   열기(트리거) · 닫기(X·배경·Esc) · 제출 시 완료 문구 (백엔드 없음, 데모) */
(function () {
  "use strict";
  var modal = document.getElementById("newsletter-modal");
  if (!modal) return;

  var triggers = document.querySelectorAll("[data-open-newsletter]");
  var form = modal.querySelector("[data-newsletter-form]");
  var done = modal.querySelector(".newsletter-done");
  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    // 재오픈 시 폼 복원
    if (form) { form.style.display = ""; form.reset(); }
    if (done) done.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var input = modal.querySelector("input");
    if (input) input.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  triggers.forEach(function (t) {
    t.addEventListener("click", function (e) { e.preventDefault(); open(); });
  });

  modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); close(); });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  if (form) {
    // required + type=email → 유효할 때만 submit 이벤트 발생
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      if (done) done.hidden = false;
    });
  }
})();
