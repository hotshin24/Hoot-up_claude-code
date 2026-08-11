/* HOOT UP DESK — 모닝 뉴스레터 폼 데모 처리 (백엔드 없음 → 전송 대신 완료 피드백) */
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('.desk-morning__form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // 백엔드 없음 → 전송 대신 데모 피드백
    var input = form.querySelector('.desk-morning__input');
    var btn = form.querySelector('.desk-morning__btn');
    var done = form.querySelector('.desk-morning__done');
    if (input) input.style.display = 'none';
    if (btn) btn.style.display = 'none';
    if (done) done.hidden = false;
  });
});
