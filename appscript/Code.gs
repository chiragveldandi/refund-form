/**
 * UniAcco Refund Request — Apps Script Web App
 *
 * Deploy:
 * 1. Open the Google Sheet this should write to → Extensions → Apps Script.
 * 2. Paste this file's contents in as Code.gs (replacing the default content).
 * 3. Deploy → New deployment → type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL it gives you — it should match NEXT_PUBLIC_APPSCRIPT_URL
 *    in the Next.js app's .env.local. If you redeploy later, use
 *    "Manage deployments" → edit → new version, so the URL stays the same.
 *
 * This project already has its own top-level doPost(e) (shared across forms).
 * The Next.js app sends { formType: "refund", ...fields } in the POST body,
 * so add a branch to your existing doPost that dispatches on that field:
 *
 *   function doPost(e) {
 *     var data = JSON.parse(e.postData.contents);
 *     if (data.formType === "refund") {
 *       return doPost_refundform(e);
 *     }
 *     // ...your existing handling for other form types
 *   }
 *
 * doGet_refundform is likewise just a helper — call it from your shared
 * doGet(e) the same way if you want a health-check route for this form.
 */

var SHEET_NAME = "Form responses Test";

var HEADERS = [
  "Timestamp",
  "Full Name",
  "Email ID used for your booking",
  "Transaction ID",
  "Please select the payment for which you are requesting a refund",
  "Amount paid",
  "Currency",
  "Date of Payment",
  "Reason for your refund request",
  "Tell us what happened, in your own words",
];

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function doPost_refundform(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.email || "",
      data.transactionId || "",
      data.paymentType || "",
      data.amountPaid || "",
      data.currency || "",
      data.paymentDate || "",
      data.reason || "",
      data.details || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployment by opening the exec URL
// directly in a browser (GET request) without submitting real data.
function doGet_refundform() {
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: "UniAcco refund endpoint is live." })
  ).setMimeType(ContentService.MimeType.JSON);
}
