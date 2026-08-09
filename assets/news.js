// ============================================================
// お知らせ（News）データ & 描画スクリプト
// ============================================================
//
// ★★★ 責任者の方へ：ここを編集してください ★★★
//
// 下の NEWS_ITEMS 配列を書き換えるだけで、お知らせカードが更新されます。
// （index.html を直接さわる必要はありません）
//
// ・各カードの設定項目：
//     icon        … カード左上のアイコン（絵文字でOK）
//     title       … カードのタイトル
//     description … 短い説明文（未入力なら仮テキストが表示されます）
//     linkLabel   … ボタンの文字（例：「詳細を確認する」）
//     linkUrl     … ボタンのリンク先URL。空 "" のままなら「準備中」表示になります
//     image       … 顔写真などの画像。空 "" のままなら画像枠（プレースホルダー）が表示されます
//                   ※ image 項目を書かないカードは、画像枠なしの通常カードになります
//     imagePosition … 画像の表示位置（例: 'center 15%'）。見切れる場合に調整
//
// ・ボタンを消したいカード … linkUrl と linkLabel の2行をどちらも削除してください
//                            （両方無いカードは、ボタンが表示されなくなります）
//
// ・カードを増やす  → { ... } のかたまりを , で区切ってコピーして追加
// ・カードを減らす  → 不要な { ... } のかたまりを削除
// ・順番を変える    → { ... } の並び順を入れ替え
//
// ============================================================

const NEWS_ITEMS = [
  // 1. 合宿ブログ 2日目
  {
    icon: '📝',
    title: '合宿ブログ 2日目を公開しました',
    description: '戦略をコードに落とし込む授業やBBQ、BeEnCupに向けた準備など、合宿2日目の様子をお届けします。',
    linkLabel: '2日目のブログを見る',
    linkUrl: 'blog/day2.html',
    image: 'blog/images2/day2_9_1.jpg',
    imagePosition: 'center center',
  },

  // 2. 合宿ブログ 1日目
  {
    icon: '📝',
    title: '合宿ブログ 1日目を公開しました',
    description: '新しい仲間との出会いや、トランプゲーム実装のスタートなど、合宿1日目の様子をお届けします。',
    linkLabel: '1日目のブログを見る',
    linkUrl: 'blog/day1.html',
    image: 'blog/images1/day1_1.jpg',
    imagePosition: 'center center',
  },
];

// ============================================================
// ▼▼▼ ここから下は描画処理です（基本的に編集不要） ▼▼▼
// ============================================================

(function () {
  'use strict';

  // HTMLとして安全に表示するためのエスケープ処理
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 1枚分のカードHTMLを組み立てる
  function buildCard(item) {
    var icon = escapeHtml(item.icon || '📌');
    var title = escapeHtml(item.title || 'タイトル未設定');
    var description = function formatDescription(value) {
  return escapeHtml(value || 'こちらにお知らせ内容が入ります。（準備中）')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
(item.description || 'こちらにお知らせ内容が入ります。（準備中）');
    function formatDescription(value) {
  return escapeHtml(value || 'こちらにお知らせ内容が入ります。（準備中）')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}


    // 画像枠（image プロパティを持つカードのみ）
    var imageHtml = '';
    if (Object.prototype.hasOwnProperty.call(item, 'image')) {
      if (item.image) {
        var imagePosition = item.imagePosition
          ? ' style="object-position:' + escapeHtml(item.imagePosition) + ';"'
          : '';
        imageHtml =
          '<div class="news-card-image">' +
          '<img src="' + escapeHtml(item.image) + '" alt="' + title + '" loading="lazy"' + imagePosition + '>' +
          '</div>';
      } else {
        // 画像未設定：あとから差し替えやすいプレースホルダー枠
        imageHtml =
          '<div class="news-card-image news-card-image-placeholder">' +
          '<span class="news-card-image-icon">🖼️</span>' +
          '<span class="news-card-image-text">画像を準備中</span>' +
          '</div>';
      }
    }

    // ボタン／リンク欄
    // linkUrl も linkLabel も書かれていないカードは、ボタンを表示しません。
    var hasButton =
      Object.prototype.hasOwnProperty.call(item, 'linkUrl') ||
      Object.prototype.hasOwnProperty.call(item, 'linkLabel');
    var linkAreaHtml = '';
    if (hasButton) {
      var linkLabel = escapeHtml(item.linkLabel || '詳細を確認する');
      var linkHtml;
      if (item.linkUrl) {
        linkHtml = '<a class="news-card-btn" href="' + escapeHtml(item.linkUrl) + '">' + linkLabel + '</a>';
      } else {
        // リンク未設定：見た目が崩れないよう「準備中」のロック表示
        linkHtml = '<span class="news-card-btn news-card-btn-disabled">準備中</span>';
      }
      linkAreaHtml = '<div class="news-card-link-area">' + linkHtml + '</div>';
    }

    return (
      '<article class="news-card">' +
      '<div class="news-card-icon">' + icon + '</div>' +
      imageHtml +
      '<h4 class="news-card-title">' + title + '</h4>' +
      '<p class="news-card-desc">' + description + '</p>' +
      linkAreaHtml +
      '</article>'
    );
  }

  function renderNews() {
    var container = document.querySelector('[data-news-list]');
    if (!container) return; // お知らせセクションが無いページでは何もしない

    if (!Array.isArray(NEWS_ITEMS) || NEWS_ITEMS.length === 0) {
      container.innerHTML =
        '<p class="news-empty">現在、お知らせはありません。</p>';
      return;
    }

    container.innerHTML = NEWS_ITEMS.map(buildCard).join('');
  }

  // お知らせセクションの開閉トグル（上のLINEセクションと同じ挙動）
  function initNewsToggle() {
    var newsBox = document.querySelector('[data-news-toggle]');
    if (!newsBox) return;

    var header = newsBox.querySelector('.news-toggle-header');
    if (!header) return;

    header.addEventListener('click', function () {
      newsBox.classList.toggle('active');
    });
  }

  function init() {
    renderNews();
    initNewsToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
