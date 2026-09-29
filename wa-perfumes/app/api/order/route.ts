import { NextResponse } from 'next/server';
import { MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import { UNISEX_PRODUCTS } from '@/data/products/unisex';

const ALL_PRODUCTS = [...MEN_PRODUCTS, ...WOMEN_PRODUCTS, ...UNISEX_PRODUCTS];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support both the WhatsAppDrawer format (fullName) and SmartOrderForm format (nomComplet)
    const nomComplet = body.nomComplet || body.fullName;
    const telephone = body.telephone || body.phone;
    const adresse = body.adresse || body.address;
    const ville = body.ville || body.city;

    if (!nomComplet || !telephone || !adresse) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('GOOGLE_SHEET_WEBHOOK_URL non dǸfini — commande non enregistrǸe dans le Sheet.');
      return NextResponse.json({ ok: true, sheet: 'skipped' });
    }

    // Prepare data to send to webhook
    let orderData = body;
    if (body.cartItems) {
      // Legacy WhatsAppDrawer logic for sheet payload formatting
      let calculatedTotal = 0;
      let totalQuantity = 0;
      const productNames: string[] = [];
      const unitPrices: number[] = [];

      for (const item of body.cartItems) {
        const serverProduct = ALL_PRODUCTS.find(p => p.id === item.id);
        if (serverProduct) {
          const price = typeof serverProduct.price === 'string' ? parseFloat(serverProduct.price as string) : serverProduct.price;
          calculatedTotal += price * item.quantity;
          totalQuantity += item.quantity;
          productNames.push(serverProduct.name + " (" + item.selectedVolume + ") x" + item.quantity);
          unitPrices.push(price);
        }
      }
      
      orderData = {
        fullName: nomComplet,
        phone: telephone.replace(/\s+/g, ''),
        city: ville,
        address: adresse,
        productName: productNames.join(' + '),
        quantity: totalQuantity,
        unitPrice: unitPrices.length === 1 ? unitPrices[0].toString() : 'Multiple',
        total: calculatedTotal
      };
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      console.error('Google Sheet inaccessible:', err);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Erreur API:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
