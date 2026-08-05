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
