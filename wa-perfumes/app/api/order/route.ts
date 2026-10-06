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
      // â”€â”€ WhatsAppDrawer flow â”€â”€
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
        fullName, phone, city, address,
        productName: productNames.join(' + '),
        quantity: totalQuantity,
        unitPrice: unitPrices.length === 1 ? String(unitPrices[0]) : unitPrices.join(' / '),
        total: calculatedTotal,
        // Fallbacks multi-langues
        nomComplet: fullName, nom: fullName,
        telephone: phone, tel: phone,
        ville: city,
        adresse: address,
        produit: productNames.join(' + '),
        quantite: totalQuantity,
        prixUnitaire: unitPrices.length === 1 ? String(unitPrices[0]) : unitPrices.join(' / '),
        prix: calculatedTotal,
        prixTotal: calculatedTotal,
      };
    } else {
      // â”€â”€ SmartOrderForm flow â”€â”€
                  orderData = {
        fullName, phone, city, address,
        productName: body.produit || body.productName || '',
        quantity: body.quantite || body.quantity || 1,
        unitPrice: String(body.prixUnitaire || body.unitPrice || 0),
        total: body.prixTotal || body.total || 0,
        // Fallbacks multi-langues
        nomComplet: fullName, nom: fullName,
        telephone: phone, tel: phone,
        ville: city,
        adresse: address,
        produit: body.produit || body.productName || '',
        quantite: body.quantite || body.quantity || 1,
        prixUnitaire: String(body.prixUnitaire || body.unitPrice || 0),
        prix: body.prixTotal || body.total || 0,
        prixTotal: body.prixTotal || body.total || 0,
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
          if (!sheetResult.success) {
            console.error('Google Sheets API Error:', sheetResult.error);
            return NextResponse.json({ 
              success: false, 
              error: 'Erreur système: Impossible d\'enregistrer la commande. ' + (sheetResult.error || 'Veuillez réessayer.')
            }, { status: 500 });
          }
          if (sheetResult?.orderId) {
            orderId = sheetResult.orderId;
          }
        } catch {
          console.error('Google Sheet response is not JSON:', text.substring(0, 200));
          return NextResponse.json({ 
            success: false, 
            error: 'Erreur serveur: Réponse invalide de la base de données.'
          }, { status: 500 });
        }
      } catch (err: any) {
        console.error('Google Sheet inaccessible:', err);
        return NextResponse.json({ 
          success: false, 
          error: 'Erreur réseau: Impossible de joindre la base de données.'
        }, { status: 500 });
      }
    } else {
      console.error('CRITICAL: GOOGLE_SHEETS_WEBHOOK_URL is not set in environment variables.');
      return NextResponse.json({ 
        success: false, 
        error: 'Erreur de configuration serveur. Webhook manquant.'
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true, success: true, orderData, orderId });
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}



