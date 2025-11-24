console.log("Hello World!");
     
    let prixHT = parseFloat(prompt("Entrez le prix HT :"));

    let prixTTCunite = prixHT + (prixHT * tva / 100);

    let prixTotalTTC = prixTTCunite * quantite;

    console.log("Prix HT :" + prixHT + "€");