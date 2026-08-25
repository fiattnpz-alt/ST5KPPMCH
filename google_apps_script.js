/**
 * Google Apps Script for saving stress evaluation submissions to Google Sheet.
 * 
 * Instructions:
 * 1. Open Google Sheets (create a new sheet or use an existing one).
 * 2. In the menu, go to Extensions -> Apps Script.
 * 3. Delete any default code in Code.gs and paste this script.
 * 4. Click the 'Save' icon.
 * 5. Click 'Deploy' -> 'New deployment'.
 * 6. Select type: 'Web app'.
 * 7. Set Description: 'Stress Form API'
 * 8. Set Execute as: 'Me' (your email).
 * 9. Set Who has access: 'Anyone'.
 * 10. Click 'Deploy'.
 * 11. Authorize access (you might need to click 'Advanced' and then 'Go to Web App (unsafe)').
 * 12. Copy the 'Web app URL' (it will end with /exec).
 * 13. Paste that URL into js/config.js.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if sheet is empty to append header row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ชื่อ - นามสกุล", 
        "เลขบัตรประชาชน", 
        "เบอร์โทร", 
        "ที่อยู่", 
        "คะแนน", 
        "สรุปความเครียด"
      ]);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.fullName || "",
      data.citizenId || "",
      data.phone || "",
      data.address || "",
      data.score !== undefined ? data.score : "",
      data.resultText || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success", 
      "message": "Data successfully recorded in Google Sheets"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error", 
      "message": error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
