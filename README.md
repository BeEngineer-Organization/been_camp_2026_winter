# BeEngineer Programming Camp Website 🍁

ロゴスランド風デザインのBeEngineer合宿案内Webページ
【BeEngineer合宿用Webページ（アーカイブ）】

## 📋 概要

このサイトは、BeEngineerのプログラミング合宿（2026年12月26日〜28日）の案内用Webページです。

- **開催場所**: ロゴスランド京都
- **対象**: 中高生（ファミリー参加OK）
- **デザイン**: ロゴスランド公式サイトを参考にした、緑×オレンジ×白のポップなデザイン

## 🚀 特徴

✅ ロゴスランド風の温かみのあるデザイン  
✅ レスポンシブ対応（スマホ・タブレット最適化）  
✅ SP版でハンバーガーメニュー & カードトグル機能  
✅ 軽量で高速表示  
✅ GitHub Pages対応  
✅ 持ち物チェックリスト（localStorage対応）  
✅ 合宿ブログテンプレート同梱  

## 📁 ファイル構成

```
BeEn合宿_案内/
├── index.html              # トップページ
├── daily-template.html     # ブログテンプレート
├── styles.css              # メインスタイルシート
├── script.js               # JavaScript（機能実装）
├── README.md               # このファイル
├── .gitignore              # Git除外設定
└── assets/                 # アセット管理
    ├── photos/             # 写真を保存
    ├── logos/              # ロゴを保存
    └── README.md           # 画像管理ガイド
```

## 🎨 デザインカラー

- **メインカラー**: `#0E8B62` (緑)
- **セカンダリ**: `#F47F2E` (オレンジ)
- **背景**: `#FAFAF8` (ベージュ白)
- **パステル**: 青・黄・ピンク・緑

## 📝 使い方

### 1. 基本的な使用方法

そのまま `index.html` をブラウザで開けば動作します。

```bash
# ローカルで確認（任意のWebサーバーを使用）
python -m http.server 8000
# または
npx serve
```

ブラウザで `http://localhost:8000` を開く

### 2. 画像の追加方法

#### ヒーローセクションの背景画像を追加

`assets/photos/` に画像を保存し、`styles.css` の `.hero::before` セクションを編集：

```css
.hero::before {
  background-image: url('assets/photos/hero-bg.jpg');
  opacity: 0.5;
}
```

#### ロゴの追加

`assets/logos/` にロゴ画像を保存し、`index.html` のサイドバーロゴ部分を編集：

```html
<div class="sidebar-logo">
  <img src="assets/logos/logo.png" alt="LOGOS LAND" style="width: 100%; max-width: 150px;">
  <p>× BeEngineer</p>
</div>
```

### 3. ブログ記事の追加

#### 日別記事の作成

`daily-template.html` をコピーして各日の記事を作成：

```bash
# Windows
copy daily-template.html daily-day1.html
copy daily-template.html daily-day2.html
copy daily-template.html daily-day3.html

# macOS/Linux
cp daily-template.html daily-day1.html
cp daily-template.html daily-day2.html
cp daily-template.html daily-day3.html
```

#### 記事の編集

各ファイルで以下を変更：

1. **タイトル・日付を変更**
```html
<title>合宿ブログ - Day 1 | BeEngineer</title>
<h1 class="blog-title">合宿 1日目の様子 🎉</h1>
<span>📅 2026年12月26日（土）</span>
```

2. **内容を追加・編集**
```html
<section class="blog-section">
  <h2>今日の学習内容</h2>
  <p>ここに本文を書く</p>
</section>
```

3. **写真を追加**
```html
<div class="blog-images">
  <div class="blog-image">
    <img src="assets/photos/day1-01.jpg" alt="集合写真">
  </div>
  <div class="blog-image">
    <img src="assets/photos/day1-02.jpg" alt="授業風景">
  </div>
</div>
```

#### index.htmlにブログリンクを追加（任意）

お問い合わせセクションの前に以下を追加：

```html
<section id="blog" class="section">
  <div class="container">
    <h2 class="section-title">合宿の様子 📝</h2>
    <div class="card-grid">
      <div class="card">
        <h3>1日目の様子</h3>
        <p>12月26日（土）</p>
        <a href="daily-day1.html" style="color: var(--color-secondary);">読む →</a>
      </div>
      <div class="card">
        <h3>2日目の様子</h3>
        <p>12月27日（日）</p>
        <a href="daily-day2.html" style="color: var(--color-secondary);">読む →</a>
      </div>
      <div class="card">
        <h3>3日目の様子</h3>
        <p>12月28日（月）</p>
        <a href="daily-day3.html" style="color: var(--color-secondary);">読む →</a>
      </div>
    </div>
  </div>
</section>
```

