# BeEngineer プログラミングキャンプ 2026 冬 案内ページ ❄️

BeEngineer × LOGOS LAND プログラミングキャンプ 2026 冬の参加者・保護者向け案内ページです。

- **開催日**: 2026年12月26日（土）〜28日（月）／2泊3日
- **会場**: ロゴスランド京都
- **内容**: Djangoを使ったオリジナルSNSアプリのグループ開発・成果発表
- **デザイン**: 冬合宿 広告LP（[been_camp_2026_winter_LP](https://github.com/BeEngineer-Organization/been_camp_2026_winter_LP)）と統一。
  空色の背景＋ピクセル調の雪、角が2段欠けた白いカード、黄色×紺のボタン、クリーム色の吹き出しタグ。

## 📁 ファイル構成

```
index.html              # 案内ページ（トップ）
styles.css              # 案内ページ・ブログ共通のスタイル
script.js               # 案内ページ・ブログ共通のスクリプト
blog/day1〜3.html       # 合宿ブログ
assets/
├── layout.js           # 公開ページ共通のヘッダー・メニュー・フッター（メニュー項目はここで編集）
├── schedule-data.js    # 3日間のスケジュール（内容はここで編集）
├── schedule.js         # スケジュールの描画
├── news.js             # お知らせ（内容はここで編集）
├── teachers.js         # 引率講師の紹介（内容はここで編集）
├── img/                # 広告LPから流用したイラスト（SVGO で最適化済み）
├── fav/                # ロゴ・ファビコン・ドット絵キャラクター
├── map/                # フロアマップ画像
├── guide/              # 集合場所の写真・LINE QR
├── sidebar.js          # スタッフページ用サイドバー
└── footer.js           # スタッフページ用フッター
staff/                  # スタッフ専用ページ（パスワード認証）
├── legacy-base.css     # スタッフページ用の共通スタイル（旧デザインを移設）
└── legacy-script.js    # スタッフページ用の共通スクリプト（旧デザインを移設）
```

公開ページ（index / blog）とスタッフページはスタイル・スクリプトを分けています。
公開ページを変更してもスタッフページの表示には影響しません。

## 📝 よくある編集

| 変更したいもの | 編集するファイル |
| --- | --- |
| お知らせ | `assets/news.js` の `NEWS_ITEMS` |
| スケジュール | `assets/schedule-data.js` の `SCHEDULE_DAYS` |
| 引率講師 | `assets/teachers.js` の `TEACHERS` |
| メニュー項目 | `assets/layout.js` の `NAV_ITEMS` |
| キャラクターの吹き出し（カウントダウン・当日の進行） | `script.js` の `CAMP_SCHEDULE` |
| LINE QR・アカウント | `index.html` の「冬合宿用 LINE QR の差し替え場所」コメント |
| 緊急連絡先の表示/非表示 | `index.html` の `contact__card--emergency` に `hidden` を付け外し |
| ブログの公開日 | 各リンクの `data-available-from`（index.html・layout.js・blog/*.html） |

## 🎯 主な機能

- **持ち物チェックリスト**: チェック状態を localStorage に自動保存（キー `item1`〜`item17`）。準備状況のゲージ・一括リセット付き。
  最後の1つにチェックを入れて全部そろうと、画面中央から紙吹雪が弾ける演出が出ます（`script.js` の `launchConfetti`）。
  コンソールで `resetChecklist()` を実行してもリセットできます。
- **スケジュール**: 日にちタブで切り替え。PC は表、SP は1行ずつのカード表示（同じ HTML）。合宿期間中は当日のタブが自動で開きます。
- **ブログの公開制御**: `data-available-from` の日時より前は「準備中」表示になり、リンクを無効化します。
- **フロアマップ・アクセス・講師紹介**: タブで切り替え（←/→ キー対応）。マップや集合場所の写真はタップするとページ内のモーダルで拡大表示。
- **カウントダウン**: ファーストビューの雪だるまが合宿までの日数や当日の進行を表示します。

## 🚀 ローカルでの確認

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開いてください。

## 🌐 公開

GitHub Pages（Settings → Pages → Deploy from a branch / main / root）で公開できます。ビルドは不要です。

## 📄 ライセンス

© 2026 BeEngineer. All Rights Reserved.
