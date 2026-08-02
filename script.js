// ============================================
// BeEngineer Programming Camp - Main Script
// ============================================

/**
 * DOMContentLoaded イベント
 * ページ読み込み完了後に実行
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // 持ち物チェックリスト機能を初期化
  initChecklistFeature();
  
  // スムーススクロール機能を初期化
  initSmoothScroll();
  
  // ハンバーガーメニュー機能を初期化
  initHamburgerMenu();
  
  // プログラムカードのトグル機能を初期化（SP版のみ）
  initProgramCardToggle();
  
  // 学習プログラムのタブ機能を初期化（SP版のみ）
  initProgramTabs();
  
  // スケジュールのトグル機能を初期化（SP版のみ）
  initScheduleToggle();
  
  // アクセス方法のトグル機能を初期化（SP版のみ）
  initAccessToggle();
  
  // 持ち物リストのトグル機能を初期化（SP版のみ）
  initItemsToggle();
  
  // ブログメニューのサブメニュートグル機能を初期化（SP版のみ）
  initBlogSubmenuToggle();
  
  // フロアマップのトグル機能を初期化（SP版のみ）
  initFloormapToggle();
  
  // フロアマップのタブ機能を初期化（PC版）
  initFloormapTabs();

  // 施設タブ（プラムイン / アイリスイン）の切り替えを初期化
  initFacilityTabs();
  
  // スクロールスパイ機能を初期化
  initScrollSpy();
  
  // スケジュール：描画（schedule.js）→ SPカード → タブ切替（順序固定）
  initScheduleMobileView();
  initScheduleTabs();
  
  // アクセスタブの切り替え機能を初期化
  initAccessTabs();
  
  // ご案内セクションのトグル機能を初期化（SP版のみ）
  initGuideToggle();
  
  // LINEアカウントセクションのトグル機能を初期化（SP版のみ）
  initLineToggle();
  
  // ブログ更新セクションのトグル機能を初期化（SP版のみ）
  initBlogUpdateToggle();
  
  // フッターのキャラクター画像をSP版でロゴの隣に配置
  initFooterCharacters();

  // ブログ目次（TOC）を自動生成 + スクロールスパイ
  initBlogToc();

  // サイドバーキャラクターの吹き出し（ランダムコメント）
  initSidebarCharacterBubbles();

  // ブログボタンの公開時刻ゲート
  initBlogButtonGate();

});

/**
 * SP 用：スケジュール表（横スクロールが必要なテーブル）を
 * 「時間 / 場所 / 内容」を1行、その下に「備考」を1行（全幅）のカード形式に組み直す。
 * 元のタブボタンと .active 状態を同期させる。
 */
function initScheduleMobileView() {
  const wrapper = document.querySelector('.schedule-table-wrapper');
  if (!wrapper) return;

  const existing = document.querySelector('.schedule-mobile-container');
  if (existing) existing.remove();

  const rows = wrapper.querySelectorAll('.schedule-row');
  if (rows.length === 0) return;

  const mobileContainer = document.createElement('div');
  mobileContainer.className = 'schedule-mobile-container';

  rows.forEach((row) => {
    const block = document.createElement('div');
    block.className = 'schedule-mobile';
    block.setAttribute('data-day', row.id);
    if (row.classList.contains('active')) {
      block.classList.add('active');
    }

    const times = row.querySelectorAll('.time-slot');
    const locations = row.querySelectorAll('.location-item');
    const activities = row.querySelectorAll('.activity');
    const notes = row.querySelectorAll('.note-item');

    const count = Math.max(times.length, locations.length, activities.length, notes.length);

    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'schedule-mobile-card';

      const head = document.createElement('div');
      head.className = 'schedule-mobile-head';

      const t = document.createElement('div');
      t.className = 'schedule-mobile-time';
      if (times[i]) t.innerHTML = times[i].innerHTML;
      head.appendChild(t);

      const l = document.createElement('div');
      l.className = 'schedule-mobile-location';
      if (locations[i]) l.innerHTML = locations[i].innerHTML;
      head.appendChild(l);

      const a = document.createElement('div');
      a.className = 'schedule-mobile-activity';
      if (activities[i]) a.innerHTML = activities[i].innerHTML;
      head.appendChild(a);

      card.appendChild(head);

      if (notes[i] && notes[i].innerHTML.trim()) {
        const n = document.createElement('div');
        n.className = 'schedule-mobile-note';
        n.innerHTML = notes[i].innerHTML;
        card.appendChild(n);
      }

      block.appendChild(card);
    }

    mobileContainer.appendChild(block);
  });

  wrapper.parentNode.insertBefore(mobileContainer, wrapper.nextSibling);
}

