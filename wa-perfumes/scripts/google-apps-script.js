function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Commandes");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "L'onglet 'Commandes' est introuvable." })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    
    // Générer l'Order ID (WA-00001)
    const lastRow = sheet.getLastRow();
    let orderNumber = 1;
    if (lastRow > 1) {
      const lastOrderId = sheet.getRange(lastRow, 2).getValue(); // Colonne B
      if (lastOrderId && lastOrderId.toString().startsWith("WA-")) {
        const num = parseInt(lastOrderId.replace("WA-", ""), 10);
        if (!isNaN(num)) {
          orderNumber = num + 1;
        }
      }
    }
    const orderId = "WA-" + orderNumber.toString().padStart(5, '0');
    
    // Date actuelle
    const date = new Date();
    const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

    // Colonnes :
    // A=Date, B=Order ID, C=Nom, D=Téléphone, E=Ville, F=Adresse, G=Produit, H=Quantité, I=Prix Unitaire, J=Prix Total, K=Statut, L=Livraison confirmée, M=Date de livraison
    
    sheet.appendRow([
      formattedDate,        // A: Date
      orderId,              // B: Order ID
      data.fullName,        // C: Nom
      data.phone,           // D: Téléphone
      data.city,            // E: Ville
      data.address,         // F: Adresse
      data.productName,     // G: Produit
      data.quantity,        // H: Quantité
      data.unitPrice,       // I: Prix Unitaire
      data.total,           // J: Prix Total
      "Nouvelle",           // K: Statut
      false,                // L: Livraison confirmée
      ""                    // M: Date de livraison
    ]);

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      orderId: orderId 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
