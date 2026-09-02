// ============================================================
// 引率講師の紹介（Teachers）データ & 描画スクリプト
// ============================================================
//
// ★★★ 責任者の方へ：ここを編集してください ★★★
//
// 下の TEACHERS データを書き換えるだけで、講師紹介が更新されます。
// （index.html を直接さわる必要はありません）
//
// ■ 全体の形
//   TEACHERS = [ 校舎1, 校舎2, 校舎3, ... ]  ← 校舎ごとのかたまりが並んでいます
//
// ■ 校舎（タブ）の設定項目
//     label   … タブに表示する校舎名（例：「京大本校」）
//     members … その校舎の講師の配列（下記）
//
// ■ 講師カードの設定項目（members の中の { ... } 1つ＝講師1人）
//     name        … 講師の名前（カード・モーダルに表示されます）
//     image       … 顔写真の画像パス。空 "" のままなら写真プレースホルダーが表示されます
//                   例: 'assets/teachers/yamada.jpg'
//     affiliation … 所属（モーダルに表示。未入力なら「準備中」表示）
//     hobby       … 趣味（モーダルに表示。未入力なら「準備中」表示）
//     message     … 【教えるにあたっての思い】の本文（モーダルに表示。未入力なら仮テキスト）
//
//   ※ カードには「丸い顔写真・名前・詳細ボタン」が表示され、
//     詳細ボタンを押すと、名前・写真・所属・趣味・思いがモーダル（ポップアップ）で開きます。
//
// ■ よくある編集
//   ・空カードを埋める → name / image / affiliation / hobby / message を入力する
//   ・講師を追加        → members の中に { name:'', image:'', affiliation:'', hobby:'', message:'' }, を増やす
//   ・講師を削除        → 不要な { ... } のかたまりを削除
//   ・校舎を追加        → TEACHERS の末尾に { label:'', members:[ ... ] }, を増やす
//   ・順番の変更        → かたまりの並び順を入れ替え
//
// ============================================================

const TEACHERS = [
  // ───────── 校舎1：京大本校 ─────────
  {
    label: '京大本校',
    members: [
      {
        name: '井ノ本 洋斗',
        image: 'assets/teachers/inomoto_portrait.png',
        affiliation: '-', // 例: '京大本校' や '京都大学 ○○学部'
        hobby: '小さなケーキ屋さんめぐり', // 例: '登山・読書'
        message: 'どれだけ価値のあることでも、興味がなければ前向きに勉強するのは難しいものです。なので、学びよりも先に「その先にどんな面白いことが待っているのか」を伝えることにこだわっています。 日本・世界をリードするようなエンジニアがBeEngineerから輩出することが僕の野望です！そのための授業を作っていくので、ついてきてください！',
      },
    ],
  },

  // ───────── 校舎2：梅田校 ─────────
  {
    label: '梅田校',
    members: [
      {
        name: '藤原 圭吾',
        image: 'assets/teachers/fujiwara_portrait.png',
        affiliation: '-',
        hobby: '読書 ゲーム 観光（特に神社巡り）',
        message: '「ワクワクするもの！」「面白いもの！」を一緒に作れるようになりませんか？そのための「実践的なプログラミング」を楽しく教える・伝えることを意識しています。 BeEngineerを通し、一緒に学んでいきましょう！',
      },
    ],
  },

  // ───────── 校舎3：飯田橋校 ─────────
  {
    label: '飯田橋校',
    members: [
      {
        name: '杉野 迅',
        image: 'assets/teachers/sugino_portrait.png',
        affiliation: '筑波大学 理工学群 社会工学類',
        hobby: 'デジタルイラスト 料理',
        message: 'アプリ開発は、自分の内なる声を聞き、創造の世界を広げる練習です。プログラミングをただ勉強するのではなく、現実という現象世界からヒントを得て、自分だけの法則で動くテラリウムを作るための道具として触れてみてはいかがでしょうか!',
      },
    ],
  },
];

// ============================================================
// ▼▼▼ ここから下は描画処理です（基本的に編集不要） ▼▼▼
// ============================================================

