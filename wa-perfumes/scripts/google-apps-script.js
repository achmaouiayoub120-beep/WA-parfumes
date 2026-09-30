function doPost(e) {
  const lock = LockService.getScriptLock();
  
  try {
    // Wait for up to 10 seconds for other processes to finish.
    lock.waitLock(10000); 

    // 1. Ouvrir le tableur par ID exact (doit correspondre parfaitement Ã  l'URL)
    const spreadsheetId = "1uXfTlz-yXKUaNPHi2PWSLH4tRVFJRi_GYJvv1MDnIYU";
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Impossible d'ouvrir le Spreadsheet via ID. VÃ©rifiez que l'ID est correct et que le script a l'autorisation d'y accÃ©der: " + err.toString() 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Ouvrir l'onglet exact "Commandes"
    const sheet = spreadsheet.getSheetByName("Commandes");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "L'onglet 'Commandes' est introuvable." 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Parser les donnÃ©es envoyÃ©es
    if (!e || !e.postData || !e.postData.contents) {
       return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Aucune donnÃ©e reÃ§ue (e.postData.contents est vide)." 
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

    // 4. GÃ©nÃ©rer un Order ID unique et propre
    const lastRow = sheet.getLastRow();
    let orderNumber = 1;

    // Rechercher le dernier Order ID de bas en haut (colonne B = 2)
    for (let i = lastRow; i > 1; i--) {
      const lastOrderId = sheet.getRange(i, 2).getValue();
      if (lastOrderId && lastOrderId.toString().startsWith("WA-")) {
        const num = parseInt(lastOrderId.toString().replace("WA-", ""), 10);
        if (!isNaN(num)) {
          orderNumber = num + 1;
          break; // TrouvÃ© le plus rÃ©cent
        }
      }
    }
    
    const orderId = "WA-" + orderNumber.toString().padStart(5, '0');
    
    // 5. Formater la date
    const date = new Date();
    const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

    // 6. Ajouter la ligne dans Google Sheets
    try {
      sheet.appendRow([
        formattedDate,                  // A: Date
        orderId,                        // B: Order ID
        data.fullName || "",            // C: Nom
        data.phone || "",               // D: TÃ©lÃ©phone
        data.city || "",                // E: Ville
        data.address || "",             // F: Adresse
        data.productName || "",         // G: Produit
        data.quantity || "",            // H: QuantitÃ©
        data.unitPrice || "",           // I: Prix Unitaire
        data.total || "",               // J: Prix Total
        "Nouvelle",                     // K: Statut
        false,                          // L: Livraison confirmÃ©e
        ""                              // M: Date de livraison
      ]);
    } catch (err) {
       return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Ã‰chec lors de l'Ã©criture dans Google Sheets (appendRow): " + err.toString() 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      orderId: orderId 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Erreur globale d'exÃ©cution: " + error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    // Garantir que le verrou est toujours relÃ¢chÃ©, mÃªme en cas d'erreur
    if (lock) {
      lock.releaseLock();
    }
  }
}
