/* 훗업 페스타 카운트다운 (HOUR·MIN·SEC)
   - 포트폴리오용: 고정 목표일 없이, 마크업 초기값(08:31:55)에서 시작
   - 새로고침(로드)마다 초기값부터 매초 카운트다운, 00:00:00에서 멈춤 */
(function () {
  var timer = document.querySelector('.festa-hero__timer');
  if (!timer) return;
  var nums = timer.querySelectorAll('.festa-hero__timer-num'); // [시, 분, 초]
  if (nums.length < 3) return;

  function val(el) { return parseInt(el.textContent.trim(), 10) || 0; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  var total = val(nums[0]) * 3600 + val(nums[1]) * 60 + val(nums[2]); // 로드 시 1회 캡처
  var start = Date.now();

  function render() {
    var rem = total - Math.floor((Date.now() - start) / 1000);
    if (rem < 0) rem = 0;
    nums[0].textContent = pad(Math.floor(rem / 3600));
    nums[1].textContent = pad(Math.floor((rem % 3600) / 60));
    nums[2].textContent = pad(rem % 60);
    if (rem === 0) clearInterval(iv);
  }

  var iv = setInterval(render, 1000);
  render();
})();