### 4. Google Map の設定

`index.html` のアクセスセクションにあるGoogle Map埋め込みコードを、必要に応じて実際の座標に更新してください。

[Google Maps埋め込みコード生成](https://www.google.com/maps)

### 5. お問い合わせ情報の変更

`index.html` のお問い合わせセクションで、メールアドレスや電話番号を更新：

```html
<p><a href="mailto:あなたのメール@example.com">あなたのメール@example.com</a></p>
<p><a href="tel:080-1234-5678">080-1234-5678</a></p>
```

## 🌐 GitHub Pages へのデプロイ

### 方法1: GitHub経由

1. GitHubでリポジトリを作成
2. ファイルをプッシュ
```bash
git init
git add .
git commit -m "Initial commit: BeEngineer Camp Website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

3. リポジトリの Settings → Pages で以下を設定：
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Save

4. 数分後、`https://YOUR-USERNAME.github.io/YOUR-REPO/` でアクセス可能

### 方法2: 直接アップロード

1. GitHubでリポジトリを作成
2. 「Add file」→「Upload files」で全ファイルをアップロード
3. Settings → Pages で設定

## 📱 レスポンシブ対応

以下のブレイクポイントで最適化されています：

- **デスクトップ**: 1024px以上（サイドバー表示、全カード展開）
- **タブレット**: 768px〜1023px
- **スマホ**: 767px以下（ハンバーガーメニュー、カードトグル機能）

## ♿ アクセシビリティ

- セマンティックHTML使用
- キーボードナビゲーション対応
- フォーカス表示
- 視覚効果の削減モード対応（prefers-reduced-motion）

## 🎯 主要機能

### 持ち物チェックリスト

- チェック状態はブラウザのlocalStorageに自動保存
- ページを再読み込みしても状態が保持される
- チェックした項目はグレーアウト

### スムーススクロール

- ナビゲーションリンクをクリックすると、該当セクションへ滑らかにスクロール
- レガシーブラウザにも対応
- URL履歴にも追加されるため、ブラウザの戻るボタンでも移動可能

### JavaScript機能（script.js）

全ての機能は `script.js` で管理されています：

- **initChecklistFeature()** - チェックリスト機能の初期化
- **initSmoothScroll()** - スムーススクロール機能の初期化
- **initHamburgerMenu()** - ハンバーガーメニュー機能の初期化（SP版）
- **initProgramCardToggle()** - 学習プログラムカードのトグル機能（SP版）
- **resetChecklist()** - チェックリストリセット（デバッグ用）

コンソールで `resetChecklist()` を実行すると、すべてのチェック状態がリセットされます。

### 学習プログラムカードのトグル機能（SP版）

スマートフォン表示（768px以下）では、学習プログラムカードが開閉式になります：

- デフォルトで内容が非表示（タイトルのみ表示）
- カードをタップすると内容が展開
- ▼アイコンが▲に回転
- スムーズなアニメーション効果
- PC版では通常通り全て表示

## 🔧 カスタマイズ

### カラーテーマの変更

`styles.css` の `:root` セクションで色を変更：

```css
:root {
  --color-primary: #0E8B62;    /* メイン色（緑） */
  --color-secondary: #F47F2E;  /* アクセント色（オレンジ） */
  --color-bg: #FAFAF8;         /* 背景色 */
}
```

### フォントの変更

`styles.css` の `body` セクションで変更：

```css
body {
  font-family: 'ご希望のフォント', 'Yu Gothic UI', sans-serif;
}
```

### セクションの追加・削除

`index.html` で `<section class="section">` ブロックをコピー・編集・削除

## 📞 サポート

質問や問題がある場合：

- **Email**: support@be-engineer.tech
- **Website**: https://be-engineer.tech

## 📄 ライセンス

© 2026 BeEngineer. All Rights Reserved.

このテンプレートはBeEngineer内部での使用を目的としています。

---

**制作日**: 2026年5月10日
**対応ブラウザ**: Chrome, Firefox, Safari, Edge（最新版）  
**推奨解像度**: 1920×1080以上（スマホ・タブレットも対応）

🍁 素敵な合宿になりますように！

