/* 클래스 개설 문의 — 제출 확인 모달 → 접수 완료 모달 (백엔드 없음, 데모)
   required 필드 네이티브 검증을 통과해야 submit 이벤트가 발생 → 확인 모달
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var form = document.querySelector('.creator-apply__form');
  var confirmM = document.getElementById('ca-confirm-modal');
  var doneM = document.getElementById('ca-submit-modal');
  if (!form || !confirmM || !doneM) return;

  var trigger = null;

  function show(m) {
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var b = m.querySelector('[data-ca-confirm], [data-modal-close]');
    if (b) b.focus();
  }
  function hide(m) {
    m.hidden = true;
    document.body.style.overflow = '';
    if (trigger && trigger.focus) trigger.focus();
    trigger = null;
  }

  // 제출 → 확인 모달
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    trigger = document.activeElement;
    show(confirmM);
  });

  // 확인 → 완료 모달 (전환: 배경 스크롤 잠금 유지)
  confirmM.querySelector('[data-ca-confirm]').addEventListener('click', function () {
    confirmM.hidden = true;
    doneM.hidden = false;
    var c = doneM.querySelector('[data-modal-close]');
    if (c) c.focus();
    form.reset();
  });

  // 취소 · X · 배경 → 확인 모달 닫기 (폼 유지)
  confirmM.querySelectorAll('[data-ca-cancel], [data-modal-close]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); hide(confirmM); });
  });

  // 완료 모달 닫기
  doneM.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); hide(doneM); });
  });

  // Esc
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!confirmM.hidden) hide(confirmM);
    else if (!doneM.hidden) hide(doneM);
  });
})();
