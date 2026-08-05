/* ============================================================
   HOOT UP — 공통 헤더 스크립트 (전 페이지 공용)
   nav.js + search.js + notifications.js 병합
   각 기능은 독립 IIFE, 대상 요소 없으면 자동으로 no-op
   ============================================================ */

/* ===== nav ===== */
/* ==========================================================================
   HOOT UP — 전체 카테고리 메가 메뉴
   햄버거 버튼 · '전체 카테고리' 링크로 펼치고, 왼쪽 대분류에 hover/클릭 시
   오른쪽 세부 카테고리를 탭처럼 전환한다. (JS 없이도 링크는 동작)
   ========================================================================== */
(function () {
  "use strict";

  var mega = document.getElementById("category-mega");
  if (!mega) return;

  var backdrop = document.querySelector(".mega-backdrop");
  var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-nav-toggle]"));
  var tabs = Array.prototype.slice.call(mega.querySelectorAll(".mega-cat"));
  var panels = Array.prototype.slice.call(mega.querySelectorAll(".mega-sub"));
  var lastTrigger = null;

  if (backdrop) backdrop.hidden = false; // JS 활성화 시 백드롭 사용

  function isOpen() {
    return mega.classList.contains("is-open");
  }

  function openMega(trigger) {
    mega.classList.add("is-open");
    mega.setAttribute("aria-hidden", "false");
    if (backdrop) backdrop.classList.add("is-open");
    toggles.forEach(function (t) { t.setAttribute("aria-expanded", "true"); });
    if (trigger) lastTrigger = trigger;
  }

  function closeMega(returnFocus) {
    mega.classList.remove("is-open");
    mega.setAttribute("aria-hidden", "true");
    if (backdrop) backdrop.classList.remove("is-open");
    toggles.forEach(function (t) { t.setAttribute("aria-expanded", "false"); });
    if (returnFocus && lastTrigger) lastTrigger.focus();
  }

  /* --- 대분류 탭 전환 --- */
  function activate(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    var targetId = tab.getAttribute("aria-controls");
    panels.forEach(function (p) {
      var on = p.id === targetId;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }

  /* --- 트리거(햄버거 · 전체 카테고리) --- */
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (isOpen()) closeMega(false);
      else openMega(btn);
    });
  });

  /* --- 탭 상호작용: hover · focus · click · 방향키 --- */
  tabs.forEach(function (tab, i) {
    tab.addEventListener("mouseenter", function () { activate(tab); });
    tab.addEventListener("focus", function () { activate(tab); });
    tab.addEventListener("click", function () { activate(tab); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next !== null) {
        e.preventDefault();
        tabs[next].focus();
      }
    });
  });

  /* --- 닫기: 백드롭 클릭 · Esc · 세부 링크 이동 --- */
  if (backdrop) {
    backdrop.addEventListener("click", function () { closeMega(false); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) closeMega(true);
  });
  mega.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeMega(false); // 실제 페이지 이동 시 닫힘
  });
})();


/* ===== search ===== */
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


/* ===== notifications ===== */
/* 헤더 벨 아이콘 알림 드롭다운 (전 페이지 공통)
   - [data-notif-toggle] 클릭 시 헤더 내 작은 팝오버 열림 (페이지 이동 없음)
   - 안 읽음 2 · 읽음 3, "모두 읽음"으로 안 읽음 배지 정리 */
(function () {
  var toggle = document.querySelector('[data-notif-toggle]');
  if (!toggle) return;

  var item = toggle.closest('.user-menu__item') || toggle.parentElement;
  item.classList.add('user-menu__item--notif');
  var badge = toggle.querySelector('.user-menu__badge');

  var unread = [
    { t: "찜한 'React 프론트엔드 실전 프로젝트'가 40% 할인 중이에요.", time: '10분 전' },
    { t: '수강 중인 반응형 웹 퍼블리싱에 새 공지가 등록됐어요.', time: '1시간 전' }
  ];
  var read = [
    { t: '졸업모(수료증)가 발급되었습니다 — 자바스크립트 핵심 완전 정복.', time: '어제' },
    { t: '올나잇 패스 구독이 갱신되었습니다.', time: '3일 전' },
    { t: '쿠폰이 도착했어요 — 신규 클래스 15% 할인.', time: '1주 전' }
  ];

  var panel = document.createElement('div');
  panel.className = 'notif';
  panel.id = 'notif-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', '알림');
  panel.hidden = true;
  item.appendChild(panel);
  // 패널이 실제로 생성된 뒤에 연결 (정적 HTML에 존재하지 않는 IDREF로 인한 W3C 오류 방지)
  toggle.setAttribute('aria-controls', 'notif-panel');

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function itemHtml(n, isUnread) {
    return '<li class="notif__item' + (isUnread ? ' notif__item--unread' : '') + '">' +
      '<span class="notif__dot" aria-hidden="true"></span>' +
      '<div class="notif__body"><p class="notif__text">' + esc(n.t) + '</p>' +
      '<p class="notif__time">' + esc(n.time) + '</p></div></li>';
  }

  function render() {
    var rows = unread.map(function (n) { return itemHtml(n, true); })
      .concat(read.map(function (n) { return itemHtml(n, false); }));
    var readAll = unread.length
      ? '<button class="notif__readall" type="button" data-readall>모두 읽음</button>'
      : '';
    panel.innerHTML =
      '<div class="notif__head">' +
        '<p class="notif__title">알림' +
          (unread.length ? ' <span class="notif__count">' + unread.length + '</span>' : '') +
        '</p>' + readAll +
      '</div>' +
      '<ul class="notif__list">' + rows.join('') + '</ul>';

    // 안 읽음 배지 동기화
    if (badge) {
      if (unread.length) {
        badge.hidden = false;
        badge.firstChild.nodeValue = String(unread.length);
      } else {
        badge.hidden = true;
      }
    }
  }

  function open() {
    render();
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onKey);
  }
  function close() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick, true);
    document.removeEventListener('keydown', onKey);
  }
  function onDocClick(e) {
    if (!item.contains(e.target)) close();
  }
  function onKey(e) {
    if (e.key === 'Escape') { close(); toggle.focus(); }
  }

  toggle.addEventListener('click', function (e) {
    e.preventDefault();
    if (panel.hidden) open(); else close();
  });

  // "모두 읽음"
  panel.addEventListener('click', function (e) {
    if (e.target.closest('[data-readall]')) {
      read = unread.concat(read);
      unread = [];
      render();
    }
  });
})();