/**
 * ブログボタンのゲート：data-available-from で指定した日時より前は
 * リンクを無効化し「準備中」メッセージを表示する
 */
function initBlogButtonGate() {
  const buttons = document.querySelectorAll('.blog-link-btn[data-available-from]');
  if (buttons.length === 0) return;

  const now = new Date();
  const toast = createBlogToast();
  let toastTimer = null;

  buttons.forEach((btn) => {
    const availableFromStr = btn.getAttribute('data-available-from');
    const availableFrom = new Date(availableFromStr);
    if (isNaN(availableFrom.getTime())) return;

    if (now < availableFrom) {
      btn.classList.add('is-locked');
      btn.setAttribute('aria-disabled', 'true');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toast.textContent = '準備中です。しばらくお待ちください';
        toast.classList.add('show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('show');
        }, 2400);
      });
    }
  });
}

function createBlogToast() {
  let toast = document.getElementById('blogToast');
  if (toast) return toast;
  toast = document.createElement('div');
  toast.id = 'blogToast';
  toast.className = 'blog-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  return toast;
}

/**
 * サイドバー下：左キャラ（dot_girl）と右キャラ（dot_boy）の間に
 * 吹き出しを 1 つインラインで挿入する。
 * 文言は「今日の日付」に応じて出し分ける（→ getSidebarBubbleMessage）。
 * ※ ランダム表示・しっぽの向きランダムは一旦解除。
 */
function initSidebarCharacterBubbles() {
  const girl = document.querySelector('.sidebar-footer-char-left');
  const boy = document.querySelector('.sidebar-footer-char-right');
  if (!girl || !boy) return;

  const footer = girl.parentNode;
  if (!footer || footer.querySelector('.sidebar-char-bubble')) return; // 二重挿入防止

  const message = getSidebarBubbleMessage();
  if (!message) return; // 表示しない日は吹き出しを作らない

  const bubble = document.createElement('span');
  bubble.className = 'sidebar-char-bubble';
  bubble.textContent = message;

  // 左キャラ ←[吹き出し]→ 右キャラ の順に並ぶよう、boy の直前に挿入
  footer.insertBefore(bubble, boy);
}

/**
 * 合宿当日（8/8〜8/10）の吹き出し文言。日付ごとに「時間帯スロット」で管理する。
 *
 * ★★★ 文言の編集方法 ★★★
 * ・各日は { from: '開始時刻', text: '文言' } の配列。
 *   「今の時刻」が from を過ぎた最後のスロットが表示される。
 *   例）14:00〜14:30 に出したい文言は from:'14:00'（次のスロット from:'14:30' まで有効）。
 * ・1日の始まりは必ず from:'00:00' のスロットから書く。
 * ・改行したいときは文中に \n を入れる（吹き出しは pre-line で改行を表示）。
 * ・2日目(8/9)・3日目(8/10)は仮の文言。決まったら差し替えてください。
 */
const CAMP_SCHEDULE = {
  // ── 1日目 8/8（土） ───────────────────────────────
  '2026-08-08': [
    { from: '00:00', text: 'いよいよ合宿開始！\n到着を待ってます！' },
    { from: '14:00', text: '指示があるまで待機！' },
    { from: '14:30', text: '開講式！' },
    { from: '15:00', text: '授業中！' },
    { from: '17:00', text: '夕食＆休憩中♪' },
    { from: '19:00', text: '初日最後の授業！' },
    { from: '21:00', text: 'お疲れ様でした！' },
  ],
  // ── 2日目 8/9（日）──────────────────────
  '2026-08-09': [
    { from: '00:00', text: '早く寝ましょう！' }, 
    { from: '04:00', text: 'おはよう！\n合宿2日目！' }, 
    { from: '07:00', text: '元気に朝活！' }, 
    { from: '08:00', text: '朝食タイム' }, 
    { from: '09:00', text: '授業中！' }, 
    { from: '12:00', text: '昼食！\nカレーが美味しい！' }, 
    { from: '13:00', text: '授業中！' }, 
    { from: '17:00', text: 'BBQタイムだぁ！！' }, 
    { from: '20:00', text: '２日目最後の授業！' }, 
    { from: '21:00', text: 'お疲れ様でした！' }, 
  ],
  // ── 3日目 8/10（月） ─────────────────────
  '2026-08-10': [
    { from: '00:00', text: '早く寝ましょう！' }, 
    { from: '04:00', text: 'おはよう！\n合宿最終日！' }, 
    { from: '07:00', text: '朝食タイム' }, 
    { from: '08:00', text: '元気に朝活！' }, 
    { from: '09:00', text: '最終調整\n戦いに備える' }, 
    { from: '10:30', text: '戦いだぁ！！！' }, 
    { from: '12:00', text: '閉講式'},
    { from: '13:00', text: 'お疲れ様！\n帰るまでが合宿！' }, 
    { from: '19:00', text: '合宿の報告をしよう！' }, 
  ],
};

