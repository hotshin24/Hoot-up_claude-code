/* 스위치 토글 (.account-toggle) — 클릭 시 on/off 전환
   알림 설정(account-notifications) · 대시보드 계정 설정(account) 공용 */
(function () {
  var toggles = document.querySelectorAll('.account-toggle');
  if (!toggles.length) return;

  Array.prototype.forEach.call(toggles, function (btn) {
    btn.addEventListener('click', function () {
      var on = !btn.classList.contains('is-on');
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  });
})();
