/* HOOT UP — 구독 모달 공용 (뉴스레터·매거진 등)
   - 트리거 [data-open-subscribe] (aria-controls = 모달 id) → 모달 열기
   - .modal 안에 [data-subscribe-form]이 있으면 구독 모달로 인식
   - 제출 시 폼 숨김 + .subscribe-done 완료 문구 표시 (백엔드 없음, 데모)
   - 닫기: [data-modal-close](X·배경) · Esc */
(function () {
  "use strict";
  var modals = {};
  var lastFocus = null;

  function close(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  function open(modal) {
    lastFocus = document.activeElement;
    var form = modal.querySelector("[data-subscribe-form]");
    var done = modal.querySelector(".subscribe-done");
    if (form) { form.style.display = ""; form.reset(); }
    if (done) done.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var input = modal.querySelector("input");
    if (input) input.focus();
  }

  [].slice.call(document.querySelectorAll(".modal")).forEach(function (modal) {
    var form = modal.querySelector("[data-subscribe-form]");
    if (!form) return; // 구독 폼이 있는 모달만 대상
    modals[modal.id] = modal;

    modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); close(modal); });
    });

    // required + type=email → 유효할 때만 submit 이벤트 발생
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      var done = modal.querySelector(".subscribe-done");
      if (done) done.hidden = false;
    });
  });

  [].slice.call(document.querySelectorAll("[data-open-subscribe]")).forEach(function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      var m = modals[t.getAttribute("aria-controls")];
      if (m) open(m);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    for (var id in modals) { if (!modals[id].hidden) close(modals[id]); }
  });
})();
