/* 담은 둥지(장바구니) — cart.html
   - 전체선택/개별 체크 · 삭제/전체 삭제 · 결제수단 선택 · 합계 실시간 재계산 */
(function () {
  var list = document.querySelector('.cart-list');
  var pay = document.querySelector('.cart-pay');
  if (!list || !pay) return;

  var allCheck = list.querySelector('.cart-all');
  var clearBtn = list.querySelector('.cart-list__clear');
  var allLabel = list.querySelector('.cart-all__count');

  function items() { return Array.prototype.slice.call(list.querySelectorAll('.cart-item')); }
  function won(n) { return n.toLocaleString('ko-KR') + '원'; }

  function recalc() {
    var all = items();
    var checked = all.filter(function (it) { return it.querySelector('.cart-item__check').checked; });
    var orig = 0, fin = 0;
    checked.forEach(function (it) {
      orig += parseInt(it.getAttribute('data-original'), 10) || 0;
      fin += parseInt(it.getAttribute('data-final'), 10) || 0;
    });
    var discount = orig - fin;

    var set = function (sel, v) { var e = pay.querySelector(sel); if (e) e.textContent = v; };
    set('[data-sum-original]', won(orig));
    set('[data-sum-discount]', orig ? '-' + won(discount) : won(0));
    set('[data-sum-total]', fin.toLocaleString('ko-KR'));
    set('[data-pay-btn]', checked.length ? won(fin) + ' 결제하기' : '결제할 상품을 선택하세요');

    // 상단 요약(전체선택 n/총) + 히어로 절약액
    if (allLabel) allLabel.textContent = checked.length + '/' + all.length;
    var save = document.querySelector('[data-save]');
    if (save) save.textContent = won(discount);
    // 전체선택 체크 상태
    if (allCheck) allCheck.checked = all.length > 0 && checked.length === all.length;
  }

  // 개별 체크
  list.addEventListener('change', function (e) {
    if (e.target.classList.contains('cart-item__check')) recalc();
  });
  // 전체선택
  if (allCheck) allCheck.addEventListener('change', function () {
    items().forEach(function (it) { it.querySelector('.cart-item__check').checked = allCheck.checked; });
    recalc();
  });
  // 개별 삭제
  list.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.cart-item__remove') : null;
    if (!btn) return;
    var item = btn.closest('.cart-item');
    if (item) item.remove();
    recalc();
  });
  // 전체 삭제
  if (clearBtn) clearBtn.addEventListener('click', function () {
    items().forEach(function (it) { it.remove(); });
    recalc();
  });

  // 결제수단 선택
  var methods = Array.prototype.slice.call(pay.querySelectorAll('.cart-method'));
  methods.forEach(function (m) {
    m.addEventListener('change', function () {
      methods.forEach(function (x) { x.classList.toggle('is-selected', x.querySelector('.cart-radio').checked); });
    });
  });

  recalc();
})();
