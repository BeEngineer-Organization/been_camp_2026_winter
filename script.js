// ============================================
// BeEngineer プログラミングキャンプ 2026 冬 - 案内ページ / ブログ共通スクリプト
// ※ スタッフページは staff/legacy-script.js を使用
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initHeaderScroll();
  initScrollSpy();
  initSnowfall();
  initCountdown();

  initScheduleTabs();
  initFacilityTabs();
  initAccessTabs();
  initImageZoom();

  initChecklistFeature();
  initBlogButtonGate();

  // ブログ記事ページ
  initBlogToc();
  initBlogImageSliders();

  initFadeIn();
  initToTop();
});

const CAMP_START = new Date(2026, 11, 26); // 合宿初日 12/26（月は 0 始まり）
const CAMP_END = new Date(2026, 11, 28); // 最終日 12/28

/* ============================================
   メニュー（ヘッダーの MENU ボタン / SP はハンバーガー）
   ============================================ */
function initMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    menu.hidden = !open;
    document.body.classList.toggle('is-menu-open', open);
    if (open) {
      const first = menu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll('a, [data-menu-close]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ヘッダー：少しスクロールしたら背景を付ける */
function initHeaderScroll() {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ============================================
   スクロールスパイ：表示中のセクションのメニューをハイライト
   ============================================ */
function initScrollSpy() {
  const links = document.querySelectorAll('[data-nav-link]');
  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  const ids = new Set(Array.from(links, (link) => link.dataset.navLink));
  const sections = Array.from(ids)
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (sections.length === 0) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.dataset.navLink === id;
      link.classList.toggle('is-active', active);
      if (active) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ============================================
   背景の雪（広告LPと同じピクセル調の雪）
   粒ごとに速さ・揺れ幅・周期をランダムにし、座標を1ドット単位に丸めて描画。
   動きを減らす設定のときは止めたまま表示する
   ============================================ */
function initSnowfall() {
  const canvas = document.querySelector('[data-snowfall]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const DOT = 2; // 1ドットの大きさ（CSS px）
  let flakes = [];
  let width = 0;
  let height = 0;
  let rafId = 0;
  let last = 0;

  const random = (min, max) => min + Math.random() * (max - min);

  const createFlake = (y) => ({
    x: random(0, width),
    y,
    phase: random(0, Math.PI * 2),
    size: DOT * Math.ceil(random(0.5, 2.5)), // 2px または 4px（まれに 6px）
    speed: random(18, 48), // 落下速度（px/秒）
    drift: random(-8, 8), // 風
    sway: random(6, 22), // 横揺れの幅
    freq: random(0.3, 1.1), // 横揺れの速さ
    alpha: random(0.35, 0.75),
  });

  // 案内ページは読み物なので、広告LPより少し控えめな量にする
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.round((width * height) / 14000));
    flakes = Array.from({ length: count }, () => createFlake(random(0, height)));
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    flakes.forEach((f) => {
      const x = Math.round((f.x + Math.sin(time * f.freq + f.phase) * f.sway) / DOT) * DOT;
      const y = Math.round(f.y / DOT) * DOT;
      ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
      ctx.fillRect(x, y, f.size, f.size);
    });
  };

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    flakes.forEach((f, i) => {
      f.y += f.speed * dt;
      f.x += f.drift * dt;
      if (f.y > height + 24) {
        flakes[i] = createFlake(-24);
      } else if (f.x < -40) {
        f.x += width + 80;
      } else if (f.x > width + 40) {
        f.x -= width + 80;
      }
    });
    draw(now / 1000);
    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    cancelAnimationFrame(rafId);
    if (reduceMotion.matches || document.hidden) {
      draw(0);
      return;
    }
    last = performance.now();
    rafId = requestAnimationFrame(tick);
  };

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      start();
    }, 150);
  });
  reduceMotion.addEventListener('change', start);
  document.addEventListener('visibilitychange', start);

  resize();
  start();
}

/* ============================================
   カウントダウン・当日の進行（FV のキャラクターの吹き出し）
   ============================================ */

