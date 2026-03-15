import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/retreat-registration
 *
 * Receives registration data and forwards it to a Google Apps Script
 * web-app that writes a row into a Google Sheet.
 *
 * Set the GOOGLE_SCRIPT_URL environment variable to the deployed
 * Apps Script URL (Extensions → Apps Script → Deploy → Web app → Copy URL).
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    /* ---- basic server-side validation ---- */
    if (!data.fullName?.trim() || !data.dob || !data.phone?.trim() || !data.email?.trim() || !data.address?.trim()) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (!Array.isArray(data.days) || data.days.length === 0) {
      return NextResponse.json({ error: 'Please select at least one day.' }, { status: 400 });
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      // Graceful fallback — log and succeed so registrations aren't lost during setup
      console.warn('[retreat-registration] GOOGLE_SCRIPT_URL not configured. Logging registration:');
      console.log(JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true });
    }

    /* ---- forward to Google Sheets ---- */
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // avoids CORS preflight issues with Apps Script
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    if (!res.ok) {
      console.error('[retreat-registration] Google Script responded with', res.status);
      throw new Error('Google Sheets error');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[retreat-registration] Error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again or contact Simon at +44 7378 143331.' },
      { status: 500 },
    );
  }
}
