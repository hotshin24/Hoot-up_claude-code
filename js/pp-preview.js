/* 크리에이터 공개 프로필 — 입력 → 라이브 미리보기 실시간 반영 (프런트 전용, 저장 없음)
   · 활동명/직함/한 줄 소개 텍스트
   · 전문 분야 칩(선택된 것만)
   · 웹사이트/GitHub/이메일 링크 아이콘
   (커버·프로필 사진은 pp-photo.js 가 반영)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  // 1) 텍스트 필드 → 미리보기
  var textMap = [
    ['pp-name', '.pp-preview__name'],
    ['pp-role', '.pp-preview__role'],
    ['pp-oneline', '.pp-preview__oneline']
  ];
  textMap.forEach(function (m) {
    var input = document.getElementById(m[0]);
    var target = document.querySelector(m[1]);
    if (!input || !target) return;
    input.addEventListener('input', function () {
      target.textContent = input.value.trim() || ' ';
    });
  });

  // 2) 전문 분야 칩 → 미리보기 (선택된 것만)
  var chipsGroup = document.querySelector('[data-pp-chips]');
  var previewChips = document.querySelector('.pp-preview__chips');
  function syncChips() {
    if (!chipsGroup || !previewChips) return;
    var labels = [].slice.call(chipsGroup.querySelectorAll('.pp-chip'))
      .filter(function (l) { var cb = l.querySelector('.pp-chip__cb'); return cb && cb.checked; })
      .map(function (l) { return l.textContent.trim(); });
    previewChips.innerHTML = '';
    labels.forEach(function (t) {
      var s = document.createElement('span');
      s.className = 'pp-preview__chip';
      s.textContent = t;
      previewChips.appendChild(s);
    });
  }
  // pp-chips.js(최대 개수 제한)가 먼저 처리하도록 스크립트 순서상 뒤에서 change 수신
  if (chipsGroup) chipsGroup.addEventListener('change', syncChips);

  // 3) 링크 아이콘 → href
  var box = document.querySelector('[data-pp-preview-links]');
  var linkMap = [
    { id: 'pp-web', key: 'web', mail: false },
    { id: 'pp-git', key: 'git', mail: false },
    { id: 'pp-mail', key: 'mail', mail: true }
  ];
  function normUrl(v) { if (!v) return ''; return /^https?:\/\//i.test(v) ? v : 'https://' + v; }
  function syncLinks() {
    if (!box) return;
    linkMap.forEach(function (m) {
      var input = document.getElementById(m.id);
      var a = box.querySelector('[data-pp-link="' + m.key + '"]');
      if (!input || !a) return;
      var v = input.value.trim();
      if (!v) { a.hidden = true; a.removeAttribute('href'); return; }
      a.hidden = false;
      a.setAttribute('href', m.mail ? ('mailto:' + v) : normUrl(v));
    });
  }
  linkMap.forEach(function (m) {
    var input = document.getElementById(m.id);
    if (input) input.addEventListener('input', syncLinks);
  });

  syncLinks();
  syncChips();
})();