/**
 * 吹き出しに表示する文言を「今日の日付・時刻」から決定して返す。
 *
 * ・合宿前（〜8/6）      … 「あと○○日！」（8/8までの残り日数を自動計算）
 * ・前日（8/7）          … 「いよいよ明日！準備しよう！」
 * ・合宿中（8/8〜8/10）  … CAMP_SCHEDULE の時間帯スロットに従う
 * ・合宿後（8/11〜）     … 「ブログ公開中～♪」
 *
 * @returns {string|null} 表示文言。null の場合は吹き出しを出さない。
 */
function getSidebarBubbleMessage() {
  // 月は 0 始まりなので 8月 = 7。
  const START = new Date(2026, 7, 8);  // 合宿初日 8/8
  const EVE   = new Date(2026, 7, 7);  // 前日 8/7
  const END   = new Date(2026, 7, 10); // 最終日 8/10

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  // 今日を 0:00 に丸める（時刻のブレを除く）
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 前日（8/7）
  if (today.getTime() === EVE.getTime()) {
    return 'いよいよ明日！準備しよう！';
  }

  // 前日より前 → カウントダウン
  if (today.getTime() < EVE.getTime()) {
    const days = Math.round((START.getTime() - today.getTime()) / MS_PER_DAY);
    return `あと${days}日！`;
  }

  // 合宿期間中（8/8〜8/10）→ 時間帯スロットで判定
  if (today.getTime() >= START.getTime() && today.getTime() <= END.getTime()) {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const slots = CAMP_SCHEDULE[`${y}-${m}-${d}`];
    if (!slots || !slots.length) return null;

    const curMin = now.getHours() * 60 + now.getMinutes();
    let text = null;
    for (const slot of slots) {
      const [h, mi] = slot.from.split(':').map(Number);
      if (curMin >= h * 60 + mi) text = slot.text;
    }
    return text;
  }

  // 合宿後（8/11〜）
  return 'ブログ公開中～♪';
}

/**
 * ブログ目次（TOC）の自動生成 + アクティブハイライト
 * .blog-section の h2 を読み取って、#blogToc 内の <ul> に目次リンクを生成する
 * スクロールに合わせて現在のセクションをハイライトする
 */
function initBlogToc() {
  const toc = document.getElementById('blogToc');
  if (!toc) return;

  const tocList = toc.querySelector('ul');
  const sections = document.querySelectorAll('.blog-content .blog-section');
  if (!tocList || sections.length === 0) return;

  // 目次リンクを生成（各セクションにIDを自動付与）
  const links = [];
  sections.forEach((section, index) => {
    const h2 = section.querySelector('h2');
    if (!h2) return;

    if (!section.id) {
      section.id = 'section-' + (index + 1);
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.textContent = h2.textContent.trim();
    li.appendChild(a);
    tocList.appendChild(li);
    links.push({ a: a, section: section });
  });

  if (links.length === 0) return;

  // スクロールに応じてアクティブな目次項目をハイライト
  const setActive = () => {
    const scrollY = window.scrollY + 120; // ヘッダ分のオフセット
    let activeIndex = 0;
    for (let i = 0; i < links.length; i++) {
      if (links[i].section.offsetTop <= scrollY) {
        activeIndex = i;
      } else {
        break;
      }
    }
    links.forEach((link, i) => {
      if (i === activeIndex) {
        link.a.classList.add('active');
      } else {
        link.a.classList.remove('active');
      }
    });
  };

  setActive();
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);

  // ----- SP用：フローティング目次ボタン + モーダル -----
  initBlogTocMobile(links);
}