/**
 * 合宿当日（12/26〜12/28）の吹き出し文言。日付ごとに「時間帯スロット」で管理する。
 *
 * ★★★ 文言の編集方法 ★★★
 * ・各日は { from: '開始時刻', text: '文言' } の配列。
 *   「今の時刻」が from を過ぎた最後のスロットが表示される。
 *   例）14:00〜14:30 に出したい文言は from:'14:00'（次のスロット from:'14:30' まで有効）。
 * ・1日の始まりは必ず from:'00:00' のスロットから書く。
 * ・改行したいときは文中に \n を入れる（吹き出しは pre-line で改行を表示）。
 * ・時刻は assets/schedule-data.js のスケジュールに合わせています。変更時は両方を確認してください。
 */
const CAMP_SCHEDULE = {
  // ── 1日目 12/26（土） ───────────────────────────────
  '2026-12-26': [
    { from: '00:00', text: 'いよいよ合宿開始！\n到着を待ってます！' },
    { from: '14:00', text: '指示があるまで待機！' },
    { from: '14:30', text: '開講式！' },
    { from: '15:00', text: '授業中！' },
    { from: '17:00', text: '夕食＆休憩中♪' },
    { from: '19:00', text: '初日最後の授業！' },
    { from: '21:00', text: 'お疲れ様でした！' },
  ],
  // ── 2日目 12/27（日）──────────────────────
  '2026-12-27': [
    { from: '00:00', text: '早く寝ましょう！' },
    { from: '04:00', text: 'おはよう！\n合宿2日目！' },
    { from: '07:00', text: '元気に朝活！' },
    { from: '08:00', text: '朝食タイム' },
    { from: '09:00', text: 'グループ開発中！' },
    { from: '12:00', text: '昼食！\nカレーが美味しい！' },
    { from: '13:00', text: 'グループ開発中！' },
    { from: '17:00', text: 'BBQタイムだぁ！！' },
    { from: '20:00', text: '２日目最後の授業！' },
    { from: '21:00', text: 'お疲れ様でした！' },
  ],
  // ── 3日目 12/28（月） ─────────────────────
  '2026-12-28': [
    { from: '00:00', text: '早く寝ましょう！' },
    { from: '04:00', text: 'おはよう！\n合宿最終日！' },
    { from: '07:00', text: '朝食タイム' },
    { from: '08:00', text: '元気に朝活！' },
    { from: '09:00', text: '最後の仕上げ！\n発表に向けてがんばろう' },
    { from: '12:00', text: '閉講式' },
    { from: '13:00', text: 'お疲れ様！\n帰るまでが合宿！' },
    { from: '19:00', text: '合宿の報告をしよう！' },
  ],
};

/**
 * 吹き出しに表示する文言を「今日の日付・時刻」から決定して返す。
 *
 * ・合宿前（〜12/24）     … 「合宿まで／あと○○日！」（12/26までの残り日数を自動計算。2行で表示）
 * ・前日（12/25）         … 「いよいよ明日！準備しよう！」
 * ・合宿中（12/26〜12/28）… CAMP_SCHEDULE の時間帯スロットに従う
 * ・合宿後（12/29〜）     … 「ブログ公開中～♪」
 *
 * @returns {string|null} 表示文言。null の場合は吹き出しを出さない。
 */
function getCountdownMessage(now = new Date()) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const eve = new Date(CAMP_START.getTime() - MS_PER_DAY);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (today.getTime() === eve.getTime()) return 'いよいよ明日！準備しよう！';

  if (today < eve) {
    const days = Math.round((CAMP_START - today) / MS_PER_DAY);
    return `合宿まで\nあと${days}日！`;
  }

  if (today >= CAMP_START && today <= CAMP_END) {
    const slots = CAMP_SCHEDULE[toDateKey(today)];
    if (!slots || !slots.length) return null;

    const curMin = now.getHours() * 60 + now.getMinutes();
    let text = null;
    for (const slot of slots) {
      const [h, mi] = slot.from.split(':').map(Number);
      if (curMin >= h * 60 + mi) text = slot.text;
    }
    return text;
  }

  return 'ブログ公開中～♪';
}

