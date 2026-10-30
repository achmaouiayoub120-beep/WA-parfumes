import { NextResponse } from 'next/server';
import { getProductById, PACK_DISCOVERY_PRICE } from '@/lib/products';

interface OrderItemInput {
  productId: string;
  volume: string;
  quantity: number;
  packDetails?: string;
}

interface OrderRequestBody {
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  items: OrderItemInput[];
  hp?: string; // Honeypot field
  renderedAt?: number; // Form display timestamp
}

interface OrderResponseData {
  productName: string;
  quantity: number;
  unitPrice: string;
  total: number;
}

// In-memory IP rate limiter (sliding window: max 10 orders per 10 minutes per IP)
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  // Clean old entries periodically
  if (ipRateLimitMap.size > 1000) {
    for (const [key, val] of ipRateLimitMap.entries()) {
      if (val.resetAt < now) ipRateLimitMap.delete(key);
    }
  }

  if (!record || record.resetAt < now) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

function sanitizeText(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Trop de requêtes. Veuillez patienter avant de réessayer.' },
        { status: 429 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Données de formulaire invalides.' },
        { status: 400 }
      );
    }

    const payload = body as Partial<OrderRequestBody>;

    // 2. Anti-spam : Honeypot
    if (payload.hp && typeof payload.hp === 'string' && payload.hp.trim().length > 0) {
      return NextResponse.json(
        { success: false, error: 'Requête suspecte.' },
        { status: 400 }
      );
    }

    // 3. Anti-spam : Délai minimal entre affichage et soumission (1,5 seconde)
    if (payload.renderedAt && typeof payload.renderedAt === 'number') {
      const elapsed = Date.now() - payload.renderedAt;
      if (elapsed > 0 && elapsed < 1500) {
        return NextResponse.json(
          { success: false, error: 'Veuillez prendre le temps de compléter le formulaire.' },
          { status: 400 }
        );
      }
    }

    // 4. Validation du client
    const customer = payload.customer;
    if (!customer || typeof customer !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Informations de livraison incomplètes.' },
        { status: 400 }
      );
    }

    const name = sanitizeText(customer.name);
    const rawPhone = sanitizeText(customer.phone);
    const city = sanitizeText(customer.city);
    const address = sanitizeText(customer.address);

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { success: false, error: 'Nom invalide (2 à 80 caractères requis).' },
        { status: 400 }
      );
    }

    // Validation téléphone marocain (06, 07 ou +212 6/7)
    const cleanPhone = rawPhone.replace(/[\s\-\.]/g, '');
    const phoneRegex = /^(?:(?:\+?212)|0)[67]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Numéro de téléphone marocain invalide (format 06/07... ou +212...).' },
        { status: 400 }
      );
    }

    if (city.length < 2 || city.length > 60) {
      return NextResponse.json(
        { success: false, error: 'Ville invalide.' },
        { status: 400 }
      );
    }

    if (address.length < 5 || address.length > 250) {
      return NextResponse.json(
        { success: false, error: 'Adresse de livraison incomplète (minimum 5 caractères).' },
        { status: 400 }
      );
    }

    // 5. Validation et calcul serveur des prix et produits
    const items = payload.items;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Le panier est vide.' },
        { status: 400 }
      );
    }

    let calculatedTotal = 0;
    let totalQuantity = 0;
    const itemNames: string[] = [];
    const itemUnitPrices: number[] = [];

    for (const item of items) {
      if (!item || typeof item !== 'object') {
        return NextResponse.json(
          { success: false, error: 'Article invalide.' },
          { status: 400 }
        );
      }

      const quantity = Math.floor(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return NextResponse.json(
          { success: false, error: 'Quantité non autorisée (entre 1 et 10 par article).' },
          { status: 400 }
        );
      }

      if (item.productId === 'pack-decouverte') {
        // Pack Découverte 5 Parfums
        const unitPrice = PACK_DISCOVERY_PRICE;
        const packTitle = item.packDetails
          ? sanitizeText(item.packDetails)
          : 'Coffret Découverte 5 Parfums (5x30ml)';

        calculatedTotal += unitPrice * quantity;
        totalQuantity += quantity;
        itemNames.push(`${packTitle} x${quantity}`);
        itemUnitPrices.push(unitPrice);
      } else {
        // Parfum standard du catalogue
        const product = getProductById(item.productId);
        if (!product) {
          return NextResponse.json(
            { success: false, error: 'Produit non reconnu dans le catalogue.' },
            { status: 400 }
          );
        }

        const requestedVolume = sanitizeText(item.volume).toLowerCase();
        const availableVolumes = product.volumes || [{ size: product.volume, price: product.price }];
        const matchedVolume = availableVolumes.find(
          (v) => v.size.toLowerCase() === requestedVolume
        );

        if (!matchedVolume) {
          return NextResponse.json(
            { success: false, error: `Contenance non disponible pour ${product.name}.` },
            { status: 400 }
          );
        }

        const unitPrice = matchedVolume.price;
        calculatedTotal += unitPrice * quantity;
        totalQuantity += quantity;
        itemNames.push(`${product.name} (${matchedVolume.size}) x${quantity}`);
        itemUnitPrices.push(unitPrice);
      }
    }

    const orderData: OrderResponseData = {
      productName: itemNames.join(' + '),
      quantity: totalQuantity,
      unitPrice: itemUnitPrices.length === 1 ? String(itemUnitPrices[0]) : itemUnitPrices.join(' / '),
      total: calculatedTotal,
    };

    // 6. Enregistrement Google Sheets (si webhook configuré)
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let orderId = `WA-${Date.now().toString().slice(-5)}`;

    if (webhookUrl) {
      try {
        const sheetPayload = {
          fullName: name,
          phone: cleanPhone,
          city,
          address,
          productName: orderData.productName,
          quantity: orderData.quantity,
          unitPrice: orderData.unitPrice,
          total: orderData.total,
          nomComplet: name,
          telephone: cleanPhone,
          ville: city,
          adresse: address,
        };

        const gRes = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetPayload),
        });

        const text = await gRes.text();
        try {
          const sheetResult = JSON.parse(text);
          if (sheetResult && typeof sheetResult === 'object' && sheetResult.orderId) {
            orderId = String(sheetResult.orderId);
          }
        } catch {
          // Si le webhook renvoie un format non-JSON, on conserve l'orderId généré
        }
      } catch {
        // En cas d'indisponibilité du webhook, on ne bloque pas la commande client
      }
    }

    // Journalisation anonymisée sans données personnelles
    console.info(`[Order] ID: ${orderId} | Items: ${totalQuantity} | Total: ${calculatedTotal} MAD`);

    return NextResponse.json({
      ok: true,
      success: true,
      orderId,
      orderData,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Une erreur est survenue lors du traitement de votre commande.' },
      { status: 500 }
    );
  }
}
