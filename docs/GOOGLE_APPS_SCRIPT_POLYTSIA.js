/**
 * Google Apps Script для розділу «Полиця» — збір заявок на PDF-гайди.
 * Таблиця: https://docs.google.com/spreadsheets/d/15wd0kPBQ4sVULowyzAkPCK884biitc7ZM0FgK6rixnY/
 *
 * Аркуш Data: A=Дата, B=Ім'я, C=Email, D=Гайд (slug), E=Статус отправки
 * Статус: за замовчуванням «не отправлен», після відправки листа — «отправлен».
 *
 * Інструкція:
 * 1. Відкрийте таблицю в Google Sheets
 * 2. Створіть аркуш «Data» з заголовками: Дата | Ім'я | Email | Гайд | Статус отправки
 * 3. Розширення → Apps Script
 * 4. Вставте цей код, збережіть
 * 5. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone)
 * 6. Скопіюйте URL у .env.local як POLYTSIA_GOOGLE_SHEET_WEBHOOK_URL
 */

const SPREADSHEET_ID = '15wd0kPBQ4sVULowyzAkPCK884biitc7ZM0FgK6rixnY'
const DATA_SHEET = 'Data'

const COLS = {
  DATE: 1,
  NAME: 2,
  EMAIL: 3,
  GUIDE: 4,
  STATUS: 5
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData?.contents || '{}')
    const action = body.action

    if (action === 'append') {
      var result = appendRow(body)
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
    }
    if (action === 'update_status') {
      updateStatus(body)
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON)
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function appendRow(body) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  var sheet = ss.getSheetByName(DATA_SHEET)
  if (!sheet) {
    sheet = ss.insertSheet(DATA_SHEET)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата', 'Ім\'я', 'Email', 'Гайд', 'Статус отправки'])
  }

  var row = [
    new Date(),
    body.name || '',
    body.email || '',
    body.guideSlug || '',
    'не отправлен'
  ]
  sheet.appendRow(row)
  var rowIndex = sheet.getLastRow()
  return { ok: true, rowIndex: rowIndex }
}

function updateStatus(body) {
  var rowIndex = parseInt(body.rowIndex, 10)
  var status = body.status || 'отправлен'
  if (!rowIndex || rowIndex < 2) return

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  var sheet = ss.getSheetByName(DATA_SHEET)
  if (!sheet || sheet.getLastRow() < rowIndex) return

  sheet.getRange(rowIndex, COLS.STATUS).setValue(status)
}