(function () {
  'use strict';

  // 講師データをキーで引けるようにする一時的な置き場
  var TEACHER_MAP = {};

  // HTMLとして安全に表示するためのエスケープ処理
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 丸い顔写真のHTML（カード用。未設定ならプレースホルダー）
  function buildPhoto(image, name, extraClass) {
    var cls = 'teacher-photo-circle' + (extraClass ? ' ' + extraClass : '');
    if (image) {
      return (
        '<div class="' + cls + '">' +
        '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(name) + '" loading="lazy">' +
        '</div>'
      );
    }
    return (
      '<div class="' + cls + ' teacher-photo-placeholder">' +
      '<span class="teacher-photo-icon">👤</span>' +
      '</div>'
    );
  }

  // モーダル用の写真HTML（元画像を長方形のまま角丸で表示。未設定ならプレースホルダー）
  function buildModalPhoto(image, name) {
    if (image) {
      return (
        '<div class="teacher-modal-photo-rect">' +
        '<img src="' + escapeHtml(image) + '" alt="' + escapeHtml(name) + '" loading="lazy">' +
        '</div>'
      );
    }
    return (
      '<div class="teacher-modal-photo-rect teacher-photo-placeholder">' +
      '<span class="teacher-photo-icon">👤</span>' +
      '</div>'
    );
  }

  // 講師カード1枚分（丸い顔・名前・詳細ボタン）
  function buildTeacherCard(member, key) {
    var hasName = member && member.name;
    var name = hasName ? member.name : '講師名（未設定）';
    var cardClass = 'teacher-card' + (hasName ? '' : ' teacher-card-empty');

    return (
      '<div class="' + cardClass + '">' +
      buildPhoto(member ? member.image : '', name) +
      '<div class="teacher-card-name">' + escapeHtml(name) + '</div>' +
      '<button type="button" class="teacher-detail-btn" data-teacher-detail="' + key + '">' +
      '詳細を見る' +
      '</button>' +
      '</div>'
    );
  }

  function render() {
    var tabsContainer = document.querySelector('[data-teachers-tabs]');
    var panelsContainer = document.querySelector('[data-teachers-panels]');
    if (!tabsContainer || !panelsContainer) return; // 講師セクションが無いページでは何もしない

    if (!Array.isArray(TEACHERS) || TEACHERS.length === 0) {
      panelsContainer.innerHTML = '<p class="teachers-empty">講師情報は準備中です。</p>';
      return;
    }

    var tabsHtml = '';
    var panelsHtml = '';
    TEACHER_MAP = {};

    TEACHERS.forEach(function (campus, cIndex) {
      var label = escapeHtml(campus && campus.label ? campus.label : '校舎' + (cIndex + 1));
      var isActive = cIndex === 0; // 最初の校舎を初期表示
      var tabKey = 'campus-' + cIndex;

      tabsHtml +=
        '<button class="teachers-tab-btn' + (isActive ? ' active' : '') + '" ' +
        'data-teachers-tab="' + tabKey + '" role="tab" ' +
        'aria-selected="' + (isActive ? 'true' : 'false') + '">' +
        label +
        '</button>';

      var members = (campus && Array.isArray(campus.members)) ? campus.members : [];
      var cardsHtml = '';
      members.forEach(function (member, mIndex) {
        var key = cIndex + '-' + mIndex;
        TEACHER_MAP[key] = member || {};
        cardsHtml += buildTeacherCard(member, key);
      });
      if (!cardsHtml) {
        cardsHtml = '<p class="teachers-empty">この校舎の講師情報は準備中です。</p>';
      }

      panelsHtml +=
        '<div class="teachers-panel' + (isActive ? ' active' : '') + '" ' +
        'data-teachers-content="' + tabKey + '" role="tabpanel">' +
        '<div class="teachers-grid">' + cardsHtml + '</div>' +
        '</div>';
    });

    tabsContainer.innerHTML = tabsHtml;
    panelsContainer.innerHTML = panelsHtml;

    initTabs(tabsContainer, panelsContainer);
    initDetailButtons(panelsContainer);
    initModal();
  }

  // 校舎タブの切り替え
  function initTabs(tabsContainer, panelsContainer) {
    var tabButtons = tabsContainer.querySelectorAll('.teachers-tab-btn');
    var panels = panelsContainer.querySelectorAll('[data-teachers-content]');

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-teachers-tab');

        tabButtons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('active');
        });

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        var target = panelsContainer.querySelector('[data-teachers-content="' + key + '"]');
        if (target) target.classList.add('active');
      });
    });
  }

  // 「詳細を見る」ボタン → モーダルを開く
  function initDetailButtons(panelsContainer) {
    var buttons = panelsContainer.querySelectorAll('[data-teacher-detail]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = this.getAttribute('data-teacher-detail');
        openModal(TEACHER_MAP[key] || {});
      });
    });
  }

  // ---- モーダル（ポップアップ）----
  var modalEl = null;

  // モーダルの器を一度だけ生成して body に追加
  function initModal() {
    if (modalEl) return;

    modalEl = document.createElement('div');
    modalEl.className = 'teacher-modal';
    modalEl.setAttribute('data-teacher-modal', '');
    modalEl.innerHTML =
      '<div class="teacher-modal-overlay" data-teacher-modal-close></div>' +
      '<div class="teacher-modal-panel" role="dialog" aria-modal="true">' +
      '<button type="button" class="teacher-modal-close" data-teacher-modal-close aria-label="閉じる">×</button>' +
      '<div class="teacher-modal-photo-area"></div>' +
      '<h3 class="teacher-modal-name"></h3>' +
      '<dl class="teacher-modal-meta">' +
      '<div class="teacher-modal-meta-row"><dt>所属</dt><dd class="teacher-modal-affiliation"></dd></div>' +
      '<div class="teacher-modal-meta-row"><dt>趣味</dt><dd class="teacher-modal-hobby"></dd></div>' +
      '</dl>' +
      '<div class="teacher-modal-message">' +
      '<h4 class="teacher-message-title">教えるにあたっての思い</h4>' +
      '<p class="teacher-modal-text"></p>' +
      '</div>' +
      '</div>';
    document.body.appendChild(modalEl);

    // 閉じる操作（×ボタン・オーバーレイ）
    modalEl.querySelectorAll('[data-teacher-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    // Escキーで閉じる
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(member) {
    if (!modalEl) initModal();

    var name = member && member.name ? member.name : '講師名（未設定）';
    var affiliation = member && member.affiliation ? member.affiliation : '（準備中）';
    var hobby = member && member.hobby ? member.hobby : '（準備中）';
    var message = member && member.message
      ? member.message
      : 'ここに【教えるにあたっての思い】が入ります。（準備中）';

    modalEl.querySelector('.teacher-modal-photo-area').innerHTML =
      buildModalPhoto(member ? member.image : '', name);
    modalEl.querySelector('.teacher-modal-name').textContent = name;
    modalEl.querySelector('.teacher-modal-affiliation').textContent = affiliation;
    modalEl.querySelector('.teacher-modal-hobby').textContent = hobby;
    modalEl.querySelector('.teacher-modal-text').textContent = message;

    modalEl.classList.add('open');
    document.body.classList.add('teacher-modal-open');
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('open');
    document.body.classList.remove('teacher-modal-open');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
