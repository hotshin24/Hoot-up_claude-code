/* 크리에이터 공개 프로필 — 전문 분야 칩 (체크박스, 최대 N개 선택) (데모)
   data-pp-chips 그룹 안 .pp-chip__cb 체크박스, data-pp-max 개수 초과 선택 방지
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var group = document.querySelector('[data-pp-chips]');
  if (!group) return;

  var MAX = parseInt(group.getAttribute('data-pp-max'), 10) || 3;
  var cbs = [].slice.call(group.querySelectorAll('.pp-chip__cb'));

  group.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb.classList || !cb.classList.contains('pp-chip__cb')) return;
    if (cb.checked) {
      var count = cbs.filter(function (c) { return c.checked; }).length;
      if (count > MAX) cb.checked = false;   // 최대 개수 초과 → 되돌림
    }
  });
})();
