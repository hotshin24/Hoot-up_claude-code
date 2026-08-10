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

  /* --- 모바일 아코디언 모드 (≤480): 세부 패널을 대분류 바로 아래로 펼침 --- */
  var subsWrap = mega.querySelector(".mega__subs");
  var accordion = false;

  function collapseAll() {
    tabs.forEach(function (t) {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
      t.setAttribute("aria-expanded", "false");
      var p = document.getElementById(t.getAttribute("aria-controls"));
      if (p) { p.hidden = true; p.classList.remove("is-active"); }
    });
  }
  function toAccordion() {
    if (accordion) return;
    tabs.forEach(function (t) {                // 각 패널을 해당 대분류 바로 뒤로 이동
      var p = document.getElementById(t.getAttribute("aria-controls"));
      if (p) t.insertAdjacentElement("afterend", p);
    });
    collapseAll();                            // 시작은 모두 접힘
    mega.classList.add("is-accordion");
    accordion = true;
  }
  function toColumns() {
    if (!accordion) return;                   // 이미 컬럼(데스크톱/태블릿) 모드
    tabs.forEach(function (t) {               // 패널을 원래 컨테이너로 복귀
      var p = document.getElementById(t.getAttribute("aria-controls"));
      if (p) { subsWrap.appendChild(p); t.removeAttribute("aria-expanded"); }
    });
    mega.classList.remove("is-accordion");
    accordion = false;
    activate(tabs[0]);
  }
  var mqMobile = window.matchMedia("(max-width: 480px)");
  function applyMenuMode() { if (mqMobile.matches) toAccordion(); else toColumns(); }
  if (mqMobile.addEventListener) mqMobile.addEventListener("change", applyMenuMode);
  else if (mqMobile.addListener) mqMobile.addListener(applyMenuMode);

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
    tab.addEventListener("mouseenter", function () { if (!accordion) activate(tab); });
    tab.addEventListener("focus", function () { if (!accordion) activate(tab); });
    tab.addEventListener("click", function () {
      if (accordion) {                        // 모바일: 클릭 시 토글(같은 항목 다시 누르면 접힘)
        var wasActive = tab.classList.contains("is-active");
        collapseAll();
        if (!wasActive) { activate(tab); tab.setAttribute("aria-expanded", "true"); }
      } else {
        activate(tab);
      }
    });
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

  applyMenuMode();   // 초기 진입 시 화면 폭에 맞는 모드 적용
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