function toDateKey(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function initCountdown() {
  const box = document.querySelector('[data-countdown]');
  const text = document.querySelector('[data-countdown-text]');
  if (!box || !text) return;

  const update = () => {
    const message = getCountdownMessage();
    box.hidden = !message;
    if (message) renderCountdownText(text, message);
  };
  update();
  setInterval(update, 60 * 1000); // 当日は時間帯で文言が変わるため1分ごとに更新
}

/* 「あと○○日」の数字だけを強調表示する（文言は textContent で入れるので HTML は解釈しない） */
function renderCountdownText(el, message) {
  const match = message.match(/^([\s\S]*あと)(\d+)(日[\s\S]*)$/);
  if (!match) {
    el.textContent = message;
    return;
  }
  const num = document.createElement('span');
  num.className = 'fv__status-num';
  num.textContent = match[2];
  el.replaceChildren(match[1], num, match[3]);
}

/* ============================================
   タブ（共通）
   role="tab" のボタンの aria-controls が指すパネルを切り替える。
   ←/→ キーでタブ間を移動できる
   ============================================ */
function setupTablist(tablist, onChange) {
  const tabs = Array.from(tablist.querySelectorAll(':scope > [role="tab"]'));
  if (tabs.length === 0) return null;

  const select = (tab, { focus = false } = {}) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
    if (onChange) onChange(tab);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (event) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      if (!step) return;
      event.preventDefault();
      select(tabs[(i + step + tabs.length) % tabs.length], { focus: true });
    });
  });

  return { tabs, select };
}

/**
 * スケジュール：日にちタブ
 * ・合宿期間中は当日のタブを自動で開く
 * ・表の下の注釈は data-note-days に列挙した日のタブでのみ表示
 */
function initScheduleTabs() {
  const tablist = document.querySelector('[data-schedule-tabs]');
  if (!tablist) return;

  const tablistApi = setupTablist(tablist, (tab) => updateScheduleNote(tab.dataset.tab));
  if (!tablistApi) return;

  const days = window.SCHEDULE_DAYS || [];
  const todayIndex = Math.round((new Date().setHours(0, 0, 0, 0) - CAMP_START) / 86400000);
  const defaultIndex = Math.max(0, days.findIndex((day) => day.active));
  const index = todayIndex >= 0 && todayIndex < tablistApi.tabs.length ? todayIndex : defaultIndex;
  tablistApi.select(tablistApi.tabs[index] || tablistApi.tabs[0]);
}

function updateScheduleNote(activeTabId) {
  document.querySelectorAll('[data-schedule-note]').forEach((note) => {
    const days = (note.getAttribute('data-note-days') || '').split(/\s+/).filter(Boolean);
    note.hidden = !activeTabId || (days.length > 0 && !days.includes(activeTabId));
  });
}

/* フロアマップ：階タブ（施設タブ [data-facility-tabs] は複数施設を載せるときだけ使う） */
function initFacilityTabs() {
  const facilityTabs = document.querySelector('[data-facility-tabs]');
  if (facilityTabs) setupTablist(facilityTabs);
  document.querySelectorAll('[data-floor-tabs]').forEach((tablist) => setupTablist(tablist));
}

/* アクセス：お車 / 電車・バス / 京都駅から */
function initAccessTabs() {
  const tablist = document.querySelector('[data-access-tabs]');
  if (tablist) setupTablist(tablist);
}

/* ============================================
   画像の拡大表示（フロアマップ・集合場所の写真）
   a.zoomable をクリックすると、別タブではなくページ内のモーダルで拡大表示する。
   Esc・背景・×ボタンで閉じる（JS が動かない環境ではリンク先の画像が開く）
   ============================================ */
