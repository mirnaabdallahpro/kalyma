import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getBusinessAiSuggestion } from "../../../../services/ai/businessSuggestionService";
import Modal from "../Modal";

function EditBusinessProfileModal({
  profile,
  section,
  onClose,
  onSave,
 
}) {
  const [form, setForm] = useState(profile || {});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiField, setAiField] = useState(null);

  useEffect(() => {
    setForm(profile || {});
    setAiSuggestion(null);
    setAiField(null);
  }, [profile]);

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  /*
  const handleAiSuggestion = async (field) => {
    if (!onAiSuggest) return;

    setAiLoading(true);
    setAiField(field);
    setAiSuggestion(null);

    try {
      const suggestion = await onAiSuggest({
        field,
        value: form[field] || "",
        profile: form,
      });

      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Erreur suggestion IA :", error);
    } finally {
      setAiLoading(false);
    }
  }; */

 const handleAiSuggestion = async (field) => {
  setAiLoading(true);
  setAiField(field);
  setAiSuggestion(null);

  try {
    const result = await getBusinessAiSuggestion({
      field,
      value: form[field] || "",
      profile: form,
    });

    setAiSuggestion(result.suggestion);
  } catch (error) {
    console.error("Erreur suggestion IA :", error);

    setAiSuggestion(
      "Impossible de générer une suggestion pour le moment."
    );
  } finally {
    setAiLoading(false);
  }
};

  const applyAiSuggestion = () => {
    if (!aiSuggestion || !aiField) return;

    update(aiField, aiSuggestion);
    setAiSuggestion(null);
    setAiField(null);
  };

  const sections = {
    identity: {
      title: "Modifier l'identité",
      fields: [
        ["companyName", "Nom de l'entreprise"],
        ["sector", "Secteur"],
        ["location", "Localisation"],
        ["stage", "Stade"],
        ["description", "Description"],
      ],
    },

    strategy: {
      title: "Modifier la vision stratégique",
      fields: [
        ["vision", "Vision"],
        ["mission", "Mission"],
        ["ambition", "Ambition"],
      ],
    },

    positioning: {
      title: "Modifier le positionnement",
      fields: [
        ["positioning", "Positionnement"],
        ["category", "Catégorie"],
        ["problemSolved", "Problème résolu"],
        ["differentiation", "Différenciation"],
      ],
    },

    value: {
      title: "Modifier la proposition de valeur",
      fields: [
        ["valueProposition", "Proposition de valeur"],
      ],
    },

    model: {
      title: "Modifier le Business Model",
      fields: [
        ["businessModel", "Modèle économique"],
        ["targetMarket", "Marché cible"],
      ],
    },
  };

  const currentSection = sections[section];

  if (!currentSection) {
    return null;
  }

  const textareaFields = [
    "description",
    "vision",
    "mission",
    "ambition",
    "positioning",
    "problemSolved",
    "differentiation",
    "valueProposition",
    "businessModel",
    "targetMarket",
  ];

  const selectFields = {
    sector: [
      "Technologie",
      "Finance",
      "Commerce",
      "Services",
      "Industrie",
      "Éducation",
      "Santé",
      "Transport",
      "Immobilier",
      "Agriculture",
      "Tourisme",
      "Autre",
    ],

    location: [
      "Maroc",
      "Tchad",
      "Comores",
      "Sénégal",
      "Côte d’Ivoire",
      "France",
      "Afrique",
      "International",
      "Autre",
    ],

    stage: [
      "Idée",
      "Pré-lancement",
      "Lancement",
      "Premiers clients",
      "Croissance",
      "Expansion",
      "Maturité",
    ],

    category: [
      "B2B",
      "B2C",
      "B2B2C",
      "Marketplace",
      "SaaS",
      "E-commerce",
      "Service",
      "Produit",
      "Plateforme",
      "Autre",
    ],
  };

  const aiFields = [
    "description",
    "vision",
    "mission",
    "ambition",
    "positioning",
    "problemSolved",
    "differentiation",
    "valueProposition",
    "targetMarket",
  ];

  const fieldHasAi = (field) => aiFields.includes(field);

  return (
    <Modal
      title={currentSection.title}
      subtitle="Mettez à jour les informations stratégiques de votre entreprise."
      onClose={onClose}
      width={600}
      footer={
        <>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            type="submit"
            form="business-profile-form"
            className="btn btn-primary"
          >
            Enregistrer
          </button>
        </>
      }
    >
      <form
        id="business-profile-form"
        className="form-grid"
        onSubmit={handleSubmit}
      >
        {currentSection.fields.map(([field, label]) => {
          const isTextarea = textareaFields.includes(field);
          const isSelect = Boolean(selectFields[field]);
          const hasAi = fieldHasAi(field);

          return (
            <div
              className="field field-full"
              key={field}
            >
              <div className="field-label-row">
                <label htmlFor={`business-${field}`}>
                  {label}
                </label>

              {hasAi && (
  <button
    type="button"
    className="ai-suggestion-btn"
    onClick={() => handleAiSuggestion(field)}
    disabled={aiLoading}
    title="Améliorer avec l'IA"
  >
    {aiLoading && aiField === field ? (
      <>
        <Loader2
          size={15}
          strokeWidth={2}
          className="ai-spinner"
        />
        Analyse...
      </>
    ) : (
      <>
        <Sparkles
          size={15}
          strokeWidth={2}
          className="text-primary"
        />
        Améliorer avec l’IA
      </>
    )}
  </button>
)}
              </div>

              {isSelect ? (
                <select
                  id={`business-${field}`}
                  value={form[field] || ""}
                  onChange={(event) =>
                    update(field, event.target.value)
                  }
                >
                  <option value="">
                    Sélectionner...
                  </option>

                  {selectFields[field].map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              ) : isTextarea ? (
                <textarea
                  id={`business-${field}`}
                  value={form[field] || ""}
                  onChange={(event) =>
                    update(field, event.target.value)
                  }
                  rows={4}
                />
              ) : (
                <input
                  id={`business-${field}`}
                  type="text"
                  value={form[field] || ""}
                  onChange={(event) =>
                    update(field, event.target.value)
                  }
                />
              )}

              {aiField === field && aiSuggestion && (
                <div className="ai-suggestion-box">
                  <div className="ai-suggestion-header">
                    <div>
                      <span className="ai-sparkle">✨</span>
                      Suggestion IA
                    </div>

                    <button
                      type="button"
                      className="ai-suggestion-close"
                      onClick={() => {
                        setAiSuggestion(null);
                        setAiField(null);
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div className="ai-suggestion-content">
                    {aiSuggestion}
                  </div>

                  <div className="ai-suggestion-actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setAiSuggestion(null);
                        setAiField(null);
                      }}
                    >
                      Conserver l’actuel
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={applyAiSuggestion}
                    >
                      Utiliser cette suggestion
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </form>
    </Modal>
  );
}

export default EditBusinessProfileModal;