# Google Sheets Setup — Retreat Registration

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it **"Spring Valley Church Retreat 2026 — Registrations"**
3. The script will auto-create headers on the first registration

## Step 2: Add the Apps Script

1. In the spreadsheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Date of Birth',
        'Email',
        'Phone',
        'Address',
        'Days Attending',
        'Family Members',
        'Guests',
        'Needs Transport',
        'Pickup Location',
        'Seats Needed',
        'Dietary Requirements',
        'Medical Conditions',
        'Additional Notes',
        'Total People'
      ]);

      // Bold the header row
      sheet.getRange(1, 1, 1, 16).setFontWeight('bold');
    }

    // Format family members
    var familyStr = '';
    if (data.familyMembers && data.familyMembers.length > 0) {
      familyStr = data.familyMembers.map(function(m) {
        return m.fullName + ' (' + m.relationship + ', DOB: ' + m.dob + ')' +
          (m.specialNeeds ? ' [' + m.specialNeeds + ']' : '');
      }).join(' | ');
    }

    // Format guests
    var guestsStr = '';
    if (data.bringingGuests && data.guests && data.guests.length > 0) {
      guestsStr = data.guests.map(function(g) {
        return g.fullName + (g.phone ? ' (Ph: ' + g.phone + ')' : '');
      }).join(' | ');
    }

    // Format days
    var daysStr = (data.days || []).join(', ');

    // Calculate total people
    var totalPeople = 1 + (data.familyMembers ? data.familyMembers.length : 0) +
      (data.bringingGuests && data.guests ? data.guests.length : 0);

    // Append the row
    sheet.appendRow([
      new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      data.fullName || '',
      data.dob || '',
      data.email || '',
      data.phone || '',
      data.address || '',
      daysStr,
      familyStr || 'None',
      guestsStr || 'None',
      data.needTransport ? 'Yes' : 'No',
      data.needTransport ? (data.pickupLocation || '') : 'N/A',
      data.needTransport ? (data.transportSeats || '1') : 'N/A',
      data.dietaryRequirements || 'None',
      data.medicalConditions || 'None',
      data.additionalNotes || 'None',
      totalPeople
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (Ctrl+S)

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Set:
   - **Description**: Retreat Registration
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** and grant permissions
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`)

## Step 4: Add URL to Environment

Add the URL to your `.env.local` file:

```
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Also add it to your Vercel environment variables:
1. Go to your Vercel project → Settings → Environment Variables
2. Add `GOOGLE_SCRIPT_URL` with the Apps Script URL
3. Redeploy

## That's it!

Registrations will now appear as rows in your Google Sheet. You can:
- Sort/filter by any column
- Share the sheet with other church leaders
- Download as Excel/PDF for printing
- Set up email notifications (Extensions → Apps Script → Triggers → add `onEdit` trigger)