/**
 * SP用：右下フローティング「目次」ボタンと、押すと開くモーダルを生成
 * モーダル内の項目をタップするとそのセクションへスクロールしてモーダルを閉じる
 */
function initBlogTocMobile(links) {
  if (document.getElementById('blogTocFab')) return;

  // フローティングボタン
  const fab = document.createElement('button');
  fab.id = 'blogTocFab';
  fab.className = 'blog-toc-fab';
  fab.setAttribute('aria-label', '目次を開く');
  fab.innerHTML = '<span>目次</span><span class="blog-toc-fab-icon" aria-hidden="true"><span></span><span></span></span>';
  document.body.appendChild(fab);

  // モーダル
  const modal = document.createElement('div');
  modal.id = 'blogTocModal';
  modal.className = 'blog-toc-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', '目次');
  modal.innerHTML = '<div class="blog-toc-modal-panel"><ul></ul></div><button class="blog-toc-modal-close" aria-label="閉じる">×</button>';
  document.body.appendChild(modal);

  // モーダル内に目次項目を生成
  const modalList = modal.querySelector('ul');
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.a.getAttribute('href');
    a.textContent = link.a.textContent;
    a.addEventListener('click', () => {
      closeModal();
    });
    li.appendChild(a);
    modalList.appendChild(li);
  });

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  fab.addEventListener('click', openModal);
  modal.querySelector('.blog-toc-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * 持ち物チェックリスト機能
 * localStorageでチェック状態を保存・復元
 */
function initChecklistFeature() {
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  if (checklistItems.length === 0) {
    // チェックリストが存在しない場合は処理をスキップ
    return;
  }
  
  // ページ読み込み時に保存された状態を復元
  checklistItems.forEach(item => {
    const itemKey = item.getAttribute('data-item');
    const savedState = localStorage.getItem(itemKey);
    
    if (savedState === 'true') {
      item.checked = true;
      item.parentElement.classList.add('checked');
    }
  });
  
  // チェック状態の変更を監視
  checklistItems.forEach(item => {
    item.addEventListener('change', function() {
      const itemKey = this.getAttribute('data-item');
      localStorage.setItem(itemKey, this.checked);
      
      if (this.checked) {
        this.parentElement.classList.add('checked');
      } else {
        this.parentElement.classList.remove('checked');
      }
    });
  });
}

/**
 * スムーススクロール機能
 * ページ内リンクをクリックした際に滑らかにスクロール
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // '#' のみ、または空の場合はスキップ
      if (href === '#' || href === '') {
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // URLを更新（履歴に追加）
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });
}

/**
 * ハンバーガーメニュー機能（SP用）
 * サイドバーの開閉を制御
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  
  if (!hamburger || !sidebar || !overlay) {
    // 要素が存在しない場合は処理をスキップ
    return;
  }
  
  // ハンバーガーボタンクリック
  hamburger.addEventListener('click', function() {
    toggleMenu();
  });
  
  // オーバーレイクリック
  overlay.addEventListener('click', function() {
    closeMenu();
  });
  
  // サイドバーのリンククリック時にメニューを閉じる
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      // SP表示の場合のみメニューを閉じる
      if (window.innerWidth <= 768) {
        // ブログメニュー（サブメニューを持つ親リンク）の場合は閉じない
        if (this.parentElement.classList.contains('has-submenu')) {
          return;
        }
        closeMenu();
      }
    });
  });
  
  // メニュー開閉の切り替え
  function toggleMenu() {
    hamburger.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // body のスクロールを制御
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  // メニューを閉じる
  function closeMenu() {
    hamburger.classList.remove('active');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * プログラムカードのトグル機能（SP版のみ）
 * カードヘッダーをタップして内容の表示/非表示を切り替え
 */
function initProgramCardToggle() {
  const programCards = document.querySelectorAll('[data-program-card]');
  
  if (programCards.length === 0) {
    // プログラムカードが存在しない場合は処理をスキップ
    return;
  }
  
  programCards.forEach(card => {
    const cardHeader = card.querySelector('.card-header');
    
    if (!cardHeader) {
      return;
    }
    
    // カードヘッダーをクリックした時の処理
    cardHeader.addEventListener('click', function() {
      // SP版（768px以下）の場合のみトグル機能を有効化
      if (window.innerWidth <= 768) {
        card.classList.toggle('active');
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、全てのカードを開いた状態にする
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      programCards.forEach(card => {
        card.classList.remove('active');
      });
    }
  });
}

/**
 * スケジュールのトグル機能（SP版のみ）
 * SP版でもPC版と同じデザインを保持
 */
function initScheduleToggle() {
  // SP版では特別な処理は不要（CSSで制御）
  return;
}

/**
 * アクセス方法のトグル機能（SP版のみ）
 * 各項目をタップして詳細の表示/非表示を切り替え
 */
function initAccessToggle() {
  const accessItems = document.querySelectorAll('[data-access-item]');
  
  if (accessItems.length === 0) {
    // アクセス項目が存在しない場合は処理をスキップ
    return;
  }
  
  accessItems.forEach(item => {
    const header = item.querySelector('.access-item-header');
    
    if (!header) {
      return;
    }
    
    // ヘッダーをクリックした時の処理
    header.addEventListener('click', function() {
      // SP版（768px以下）の場合のみトグル機能を有効化
      if (window.innerWidth <= 768) {
        item.classList.toggle('active');
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、全ての項目を閉じる
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      accessItems.forEach(item => {
        item.classList.remove('active');
      });
    }
  });
}

/**
 * 持ち物リストのトグル機能（SP版のみ）
 * ヘッダーをタップして詳細の表示/非表示を切り替え
 */
function initItemsToggle() {
  const itemsMobile = document.querySelector('[data-items-mobile]');
  
  if (!itemsMobile) {
    // 持ち物リストのモバイル版が存在しない場合は処理をスキップ
    return;
  }
  
  const header = itemsMobile.querySelector('.items-mobile-header');
  
  if (!header) {
    return;
  }
  
  // ヘッダーをクリックした時の処理
  header.addEventListener('click', function() {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      itemsMobile.classList.toggle('active');
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、閉じる
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      itemsMobile.classList.remove('active');
    }
  });
}

/**
 * ブログメニューのサブメニュートグル機能（SP版のみ）
 * ブログメニューをタップしてサブメニューの表示/非表示を切り替え
 */
function initBlogSubmenuToggle() {
  const blogMenuItem = document.querySelector('.sidebar-nav .has-submenu');
  
  if (!blogMenuItem) {
    // ブログメニューが存在しない場合は処理をスキップ
    return;
  }
  
  const blogLink = blogMenuItem.querySelector('a');
  
  if (!blogLink) {
    return;
  }
  
  // ブログメニューリンクをクリックした時の処理
  blogLink.addEventListener('click', function(e) {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      e.preventDefault();
      blogMenuItem.classList.toggle('active');
      
      // サブメニューが開いた場合、スクロールして画面内に表示
      if (blogMenuItem.classList.contains('active')) {
        // アニメーション完了後にスクロール
        setTimeout(() => {
          const submenu = blogMenuItem.querySelector('.submenu');
          
          if (submenu) {
            // サブメニューの最後の項目（3日目）を取得
            const lastItem = submenu.querySelector('li:last-child');
            
            if (lastItem) {
              // 最後の項目を画面内に表示
              lastItem.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
              });
            }
          }
        }, 150);
      }
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、閉じる
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      blogMenuItem.classList.remove('active');
    }
  });
}

/**
 * フロアマップのトグル機能
 * SP版でフロアマップをアコーディオン形式で開閉
 */
function initFloormapToggle() {
  const floormapItems = document.querySelectorAll('[data-floormap-item]');
  
  if (floormapItems.length === 0) {
    return;
  }
  
  floormapItems.forEach(item => {
    const header = item.querySelector('[data-floormap-header]');
    
    if (!header) return;
    
    header.addEventListener('click', function() {
      // SP版でのみ動作（768px以下）
      if (window.innerWidth <= 768) {
        // クリックされたアイテムの開閉を切り替え
        item.classList.toggle('active');
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、全て開く
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      floormapItems.forEach(item => {
        item.classList.remove('active');
      });
    }
  });
}

/**
 * フロアマップのタブ機能（PC版）
 * タブをクリックして各階を切り替え（アクセスと同じ形式）
 */
function initFloormapTabs() {
  // 施設ごとに floormap タブをスコープして処理する。
  // 各 .floormap-tabs の直下の親（.facility-content）内のフロアだけを操作する。
  const tabContainers = document.querySelectorAll('.floormap-tabs');
  if (tabContainers.length === 0) return;

  const setupContainer = (tabContainer) => {
    const scope = tabContainer.closest('.facility-content') || tabContainer.parentElement;
    const tabButtons = tabContainer.querySelectorAll('.floormap-tab-btn');
    const items = scope.querySelectorAll('[data-floor-content]');
    if (tabButtons.length === 0 || items.length === 0) return;

    // PC版：1番目のフロアがアクティブな状態を担保（HTML 側でも明示済み）
    if (window.innerWidth > 768) {
      const hasActive = Array.from(items).some(i => i.classList.contains('active'));
      if (!hasActive) {
        items[0].classList.add('active');
        if (tabButtons[0]) tabButtons[0].classList.add('active');
      }
    }

    tabButtons.forEach((button) => {
      button.addEventListener('click', function () {
        if (window.innerWidth > 768) {
          const floorId = this.getAttribute('data-floor');
          const targetContent = scope.querySelector(`[data-floor-content="${floorId}"]`);

          // 同じ施設スコープ内だけ active を解除
          tabButtons.forEach(btn => btn.classList.remove('active'));
          items.forEach(item => item.classList.remove('active'));

          this.classList.add('active');
          if (targetContent) targetContent.classList.add('active');
        }
      });
    });
  };

  tabContainers.forEach(setupContainer);

  // リサイズ：SPに戻ったら全 active 解除、PCに戻ったら各施設の先頭フロアを表示
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.floormap-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('[data-floor-content]').forEach(item => item.classList.remove('active'));
    } else {
      tabContainers.forEach((tabContainer) => {
        const scope = tabContainer.closest('.facility-content') || tabContainer.parentElement;
        const items = scope.querySelectorAll('[data-floor-content]');
        const tabButtons = tabContainer.querySelectorAll('.floormap-tab-btn');
        const hasActive = Array.from(items).some(i => i.classList.contains('active'));
        if (!hasActive && items.length > 0) {
          items[0].classList.add('active');
          if (tabButtons[0]) tabButtons[0].classList.add('active');
        }
      });
    }
  });
}

