/**
 * Central Webhook for TLI Projects
 * Handles Invoice Creator and Field Log data.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();

    // Route 1: Invoice Creator Logic
    if (data.app_source === "InvoiceCreator") {
      const sheetName = "Invoices_Archive";
      let sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.appendRow(["Timestamp", "Client", "Case #", "PAE #", "Total Amount", "Full_JSON_State"]);
        sheet.getRange("1:1").setFontWeight("bold").setBackground("#eef7ff");
      }

      const totalAmount = data.tables?.hours?.length > 0 ? "Calculated on Pull" : "N/A";
      
      // We store the full JSON in the last column for the 'Pull' feature
      sheet.appendRow([
        timestamp,
        data['field-client'] || "Unknown",
        data['field-case'] || "Unknown",
        data['field-pae'] || "Unknown",
        totalAmount,
        JSON.stringify(data)
      ]);

      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Invoice Archived" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Route 2: Default logic for TLI Field Log or other sources
    const logSheet = ss.getSheetByName("Field_Logs") || ss.insertSheet("Field_Logs");
    logSheet.appendRow([timestamp, "Raw Data Sync", JSON.stringify(data)]);

    return ContentService.createTextOutput("Data Received").setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles 'Pull' requests from the Invoice Creator
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Invoices_Archive");
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "No archive found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get the last row of data (the most recent save)
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return ContentService.createTextOutput("[]");

    const jsonData = sheet.getRange(lastRow, 6).getValue(); // Column F holds the JSON
    
    // Return the data directly to be consumed by applyInvoiceState(data)
    return ContentService.createTextOutput(jsonData)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "error": err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}