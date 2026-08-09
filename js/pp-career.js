/* 크리에이터 공개 프로필 — 경력·이력 추가/삭제 (데모)
   · + 경력 추가 → 빈 경력 행(기간·내용 input) 추가
   · × → 해당 경력 행 삭제 (위임이라 동적 추가 행도 동작)
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var wrap = document.querySelector('.pp-careers');
  var addBtn = document.querySelector('.pp-add');
  if (!wrap) return;

  function newCareer() {
    var row = document.createElement('div');
    row.className = 'pp-career';
    row.innerHTML =
      '<input class="pp-career__year" type="text" value="" placeholder="기간 (예: 2024 – 현재)" aria-label="기간">' +
      '<input class="pp-career__desc" type="text" value="" placeholder="경력 내용" aria-label="경력 내용">' +
      '<button class="pp-career__remove" type="button" aria-label="삭제">×</button>';
    return row;
  }

  // 삭제(×)
  wrap.addEventListener('click', function (e) {
    var rm = e.target.closest('.pp-career__remove');
    if (rm) rm.closest('.pp-career').remove();
  });

  // 경력 추가(+)
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var row = newCareer();
      wrap.appendChild(row);
      row.querySelector('.pp-career__year').focus();
    });
  }
})();