function initImageZoom() {
  const links = document.querySelectorAll('a.zoomable');
  if (links.length === 0) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'zoom-modal';
  dialog.setAttribute('aria-label', '画像の拡大表示');
  dialog.innerHTML = '<figure class="zoom-modal__panel"><img class="zoom-modal__img" alt=""><figcaption class="zoom-modal__caption"></figcaption></figure><button type="button" class="zoom-modal__close" aria-label="閉じる">×</button>';
  document.body.appendChild(dialog);

  const img = dialog.querySelector('.zoom-modal__img');
  const caption = dialog.querySelector('.zoom-modal__caption');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const source = link.querySelector('img');
      img.src = link.href;
      img.alt = source ? source.alt : '';
      caption.textContent = img.alt;
      dialog.showModal();
      document.body.classList.add('is-menu-open');
    });
  });

  dialog.querySelector('.zoom-modal__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('is-menu-open'));
}

/* ============================================
   持ち物チェックリスト
   localStorage でチェック状態を保存・復元（キーは data-item の値。以前のページと共通）
   ============================================ */
function initChecklistFeature() {
  const box = document.querySelector('[data-checklist]');
  const items = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  if (items.length === 0) return;

  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* 保存できない環境では何もしない */ }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* 同上 */ }
    },
  };

  const isAllChecked = () => Array.from(items).every((item) => item.checked);

  const updateProgress = () => {
    if (!box) return;
    const total = items.length;
    const checked = Array.from(items).filter((item) => item.checked).length;
    const text = box.querySelector('[data-progress-text]');
    const bar = box.querySelector('[data-progress-bar]');
    const fill = box.querySelector('[data-progress-fill]');
    const done = box.querySelector('[data-progress-done]');
    if (text) text.textContent = `${checked} / ${total}`;
    if (bar) {
      bar.setAttribute('aria-valuemax', String(total));
      bar.setAttribute('aria-valuenow', String(checked));
    }
    if (fill) fill.style.setProperty('--progress', String(checked / total));
    if (done) done.hidden = checked !== total;
    box.classList.toggle('is-complete', checked === total);
  };

  items.forEach((item) => {
    const key = item.getAttribute('data-item');
    if (storage.get(key) === 'true') {
      item.checked = true;
      item.parentElement.classList.add('checked');
    }

    item.addEventListener('change', () => {
      storage.set(key, item.checked);
      item.parentElement.classList.toggle('checked', item.checked);
      updateProgress();
      // 最後の1つにチェックを入れて「全部そろった」瞬間だけお祝いする（ページ読み込み時の復元では出さない）
      if (item.checked && isAllChecked()) launchConfetti();
    });
  });

  const reset = document.querySelector('[data-checklist-reset]');
  if (reset) {
    reset.addEventListener('click', () => {
      resetChecklist();
      updateProgress();
    });
  }

  updateProgress();
}

/**
 * クラッカー風の演出：画面中央から紙吹雪が「パーン」と弾けて、重力で落ちながら消える。
 * ライブラリは使わず canvas で描く。動きを減らす設定（prefers-reduced-motion）の環境では出さない。
 */
function launchConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  canvas.setAttribute('aria-hidden', 'true');
  // CSS が古いキャッシュのままでも必ず画面全体に重なるよう、位置はここで直接指定する
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', zIndex: '90', width: '100%', height: '100%', pointerEvents: 'none',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const COLORS = ['#f0b844', '#ffe589', '#015eb9', '#409ad6', '#ffffff', '#f0861c', '#e8505b', '#5cc46b'];
  const DURATION = 2600;
  const scale = Math.min(1, Math.max(0.6, width / 1200)); // SP では少し控えめに飛ばす
  const pieces = Array.from({ length: 160 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (8 + Math.random() * 14) * scale;
    return {
      x: width / 2,
      y: height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6 * scale, // 少し上向きに弾ける
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      flip: Math.random() * Math.PI,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  });

  const start = performance.now();
  const frame = (now) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = Math.min(1, (DURATION - elapsed) / 600); // 最後の 0.6 秒でフェードアウト

    pieces.forEach((p) => {
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.32; // 空気抵抗＋重力
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.flip += 0.12;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(1, Math.cos(p.flip)); // ひらひら回転して見えるように縦につぶす
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < DURATION) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  };
  requestAnimationFrame(frame);
}

/**
 * チェックリストをリセット
 * 必要に応じてコンソールから実行: resetChecklist()
 */
