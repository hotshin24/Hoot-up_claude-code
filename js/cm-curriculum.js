/* 커리큘럼 편집 (creator-curriculum-edit.html) — 보기(readonly) ↔ 편집 토글 (데모)
   · 편집: 입력 readonly 해제 + 체크박스 활성 + 삭제(−)/추가(+)/영상 첨부 노출
   · 취소: 편집 진입 시점 상태로 되돌리고 보기 모드
   · 저장: 값 유지 + 보기 모드 + '커리큘럼이 저장되었습니다' 완료 모달
   · 영상 첨부: 파일 선택 시 파일명 표시 (업로드 없음)
   · 미리보기 체크박스: 체크=미리보기 / 해제=유료 영상
   모달 닫기(X·배경·Esc)는 modal.js 가 담당 / 위임 방식이라 동적 추가 행도 동작
   defer 로 로드되어 DOM 파싱 후 실행되므로 DOMContentLoaded 래퍼 불필요 */
(function () {
  var root = document.querySelector('.cedit');
  if (!root) return;

  var list = root.querySelector('.cedit-list');
  var doneM = document.getElementById('cedit-done');
  var snapshot = null;

  function setEditing(on) {
    root.classList.toggle('is-editing', on);
    [].forEach.call(root.querySelectorAll('.cedit-in'), function (i) { i.readOnly = !on; });
    [].forEach.call(root.querySelectorAll('.cedit-preview__cb'), function (c) { c.disabled = !on; });
  }

  function renumber(chapter) {
    [].forEach.call(chapter.querySelectorAll('.cedit-lesson__no'), function (n, i) {
      var s = String(i + 1);
      n.textContent = s.length < 2 ? '0' + s : s;
    });
  }

  function newLesson() {
    var li = document.createElement('li');
    li.className = 'cedit-lesson';
    li.innerHTML = [
      '<button class="cedit-lesson__del" type="button" data-cedit-del aria-label="강의 삭제">−</button>',
      '<span class="cedit-lesson__no">00</span>',
      '<input class="cedit-in cedit-lesson__title" type="text" value="" placeholder="새 강의 제목" aria-label="강의 제목">',
      '<label class="cedit-file"><input class="cedit-file__input" type="file" accept="video/*" aria-label="영상 파일 첨부"><span class="cedit-file__btn"><span class="icon icon--camera" aria-hidden="true"></span> 영상 첨부</span><span class="cedit-file__name" data-cedit-filename></span></label>',
      '<input class="cedit-in cedit-lesson__time" type="text" value="" placeholder="00:00" aria-label="강의 시간">',
      '<label class="cedit-preview"><input class="cedit-preview__cb" type="checkbox"> <span>미리보기</span></label>'
    ].join('');
    return li;
  }

  function renumberChapters() {
    var n = 0;
    [].forEach.call(list.querySelectorAll('.cedit-ch__no'), function (el) {
      if (el.textContent.trim() === 'BONUS') return;
      n++;
      var s = String(n);
      el.textContent = 'CH ' + (s.length < 2 ? '0' + s : s);
    });
  }

  function newChapter() {
    var sec = document.createElement('section');
    sec.className = 'cedit-ch';
    sec.innerHTML = [
      '<div class="cedit-ch__bar">',
      '  <span class="cedit-ch__no">CH 00</span>',
      '  <input class="cedit-in cedit-ch__title" type="text" value="" placeholder="새 챕터 제목" aria-label="챕터 제목">',
      '</div>',
      '<input class="cedit-in cedit-ch__desc" type="text" value="" placeholder="챕터 설명" aria-label="챕터 설명">',
      '<ul class="cedit-lessons"></ul>',
      '<button class="cedit-add" type="button" data-cedit-add>＋ 강의 추가</button>'
    ].join('');
    sec.querySelector('.cedit-lessons').appendChild(newLesson());
    return sec;
  }

  function openDone() {
    if (!doneM) return;
    doneM.hidden = false;
    document.body.style.overflow = 'hidden';
    var c = doneM.querySelector('[data-modal-close]');
    if (c) c.focus();
  }

  root.addEventListener('click', function (e) {
    var t = e.target;

    if (t.closest('[data-cedit-edit]')) { snapshot = list.innerHTML; setEditing(true); return; }
    if (t.closest('[data-cedit-cancel]')) { if (snapshot != null) list.innerHTML = snapshot; setEditing(false); return; }
    if (t.closest('[data-cedit-save]')) { setEditing(false); openDone(); return; }

    if (!root.classList.contains('is-editing')) return;

    var del = t.closest('[data-cedit-del]');
    if (del) {
      var li = del.closest('.cedit-lesson');
      var ch = li.closest('.cedit-ch');
      li.remove();
      renumber(ch);
      return;
    }
    var add = t.closest('[data-cedit-add]');
    if (add) {
      var chapter = add.closest('.cedit-ch');
      var ul = chapter.querySelector('.cedit-lessons');
      var li2 = newLesson();
      ul.appendChild(li2);
      renumber(chapter);
      li2.querySelector('.cedit-lesson__title').focus();
      return;
    }
    // 챕터(섹션) 통째로 추가
    var addCh = t.closest('[data-cedit-add-chapter]');
    if (addCh) {
      var sec = newChapter();
      list.appendChild(sec);
      renumberChapters();
      sec.querySelector('.cedit-ch__title').focus();
      return;
    }
  });

  // 영상 파일 선택 → 파일명 표시 (업로드 없음)
  root.addEventListener('change', function (e) {
    var input = e.target.closest && e.target.closest('.cedit-file__input');
    if (!input) return;
    var name = (input.files && input.files[0]) ? input.files[0].name : '';
    var disp = input.closest('.cedit-file').querySelector('[data-cedit-filename]');
    if (disp) disp.textContent = name;
  });

  // 초기 상태: HTML 의 is-editing 유무를 존중 (새 초안 작성 페이지는 편집 모드로 시작)
  setEditing(root.classList.contains('is-editing'));
})();
