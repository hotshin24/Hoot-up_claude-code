/* 회원정보 — 프로필 사진 변경/삭제 (프런트 전용 데모, 업로드 없음)
   · 이미지 변경 → 파일 선택 후 로컬 미리보기(URL.createObjectURL)
   · 삭제 → 기본 플레이스홀더로 되돌림
   ※ 취소 시 원복은 member-save.js 의 스냅샷이 담당
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var avatar = document.querySelector('.member-photo__avatar');
  var input = document.querySelector('[data-photo-input]');
  var changeBtn = document.querySelector('[data-photo-change]');
  var deleteBtn = document.querySelector('[data-photo-delete]');
  if (!avatar) return;

  var PLACEHOLDER = 'assets/avatar/placeholder.svg';

  if (changeBtn && input) {
    changeBtn.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      avatar.src = URL.createObjectURL(file);   // 로컬 미리보기 (서버 업로드 없음)
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      avatar.src = PLACEHOLDER;
      if (input) input.value = '';
    });
  }
})();
