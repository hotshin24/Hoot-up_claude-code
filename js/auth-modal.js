/* ==========================================================================
   HOOT UP — 인증 모달 (로그인 / 회원가입)
   열기·닫기 · 상호 전환 · 비밀번호 표시 토글 · 데모 계정 자동입력
   ========================================================================== */
(function () {
  "use strict";

  var signupModal = document.getElementById("signup-modal");
  var loginModal = document.getElementById("login-modal");
  var modals = [signupModal, loginModal].filter(Boolean);
  if (!modals.length) return;

  var lastFocus = null;

  function closeAll() {
    modals.forEach(function (m) { m.hidden = true; });
    document.body.style.overflow = "";
  }

  function openModal(modal) {
    if (!modal) return;
    var open = modals.some(function (m) { return !m.hidden; });
    if (!open) lastFocus = document.activeElement;   // 다른 모달에서 전환 시 원래 포커스 유지
    closeAll();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var first = modal.querySelector("input");
    if (first) first.focus();
  }

  // 열기 트리거
  document.querySelectorAll("[data-open-signup]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openModal(signupModal); });
  });
  document.querySelectorAll("[data-open-login]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openModal(loginModal); });
  });

  // 모달별 닫기 · 비밀번호 토글 · 제출 방지
  modals.forEach(function (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        closeAll();
        if (lastFocus) lastFocus.focus();
      });
    });

    modal.querySelectorAll("[data-pw-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = btn.parentElement.querySelector("input");
        var icon = btn.querySelector(".icon");
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        icon.classList.toggle("icon--eye", show);
        icon.classList.toggle("icon--eye-slash", !show);
        btn.setAttribute("aria-label", show ? "비밀번호 숨기기" : "비밀번호 표시");
      });
    });

    var form = modal.querySelector("form");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
  });

  // Esc 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (modals.some(function (m) { return !m.hidden; })) {
        closeAll();
        if (lastFocus) lastFocus.focus();
      }
    }
  });

  // 데모 계정 라디오 → 로그인 폼 자동 입력
  if (loginModal) {
    var emailField = loginModal.querySelector('input[type="email"]');
    var pwField = loginModal.querySelector('input[type="password"]');
    loginModal.querySelectorAll("[data-demo-email]").forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (emailField) emailField.value = radio.getAttribute("data-demo-email");
        if (pwField) pwField.value = radio.getAttribute("data-demo-pw");
      });
    });
  }
})();
