/* ==========================================================================
   HOOT UP — 헤더 검색 자동완성
   전체 클래스(categories.html)를 런타임에 파싱해 인덱스로 사용(단일 소스).
   제목·카테고리·지식공유자명으로 필터 → 드롭다운 결과, Enter/클릭으로 이동.
   ========================================================================== */
(function () {
  "use strict";

  var form = document.querySelector(".search");
  if (!form) return;
  var input = form.querySelector(".search__input");
  if (!input) return;

  var CATS = {
    "dev-it": "개발 & IT",
    "career-money": "커리어 & 머니",
    "design-creative": "디자인 & 크리에이티브",
    "photo-video": "사진 & 영상",
    "drawing-illust": "드로잉 & 일러스트",
    "fitness-mindfulness": "운동 & 마음챙김",
    "craft-handmade": "공예 & 핸드메이드",
    "cooking-baking": "요리 & 베이킹"
  };

  var box = document.createElement("div");
  box.className = "search__results";
  box.setAttribute("role", "listbox");
  box.hidden = true;
  form.appendChild(box);

  var index = null, loading = false, current = [], active = -1;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function ensureIndex(cb) {
    if (index) { cb && cb(); return; }
    if (loading) return;
    loading = true;
    fetch("categories.html")
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var seen = {};
        index = [];
        doc.querySelectorAll(".course-grid__item").forEach(function (li) {
          var a = li.querySelector(".course-card__link");
          if (!a) return;
          var title = a.textContent.trim();
          if (seen[title]) return;         // 중복 제목 제거
          seen[title] = 1;
          var meta = li.querySelector(".course-card__meta");
          index.push({
            title: title,
            href: a.getAttribute("href"),
            cat: li.getAttribute("data-category") || "",
            meta: meta ? meta.textContent.trim() : ""
          });
        });
        loading = false;
        cb && cb();
      })
      .catch(function () { loading = false; });
  }

  function close() { box.hidden = true; active = -1; }

  function render() {
    var q = input.value.trim().toLowerCase();
    if (!q) { close(); return; }
    if (!index) { ensureIndex(render); return; }

    current = index.filter(function (it) {
      return it.title.toLowerCase().indexOf(q) > -1
          || (CATS[it.cat] || "").toLowerCase().indexOf(q) > -1
          || it.meta.toLowerCase().indexOf(q) > -1;
    }).slice(0, 8);
    active = -1;

    if (!current.length) {
      box.innerHTML = '<p class="search__empty"><b>' + esc(input.value.trim()) + '</b> 검색 결과가 없어요</p>';
      box.hidden = false;
      return;
    }

    box.innerHTML = current.map(function (it, i) {
      var t = esc(it.title);
      var idx = it.title.toLowerCase().indexOf(q);
      if (idx > -1) {
        t = esc(it.title.slice(0, idx)) +
            "<mark>" + esc(it.title.slice(idx, idx + q.length)) + "</mark>" +
            esc(it.title.slice(idx + q.length));
      }
      return '<a class="search__result" role="option" href="' + esc(it.href) + '" data-i="' + i + '">' +
               '<span class="search__result-cat">' + esc(CATS[it.cat] || it.cat) + '</span>' +
               '<span class="search__result-title">' + t + '</span>' +
             '</a>';
    }).join("");
    box.hidden = false;
  }

  function setActive(n) {
    var opts = box.querySelectorAll(".search__result");
    if (!opts.length) return;
    active = (n + opts.length) % opts.length;
    opts.forEach(function (o, i) { o.classList.toggle("is-active", i === active); });
    opts[active].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("input", render);
  input.addEventListener("focus", function () {
    if (input.value.trim()) render(); else ensureIndex();
  });

  input.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Escape") { close(); }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var opts = box.querySelectorAll(".search__result");
    if (active > -1 && opts[active]) { window.location.href = opts[active].getAttribute("href"); }
    else if (current[0]) { window.location.href = current[0].href; }
    else { window.location.href = "categories.html"; }   // 결과 없으면 전체 클래스로
  });

  document.addEventListener("click", function (e) {
    if (!form.contains(e.target)) close();
  });
})();