/**
 * 施設タブ（プラムイン / アイリスイン）の切り替え
 * クリックでパネル表示を切り替え、aria-selected も更新
 */
function initFacilityTabs() {
  const tabButtons = document.querySelectorAll('.facility-tab-btn');
  const panels = document.querySelectorAll('[data-facility-content]');
  if (tabButtons.length === 0 || panels.length === 0) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const facility = this.getAttribute('data-facility');

      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      const target = document.querySelector(`[data-facility-content="${facility}"]`);
      if (target) target.classList.add('active');
    });
  });
}

/**
 * スクロールスパイ機能
 * ページをスクロールした際に、現在表示されているセクションに対応するメニューをハイライト
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) {
    return;
  }
  
  // 各セクションのIDとメニューリンクのマップを作成
  const linkMap = new Map();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      linkMap.set(href.substring(1), link);
    }
  });
  
  // Intersection Observer のオプション
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // 上部20%、下部70%の範囲でトリガー
    threshold: 0
  };
  
  // 現在アクティブなセクションを追跡
  let currentActiveSection = null;
  
  // Intersection Observer のコールバック
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      const sectionId = entry.target.id;
      const link = linkMap.get(sectionId);
      
      if (!link) return;
      
      if (entry.isIntersecting) {
        // セクションが表示されている場合
        // 既存のアクティブ状態をクリア
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        
        // 現在のセクションのリンクをアクティブに
        link.classList.add('active');
        currentActiveSection = sectionId;
      }
    });
  };
  
  // Intersection Observer を作成
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  
  // 各セクションを監視
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // メニューをクリックした時にもアクティブ状態を更新
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        // 全てのアクティブ状態をクリア
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        // クリックされたリンクをアクティブに
        this.classList.add('active');
      }
    });
  });
  
  // ページ読み込み時に初期状態を設定
  setTimeout(() => {
    const scrollPosition = window.scrollY;
    let foundActive = false;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
        const link = linkMap.get(section.id);
        if (link) {
          navLinks.forEach(navLink => navLink.classList.remove('active'));
          link.classList.add('active');
          foundActive = true;
        }
      }
    });
    
    // どのセクションにも該当しない場合は、最初のリンク（トップ）をアクティブに
    if (!foundActive && navLinks.length > 0) {
      navLinks[0].classList.add('active');
    }
  }, 100);
}

/**
 * スケジュールタブの切り替え機能
 */