function resetChecklist() {
  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach((item) => {
    try { localStorage.removeItem(item.getAttribute('data-item')); } catch (e) { /* 何もしない */ }
    item.checked = false;
    item.parentElement.classList.remove('checked');
  });
}

/* ============================================
   ブログボタンの公開日ゲート
   data-available-from で指定した日時より前はリンクを無効化し「準備中」を表示する
   ============================================ */
function initBlogButtonGate() {
  const buttons = document.querySelectorAll('a[data-available-from]');
  if (buttons.length === 0) return;

  const now = new Date();
  buttons.forEach((btn) => {
    const availableFrom = new Date(btn.getAttribute('data-available-from'));
    if (isNaN(availableFrom.getTime()) || now >= availableFrom) return;

    btn.classList.add('is-locked');
    btn.setAttribute('aria-disabled', 'true');
    const state = btn.querySelector('[data-blog-state]');
    if (state) state.textContent = '準備中';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      showToast('準備中です。しばらくお待ちください');
    });
  });
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector('[data-toast]');
  if (!toast) {
    toast = document.createElement('p');
    toast.className = 'toast';
    toast.setAttribute('data-toast', '');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

/* ============================================
   ブログ目次（TOC）の自動生成 + 現在位置のハイライト
   .blog-section の h2 を読み取って #blogToc の <ul> に目次リンクを生成する
   ============================================ */
function initBlogToc() {
  const toc = document.getElementById('blogToc');
  if (!toc) return;

  const tocList = toc.querySelector('ul');
  const sections = document.querySelectorAll('.blog-content .blog-section');
  if (!tocList || sections.length === 0) return;

  const links = [];
  sections.forEach((section, index) => {
    const h2 = section.querySelector('h2');
    if (!h2) return;
    if (!section.id) section.id = 'section-' + (index + 1);

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.textContent = h2.textContent.trim();
    li.appendChild(a);
    tocList.appendChild(li);
    links.push({ a, section });
  });
  if (links.length === 0) return;

  const setActive = () => {
    const scrollY = window.scrollY + 120; // ヘッダー分のオフセット
    let activeIndex = 0;
    for (let i = 0; i < links.length; i++) {
      if (links[i].section.offsetTop <= scrollY) {
        activeIndex = i;
      } else {
        break;
      }
    }
    links.forEach((link, i) => link.a.classList.toggle('active', i === activeIndex));
  };

  setActive();
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);

  initBlogTocMobile(links);
}

