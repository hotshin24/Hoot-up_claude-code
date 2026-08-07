/* 찜한 둥지 — 항목 체크박스에 따라 '담기' 버튼 활성/비활성 (데모)
   체크됨 → 활성(클릭 시 cart.html), 해제 → 비활성(클릭 무시)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  [].slice.call(document.querySelectorAll('.wish-item')).forEach(function (item) {
    var check = item.querySelector('.wish-check');
    var btn = item.querySelector('.wish-item__btn');
    if (!check || !btn) return;

    function sync() {
      var on = check.checked;
      btn.classList.toggle('is-disabled', !on);
      btn.setAttribute('aria-disabled', on ? 'false' : 'true');
    }

    check.addEventListener('change', sync);
    btn.addEventListener('click', function (e) {
      if (!check.checked) e.preventDefault();   // 비활성 상태면 이동 차단
    });

    sync();   // 초기 상태 반영
  });
})();
