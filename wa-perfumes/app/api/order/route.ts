import { NextResponse } from 'next/server';
import { MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';

const ALL_PRODUCTS = [...MEN_PRODUCTS, ...WOMEN_PRODUCTS];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, city, address, cartItems } = body;

    // 1. Validation minimale
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ success: false, error: 'Nom invalide' }, { status: 400 });
    }
    if (!phone || !/^(06|07)\d{8}$/.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json({ success: false, error: 'Numéro de téléphone invalide (doit commencer par 06 ou 07 et contenir 10 chiffres)' }, { status: 400 });
    }
    if (!city) {
      return NextResponse.json({ success: false, error: 'Ville requise' }, { status: 400 });
    }
    if (!address || address.length < 5) {
      return NextResponse.json({ success: false, error: 'Adresse trop courte' }, { status: 400 });
    }
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Panier vide' }, { status: 400 });
    }

    // 2. Vérification des prix et calcul du total côté serveur (Sécurité)
    let calculatedTotal = 0;
    let totalQuantity = 0;
    const productNames: string[] = [];
    const unitPrices: number[] = [];

    for (const item of cartItems) {
      const serverProduct = ALL_PRODUCTS.find(p => p.id === item.id);
      if (!serverProduct) {
        return NextResponse.json({ success: false, error: `Produit introuvable: ${item.id}` }, { status: 400 });
      }
      // On suppose que le prix unitaire est dans selectedPrice pour le volume donné, 
      // ici dans wa-perfumes tous les parfums sont à 50 DH, on vérifie via serverProduct.price
      // Pour être sûr, on utilise le prix du serveur
      const price = typeof serverProduct.price === 'string' ? parseFloat(serverProduct.price) : serverProduct.price;
      
      calculatedTotal += price * item.quantity;
      totalQuantity += item.quantity;
      productNames.push(`${serverProduct.name} (${item.selectedVolume}) x${item.quantity}`);
      unitPrices.push(price);
    }

    const productNameString = productNames.join(' + ');
    const unitPriceString = unitPrices.length === 1 ? unitPrices[0].toString() : 'Multiple';

    // 3. Envoyer à Google Apps Script
    const scriptUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    if (!scriptUrl) {
      console.error('Erreur: GOOGLE_SHEETS_WEBHOOK_URL non défini');
      return NextResponse.json({ success: false, error: 'Erreur de configuration serveur' }, { status: 500 });
    }

    const orderData = {
      fullName,
      phone: phone.replace(/\s+/g, ''), // Nettoyage
      city,
      address,
      productName: productNameString,
      quantity: totalQuantity,
      unitPrice: unitPriceString,
      total: calculatedTotal
    };

    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.success) {
      return NextResponse.json({
        success: true,
        orderId: result.orderId,
        orderData
      });
    } else {
      console.error('Erreur Google Sheets:', result.error);
      return NextResponse.json({ success: false, error: "Erreur lors de l'enregistrement de la commande" }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Erreur API:', error);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
