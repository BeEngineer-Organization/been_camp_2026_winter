// ============================================================
// スケジュール（TOP用）データ
// ============================================================
//
// ★★★ 編集方法 ★★★
// 下の SCHEDULE_DAYS 配列を書き換えるだけで TOP ページの
// 3日間スケジュール表が更新されます。
//
// ※ スタッフ向けは staff/schedule-data.js（STAFF_SCHEDULE_DAYS）で別管理です。
//
// 元資料: 26BeEn合宿スケジュール - スケジュール（生徒）.pdf
//
// ※ 2026冬：時間・場所は既存の内容のまま。授業の備考（note）は冬の学習内容
//   （Djangoを使ったSNSアプリのグループ開発・発表）に合わせて書き換えた仮の割り当てです。
//   どの時間にどの CHAPTER を行うかは、確定したらここを修正してください。
//
// ・time     … 表示用の時間帯（例: "13:00～14:00"）
// ・location … 場所（<br> で改行可。場所アイコンは自動で付きます）
// ・activity … 内容
// ・active   … true の日を最初に表示（合宿期間中は当日のタブが自動で開きます）
// ・note     … 備考（空文字 "" 可。<br> で改行可）
//
// ============================================================

window.SCHEDULE_DAYS = [
  {
    id: 'schedule-day1',
    active: true,
    items: [
      {
        time: '13:00～14:00',
        location: 'エントランス',
        activity: '集合',
        note: '現地のスタッフの指示に従うこと！',
      },
      {
        time: '14:00～14:30',
        location: '宿泊部屋へ',
        activity: '宿泊する部屋へ荷物を置く',
        note: '先生が部屋まで誘導！',
      },
      {
        time: '14:30～15:00',
        location: '研修室1～4',
        activity: '開講式',
        note: 'アイスブレイク・班分け・Wi-Fi接続',
      },
      {
        time: '15:00～17:00',
        location: '研修室1～4',
        activity: '授業',
        note: 'CHAPTER 1 ベースアプリの開発①<br>DjangoでSNSアプリをつくり始めよう',
      },
      {
        time: '17:00～18:00',
        location: '1Fレストラン',
        activity: '夕食',
        note: '班ごとに食事',
      },
      {
        time: '18:00～19:00',
        location: '研修室1～4',
        activity: '休憩',
        note: '各教室にスタッフ配置',
      },
      {
        time: '19:00～21:00',
        location: '研修室1～4',
        activity: '授業',
        note: 'CHAPTER 1 ベースアプリの開発②',
      },
      {
        time: '21:00～24:00',
        location: '各部屋',
        activity: '班長会議・就寝準備',
        note: '班長会議は21:00～<br>自由時間・質問対応可能',
      },
    ],
  },
  {
    id: 'schedule-day2',
    active: false,
    items: [
      {
        time: '6:30～7:00',
        location: '各部屋',
        activity: '起床',
        note: '各班で協力して起床',
      },
      {
        time: '7:00～8:00',
        location: '研修室1～4',
        activity: '朝活（授業）',
        note: '全体での朝の活動',
      },
      {
        time: '8:00～9:00',
        location: '1Fレストラン',
        activity: '朝食',
        note: '班ごとに食事',
      },
      {
        time: '9:00～12:00',
        location: '研修室1～4',
        activity: '授業',
        note: 'CHAPTER 2 グループ開発①<br>役割分担をして開発スタート',
      },
      {
        time: '12:00～13:00',
        location: '研修室1～4',
        activity: '昼食',
        note: '教室でカレーを食べます！',
      },
      {
        time: '13:00～17:00',
        location: '研修室1～4',
        activity: '授業',
        note: 'CHAPTER 2 グループ開発②<br>グループで相談しながら<br>オリジナル機能を実装していく！',
      },
      {
        time: '17:00～20:00',
        location: '外・ピラミッド<br>TAKIBI1～4，6',
        activity: 'BBQ',
        note: 'コミュニケーションを楽しもう',
      },
      {
        time: '20:00～21:00',
        location: '研修室1～4',
        activity: '授業',
        note: '＜続＞オリジナル機能を実装していく！',
      },
      {
        time: '21:00～24:00',
        location: '各部屋',
        activity: '班長会議・就寝準備',
        note: '班長会議は21:00～<br>自由時間・質問対応可能',
      },
    ],
  },
  {
    id: 'schedule-day3',
    active: false,
    items: [
      {
        time: '6:30～7:00',
        location: '各部屋',
        activity: '起床',
        note: '各班で協力して起床',
      },
      {
        time: '7:00～8:00',
        location: '1Fレストラン',
        activity: '朝食',
        note: '班ごとに食事',
      },
      {
        time: '8:00～9:00',
        location: '研修室1～4',
        activity: '朝活（授業）',
        note: '荷物を持って研修室へ<br>全体での朝の活動',
      },
      {
        time: '9:00～12:00',
        location: '研修室1～4',
        activity: '授業',
        note: '最後の仕上げ<br>CHAPTER 3 開発したアプリの発表',
      },
      {
        time: '12:00～13:00',
        location: '研修室1～4',
        activity: '閉講式',
        note: '成果の確認！',
      },
      {
        time: '13:00～',
        location: 'エントランス',
        activity: '解散',
        note: '先生たちの指示に従い、行動する！',
      },
    ],
  },
];
