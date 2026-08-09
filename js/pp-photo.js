/* 크리에이터 공개 프로필 — 커버/프로필 사진 변경·삭제 (프런트 전용 데모, 업로드 없음)
   · 커버 이미지 변경 → .pp-cover 배경 + 미리보기 커버(.pp-preview__cover)
   · 프로필 이미지 변경 → 아바타(.pp-photo__avatar) + 미리보기 아바타(.pp-preview__avatar)
   · 삭제 → 아바타/미리보기 아바타를 기본 플레이스홀더로 (확인 모달의 '확인'에서 실행)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var PLACEHOLDER = 'assets/avatar/placeholder.svg';

  var cover = document.querySelector('.pp-cover');
  var previewCover = document.querySelector('.pp-preview__cover');
  var coverBtn = document.querySelector('[data-pp-cover-btn]');
  var coverInput = document.querySelector('[data-pp-cover-input]');
  var avatar = document.querySelector('.pp-photo__avatar');
  var previewAvatar = document.querySelector('.pp-preview__avatar');
  var changeBtn = document.querySelector('[data-pp-photo-change]');
  var delConfirm = document.querySelector('[data-pp-photo-del-confirm]');
  var photoInput = document.querySelector('[data-pp-photo-input]');

  function setCover(el, url) {
    if (!el) return;
    el.style.backgroundImage = 'url("' + url + '")';
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
  }

  // 커버 이미지 변경
  if (cover && coverBtn && coverInput) {
    coverBtn.addEventListener('click', function () { coverInput.click(); });
    coverInput.addEventListener('change', function () {
      var f = coverInput.files && coverInput.files[0];
      if (!f) return;
      var url = URL.createObjectURL(f);
      setCover(cover, url);
      setCover(previewCover, url);   // 미리보기 커버 반영
    });
  }

  // 프로필 이미지 변경
  if (avatar && changeBtn && photoInput) {
    changeBtn.addEventListener('click', function () { photoInput.click(); });
    photoInput.addEventListener('change', function () {
      var f = photoInput.files && photoInput.files[0];
      if (!f) return;
      var url = URL.createObjectURL(f);
      avatar.src = url;
      if (previewAvatar) previewAvatar.src = url;   // 미리보기 아바타 반영
    });
  }

  // 프로필 이미지 삭제 (확인 모달의 '확인')
  if (avatar && delConfirm) {
    delConfirm.addEventListener('click', function () {
      avatar.src = PLACEHOLDER;
      if (previewAvatar) previewAvatar.src = PLACEHOLDER;
      if (photoInput) photoInput.value = '';
    });
  }
})();