function initScheduleTabs() {
  const tabButtons = document.querySelectorAll('.schedule-tabs .tab-btn');
  
  if (tabButtons.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTab);
      const tabContents = document.querySelectorAll('.schedule-row.tab-content');
      
      // 同じタブを押した場合は閉じる（トグル機能）
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        updateScheduleTabEmoji(this, false);
        if (targetContent) {
          targetContent.classList.remove('active');
        }
        document.querySelectorAll('.schedule-mobile').forEach((block) => {
          block.classList.remove('active');
        });
        updateScheduleNote(null);
      } else {
        // すべてのタブボタンの絵文字を📅に戻す
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          updateScheduleTabEmoji(btn, false);
        });
        tabContents.forEach(content => content.classList.remove('active'));
        
        // クリックされたタブボタンとそのコンテンツにactiveクラスを追加
        this.classList.add('active');
        updateScheduleTabEmoji(this, true);
        if (targetContent) {
          targetContent.classList.add('active');
        }

        // SPカード表示も同期
        document.querySelectorAll('.schedule-mobile').forEach((block) => {
          if (targetContent && block.getAttribute('data-day') === targetContent.id) {
            block.classList.add('active');
          } else {
            block.classList.remove('active');
          }
        });

        updateScheduleNote(targetTab);
      }
    });
  });

  // 初期表示（デフォルトでactiveなタブ）に合わせて注釈の表示を同期
  const initialTab = document.querySelector('.schedule-tabs .tab-btn.active');
  updateScheduleNote(initialTab ? initialTab.getAttribute('data-tab') : null);
}

