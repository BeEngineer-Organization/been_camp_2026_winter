/**
 * 公開ページ（index / blog）共通のヘッダー・メニュー・フッター
 *
 * 使い方:
 *   <div id="site-header"></div>   ← ヘッダー＋メニュー（body の先頭付近）
 *   <div id="site-footer"></div>   ← フッター
 *   <script src="（assetsまでの相対パス）/layout.js"></script>
 *
 * - 画像・リンクのパスはこのスクリプトの配置場所から自動解決されるので、
 *   ルート / blog/ のどちらから読み込んでも動作する。
 * - メニュー項目は NAV_ITEMS を編集すれば全ページに反映される。
 * - 開閉などの動きは script.js の initMenu() が担当する。
 *
 * ※ スタッフページは従来どおり assets/sidebar.js / assets/footer.js を使う。
 */
(function () {
  const COPYRIGHT_YEAR = 2026;

  // id = index.html 内のセクションID / menuLabel = MENU 内だけの表記（改行位置の指定など）
  const NAV_ITEMS = [
    { id: 'news', label: 'お知らせ' },
    { id: 'overview', label: '開催概要' },
    { id: 'guide', label: '集合案内' },
    { id: 'program', label: '学習プログラム' },
    { id: 'schedule', label: 'スケジュール' },
    { id: 'teachers', label: '引率講師' },
    { id: 'floormap', label: '会場マップ' },
    { id: 'items', label: '持ち物' },
    { id: 'access', label: 'アクセス' },
    { id: 'health', label: '健康・安全管理' },
    { id: 'blog', label: '合宿ブログ' },
    { id: 'contact', label: 'お問い合わせ・緊急連絡先', menuLabel: 'お問い合わせ・<br>緊急連絡先' },
  ];

  // 合宿クイズ（別リポジトリ BeEn_Quiz、参加者用パスワードが必要）は冬合宿では非表示。
  // 再掲するときは NAV_ITEMS とは別にメニューへ
  // https://beengineer-organization.github.io/BeEn_Quiz/camp.html へのリンクを追加する。

  const BLOG_DAYS = [
    { n: 1, date: '12/26(土)' },
    { n: 2, date: '12/27(日)' },
    { n: 3, date: '12/28(月)' },
  ];

  const scriptEl = document.currentScript
    || document.querySelector('script[src$="/layout.js"]');
  const assetsBase = scriptEl ? new URL('.', scriptEl.src).href : 'assets/';
  const rootBase = scriptEl ? new URL('..', scriptEl.src).href : '';

  // index 上では同一ページ内アンカー、blog/ からは ../index.html#xxx
  const onIndex = /\/(index\.html)?$/.test(location.pathname);
  const anchor = (id) => (onIndex ? `#${id}` : `${rootBase}index.html#${id}`);
  const topLink = onIndex ? '#top' : `${rootBase}index.html`;
  const blogLink = (n) => `${rootBase}blog/day${n}.html`;

  const logos = (cls) => `
    <img src="${assetsBase}img/logo-beengineer-white.svg" alt="BeEngineer" class="${cls}__logo-been" width="198" height="79">
    <span class="${cls}__cross" aria-hidden="true">×</span>
    <img src="${assetsBase}img/logo-logosland-white.svg" alt="LOGOS LAND" class="${cls}__logo-logos" width="105" height="168">`;

  const headerHTML = `
    <header class="site-header" data-site-header>
      <div class="site-header__inner">
        <a href="${topLink}" class="site-header__logos" aria-label="BeEngineer × LOGOS LAND 冬合宿案内 トップへ">${logos('site-header')}</a>
        <button type="button" class="menu-toggle" id="menu-toggle" aria-controls="site-menu" aria-expanded="false" aria-label="メニューを開く">
          <span class="menu-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="menu-toggle__label">MENU</span>
        </button>
      </div>
    </header>

    <div class="site-menu" id="site-menu" hidden>
      <div class="site-menu__backdrop" data-menu-close></div>
      <nav class="site-menu__panel pixel-card" aria-label="すべてのメニュー">
        <p class="site-menu__title"><span class="pixel-font">MENU</span></p>
        <ol class="site-menu__list">
          ${NAV_ITEMS.map((item, i) => `<li><a href="${anchor(item.id)}" class="site-menu__link" data-nav-link="${item.id}"><span class="site-menu__num">${String(i + 1).padStart(2, '0')}</span><span>${item.menuLabel || item.label}</span></a></li>`).join('')}
        </ol>
        <div class="site-menu__blog">
          <p class="site-menu__sub">合宿ブログ</p>
          <ul>
            ${BLOG_DAYS.map((d) => `<li><a href="${blogLink(d.n)}" class="site-menu__day" data-available-from="2026-12-${25 + d.n}T00:00:00"><b>${d.n}日目</b><small>${d.date}</small></a></li>`).join('')}
          </ul>
        </div>
      </nav>
    </div>`;

  const footerHTML = `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__brand">
          <div class="site-footer__logos">
            <a href="https://be-engineer.tech/" target="_blank" rel="noopener noreferrer"><img src="${assetsBase}img/logo-beengineer-white.svg" alt="BeEngineer" class="site-footer__logo-been" width="198" height="79" loading="lazy"></a>
            <span class="site-footer__cross" aria-hidden="true">×</span>
            <a href="https://logosland.jp/" target="_blank" rel="noopener noreferrer"><img src="${assetsBase}img/logo-logosland-white.svg" alt="LOGOS LAND" class="site-footer__logo-logos" width="105" height="168" loading="lazy"></a>
          </div>
          <p class="site-footer__tagline">京大ITベンチャー発、実践的なチカラを鍛える<br>中高生対象のプログラミング塾</p>
          <ul class="site-footer__campus">
            <li>京大本校</li><li>梅田校</li><li>飯田橋校</li><li>横浜校</li><li>首里校</li>
          </ul>
        </div>
        <nav class="site-footer__nav" aria-label="フッターメニュー">
          <ul>
            ${NAV_ITEMS.map((item) => `<li><a href="${anchor(item.id)}">${item.label.replace(/・/g, '・<wbr>')}</a></li>`).join('')}
          </ul>
        </nav>
        <p class="site-footer__copy"><small>© ${COPYRIGHT_YEAR} BeEngineer. All Rights Reserved.</small></p>
      </div>
    </footer>`;

  function render() {
    const header = document.getElementById('site-header');
    if (header) header.outerHTML = headerHTML;
    const footer = document.getElementById('site-footer');
    if (footer) footer.outerHTML = footerHTML;
  }

  // プレースホルダはこのスクリプトより前にあるため、通常は即時描画できる
  if (document.readyState === 'loading' && !document.getElementById('site-footer')) {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
