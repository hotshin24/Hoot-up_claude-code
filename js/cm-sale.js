/* 내 클래스 관리 — 판매 중지/재개 토글 (데모)
   · '판매 중지' 클릭 → 중지 확인 모달 → 확인 → 중지 완료 모달 + 버튼 '판매 재개'로 변경
   · '판매 재개' 클릭 → 재개 확인 모달 → 확인 → 재개 완료 모달 + 버튼 '판매 중지'로 변경
   모달 열기/닫기(취소·X·배경·Esc)는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var stopConfirm = document.getElementById('cm-sale-confirm');
  var stopDone = document.getElementById('cm-sale-done');
  var resumeConfirm = document.getElementById('cm-resume-confirm');
  var resumeDone = document.getElementById('cm-resume-done');
  if (!stopConfirm || !stopDone || !resumeConfirm || !resumeDone) return;

  var pending = null;

  function openModal(m) {
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var c = m.querySelector('[data-modal-close]');
    if (c) c.focus();
  }

  function advance(fromModal, toModal) {
    fromModal.hidden = true;         // 배경 스크롤 잠금은 완료 모달로 이어짐
    toModal.hidden = false;
    var c = toModal.querySelector('[data-modal-close]');
    if (c) c.focus();
  }

  // 판매 중지 ↔ 재개 버튼 → 상태에 맞는 확인 모달
  [].slice.call(document.querySelectorAll('[data-cm-sale]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      pending = btn;
      openModal(btn.classList.contains('is-stopped') ? resumeConfirm : stopConfirm);
    });
  });

  // 판매 중지 확정
  var stopBtn = stopConfirm.querySelector('[data-cm-sale-confirm]');
  if (stopBtn) {
    stopBtn.addEventListener('click', function () {
      if (pending) { pending.classList.add('is-stopped'); pending.textContent = '판매 재개'; }
      advance(stopConfirm, stopDone);
    });
  }

  // 판매 재개 확정
  var resumeBtn = resumeConfirm.querySelector('[data-cm-resume-confirm]');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function () {
      if (pending) { pending.classList.remove('is-stopped'); pending.textContent = '판매 중지'; }
      advance(resumeConfirm, resumeDone);
    });
  }
})();
