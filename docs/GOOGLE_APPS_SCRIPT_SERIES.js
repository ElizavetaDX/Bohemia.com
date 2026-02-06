/**
 * Google Apps Script для збору даних з анкети /series.
 * Таблиця: 1JEhx8GZ_v0pYezEWDBazcE9MvRuuKRmbl1xUdQI7lzo
 *
 * Два етапи запису:
 * 1. create_lead — додає рядок при натисканні «Перейти до оплати» (Статус: Не оплачено)
 * 2. update_status — оновлює Статус та Дата оплати після webhook Monobank
 *
 * Інструкція:
 * 1. Відкрийте таблицю в Google Sheets
 * 2. Розширення → Apps Script
 * 3. Вставте цей код
 * 4. Аркуш Data: A=Дата створення, B=Ім'я, C=Телефон, D=Telegram, E=Email, F=Серії, G=Сума, H=Статус, I=Дата оплати
 * 5. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone)
 * 6. Скопіюйте URL у .env.local як GOOGLE_SHEET_WEBHOOK_URL
 */

const SPREADSHEET_ID = '1JEhx8GZ_v0pYezEWDBazcE9MvRuuKRmbl1xUdQI7lzo'
const DATA_SHEET = 'Data'

const COLS = {
  CREATED: 1,
  NAME: 2,
  PHONE: 3,
  TELEGRAM: 4,
  EMAIL: 5,
  SERIES: 6,
  AMOUNT: 7,
  STATUS: 8,
  PAID_AT: 9
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData?.contents || '{}')
    const action = body.action

    if (action === 'create_lead') {
      createLead(body)
    } else if (action === 'update_status') {
      updateStatus(body)
    } else if (action === 'store') {
      storePending(body)
    } else if (action === 'confirm') {
      confirmAndAppend(body.reference)
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function createLead(body) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(DATA_SHEET)
  if (!sheet) sheet = ss.insertSheet(DATA_SHEET)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата створення', 'Ім\'я', 'Телефон', 'Telegram', 'Email', 'Серії', 'Сума', 'Статус', 'Дата оплати'])
  }

  const seriesStr = Array.isArray(body.seriesId) ? body.seriesId.join(', ') : (body.seriesId || '')
  const row = [
    new Date(),
    body.name || '',
    String(body.phone || '').replace(/\D/g, ''),
    body.telegram || '',
    body.email || '',
    seriesStr,
    body.amount ?? 0,
    'Не оплачено',
    ''
  ]
  sheet.appendRow(row)
}

function updateStatus(body) {
  const phone = String(body.phone || '').replace(/\D/g, '')
  if (!phone || phone.length < 9) return

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  const sheet = ss.getSheetByName(DATA_SHEET)
  if (!sheet || sheet.getLastRow() < 2) return

  const data = sheet.getDataRange().getValues()
  for (let i = 1; i < data.length; i++) {
    const rowPhone = String(data[i][COLS.PHONE - 1] || '').replace(/\D/g, '')
    const last9 = rowPhone.slice(-9)
    const searchLast9 = phone.slice(-9)
    if (rowPhone === phone || last9 === searchLast9) {
      const rowNum = i + 1
      sheet.getRange(rowNum, COLS.STATUS).setValue('Оплачено')
      sheet.getRange(rowNum, COLS.PAID_AT).setValue(new Date())
      return
    }
  }
}

function storePending(body) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName('Pending')
  if (!sheet) sheet = ss.insertSheet('Pending')
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['invoiceId', 'name', 'phone', 'telegram', 'email', 'birth', 'city', 'seriesId'])
  }
  const row = [
    body.invoiceId || '',
    body.name || '',
    body.phone || '',
    body.telegram || '',
    body.email || '',
    body.birth || '',
    body.city || '',
    JSON.stringify(body.seriesId || [])
  ]
  sheet.appendRow(row)
}

function confirmAndAppend(reference) {
  if (!reference) return
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  const pendingSheet = ss.getSheetByName('Pending')
  if (!pendingSheet) return
  const data = pendingSheet.getDataRange().getValues()
  let foundRow = -1
  let rowData = null
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === reference) {
      foundRow = i + 1
      rowData = data[i]
      break
    }
  }
  if (foundRow === -1 || !rowData) return
  const phone = String(rowData[2] || '').replace(/\D/g, '')
  updateStatus({ phone })
  pendingSheet.deleteRow(foundRow)
}
