import { NextResponse } from 'next/server';

// This is a simple API route to track orders before they are sent to WhatsApp.
// In a real production environment, you would POST this to a Google Sheets Apps Script URL.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, timestamp } = body;

    // TODO: Replace with your actual Google Apps Script Web App URL
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;
    
    if (GOOGLE_SHEETS_URL) {
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date(timestamp).toLocaleString('fr-FR'),
          total,
          items: items.map((i: any) => `${i.name} (${i.volume}) x${i.quantity}`).join('\n'),
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
