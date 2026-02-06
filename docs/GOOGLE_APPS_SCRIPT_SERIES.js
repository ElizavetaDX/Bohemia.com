/**
 * Google Apps Script для збору даних з анкети /series.
 * Таблиця: 1JEhx8GZ_v0pYezEWDBazcE9MvRuuKRmbl1xUdQI7lzo
 *
 * Інструкція:
 * 1. Відкрийте таблицю в Google Sheets
 * 2. Розширення → Apps Script
 * 3. Вставте цей код
 * 4. Створіть два аркуші: "Pending" та "Data"
 * 5. Pending: A=invoiceId, B=name, C=phone, D=telegram, E=email, F=birth, G=city, H=seriesId(JSON)
 * 6. Data: A=Timestamp, B=Name, C=Phone, D=Telegram, E=Email, F=BirthDate, G=City, H=SeriesID
 * 7. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone)
 * 8. Скопіюйте URL у .env.local як GOOGLE_SHEET_WEBHOOK_URL
 */

const SPREADSHEET_ID = '1JEhx8GZ_v0pYezEWDBazcE9MvRuuKRmbl1xUdQI7lzo'
const PENDING_SHEET = 'Pending'
const DATA_SHEET = 'Data'

function doPost(e) {
  try {
    const body = JSON.parse(e.postData?.contents || '{}')
    const action = body.action

    if (action === 'store') {
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

function storePending(body) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = ss.getSheetByName(PENDING_SHEET)
  if (!sheet) sheet = ss.insertSheet(PENDING_SHEET)
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
  const pendingSheet = ss.getSheetByName(PENDING_SHEET)
  if (!pendingSheet) return

  const data = pendingSheet.getDataRange().getValues()
  const header = data[0]
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

  const seriesId = (() => {
    try {
      const arr = JSON.parse(rowData[7] || '[]')
      return Array.isArray(arr) ? arr.join(', ') : rowData[7]
    } catch {
      return rowData[7] || ''
    }
  })()

  let dataSheet = ss.getSheetByName(DATA_SHEET)
  if (!dataSheet) dataSheet = ss.insertSheet(DATA_SHEET)
  if (dataSheet.getLastRow() === 0) {
    dataSheet.appendRow(['Timestamp', 'Name', 'Phone', 'Telegram', 'Email', 'BirthDate', 'City', 'SeriesID'])
  }

  const timestamp = new Date()
  const newRow = [
    timestamp,
    rowData[1] || '',
    rowData[2] || '',
    rowData[3] || '',
    rowData[4] || '',
    rowData[5] || '',
    rowData[6] || '',
    seriesId
  ]
  dataSheet.appendRow(newRow)

  pendingSheet.deleteRow(foundRow)
}
