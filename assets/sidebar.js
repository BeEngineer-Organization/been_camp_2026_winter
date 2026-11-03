/**
 * スタッフページ用サイドバーコンポーネント
 * ※ 公開ページ（index / blog）は 2026冬のリデザインで assets/layout.js に移行済み。
 *
 * 使い方:
 *   <div id="site-sidebar" data-variant="staff"></div>      ← スタッフ用（schedule / tokyo-arrival / items）
 *   <div id="site-sidebar" data-variant="staff-mtg"></div>  ← スタッフMTG用（mtg-day1〜3）
 *   <script src="（assetsまでの相対パス）/sidebar.js"></script>
 *
 * このプレースホルダは「ハンバーガーボタン / サイドバー / オーバーレイ」の
 * 3要素にまとめて差し替えられる。
 *
 * - メインページへのリンクはこのスクリプトの配置場所から自動解決される。
 * - 現在ページを location から判定し、該当リンクに .active を自動付与する。
 *
 * 注意: staff/legacy-script.js の initHamburgerMenu() が
 * #hamburger / #sidebar / #overlay を参照するため、
 * このスクリプトは legacy-script.js より前に読み込み、先に描画を完了させること。
 */
(function () {
  // このスクリプト自身のURLを基に各種ベースURLを決定。
  // currentScript は defer/async/module 読み込み時に null になり得るのでフォールバック。
  const scriptEl = document.currentScript
    || document.querySelector('script[src$="/sidebar.js"]');
  const rootBase = scriptEl ? new URL('..', scriptEl.src).href : '';    // プロジェクトルート/

  const path = location.pathname;
  const currentFile = (path.split('/').pop() || 'index.html');

  // --- HTML 生成 -----------------------------------------------------------
  const hamburgerHTML = `
    <button class="hamburger" id="hamburger" aria-label="メニュー">
      <span></span>
      <span></span>
      <span></span>
    </button>`;

  const overlayHTML = `<div class="overlay" id="overlay"></div>`;

  function staffSidebar() {
    return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h1>🔒 Staff Only</h1>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li><a href="schedule.html">📅 詳細スケジュール</a></li>
          <li><a href="tokyo-arrival.html">🚄 東京・横浜チーム</a></li>
          <li><a href="items.html">🎒 持ち物チェック</a></li>
          <li><a href="${rootBase}index.html">🏠 メインページ</a></li>
          <li class="nav-divider">
            <span class="nav-section-label">🗓️ MTGページ</span>
          </li>
          <li><a href="mtg-day1.html">1日目 MTG</a></li>
          <li><a href="mtg-day2.html">2日目 MTG</a></li>
          <li><a href="mtg-day3.html">3日目 MTG</a></li>
        </ul>
      </nav>
    </aside>`;
  }

  // スタッフMTGページ用（mtg-day1〜3）。各MTGページ内の 始礼/終礼 アンカー + ページ一覧。
  function staffMtgSidebar() {
    return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <h1>🔒 Staff Only</h1>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li><a href="#shirei">📝 始礼</a></li>
          <li><a href="#shurei">📝 終礼</a></li>
          <li class="nav-divider">
            <span class="nav-section-label">📄 ページ一覧</span>
          </li>
          <li><a href="${rootBase}index.html">🏠 メインページ</a></li>
          <li><a href="schedule.html">📋 スタッフスケジュール</a></li>
          <li><a href="items.html">🎒 持ち物チェック</a></li>
          <li class="nav-divider">
            <span class="nav-section-label">🗓️ MTGページ</span>
          </li>
          <li><a href="mtg-day1.html">1日目 MTG</a></li>
          <li><a href="mtg-day2.html">2日目 MTG</a></li>
          <li><a href="mtg-day3.html">3日目 MTG</a></li>
        </ul>
      </nav>
    </aside>`;
  }

  // 現在ページに該当するナビリンクへ .active を付与する。
  // href のファイル名部分（ハッシュ・クエリを除く）が currentFile と一致したら付与。
  // 純粋なページ内アンカー（#xxx）はファイル遷移しないので対象外。
  function markActive(root) {
    root.querySelectorAll('.sidebar-nav a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      const file = href.split('#')[0].split('?')[0].split('/').pop();
      if (file && file === currentFile) {
        a.classList.add('active');
      }
    });
  }

  function render() {
    const placeholder = document.getElementById('site-sidebar');
    if (!placeholder) {
      console.error('[sidebar.js] #site-sidebar が見つかりません。');
      return;
    }
    const variant = placeholder.dataset.variant || 'staff';
    const sidebarHTML =
      variant === 'staff-mtg' ? staffMtgSidebar() : staffSidebar();

    // プレースホルダを「ハンバーガー + サイドバー + オーバーレイ」の3要素に差し替え。
    placeholder.outerHTML = hamburgerHTML + sidebarHTML + overlayHTML;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) markActive(sidebar);
  }

  // プレースホルダはこのスクリプトより前にあるため通常は即時描画できる。
  // 万一まだDOMが構築途中なら DOMContentLoaded を待つ（footer.js と同じ堅牢性）。
  if (document.getElementById('site-sidebar')) {
    render();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