/**
 * スケジュール表下の注釈の表示/非表示を切り替える
 * data-note-days に列挙した日のタブが開いているときだけ表示する
 * @param {string|null} activeTabId - 現在開いているタブのID（未選択時はnull）
 */
function updateScheduleNote(activeTabId) {
  document.querySelectorAll('[data-schedule-note]').forEach((note) => {
    const days = (note.getAttribute('data-note-days') || '').split(/\s+/).filter(Boolean);
    note.hidden = !activeTabId || (days.length > 0 && !days.includes(activeTabId));
  });
}

/**
 * スケジュールタブボタンの絵文字を更新
 * @param {HTMLElement} button - タブボタン要素
 * @param {boolean} isActive - アクティブ状態かどうか
 */
function updateScheduleTabEmoji(button, isActive) {
  const emojiSpan = button.querySelector('.tab-emoji');
  if (emojiSpan) {
    emojiSpan.textContent = isActive ? '🍁' : '📅';
  }
}

/**
 * アクセスタブの切り替え機能
 * お車/電車・バス/京都駅からのアクセス情報をタブで切り替え
 */
function initAccessTabs() {
  const tabButtons = document.querySelectorAll('.access-tab-btn');
  const tabContents = document.querySelectorAll('.access-tab-content');
  
  if (tabButtons.length === 0 || tabContents.length === 0) return;
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-access-tab');
      
      // すべてのタブボタンとコンテンツからactiveクラスを削除
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // クリックされたタブボタンとそのコンテンツにactiveクラスを追加
      this.classList.add('active');
      const targetContent = document.getElementById('access-' + targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/**
 * ご案内セクションのトグル機能（SP版のみ）
 * ヘッダーをタップして詳細の表示/非表示を切り替え
 */
function initGuideToggle() {
  const guideWrapper = document.querySelector('[data-guide-toggle]');
  
  if (!guideWrapper) {
    // ご案内セクションが存在しない場合は処理をスキップ
    return;
  }
  
  const header = guideWrapper.querySelector('.guide-toggle-header');
  
  if (!header) {
    return;
  }
  
  // ヘッダーをクリックした時の処理
  header.addEventListener('click', function() {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      guideWrapper.classList.toggle('active');
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、開いた状態にする
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      guideWrapper.classList.remove('active');
    }
  });
}

/**
 * LINEアカウントセクションのトグル機能（SP版のみ）
 * ヘッダーをタップして詳細の表示/非表示を切り替え
 */
function initLineToggle() {
  const lineBox = document.querySelector('[data-line-toggle]');
  
  if (!lineBox) {
    // LINEアカウントセクションが存在しない場合は処理をスキップ
    return;
  }
  
  const header = lineBox.querySelector('.line-toggle-header');
  
  if (!header) {
    return;
  }
  
  // ヘッダーをクリックした時の処理（PC版・SP版両方で有効）
  header.addEventListener('click', function() {
    lineBox.classList.toggle('active');
  });
}

/**
 * ブログ更新セクションのトグル機能（SP版のみ）
 * ヘッダーをクリックしてコンテンツの表示/非表示を切り替え
 */
function initBlogUpdateToggle() {
  const blogUpdateBox = document.querySelector('[data-blog-update-toggle]');
  
  if (!blogUpdateBox) {
    // ブログ更新セクションが存在しない場合は処理をスキップ
    return;
  }
  
  const header = blogUpdateBox.querySelector('.blog-update-header');
  
  if (!header) {
    return;
  }
  
  // ヘッダーをクリックした時の処理
  header.addEventListener('click', function() {
    // SP版（768px以下）の場合のみトグル機能を有効化
    if (window.innerWidth <= 768) {
      blogUpdateBox.classList.toggle('active');
    }
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、開いた状態にする
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      blogUpdateBox.classList.remove('active');
    }
  });
}