/* SP用：右下の「目次」ボタンと、押すと開く目次モーダル */
function initBlogTocMobile(links) {
  if (document.getElementById('blogTocFab')) return;

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.id = 'blogTocFab';
  fab.className = 'blog-toc-fab';
  fab.setAttribute('aria-label', '目次を開く');
  fab.innerHTML = '<span>目次</span>';
  document.body.appendChild(fab);

  const modal = document.createElement('div');
  modal.id = 'blogTocModal';
  modal.className = 'blog-toc-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', '目次');
  modal.innerHTML = '<div class="blog-toc-modal__panel pixel-card"><p class="blog-toc-modal__title">目次</p><ul></ul></div><button type="button" class="blog-toc-modal__close" aria-label="閉じる">×</button>';
  document.body.appendChild(modal);

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('is-menu-open');
  };
  const openModal = () => {
    modal.classList.add('open');
    document.body.classList.add('is-menu-open');
  };

  const modalList = modal.querySelector('ul');
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.a.getAttribute('href');
    a.textContent = link.a.textContent;
    a.addEventListener('click', closeModal);
    li.appendChild(a);
    modalList.appendChild(li);
  });

  fab.addEventListener('click', openModal);
  modal.querySelector('.blog-toc-modal__close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* ============================================
   ブログ画像ギャラリー（SP用スライド）
   2枚以上の .blog-images を横スワイプ＋左右ボタン＋ドット＋自動再生にする
   PCではトラックを display:contents にし、グリッド表示
   ============================================ */
function initBlogImageSliders() {
  const AUTO_SLIDE_MS = 4500;
  const galleries = document.querySelectorAll('.blog-images');
  if (galleries.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSpView = () => window.matchMedia('(max-width: 767px)').matches;

  galleries.forEach((gallery) => {
    if (gallery.dataset.sliderInit === '1') return;

    const images = Array.from(gallery.querySelectorAll(':scope > .blog-image'));
    if (images.length <= 1) return;

    gallery.dataset.sliderInit = '1';
    gallery.classList.add('blog-images--slider');

    const track = document.createElement('div');
    track.className = 'blog-images-track';
    images.forEach((image) => track.appendChild(image));
    gallery.appendChild(track);

    const makeNav = (dir, label, char) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'blog-images-nav blog-images-nav--' + dir;
      button.setAttribute('aria-label', label);
      button.innerHTML = '<span aria-hidden="true">' + char + '</span>';
      gallery.appendChild(button);
      return button;
    };
    const prevBtn = makeNav('prev', '前の写真', '◀');
    const nextBtn = makeNav('next', '次の写真', '▶');

    const dots = document.createElement('div');
    dots.className = 'blog-images-dots';
    dots.setAttribute('aria-label', '写真スライド');

    const getIndex = () => {
      const width = track.clientWidth || 1;
      return Math.max(0, Math.min(images.length - 1, Math.round(track.scrollLeft / width)));
    };

    const goTo = (index, behavior = 'smooth') => {
      const clamped = ((index % images.length) + images.length) % images.length;
      track.scrollTo({ left: clamped * track.clientWidth, behavior });
    };

    let autoplayTimer = null;
    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    };
    const startAutoplay = () => {
      if (prefersReducedMotion || !isSpView()) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(getIndex() + 1), AUTO_SLIDE_MS);
    };
    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const dotButtons = images.map((_, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'blog-images-dot';
      button.setAttribute('aria-label', (index + 1) + '枚目の写真');
      if (index === 0) button.setAttribute('aria-current', 'true');
      button.addEventListener('click', () => {
        goTo(index);
        restartAutoplay();
      });
      dots.appendChild(button);
      return button;
    });
    gallery.appendChild(dots);

    const updateActiveDot = () => {
      const current = getIndex();
      dotButtons.forEach((button, index) => {
        if (index === current) {
          button.setAttribute('aria-current', 'true');
        } else {
          button.removeAttribute('aria-current');
        }
      });
    };

    prevBtn.addEventListener('click', () => {
      goTo(getIndex() - 1);
      restartAutoplay();
    });
    nextBtn.addEventListener('click', () => {
      goTo(getIndex() + 1);
      restartAutoplay();
    });

    track.addEventListener('scroll', updateActiveDot, { passive: true });
    gallery.addEventListener('pointerenter', stopAutoplay);
    gallery.addEventListener('pointerleave', startAutoplay);
    track.addEventListener('touchstart', stopAutoplay, { passive: true });
    track.addEventListener('touchend', restartAutoplay, { passive: true });
    window.addEventListener('resize', () => {
      updateActiveDot();
      if (isSpView()) {
        startAutoplay();
      } else {
        stopAutoplay();
      }
    });

    startAutoplay();
  });
}

/* ============================================
   スクロール時のフェードイン（控えめに、カード単位で）
   ============================================ */
function initFadeIn() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll('.section-head, .pixel-card:not(.site-menu__panel):not(.blog-toc-modal__panel), .chapter-list, .blog-notice');
  const observer = new IntersectionObserver(
    (records) => {
      records.forEach((record) => {
        if (!record.isIntersecting) return;
        record.target.classList.add('is-visible');
        observer.unobserve(record.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((target) => {
    // 最初から画面内にあるものはそのまま表示（読み込み直後のちらつき防止）
    if (target.getBoundingClientRect().top < window.innerHeight) return;
    target.classList.add('fade-in');
    observer.observe(target);
  });
}

/* ページ先頭へ戻るボタン */
function initToTop() {
  const button = document.querySelector('[data-to-top]');
  if (!button) return;
  const update = () => {
    button.hidden = window.scrollY < window.innerHeight;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}
