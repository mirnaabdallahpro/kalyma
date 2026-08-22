import * as XLSX from "xlsx";

const FIELD_ALIASES = {
  companyName: [
    "entreprise",
    "societe",
    "company",
    "nom entreprise",
    "nom de l entreprise",
    "client",
    "organisation",
    "raison sociale",
    "business",
    "nom du client",
    "nom societe",
  ],
  contactName: [
    "contact",
    "nom",
    "nom contact",
    "nom du contact",
    "interlocuteur",
    "full name",
    "name",
    "prenom nom",
    "responsable",
  ],
  contactEmail: ["email", "mail", "e mail", "adresse email", "courriel"],
  contactPhone: [
    "telephone",
    "tel",
    "phone",
    "numero",
    "numero de telephone",
    "mobile",
    "gsm",
    "whatsapp",
    "numero tel",
  ],
  source: ["source", "origine", "canal", "provenance"],
  amount: [
    "montant",
    "budget",
    "valeur",
    "prix",
    "amount",
    "value",
    "montant estime",
    "montant estimatif",
    "ca potentiel",
  ],
  notes: ["notes", "note", "commentaire", "commentaires", "remarque", "remarques", "description", "details"],
};

function normalizeHeader(str) {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreMatch(normalizedHeader, normalizedAlias) {
  if (normalizedHeader === normalizedAlias) return 100;
  if (normalizedHeader.includes(normalizedAlias) || normalizedAlias.includes(normalizedHeader)) return 70;
  return 0;
}

// Propose automatiquement un mapping { header: champ } à partir
// des en-têtes détectées dans le fichier, quel que soit leur libellé exact.
export function autoDetectMapping(headers) {
  const mapping = {};

  headers.forEach((header) => {
    const normalized = normalizeHeader(header);
    let bestField = "";
    let bestScore = 0;

    Object.entries(FIELD_ALIASES).forEach(([field, aliases]) => {
      aliases.forEach((alias) => {
        const score = scoreMatch(normalized, alias);
        if (score > bestScore) {
          bestScore = score;
          bestField = field;
        }
      });
    });

    mapping[header] = bestScore >= 70 ? bestField : "";
  });

  return mapping;
}

// Lit un fichier CSV ou Excel (peu importe l'outil qui l'a généré)
// et retourne un tableau d'objets { enTete: valeur } pour chaque ligne.
export function parseSpreadsheetFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
          reject(new Error("Le fichier ne contient aucune feuille exploitable."));
          return;
        }

        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!rows.length) {
          reject(new Error("Le fichier ne contient aucune ligne de données."));
          return;
        }

        resolve(rows);
      } catch (err) {
        reject(
          new Error("Impossible de lire ce fichier. Vérifie qu'il s'agit bien d'un CSV ou Excel valide.")
        );
      }
    };

    reader.onerror = () => reject(new Error("Erreur de lecture du fichier."));
    reader.readAsArrayBuffer(file);
  });
}