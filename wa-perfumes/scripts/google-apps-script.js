function doPost(e) {
  // Configurer un verrou pour éviter les conflits si plusieurs commandes arrivent en même temps
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // Attend jusqu'à 10 secondes

  try {
    // 1. Ouvrir le tableur par ID exact pour vérifier que le contexte Web App n'échoue pas
    // L'ID provient de l'URL du tableur: https://docs.google.com/spreadsheets/d/1uXfTlz_yXKUaNPHi2PWSLH4tRVFJRi_GYJvv1MDnlYU/edit
    const spreadsheetId = "1uXfTlz_yXKUaNPHi2PWSLH4tRVFJRi_GYJvv1MDnlYU";
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Impossible d'ouvrir le Spreadsheet via ID. Vérifiez l'ID: " + err.toString() 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Ouvrir l'onglet "Commandes"
    const sheet = spreadsheet.getSheetByName("Commandes");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "L'onglet 'Commandes' est introuvable dans le spreadsheet." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Parser les données envoyées
    if (!e || !e.postData || !e.postData.contents) {
       return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Aucune donnée reçue (e.postData.contents est vide)." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Erreur de parsing JSON: " + err.toString() 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Générer un Order ID unique et propre
    const lastRow = sheet.getLastRow();
    let orderNumber = 1;

    // Rechercher le dernier Order ID de bas en haut (colonne B = 2)
    for (let i = lastRow; i > 1; i--) {
      const lastOrderId = sheet.getRange(i, 2).getValue();
      if (lastOrderId && lastOrderId.toString().startsWith("WA-")) {
        const num = parseInt(lastOrderId.toString().replace("WA-", ""), 10);
        if (!isNaN(num)) {
          orderNumber = num + 1;
          break; // Trouvé
        }
      }
    }
    
    const orderId = "WA-" + orderNumber.toString().padStart(5, '0');
    
    // 5. Formater la date
    const date = new Date();
    const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

    // 6. Ajouter la ligne
    sheet.appendRow([
      formattedDate,                  // A: Date
      orderId,                        // B: Order ID
      data.fullName || "",            // C: Nom
      data.phone || "",               // D: Téléphone
      data.city || "",                // E: Ville
      data.address || "",             // F: Adresse
      data.productName || "",         // G: Produit
      data.quantity || "",            // H: Quantité
      data.unitPrice || "",           // I: Prix Unitaire
      data.total || "",               // J: Prix Total
      "Nouvelle",                     // K: Statut
      false,                          // L: Livraison confirmée
      ""                              // M: Date de livraison
    ]);

    // Relâcher le verrou
    if (lock) lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      orderId: orderId 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    if (typeof lock !== 'undefined' && lock) lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
