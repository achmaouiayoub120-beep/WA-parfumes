/**
 * Constantes globales pour WA Perfumes
 */

// Numéro WhatsApp officiel (sans '+' ni espaces pour l'API wa.me)
const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
export const WHATSAPP_NUMBER = 
  envNumber && envNumber !== '212707525317' 
    ? envNumber 
    : '212785863999';
