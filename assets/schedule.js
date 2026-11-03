// ============================================================
// スケジュール（TOP用）描画スクリプト
// ============================================================
// データの編集 → assets/schedule-data.js
//
// 1日分ずつ <table> を描画する。PC は表、SP は CSS で1行ずつのカードに組み替える
// （同じ HTML を使うので、PC/SP で内容がずれることはない）。
// タブの切り替えは script.js の initScheduleTabs() が担当する。
// ============================================================

(function () {
  'use strict';

  function buildRow(item) {
    var note = item.note ? item.note : '';
    var cls = /授業|朝活/.test(item.activity) ? ' class="is-class"' : '';
    return (
      '<tr' + cls + '>' +
      '<td class="schedule-table__time">' + item.time + '</td>' +
      '<td class="schedule-table__place">' + item.location + '</td>' +
      '<td class="schedule-table__activity">' + item.activity + '</td>' +
      '<td class="schedule-table__note">' + note + '</td>' +
      '</tr>'
    );
  }

  function buildPanel(day) {
    return (
      '<div class="schedule-panel" id="' + day.id + '" role="tabpanel" aria-labelledby="tab-' + day.id + '"' +
      (day.active ? '' : ' hidden') + '>' +
      '<table class="schedule-table">' +
      '<thead><tr><th scope="col">時間</th><th scope="col">場所</th><th scope="col">内容</th><th scope="col">備考</th></tr></thead>' +
      '<tbody>' + day.items.map(buildRow).join('') + '</tbody>' +
      '</table>' +
      '</div>'
    );
  }

  function renderSchedule() {
    var container = document.querySelector('[data-schedule-panels]');
    var days = window.SCHEDULE_DAYS;
    if (!container || !Array.isArray(days) || days.length === 0) return false;

    container.innerHTML = days.map(buildPanel).join('');
    return true;
  }

  window.renderCampSchedule = renderSchedule;

  // コンテナが存在する時点で即描画（script.js より先に実行される）
  renderSchedule();
})();
