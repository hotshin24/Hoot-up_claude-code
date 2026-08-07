/* 내 클래스 관리 상태 필터 (creator-classes.html)
   - .myclass-chip[data-tab] 로 .cm-row[data-tabs] 표시/숨김
   - 마지막으로 보이는 행에 .cm-row--last 부여(하단 구분선 제거) */
(function () {
  var filter = document.querySelector('.myclass-chips');
  var list = document.querySelector('.cm-list');
  if (!filter || !list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll('.cm-row'));
  var chips = Array.prototype.slice.call(filter.querySelectorAll('.myclass-chip'));

  function apply(tab) {
    rows.forEach(function (r) {
      var tabs = ' ' + (r.getAttribute('data-tabs') || '') + ' ';
      var hide = tabs.indexOf(' ' + tab + ' ') === -1;
      r.hidden = hide;                        // 접근성(스크린리더)
      r.style.display = hide ? 'none' : '';   // 캐시 무관 확실한 시각적 토글
    });
    var visible = rows.filter(function (r) { return r.style.display !== 'none'; });
    rows.forEach(function (r) { r.classList.remove('cm-row--last'); });
    if (visible.length) visible[visible.length - 1].classList.add('cm-row--last');
  }

  filter.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.myclass-chip') : null;
    if (!chip) return;
    chips.forEach(function (c) {
      var on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    apply(chip.getAttribute('data-tab') || 'all');
  });
})();
