/**
 * 共通サイドバーコンポーネント
 *
 * 使い方:
 *   <div id="site-sidebar" data-variant="public"></div>     ← 一般公開用（index / blog）
 *   <div id="site-sidebar" data-variant="staff"></div>      ← スタッフ用（schedule / tokyo-arrival / items）
 *   <div id="site-sidebar" data-variant="staff-mtg"></div>  ← スタッフMTG用（mtg-day1〜3）
 *   <script src="（assetsまでの相対パス）/sidebar.js"></script>
 *
 * このプレースホルダは「ハンバーガーボタン / サイドバー / オーバーレイ」の
 * 3要素にまとめて差し替えられる。
 *
 * - 画像・リンクのパスはこのスクリプトの配置場所から自動解決されるので、
 *   ルート / blog/ / staff/ のどこから読み込んでも動作する。
 * - 現在ページを location から判定し、該当リンクに .active を自動付与する。
 * - 文言・メニュー・年号を変更する場合はこのファイルを編集すれば全ページに反映される。
 *
 * 注意: script.js の initHamburgerMenu() / initSidebarCharacterBubbles() が
 * #hamburger / #sidebar / #overlay / .sidebar-footer-char-* を参照するため、
 * このスクリプトは script.js より前に読み込み、先に描画を完了させること。
 */
(function () {
  // このスクリプト自身のURLを基に各種ベースURLを決定。
  // currentScript は defer/async/module 読み込み時に null になり得るのでフォールバック。
  const scriptEl = document.currentScript
    || document.querySelector('script[src$="/sidebar.js"]');
  const assetsBase = scriptEl ? new URL('.', scriptEl.src).href : '';   // .../assets/
  const rootBase = scriptEl ? new URL('..', scriptEl.src).href : '';    // プロジェクトルート/

  // 現在ページが index.html（ルート直下）かどうか。
  // 例: "/", "/index.html", "/been_gassyuku2026/", "/been_gassyuku2026/index.html"
  const path = location.pathname;
  const onIndex = /\/(index\.html)?$/.test(path);
  const currentFile = (path.split('/').pop() || 'index.html');

  // --- 公開用ナビのリンク解決 ---------------------------------------------
  // index 上では同一ページ内アンカー（スムーススクロール維持）、
  // それ以外（blog/ staff/）からは ../index.html#xxx 形式にする。
  const anchor = (hash) => onIndex ? `#${hash}` : `${rootBase}index.html#${hash}`;
  const topLink = onIndex ? '#hero' : `${rootBase}index.html`;
  // ブログサブメニュー: index 上は blog/dayN.html、blog 配下は dayN.html
  const blogLink = (n) => onIndex ? `${rootBase}blog/day${n}.html` : `day${n}.html`;

  // 合宿クイズ（別リポジトリ BeEn_Quiz でホスティング）。参加者用のパスワードが必要。
  const quizLink = 'https://beengineer-organization.github.io/BeEn_Quiz/camp.html';

  // --- HTML 生成 -----------------------------------------------------------
  const hamburgerHTML = `
    <button class="hamburger" id="hamburger" aria-label="メニュー">
      <span></span>
      <span></span>
      <span></span>
    </button>`;

  const overlayHTML = `<div class="overlay" id="overlay"></div>`;

  function publicSidebar() {
    return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <img src="${assetsBase}fav/LOGOSLAND_logo.svg" alt="LOGOS LAND" class="logo-image">
        <div class="logo-separator">×</div>
        <img src="${assetsBase}fav/BeEngineer_logo.svg" alt="BeEngineer" class="logo-image logo-been">
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li><a href="${topLink}">トップ</a></li>
          <li class="has-submenu">
            <a href="${anchor('blog')}">ブログ</a>
            <ul class="submenu">
              <li><a href="${blogLink(1)}">1日目</a></li>
            </ul>
          </li>
          <li><a href="${anchor('guide')}">ご案内</a></li>
          <li><a href="${anchor('overview')}">日程・会場</a></li>
          <li><a href="${anchor('teachers')}">引率講師の紹介</a></li>
          <li><a href="${anchor('program')}">学習内容</a></li>
          <li><a href="${quizLink}" target="_blank" rel="noopener">合宿クイズ 🔒</a></li>
          <li><a href="${anchor('schedule')}">スケジュール</a></li>
          <li><a href="${anchor('floormap')}">フロアマップ</a></li>
          <li><a href="${anchor('items')}">持ち物</a></li>
          <li><a href="${anchor('access')}">アクセス</a></li>
          <li><a href="${anchor('health')}">健康管理</a></li>
          <li><a href="${anchor('contact')}">お問い合わせ</a></li>
        </ul>
      </nav>

      <!-- コピーライトはフッター(footer.js)と重複するため非表示。キャラクター画像は装飾＋吹き出し用に残す。 -->
      <div class="sidebar-footer">
        <img src="${assetsBase}fav/dot_girl.svg" alt="" class="sidebar-footer-char sidebar-footer-char-left">
        <img src="${assetsBase}fav/dot_boy.svg" alt="" class="sidebar-footer-char sidebar-footer-char-right">
      </div>
    </aside>`;
  }

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
            <span class="nav-section-label">📝 ブログ確認（未公開）</span>
          </li>
          <li><a href="${rootBase}blog/day2.html">2日目ブログ</a></li>
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
            <span class="nav-section-label">📝 ブログ確認（未公開）</span>
          </li>
          <li><a href="${rootBase}blog/day2.html">2日目ブログ</a></li>
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
    const variant = placeholder.dataset.variant || 'public';
    const sidebarHTML =
      variant === 'staff-mtg' ? staffMtgSidebar()
      : variant === 'staff' ? staffSidebar()
      : publicSidebar();

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
