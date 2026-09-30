import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support both WhatsAppDrawer format (fullName) and SmartOrderForm format (nomComplet)
    const fullName = body.nomComplet || body.fullName;
    const phone = (body.telephone || body.phone || '').replace(/\s+/g, '');
    const city = body.ville || body.city;
    const address = body.adresse || body.address;

    if (!fullName || !phone || !address) {
      return NextResponse.json({ success: false, error: 'Champs manquants' }, { status: 400 });
    }

    // Build normalized orderData depending on the source
    let orderData: Record<string, any>;

    if (body.cartItems && Array.isArray(body.cartItems)) {
      // ── WhatsAppDrawer flow ──
      // Cart items already contain all data from the Zustand store (name, selectedPrice, selectedVolume, quantity)
      let calculatedTotal = 0;
      let totalQuantity = 0;
      const productNames: string[] = [];
      const unitPrices: number[] = [];

      for (const item of body.cartItems) {
        const name = item.name || item.id || 'Produit';
        const price = item.selectedPrice || item.price || 0;
        const qty = item.quantity || 1;
        const volume = item.selectedVolume || 'Standard';

        calculatedTotal += price * qty;
        totalQuantity += qty;
        productNames.push(`${name} (${volume}) x${qty}`);
        unitPrices.push(price);
      }

      orderData = {
        fullName,
        phone,
        city,
        address,
        productName: productNames.join(' + '),
        quantity: totalQuantity,
        unitPrice: unitPrices.length === 1 ? String(unitPrices[0]) : unitPrices.join(' / '),
        total: calculatedTotal,
      };
    } else {
      // ── SmartOrderForm flow ──
      orderData = {
        fullName,
        phone,
        city,
        address,
        productName: body.produit || body.productName || '',
        quantity: body.quantite || body.quantity || 1,
        unitPrice: String(body.prixUnitaire || body.unitPrice || 0),
        total: body.prixTotal || body.total || 0,
      };
    }

    // Send to Google Sheets via webhook
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let orderId = 'WA-XXXXX';

    if (webhookUrl) {
      try {
        const gRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
        const text = await gRes.text();
        try {
          const sheetResult = JSON.parse(text);
          if (sheetResult?.orderId) {
            orderId = sheetResult.orderId;
          }
        } catch {
          console.warn('Google Sheet response is not JSON:', text.substring(0, 200));
        }
      } catch (err) {
        console.error('Google Sheet inaccessible:', err);
      }
    } else {
      console.warn('GOOGLE_SHEETS_WEBHOOK_URL not set — order not saved to Sheet.');
    }

    return NextResponse.json({ ok: true, success: true, orderData, orderId });
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