/**
 * 学習プログラムのタブ機能（SP版のみ）
 * タブをクリックして各CHAPTERの表示/非表示を切り替え
 */
function initProgramTabs() {
  const tabButtons = document.querySelectorAll('.program-tab-btn');
  const tabContents = document.querySelectorAll('.program-card[data-tab-content]');
  
  if (tabButtons.length === 0 || tabContents.length === 0) {
    return;
  }
  
  // タブボタンをクリックした時の処理
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // SP版（768px以下）の場合のみタブ機能を有効化
      if (window.innerWidth <= 768) {
        const tabNumber = this.getAttribute('data-tab');
        const targetContent = document.querySelector(`.program-card[data-tab-content="${tabNumber}"]`);
        
        // 同じタブを押した場合は非表示に（トグル機能）
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          if (targetContent) {
            targetContent.classList.remove('active');
          }
        } else {
          // すべてのタブとコンテンツから active クラスを削除
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          
          // クリックされたタブと対応するコンテンツに active クラスを追加
          this.classList.add('active');
          if (targetContent) {
            targetContent.classList.add('active');
          }
        }
      }
    });
  });
  
  // ウィンドウリサイズ時にPC版に戻った場合は、すべてのカードを表示
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
    }
  });
}

/**
 * フッターのキャラクター画像をSP版でロゴの隣に配置
 */
function initFooterCharacters() {
  const logoWrapper = document.querySelector('.footer-logo-wrapper');
  const footerContent = document.querySelector('.footer-content');
  const charLeft = document.querySelector('.footer-character-left');
  const charRight = document.querySelector('.footer-character-right');
  
  if (!logoWrapper || !footerContent || !charLeft || !charRight) {
    return;
  }
  
  // 元の位置を記憶
  const originalParent = footerContent;
  
  function arrangeCharacters() {
    if (window.innerWidth <= 768) {
      // SP版：キャラクター画像をロゴの隣に移動
      if (charLeft.parentElement !== logoWrapper) {
        logoWrapper.insertBefore(charLeft, logoWrapper.firstChild);
      }
      if (charRight.parentElement !== logoWrapper) {
        logoWrapper.appendChild(charRight);
      }
    } else {
      // PC版：キャラクター画像を元の位置に戻す
      if (charLeft.parentElement !== originalParent) {
        originalParent.insertBefore(charLeft, originalParent.firstChild);
      }
      if (charRight.parentElement !== originalParent) {
        originalParent.appendChild(charRight);
      }
    }
  }
  
  // 初期配置
  arrangeCharacters();
  
  // ウィンドウリサイズ時に再配置
  window.addEventListener('resize', arrangeCharacters);
}

/**
 * チェックリストをリセット（デバッグ用）
 * 必要に応じてコンソールから実行: resetChecklist()
 */
function resetChecklist() {
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  checklistItems.forEach(item => {
    const itemKey = item.getAttribute('data-item');
    localStorage.removeItem(itemKey);
    item.checked = false;
    item.parentElement.classList.remove('checked');
  });
  
  console.log('チェックリストがリセットされました');
}

