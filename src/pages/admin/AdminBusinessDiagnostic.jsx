import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getAdminBusinessClientDetail,
} from "../../../services/admin/adminBusinessService";

import {
    createAdminBusinessDiagnostic,
} from "../../../services/admin/adminBusinessDiagnosticService";


function AdminBusinessDiagnostic() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [form, setForm] = useState({
    business_score: 0,

    synthesis_title: "",
    synthesis_description: "",

    strength_dimension: "",
    strength_score: null,

    priority_dimension: "",
    priority_score: null,

    next_action_title: "",
    next_action_description: "",

    dimensions: [],

    recommendations: [],
  });


  useEffect(() => {
    if (clientId) {
      loadClient();
    }
  }, [clientId]);


  async function loadClient() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getAdminBusinessClientDetail(
          clientId
        );

      setClient(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Impossible de charger le client."
      );
    } finally {
      setLoading(false);
    }
  }


  const business =
    client?.business_profiles?.[0] ??
    null;

  const offers =
    client?.business_offers ?? [];

  const goals =
    client?.business_goals ?? [];

  const priorities =
    client?.business_strategy_priorities ??
    [];


  const fullName = useMemo(() => {
    if (!client) {
      return "";
    }

    return (
      `${client.first_name ?? ""} ${
        client.last_name ?? ""
      }`
    ).trim();
  }, [client]);


  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }


  function updateDimension(
    index,
    field,
    value
  ) {
    setForm((previous) => {
      const dimensions = [
        ...previous.dimensions,
      ];

      dimensions[index] = {
        ...dimensions[index],
        [field]: value,
      };

      return {
        ...previous,
        dimensions,
      };
    });
  }


  function updateRecommendation(
    index,
    field,
    value
  ) {
    setForm((previous) => {
      const recommendations = [
        ...previous.recommendations,
      ];

      recommendations[index] = {
        ...recommendations[index],
        [field]: value,
      };

      return {
        ...previous,
        recommendations,
      };
    });
  }


  function addDimension() {
    setForm((previous) => ({
      ...previous,

      dimensions: [
        ...previous.dimensions,

        {
          key: "",
          label: "",
          score: 0,
          status: "medium",
          description: "",
        },
      ],
    }));
  }


  function removeDimension(index) {
    setForm((previous) => ({
      ...previous,

      dimensions:
        previous.dimensions.filter(
          (_, currentIndex) =>
            currentIndex !== index
        ),
    }));
  }


  function addRecommendation() {
    setForm((previous) => ({
      ...previous,

      recommendations: [
        ...previous.recommendations,

        {
          priority: "medium",
          title: "",
          description: "",
          impact: "Moyen",
        },
      ],
    }));
  }


  function removeRecommendation(index) {
    setForm((previous) => ({
      ...previous,

      recommendations:
        previous.recommendations.filter(
          (_, currentIndex) =>
            currentIndex !== index
        ),
    }));
  }


  async function handleGenerate() {
    try {
      setGenerating(true);
      setError(null);

      const diagnostic =
        await createAdminBusinessDiagnostic(
          clientId,
          {
            ...form,

            source: "admin",

            status: "ready",
          }
        );

      navigate(
        `/admin/business/${clientId}/diagnostic/${diagnostic.id}`
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Impossible de générer le diagnostic."
      );
    } finally {
      setGenerating(false);
    }
  }


  if (loading) {
    return (
      <div className="admin-business-page">
        Chargement du diagnostic...
      </div>
    );
  }


  if (error && !client) {
    return (
      <div className="admin-business-page">

        <p>{error}</p>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate(
              `/admin/business/${clientId}`
            )
          }
        >
          Retour au client
        </button>

      </div>
    );
  }


  if (!client) {
    return null;
  }


  return (
    <div className="admin-business-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="admin-page-header">

        <div>

          <button
            type="button"
            className="admin-business-back"
            onClick={() =>
              navigate(
                `/admin/business/${clientId}`
              )
            }
          >
            ← Retour au client
          </button>

          <span className="admin-page-eyebrow">
            ADMIN / BUSINESS / DIAGNOSTIC
          </span>

          <h1>
            Diagnostic stratégique
          </h1>

          <p>
            {fullName ||
              client.email}

            {business?.company_name
              ? ` — ${business.company_name}`
              : ""}
          </p>

        </div>

      </div>


      {error && (
        <div className="admin-business-error">
          {error}
        </div>
      )}


      {/* =========================================
          CONTEXTE CLIENT
      ========================================= */}

      <div className="admin-business-diagnostic-context">

        <div>
          <span>ENTREPRISE</span>

          <strong>
            {business?.company_name ||
              "Non renseignée"}
          </strong>
        </div>

        <div>
          <span>SECTEUR</span>

          <strong>
            {business?.sector ||
              "Non renseigné"}
          </strong>
        </div>

        <div>
          <span>STADE</span>

          <strong>
            {business?.stage ||
              "Non renseigné"}
          </strong>
        </div>

        <div>
          <span>OFFRES</span>

          <strong>
            {offers.length}
          </strong>
        </div>

        <div>
          <span>OBJECTIFS</span>

          <strong>
            {goals.length}
          </strong>
        </div>

        <div>
          <span>PRIORITÉS</span>

          <strong>
            {priorities.length}
          </strong>
        </div>

      </div>


      {/* =========================================
          SCORE
      ========================================= */}

      <AdminDiagnosticSection
        title="Score Business"
        subtitle="Évaluation globale de la maturité actuelle."
      >

        <div className="admin-diagnostic-score-editor">

          <div>

            <span>
              SCORE BUSINESS
            </span>

            <input
              type="number"
              min="0"
              max="100"
              value={
                form.business_score
              }
              onChange={(event) =>
                updateField(
                  "business_score",
                  Number(
                    event.target.value
                  )
                )
              }
            />

            <small>/100</small>

          </div>

        </div>

      </AdminDiagnosticSection>


      {/* =========================================
          SYNTHÈSE
      ========================================= */}

      <AdminDiagnosticSection
        title="Synthèse"
        subtitle="Résumé stratégique du diagnostic."
      >

        <div className="admin-diagnostic-form-grid">

          <Field
            label="Titre"
            value={
              form.synthesis_title
            }
            onChange={(value) =>
              updateField(
                "synthesis_title",
                value
              )
            }
          />

          <TextAreaField
            label="Synthèse"
            value={
              form.synthesis_description
            }
            onChange={(value) =>
              updateField(
                "synthesis_description",
                value
              )
            }
          />

        </div>

      </AdminDiagnosticSection>


      {/* =========================================
          POINT FORT / PRIORITÉ
      ========================================= */}

      <AdminDiagnosticSection
        title="Points clés"
        subtitle="Le point fort et le principal levier de progression."
      >

        <div className="admin-diagnostic-form-grid">

          <Field
            label="Point fort"
            value={
              form.strength_dimension
            }
            onChange={(value) =>
              updateField(
                "strength_dimension",
                value
              )
            }
          />

          <NumberField
            label="Score du point fort"
            value={
              form.strength_score
            }
            onChange={(value) =>
              updateField(
                "strength_score",
                value
              )
            }
          />

          <Field
            label="Priorité"
            value={
              form.priority_dimension
            }
            onChange={(value) =>
              updateField(
                "priority_dimension",
                value
              )
            }
          />

          <NumberField
            label="Score de la priorité"
            value={
              form.priority_score
            }
            onChange={(value) =>
              updateField(
                "priority_score",
                value
              )
            }
          />

        </div>

      </AdminDiagnosticSection>


      {/* =========================================
          DIMENSIONS
      ========================================= */}

      <AdminDiagnosticSection
        title="Dimensions"
        subtitle="Évaluation des fondamentaux du business."
      >

        <div className="admin-diagnostic-dimensions">

          {form.dimensions.map(
            (dimension, index) => (
              <div
                className="admin-diagnostic-dimension-editor"
                key={index}
              >

                <div className="admin-diagnostic-editor-header">

                  <strong>
                    Dimension {index + 1}
                  </strong>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      removeDimension(
                        index
                      )
                    }
                  >
                    Supprimer
                  </button>

                </div>

                <div className="admin-diagnostic-form-grid">

                  <Field
                    label="Clé"
                    value={
                      dimension.key
                    }
                    onChange={(value) =>
                      updateDimension(
                        index,
                        "key",
                        value
                      )
                    }
                  />

                  <Field
                    label="Nom"
                    value={
                      dimension.label
                    }
                    onChange={(value) =>
                      updateDimension(
                        index,
                        "label",
                        value
                      )
                    }
                  />

                  <NumberField
                    label="Score"
                    value={
                      dimension.score
                    }
                    onChange={(value) =>
                      updateDimension(
                        index,
                        "score",
                        value
                      )
                    }
                  />

                  <SelectField
                    label="Statut"
                    value={
                      dimension.status
                    }
                    options={[
                      {
                        value: "strong",
                        label: "Solide",
                      },
                      {
                        value: "medium",
                        label: "À optimiser",
                      },
                      {
                        value: "weak",
                        label: "Prioritaire",
                      },
                    ]}
                    onChange={(value) =>
                      updateDimension(
                        index,
                        "status",
                        value
                      )
                    }
                  />

                  <TextAreaField
                    label="Description"
                    value={
                      dimension.description
                    }
                    onChange={(value) =>
                      updateDimension(
                        index,
                        "description",
                        value
                      )
                    }
                  />

                </div>

              </div>
            )
          )}

        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={addDimension}
        >
          + Ajouter une dimension
        </button>

      </AdminDiagnosticSection>


      {/* =========================================
          RECOMMANDATIONS
      ========================================= */}

      <AdminDiagnosticSection
        title="Recommandations"
        subtitle="Actions prioritaires identifiées."
      >

        <div className="admin-diagnostic-recommendations">

          {form.recommendations.map(
            (
              recommendation,
              index
            ) => (
              <div
                className="admin-diagnostic-recommendation-editor"
                key={index}
              >

                <div className="admin-diagnostic-editor-header">

                  <strong>
                    Recommandation{" "}
                    {index + 1}
                  </strong>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() =>
                      removeRecommendation(
                        index
                      )
                    }
                  >
                    Supprimer
                  </button>

                </div>

                <div className="admin-diagnostic-form-grid">

                  <Field
                    label="Titre"
                    value={
                      recommendation.title
                    }
                    onChange={(value) =>
                      updateRecommendation(
                        index,
                        "title",
                        value
                      )
                    }
                  />

                  <SelectField
                    label="Priorité"
                    value={
                      recommendation.priority
                    }
                    options={[
                      {
                        value: "high",
                        label: "Prioritaire",
                      },
                      {
                        value: "medium",
                        label: "À travailler",
                      },
                    ]}
                    onChange={(value) =>
                      updateRecommendation(
                        index,
                        "priority",
                        value
                      )
                    }
                  />

                  <TextAreaField
                    label="Description"
                    value={
                      recommendation.description
                    }
                    onChange={(value) =>
                      updateRecommendation(
                        index,
                        "description",
                        value
                      )
                    }
                  />

                  <Field
                    label="Impact"
                    value={
                      recommendation.impact
                    }
                    onChange={(value) =>
                      updateRecommendation(
                        index,
                        "impact",
                        value
                      )
                    }
                  />

                </div>

              </div>
            )
          )}

        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={addRecommendation}
        >
          + Ajouter une recommandation
        </button>

      </AdminDiagnosticSection>


      {/* =========================================
          PROCHAINE ACTION
      ========================================= */}

      <AdminDiagnosticSection
        title="Prochaine action"
        subtitle="Le prochain levier à travailler."
      >

        <div className="admin-diagnostic-form-grid">

          <Field
            label="Titre"
            value={
              form.next_action_title
            }
            onChange={(value) =>
              updateField(
                "next_action_title",
                value
              )
            }
          />

          <TextAreaField
            label="Description"
            value={
              form.next_action_description
            }
            onChange={(value) =>
              updateField(
                "next_action_description",
                value
              )
            }
          />

        </div>

      </AdminDiagnosticSection>


      {/* =========================================
          ACTIONS
      ========================================= */}

      <div className="admin-diagnostic-actions">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate(
              `/admin/business/${clientId}`
            )
          }
        >
          Annuler
        </button>

        <button
          type="button"
          className="btn btn-primary"
          disabled={generating}
          onClick={handleGenerate}
        >
          {generating
            ? "Génération..."
            : "Générer le diagnostic"}
        </button>

      </div>

    </div>
  );
}


/* =========================================
   SECTION
========================================= */

function AdminDiagnosticSection({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="admin-diagnostic-section">

      <div className="admin-diagnostic-section-header">

        <div>
          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

      </div>

      <div className="admin-diagnostic-section-body">
        {children}
      </div>

    </section>
  );
}


/* =========================================
   FIELDS
========================================= */

function Field({
  label,
  value,
  onChange,
}) {
  return (
    <label className="admin-diagnostic-field">

      <span>{label}</span>

      <input
        type="text"
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

    </label>
  );
}


function NumberField({
  label,
  value,
  onChange,
}) {
  return (
    <label className="admin-diagnostic-field">

      <span>{label}</span>

      <input
        type="number"
        min="0"
        max="100"
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value === ""
              ? null
              : Number(
                  event.target.value
                )
          )
        }
      />

    </label>
  );
}


function TextAreaField({
  label,
  value,
  onChange,
}) {
  return (
    <label className="admin-diagnostic-field admin-diagnostic-field-full">

      <span>{label}</span>

      <textarea
        rows="4"
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

    </label>
  );
}


function SelectField({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label className="admin-diagnostic-field">

      <span>{label}</span>

      <select
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      >

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </label>
  );
}


export default AdminBusinessDiagnostic;