/* ===== gnb 퀵링크 가로 스크롤 chevron (태블릿·모바일 ≤768) ===== */
(function () {
  "use strict";
  var gnb = document.querySelector(".gnb");
  var list = gnb && gnb.querySelector(".gnb__list");
  if (!gnb || !list) return;

  // 리스트를 스크롤러로 감싸고 양 끝에 chevron 버튼 삽입
  var scroller = document.createElement("div");
  scroller.className = "gnb__scroller";
  list.parentNode.insertBefore(scroller, list);
  scroller.appendChild(list);

  function makeChev(dir) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "gnb__chev gnb__chev--" + dir;
    b.setAttribute("aria-label", dir === "prev" ? "이전 메뉴 보기" : "다음 메뉴 보기");
    b.tabIndex = -1;
    var s = document.createElement("span");
    s.className = "icon icon--chevron-" + (dir === "prev" ? "left" : "right");
    s.setAttribute("aria-hidden", "true");
    b.appendChild(s);
    return b;
  }
  var prev = makeChev("prev");
  var next = makeChev("next");
  scroller.appendChild(prev);
  scroller.appendChild(next);

  function update() {
    var max = list.scrollWidth - list.clientWidth;
    prev.classList.toggle("is-shown", list.scrollLeft > 4);
    next.classList.toggle("is-shown", list.scrollLeft < max - 4);
  }
  function step(sign) {
    list.scrollBy({ left: sign * Math.max(120, Math.round(list.clientWidth * 0.6)), behavior: "smooth" });
  }
  prev.addEventListener("click", function () { step(-1); });
  next.addEventListener("click", function () { step(1); });
  list.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* ===== 카테고리 버튼 접기 (≤1280: 첫 행만 노출, 우측 원형 chevron 으로 펼침)
   세부 카테고리(.subcat .chip-list) · 대분류 필터(.class-filter__list) 공용 ===== */
(function () {
  "use strict";

  // [호스트(=position 기준·토글 삽입 위치), 리스트, 버튼 안 항목, aria 라벨]
  var TARGETS = [
    { host: ".subcat nav", list: ".chip-list", item: ".chip", label: "세부 카테고리 모두 보기" },
    { host: ".class-filter", list: ".class-filter__list", item: ".chip", label: "카테고리 모두 보기" }
  ];
  var mq = window.matchMedia("(max-width: 1280px)");

  function initHost(host, cfg) {
    var list = host.querySelector(cfg.list);
    if (!list) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chipfilter-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", cfg.label);
    var ic = document.createElement("span");
    ic.className = "icon icon--chevron-down";
    ic.setAttribute("aria-hidden", "true");
    btn.appendChild(ic);
    host.appendChild(btn);

    var expanded = false;

    function items() { return list.querySelectorAll(cfg.item); }
    function firstRowBottom() {
      var it = items();
      if (!it.length) return 0;
      return Math.round(it[0].getBoundingClientRect().bottom - list.getBoundingClientRect().top);
    }
    function isMultiRow() {
      var it = items();
      if (it.length < 2) return false;
      var top0 = it[0].getBoundingClientRect().top;
      for (var i = 1; i < it.length; i++) {
        if (it[i].getBoundingClientRect().top > top0 + 4) return true;
      }
      return false;
    }
    function placeToggle() {
      // chevron 을 첫 행 중앙에 정렬 (호스트별 상단 패딩 차이를 자동 보정)
      var it = items();
      if (!it.length) return;
      var r = it[0].getBoundingClientRect();
      var hostTop = host.getBoundingClientRect().top;
      btn.style.top = Math.round((r.top - hostTop) + (r.height - 38) / 2) + "px";
    }
    function apply() {
      // 자연 상태로 되돌려 행 수/첫 행 높이를 측정
      list.style.maxHeight = "";
      list.style.overflow = "";
      list.style.marginBottom = "";
      if (!mq.matches || !isMultiRow()) {
        host.classList.remove("is-chipfilter-collapsible", "is-chipfilter-expanded");
        btn.setAttribute("aria-expanded", "false");
        return;
      }
      host.classList.add("is-chipfilter-collapsible");
      placeToggle();
      if (expanded) {
        host.classList.add("is-chipfilter-expanded");
        btn.setAttribute("aria-expanded", "true");
        // 펼침: 높이 제한 없음 (자연 높이)
      } else {
        host.classList.remove("is-chipfilter-expanded");
        btn.setAttribute("aria-expanded", "false");
        // 첫 행에서 클립하되, 리스트 자체의 하단 패딩만큼 margin 으로 보정해
        // 아래 경계선과의 간격을 접힘 상태에서도 유지 (호스트에 패딩이 있으면 0 → 보정 불필요)
        var padBottom = parseFloat(getComputedStyle(list).paddingBottom) || 0;
        list.style.maxHeight = firstRowBottom() + "px";
        list.style.overflow = "hidden";
        list.style.marginBottom = padBottom + "px";
      }
    }

    btn.addEventListener("click", function () {
      expanded = !expanded;
      apply();
    });
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(apply, 120);
    });
    window.addEventListener("load", apply);
    if (mq.addEventListener) {
      mq.addEventListener("change", function () { expanded = false; apply(); });
    } else if (mq.addListener) {
      mq.addListener(function () { expanded = false; apply(); });
    }
    apply();
  }

  var found = false;
  TARGETS.forEach(function (cfg) {
    Array.prototype.forEach.call(document.querySelectorAll(cfg.host), function (host) {
      found = true;
      initHost(host, cfg);
    });
  });
  if (!found) return;
})();
