/* 크리에이터 정산 계좌 (creator-tax.html) — readonly ↔ 편집 토글 (데모, 저장 없음)
   · 기본: readonly(보기) — 입력 잠금 + '계좌 정보 수정' 버튼만
   · 수정: 편집 가능 + '취소' · '계좌 정보 저장' 버튼
   · 저장: 값 유지하고 보기 모드로
   · 취소: 수정 전 값으로 되돌리고 보기 모드로
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var account = document.querySelector('[data-tax-account]');
  if (!account) return;

  var editBtn = account.querySelector('[data-tax-edit]');
  var cancelBtn = account.querySelector('[data-tax-cancel]');
  var saveBtn = account.querySelector('[data-tax-save]');
  var fields = [].slice.call(account.querySelectorAll('.tax-field__control'));
  var snapshot = {};

  function setReadonly(view) {
    account.classList.toggle('is-readonly', view);
    fields.forEach(function (el) {
      if (el.tagName === 'SELECT') el.disabled = view;   // select 는 disabled 로
      else el.readOnly = view;
    });
  }

  function takeSnapshot() {
    fields.forEach(function (el, i) { snapshot[i] = el.value; });
  }
  function restoreSnapshot() {
    fields.forEach(function (el, i) { if (i in snapshot) el.value = snapshot[i]; });
  }

  if (editBtn) editBtn.addEventListener('click', function () {
    takeSnapshot();
    setReadonly(false);
    if (fields[0]) fields[0].focus();
  });

  if (saveBtn) saveBtn.addEventListener('click', function () {
    setReadonly(true);
  });

  if (cancelBtn) cancelBtn.addEventListener('click', function () {
    restoreSnapshot();
    setReadonly(true);
  });

  setReadonly(true);   // 초기: 보기 모드

  // 서류 파일 업로드 (신분증·사업자등록증) — 프런트 전용 데모, 실제 업로드 없음
  var upBtn = document.querySelector('[data-tax-upload-btn]');
  var upInput = document.querySelector('[data-tax-upload-input]');
  var upSub = document.querySelector('[data-tax-upload-sub]');
  if (upBtn && upInput) {
    upBtn.addEventListener('click', function () { upInput.click(); });
    upInput.addEventListener('change', function () {
      var f = upInput.files && upInput.files[0];
      if (!f) return;
      if (upSub) {
        upSub.textContent = f.name + ' · 제출 완료';
        upSub.classList.remove('tax-doc__sub--danger');
      }
      upBtn.textContent = '다시 업로드';
    });
  }

  // 정산 알림 이메일 변경 모달 — 제출 시 표시 이메일 갱신 (열기·완료문구·닫기는 subscribe-modal.js)
  var emailForm = document.querySelector('[data-tax-email-form]');
  var emailSub = document.querySelector('[data-tax-email]');
  if (emailForm && emailSub) {
    emailForm.addEventListener('submit', function () {
      var input = emailForm.querySelector('input[name="new-email"]');
      var v = input ? input.value.trim() : '';
      if (v) emailSub.textContent = v;
    });
  }
})();
