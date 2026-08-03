/* 이벤트 카운트다운 시계 (index / index-member)
   - 포트폴리오용: 고정 목표일 없이, 마크업에 적힌 초기값(예: 06일 13:46:31)에서 시작
   - 페이지 로드(새로고침)마다 초기값부터 매초 카운트다운, 0에서 멈춤 */
(function () {
  var clocks = document.querySelectorAll('.countdown__clock');
  if (!clocks.length) return;

  clocks.forEach(function (clock) {
    var units = clock.querySelectorAll('.countdown__unit');
    if (units.length < 4) return;

    function readUnit(u) {
      var s = '';
      u.querySelectorAll('.countdown__digit').forEach(function (d) { s += d.textContent.trim(); });
      return parseInt(s, 10) || 0;
    }

    // 초기값(일·시·분·초) → 총 초. 로드 시 1회만 캡처
    var total = readUnit(units[0]) * 86400 +
                readUnit(units[1]) * 3600 +
                readUnit(units[2]) * 60 +
                readUnit(units[3]);
    var start = Date.now();

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function setUnit(u, val) {
      var str = pad(val);
      var d = u.querySelectorAll('.countdown__digit');
      if (d[0]) d[0].textContent = str.charAt(0);
      if (d[1]) d[1].textContent = str.charAt(1);
    }

    var timer = null;
    function render() {
      var rem = total - Math.floor((Date.now() - start) / 1000);
      if (rem < 0) rem = 0;
      setUnit(units[0], Math.floor(rem / 86400));
      setUnit(units[1], Math.floor((rem % 86400) / 3600));
      setUnit(units[2], Math.floor((rem % 3600) / 60));
      setUnit(units[3], rem % 60);
      if (rem === 0 && timer) { clearInterval(timer); timer = null; }
    }

    render();
    timer = setInterval(render, 1000);
  });
})();
