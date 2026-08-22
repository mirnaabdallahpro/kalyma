import { useState } from "react";
import { bulkImportProspects } from "../../../services/crm";
import { autoDetectMapping, parseSpreadsheetFile } from "../../utils/prospectImport";
import Modal from "../shared/Modal";

const FIELD_OPTIONS = [
  { value: "", label: "Ignorer" },
  { value: "companyName", label: "Entreprise *" },
  { value: "contactName", label: "Contact" },
  { value: "contactEmail", label: "Email" },
  { value: "contactPhone", label: "Téléphone" },
  { value: "source", label: "Source" },
  { value: "amount", label: "Montant" },
  { value: "notes", label: "Notes" },
];

function ImportProspectsModal({ offers, onClose, onImported }) {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [offerId, setOfferId] = useState(offers[0]?.id || "");
  const [stage, setStage] = useState("lead");
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    try {
      const rows = await parseSpreadsheetFile(file);
      const detectedHeaders = Object.keys(rows[0]);
      setHeaders(detectedHeaders);
      setRawRows(rows);
      setMapping(autoDetectMapping(detectedHeaders));
      setFileName(file.name);
      setStep(2);
    } catch (err) {
      setError(err.message || "Fichier invalide.");
    }
  };

  const updateMapping = (header, field) => {
    setMapping((prev) => ({ ...prev, [header]: field }));
  };

  const mappedRows = () =>
    rawRows.map((row) => {
      const mapped = {};
      headers.forEach((header) => {
        const field = mapping[header];
        if (field) mapped[field] = row[header];
      });
      return mapped;
    });

  const companyMapped = Object.values(mapping).includes("companyName");

  const goToPreview = () => {
    if (!companyMapped) {
      setError("Associe au moins une colonne au champ Entreprise pour continuer.");
      return;
    }
    if (!offerId) {
      setError("Choisis l'offre à associer aux prospects importés.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleImport = async () => {
    setImporting(true);
    setError("");
    try {
      const rows = mappedRows().filter((r) => r.companyName && String(r.companyName).trim());
      const { created, relanceCount } = await bulkImportProspects(rows, { offerId, stage });
      setResult({ count: created.length, relanceCount });
      onImported();
    } catch (err) {
      setError(err.message || "L'import a échoué.");
    } finally {
      setImporting(false);
    }
  };

  const preview = mappedRows().slice(0, 5);

  return (
    <Modal
      title="Importer des prospects"
      subtitle={fileName || "Fichier CSV ou Excel"}
      onClose={onClose}
      width={640}
      footer={
        step === 2 ? (
          <>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="button" className="btn btn-primary" onClick={goToPreview}>
              Aperçu →
            </button>
          </>
        ) : step === 3 && !result ? (
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(2)}
              disabled={importing}
            >
              ← Retour
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? "Import en cours…" : `Importer ${rawRows.length} prospects`}
            </button>
          </>
        ) : result ? (
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Fermer
          </button>
        ) : null
      }
    >
      {error && <div className="import-error">{error}</div>}

      {step === 1 && (
        <div className="import-upload">
          <p>
            Importe un fichier CSV ou Excel, peu importe comment il a été créé —
            les colonnes entreprise, contact, email, téléphone, source, montant
            et notes sont détectées automatiquement.
          </p>

          <label className="import-dropzone">
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} hidden />
            <span>Choisir un fichier</span>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="import-mapping">
          <p className="import-hint">
            {rawRows.length} ligne{rawRows.length > 1 ? "s" : ""} détectée
            {rawRows.length > 1 ? "s" : ""}. Vérifie la correspondance des
            colonnes, corrige si besoin.
          </p>

          <div className="import-mapping-list">
            {headers.map((header) => (
              <div className="import-mapping-row" key={header}>
                <span className="import-source-col">{header}</span>
                <span className="import-arrow">→</span>
                <select
                  value={mapping[header] || ""}
                  onChange={(e) => updateMapping(header, e.target.value)}
                >
                  {FIELD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="form-grid" style={{ marginTop: 18 }}>
            <div className="field">
              <label>Offre à associer</label>
              <select value={offerId} onChange={(e) => setOfferId(e.target.value)}>
                {offers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Étape de départ</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="lead">Lead</option>
                <option value="qualification">Qualification</option>
                <option value="nurturing">Nurturing</option>
                <option value="rdv">RDV</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 3 && !result && (
        <div className="import-preview">
          <p className="import-hint">
            Aperçu des {Math.min(5, rawRows.length)} premières lignes sur{" "}
            {rawRows.length} :
          </p>

          <div className="import-preview-table-wrap">
            <table className="import-preview-table">
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Source</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i}>
                    <td>{r.companyName || "—"}</td>
                    <td>{r.contactName || "—"}</td>
                    <td>{r.contactEmail || "—"}</td>
                    <td>{r.contactPhone || "—"}</td>
                    <td>{r.source || "—"}</td>
                    <td>{r.amount || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div className="import-success">
          <p>
            ✓ {result.count} prospect{result.count > 1 ? "s" : ""} importé
            {result.count > 1 ? "s" : ""} avec succès, en stade{" "}
            <strong>{stage}</strong>, rattaché{result.count > 1 ? "s" : ""} à
            l&apos;offre choisie.
          </p>
          {result.relanceCount > 0 && (
            <p>
              {result.relanceCount} relance{result.relanceCount > 1 ? "s" : ""}{" "}
              programmée{result.relanceCount > 1 ? "s" : ""} automatiquement.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

export default ImportProspectsModal;