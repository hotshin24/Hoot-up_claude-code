/* 내 클래스 관리 — 초안 삭제 (데모)
   · '초안 삭제' 클릭 → 확인 모달 → 확인 → 완료 모달 + 해당 초안 카드(article) 실제 제거
   모달 닫기(취소·X·배경·Esc)는 modal.js 가 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var confirmM = document.getElementById('cm-draft-confirm');
  var doneM = document.getElementById('cm-draft-done');
  if (!confirmM || !doneM) return;

  var pending = null;   // 삭제 대상 article
  var list = document.querySelector('.cm-list');

  // 삭제 후: 마지막으로 보이는 행에 다시 --last 부여(하단 구분선 제거) — cm-tabs.js 와 동일 규칙
  function refreshLast() {
    if (!list) return;
    var rows = [].slice.call(list.querySelectorAll('.cm-row'));
    rows.forEach(function (r) { r.classList.remove('cm-row--last'); });
    var visible = rows.filter(function (r) { return !r.hidden && r.style.display !== 'none'; });
    if (visible.length) visible[visible.length - 1].classList.add('cm-row--last');
  }

  function openModal(m) {
    m.hidden = false;
    document.body.style.overflow = 'hidden';
    var c = m.querySelector('[data-modal-close]');
    if (c) c.focus();
  }

  [].slice.call(document.querySelectorAll('[data-cm-draft-del]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      pending = btn.closest('.cm-row');
      openModal(confirmM);
    });
  });

  var confirmBtn = confirmM.querySelector('[data-cm-draft-confirm]');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      if (pending) { pending.remove(); pending = null; refreshLast(); }   // 초안 카드 제거 + 구분선 재계산
      confirmM.hidden = true;                              // 배경 스크롤 잠금은 완료 모달로 이어짐
      doneM.hidden = false;
      var c = doneM.querySelector('[data-modal-close]');
      if (c) c.focus();
    });
  }
})();
