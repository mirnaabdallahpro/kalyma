import { useEffect, useMemo, useState } from "react";

import { Sparkles } from "lucide-react";
import BusinessCard from "../../components/business/BusinessCard";
import Modal from "../../components/business/Modal";

import {
  createBusinessStrategyPriority,
  deleteBusinessStrategyPriority,
  getBusinessStrategyPriorities,
  getBusinessStrategyProfile,
  updateBusinessStrategyPriorityStatus,
} from "../../../services/businessStrategyService";

import { updateBusinessProfile } from "../../../services/businessProfileService";


function BusinessStrategy() {
  /* =========================================
     STATE
  ========================================= */

  const [strategy, setStrategy] = useState(null);

  const [priorities, setPriorities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const [editingSection, setEditingSection] =
    useState(null);

    const [aiLoading, setAiLoading] =
    useState(false);

  const [aiSuggestions, setAiSuggestions] =
    useState([]);

  const [priorityModal, setPriorityModal] =
    useState(null);

  const [newPriority, setNewPriority] =
    useState({
      title: "",
      description: "",
      priority: "medium",
    });


  /* =========================================
     LOAD STRATEGY
  ========================================= */

  useEffect(() => {
    loadStrategy();
  }, []);


  async function loadStrategy() {
    try {
      setLoading(true);
      setError("");

      const [
        profile,
        strategyPriorities,
      ] = await Promise.all([
        getBusinessStrategyProfile(),
        getBusinessStrategyPriorities(),
      ]);

      if (!profile) {
        setStrategy(null);
        setPriorities([]);
        return;
      }

      setStrategy({
        id: profile.id,

        vision:
          profile.vision ?? "",

        mission:
          profile.mission ?? "",

        positioning:
          profile.positioning ?? "",

        icp: {
          sector:
            profile.icp_sector ?? "",

          size:
            profile.icp_size ?? "",

          revenue:
            profile.icp_revenue ?? "",

          geography:
            profile.icp_geography ?? "",
        },

        differentiators:
          Array.isArray(
            profile.differentiators
          )
            ? profile.differentiators
            : [],
      });

      setPriorities(
        strategyPriorities ?? []
      );

    } catch (err) {
      console.error(
        "Erreur chargement stratégie :",
        err
      );

      setError(
        "Impossible de charger votre stratégie."
      );

    } finally {
      setLoading(false);
    }
  }


  /* =========================================
     STRATEGIC MATURITY SCORE
  ========================================= */

  const strategicScore = useMemo(() => {
    if (!strategy) {
      return 0;
    }

    let score = 0;

    if (
      strategy.vision?.trim()
    ) {
      score += 20;
    }

    if (
      strategy.mission?.trim()
    ) {
      score += 20;
    }

    if (
      strategy.positioning?.trim()
    ) {
      score += 20;
    }

    const icpComplete =
      strategy.icp?.sector?.trim() &&
      strategy.icp?.size?.trim() &&
      strategy.icp?.revenue?.trim() &&
      strategy.icp?.geography?.trim();

    if (icpComplete) {
      score += 20;
    }

    if (
      strategy.differentiators?.length > 0
    ) {
      score += 20;
    }

    return score;
  }, [strategy]);


  const strategicScoreLabel =
    strategicScore >= 80
      ? "Très bonne base"
      : strategicScore >= 60
      ? "Bonne base · À renforcer"
      : strategicScore >= 40
      ? "En construction"
      : "À structurer";


  /* =========================================
     SAVE TEXT SECTION
  ========================================= */

  async function handleSaveSection(
    section,
    value
  ) {
    try {
      setSaving(true);
      setError("");

      const updates = {};

      if (section === "vision") {
        updates.vision = value;
      }

      if (section === "mission") {
        updates.mission = value;
      }

      if (section === "positioning") {
        updates.positioning = value;
      }

      const updatedProfile =
        await updateBusinessProfile(
          updates
        );

      setStrategy((current) => ({
        ...current,

        vision:
          updatedProfile.vision ??
          current.vision,

        mission:
          updatedProfile.mission ??
          current.mission,

        positioning:
          updatedProfile.positioning ??
          current.positioning,
      }));

      setEditingSection(null);

    } catch (err) {
      console.error(
        "Erreur sauvegarde stratégie :",
        err
      );

      setError(
        "Impossible d'enregistrer cette modification."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =========================================
     SAVE ICP
  ========================================= */

  async function handleSaveICP(icp) {
    try {
      setSaving(true);
      setError("");

      const updatedProfile =
        await updateBusinessProfile({
          icpSector: icp.sector,
          icpSize: icp.size,
          icpRevenue: icp.revenue,
          icpGeography:
            icp.geography,
        });

      setStrategy((current) => ({
        ...current,

        icp: {
          sector:
            updatedProfile.icp_sector ??
            icp.sector,

          size:
            updatedProfile.icp_size ??
            icp.size,

          revenue:
            updatedProfile.icp_revenue ??
            icp.revenue,

          geography:
            updatedProfile.icp_geography ??
            icp.geography,
        },
      }));

      setEditingSection(null);

    } catch (err) {
      console.error(
        "Erreur sauvegarde ICP :",
        err
      );

      setError(
        "Impossible d'enregistrer votre client idéal."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =========================================
     SAVE DIFFERENTIATORS
  ========================================= */

  async function handleSaveDifferentiators(
    differentiators
  ) {
    try {
      setSaving(true);
      setError("");

      const updatedProfile =
        await updateBusinessProfile({
          differentiators,
        });

      setStrategy((current) => ({
        ...current,

        differentiators:
          updatedProfile.differentiators ??
          differentiators,
      }));

      setEditingSection(null);

    } catch (err) {
      console.error(
        "Erreur sauvegarde différenciation :",
        err
      );

      setError(
        "Impossible d'enregistrer vos éléments de différenciation."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =========================================
     ADD PRIORITY
  ========================================= */

  async function handleAddPriority(event) {
    event.preventDefault();

    if (
      !newPriority.title.trim()
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const createdPriority =
        await createBusinessStrategyPriority(
          {
            title:
              newPriority.title.trim(),

            description:
              newPriority.description.trim(),

            priority:
              newPriority.priority,

            status: "todo",
          }
        );

      setPriorities((current) => [
        ...current,
        createdPriority,
      ]);

      setNewPriority({
        title: "",
        description: "",
        priority: "medium",
      });

      setPriorityModal(null);

    } catch (err) {
      console.error(
        "Erreur création priorité :",
        err
      );

      setError(
        "Impossible de créer cette priorité."
      );

    } finally {
      setSaving(false);
    }
  }


  /* =========================================
     TOGGLE PRIORITY STATUS
  ========================================= */

  async function togglePriorityStatus(
    priority
  ) {
    const nextStatus =
      priority.status === "done"
        ? "todo"
        : "done";

    try {
      setError("");

      const updatedPriority =
        await updateBusinessStrategyPriorityStatus(
          priority.id,
          nextStatus
        );

      setPriorities((current) =>
        current.map((item) =>
          item.id === priority.id
            ? {
                ...item,
                ...updatedPriority,
              }
            : item
        )
      );

    } catch (err) {
      console.error(
        "Erreur changement statut :",
        err
      );

      setError(
        "Impossible de modifier le statut."
      );
    }
  }


  /* =========================================
     DELETE PRIORITY
  ========================================= */

  async function handleDeletePriority(
    id
  ) {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer cette priorité ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBusinessStrategyPriority(
        id
      );

      setPriorities((current) =>
        current.filter(
          (priority) =>
            priority.id !== id
        )
      );

    } catch (err) {
      console.error(
        "Erreur suppression priorité :",
        err
      );

      setError(
        "Impossible de supprimer cette priorité."
      );
    }
  }


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="business-strategy-page">

        <div className="business-page-header">
          <div>
            <span className="business-page-eyebrow">
              BUSINESS / STRATÉGIE
            </span>

            <h1>Stratégie</h1>

            <p>
              Chargement de votre stratégie...
            </p>
          </div>
        </div>

        <div className="business-loading">
          Chargement...
        </div>

      </div>
    );
  }


  /* =========================================
     NO PROFILE
  ========================================= */

  if (!strategy) {
    return (
      <div className="business-strategy-page">

        <div className="business-page-header">

          <div>
            <span className="business-page-eyebrow">
              BUSINESS / STRATÉGIE
            </span>

            <h1>Stratégie</h1>

            <p>
              Votre profil business n'est pas
              encore disponible.
            </p>
          </div>

        </div>

        <BusinessCard
          title="Stratégie indisponible"
          subtitle="Commencez par compléter votre profil business."
        >
          <p>
            Votre stratégie sera automatiquement
            disponible une fois votre profil
            business créé.
          </p>
        </BusinessCard>

      </div>
    );
  }


  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="business-strategy-page">

      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="business-alert business-alert-error">
          {error}
        </div>
      )}


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="business-page-header">

        <div>

          <span className="business-page-eyebrow">
            BUSINESS / STRATÉGIE
          </span>

          <h1>Stratégie</h1>

          <p>
            Définissez la direction stratégique
            de votre entreprise.
          </p>

        </div>


        <div className="business-strategy-score">

          <span>
            Maturité stratégique
          </span>

          <strong>
            {strategicScore}%
          </strong>

          <small>
            {strategicScoreLabel}
          </small>

        </div>

      </div>


      {/* =====================================
          STRATEGIC FOUNDATION
      ===================================== */}

      <section className="strategy-foundation">

        <BusinessCard
          title="Vision"
          subtitle="Où voulez-vous emmener votre entreprise ?"
          action={
            <button
              type="button"
              className="business-edit-button"
              onClick={() =>
                setEditingSection("vision")
              }
              disabled={saving}
            >
              Modifier
            </button>
          }
        >

          <div className="strategy-big-text">

            {strategy.vision ||
              "Votre vision n'est pas encore définie."}

          </div>

        </BusinessCard>


        <BusinessCard
          title="Mission"
          subtitle="Pourquoi votre entreprise existe-t-elle ?"
          action={
            <button
              type="button"
              className="business-edit-button"
              onClick={() =>
                setEditingSection("mission")
              }
              disabled={saving}
            >
              Modifier
            </button>
          }
        >

          <div className="strategy-big-text">

            {strategy.mission ||
              "Votre mission n'est pas encore définie."}

          </div>

        </BusinessCard>

      </section>


      {/* =====================================
          POSITIONING
      ===================================== */}

      <BusinessCard
        title="Positionnement"
        subtitle="La place que votre entreprise souhaite occuper dans l'esprit de son marché."
        action={
          <button
            type="button"
            className="business-edit-button"
            onClick={() =>
              setEditingSection(
                "positioning"
              )
            }
            disabled={saving}
          >
            Modifier
          </button>
        }
      >

        <div className="strategy-positioning">

          <div className="strategy-positioning-main">

            <span className="strategy-label">
              Positionnement actuel
            </span>

            <h2>

              {strategy.positioning ||
                "Votre positionnement n'est pas encore défini."}

            </h2>

          </div>


          <div className="strategy-positioning-status">

            <span className="strategy-status-dot" />

            <div>

              <strong>
                {strategy.positioning
                  ? "Positionnement défini"
                  : "Positionnement à définir"}
              </strong>

              <small>

                {strategy.positioning
                  ? "Votre positionnement est exploitable mais peut encore être différencié."
                  : "Définissez clairement la place que votre entreprise souhaite occuper."}

              </small>

            </div>

          </div>

        </div>

      </BusinessCard>


      {/* =====================================
          ICP
      ===================================== */}

      <BusinessCard
        title="Client idéal"
        subtitle="Le profil de client pour lequel votre offre crée le plus de valeur."
        action={
          <button
            type="button"
            className="business-edit-button"
            onClick={() =>
              setEditingSection("icp")
            }
            disabled={saving}
          >
            Modifier
          </button>
        }
      >

        <div className="strategy-icp-grid">

          <StrategyData
            label="Secteur"
            value={
              strategy.icp.sector ||
              "Non défini"
            }
          />

          <StrategyData
            label="Taille"
            value={
              strategy.icp.size ||
              "Non définie"
            }
          />

          <StrategyData
            label="Chiffre d'affaires"
            value={
              strategy.icp.revenue ||
              "Non défini"
            }
          />

          <StrategyData
            label="Zone géographique"
            value={
              strategy.icp.geography ||
              "Non définie"
            }
          />

        </div>

      </BusinessCard>


      {/* =====================================
          DIFFERENTIATION
      ===================================== */}

      <BusinessCard
        title="Différenciation"
        subtitle="Pourquoi un client devrait-il vous choisir plutôt qu'une alternative ?"
        action={
          <button
            type="button"
            className="business-edit-button"
            onClick={() =>
              setEditingSection(
                "differentiators"
              )
            }
            disabled={saving}
          >
            Modifier
          </button>
        }
      >

        <div className="strategy-differentiators">

          {strategy.differentiators.length >
          0 ? (
            strategy.differentiators.map(
              (item, index) => (
                <div
                  className="strategy-differentiator"
                  key={`${item}-${index}`}
                >

                  <span>
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </span>

                  <p>{item}</p>

                </div>
              )
            )
          ) : (
            <div className="strategy-empty-state">
              Aucun élément de différenciation
              n'a encore été défini.
            </div>
          )}

        </div>

      </BusinessCard>


      {/* =====================================
          PRIORITIES
      ===================================== */}

      <BusinessCard
        title="Priorités stratégiques"
        subtitle="Les quelques chantiers qui doivent faire avancer votre entreprise maintenant."
        action={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              setPriorityModal("new")
            }
            disabled={saving}
          >
            + Ajouter
          </button>
        }
      >

        <div className="strategy-priorities">

          {priorities.length > 0 ? (

            priorities.map(
              (priority, index) => (

                <StrategyPriority
                  key={priority.id}
                  priority={priority}
                  index={index}
                  onToggle={() =>
                    togglePriorityStatus(
                      priority
                    )
                  }
                  onDelete={() =>
                    handleDeletePriority(
                      priority.id
                    )
                  }
                />

              )
            )

          ) : (

            <div className="strategy-empty-state">

              <strong>
                Aucune priorité stratégique
              </strong>

              <p>
                Ajoutez les chantiers qui doivent
                faire avancer votre entreprise.
              </p>

            </div>

          )}

        </div>

      </BusinessCard>


      {/* =====================================
          AI INSIGHT
      ===================================== */}

      <div className="strategy-ai-card">

        <div className="strategy-ai-icon">
          ✦
        </div>

        <div className="strategy-ai-content">

          <span>
            KALYMA AI · ANALYSE STRATÉGIQUE
          </span>

          <h3>
            {getStrategicInsight(
              strategy
            ).title}
          </h3>

          <p>
            {getStrategicInsight(
              strategy
            ).description}
          </p>

        </div>

        <button
          type="button"
          className="strategy-ai-button"
        >
          Approfondir →
        </button>

      </div>


      {/* =====================================
          TEXT MODAL
      ===================================== */}

      {editingSection &&
        [
          "vision",
          "mission",
          "positioning",
        ].includes(
          editingSection
        ) && (

          <StrategyTextModal
            title={getSectionTitle(
              editingSection
            )}
            value={
              strategy[
                editingSection
              ]
            }
            saving={saving}
            onClose={() =>
              setEditingSection(null)
            }
            onSave={(value) =>
              handleSaveSection(
                editingSection,
                value
              )
            }
          />

        )}


      {/* =====================================
          ICP MODAL
      ===================================== */}

      {editingSection === "icp" && (

        <ICPModal
          initialValue={strategy.icp}
          saving={saving}
          onClose={() =>
            setEditingSection(null)
          }
          onSave={handleSaveICP}
        />

      )}


      {/* =====================================
          DIFFERENTIATORS MODAL
      ===================================== */}

      {editingSection ===
        "differentiators" && (

        <DifferentiatorsModal
          initialValue={
            strategy.differentiators
          }
          saving={saving}
          onClose={() =>
            setEditingSection(null)
          }
          onSave={
            handleSaveDifferentiators
          }
          aiLoading={aiLoading }
          aiSuggestions ={aiSuggestions }
        />

      )}


      {/* =====================================
          PRIORITY MODAL
      ===================================== */}

      {priorityModal === "new" && (

        <Modal
          title="Nouvelle priorité"
          subtitle="Ajoutez un chantier stratégique à votre roadmap."
          onClose={() =>
            setPriorityModal(null)
          }
          footer={
            <>

              <button
                type="button"
                className="business-modal-cancel"
                onClick={() =>
                  setPriorityModal(null)
                }
                disabled={saving}
              >
                Annuler
              </button>

              <button
                type="submit"
                form="priority-form"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Enregistrement..."
                  : "Ajouter"}
              </button>

            </>
          }
        >

          <form
            id="priority-form"
            onSubmit={
              handleAddPriority
            }
            className="business-form"
          >

            <label>
              Nom de la priorité

              <input
                value={
                  newPriority.title
                }
                onChange={(event) =>
                  setNewPriority(
                    (current) => ({
                      ...current,
                      title:
                        event.target.value,
                    })
                  )
                }
                placeholder="Ex. Structurer le système commercial"
                disabled={saving}
              />

            </label>


            <label>
              Description

              <textarea
                rows="4"
                value={
                  newPriority.description
                }
                onChange={(event) =>
                  setNewPriority(
                    (current) => ({
                      ...current,
                      description:
                        event.target.value,
                    })
                  )
                }
                placeholder="Décrivez ce que vous souhaitez accomplir."
                disabled={saving}
              />

            </label>


            <label>
              Niveau de priorité

              <select
                value={
                  newPriority.priority
                }
                onChange={(event) =>
                  setNewPriority(
                    (current) => ({
                      ...current,
                      priority:
                        event.target.value,
                    })
                  )
                }
                disabled={saving}
              >

                <option value="high">
                  Haute
                </option>

                <option value="medium">
                  Moyenne
                </option>

                <option value="low">
                  Faible
                </option>

              </select>

            </label>

          </form>

        </Modal>

      )}

    </div>
  );
}


/* =========================================
   DATA
========================================= */

function StrategyData({
  label,
  value,
}) {
  return (
    <div className="strategy-data">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


/* =========================================
   PRIORITY
========================================= */

function StrategyPriority({
  priority,
  index,
  onToggle,
  onDelete,
}) {
  return (
    <div
      className={`strategy-priority ${
        priority.status === "done"
          ? "completed"
          : ""
      }`}
    >

      <button
        type="button"
        className="strategy-priority-check"
        onClick={onToggle}
        aria-label="Changer le statut"
      >
        {priority.status === "done"
          ? "✓"
          : ""}
      </button>


      <div className="strategy-priority-number">

        {String(
          index + 1
        ).padStart(2, "0")}

      </div>


      <div className="strategy-priority-content">

        <div className="strategy-priority-title">

          <strong>
            {priority.title}
          </strong>

          <span
            className={`priority-badge ${priority.priority}`}
          >
            {getPriorityLabel(
              priority.priority
            )}
          </span>

        </div>


        <p>
          {priority.description}
        </p>

      </div>


      <span
        className={`strategy-priority-status ${priority.status}`}
      >
        {getStatusLabel(
          priority.status
        )}
      </span>


      <button
        type="button"
        className="strategy-delete-button"
        onClick={onDelete}
        title="Supprimer"
      >
        ×
      </button>

    </div>
  );
}


/* =========================================
   TEXT MODAL
========================================= */

function StrategyTextModal({
  title,
  value,
  saving,
  onClose,
  onSave,
}) {
  const [text, setText] =
    useState(value ?? "");

  return (
    <Modal
      title={title}
      subtitle="Modifiez cet élément de votre stratégie."
      onClose={onClose}
      footer={
        <>

          <button
            type="button"
            className="business-modal-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Annuler
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onSave(text)
            }
            disabled={saving}
          >
            {saving
              ? "Enregistrement..."
              : "Enregistrer"}
          </button>

        </>
      }
    >

      <div className="business-form">

        <label>
          Contenu

          <textarea
            rows="6"
            value={text}
            onChange={(event) =>
              setText(
                event.target.value
              )
            }
            disabled={saving}
          />

        </label>

      </div>

    </Modal>
  );
}


/* =========================================
   ICP MODAL
========================================= */

function ICPModal({
  initialValue,
  saving,
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState({
      sector:
        initialValue?.sector ?? "",

      size:
        initialValue?.size ?? "",

      revenue:
        initialValue?.revenue ?? "",

      geography:
        initialValue?.geography ?? "",
    });


  const update = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };


  return (
    <Modal
      title="Client idéal"
      subtitle="Définissez précisément votre ICP."
      onClose={onClose}
      footer={
        <>

          <button
            type="button"
            className="business-modal-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Annuler
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onSave(form)
            }
            disabled={saving}
          >
            {saving
              ? "Enregistrement..."
              : "Enregistrer"}
          </button>

        </>
      }
    >

      <div className="business-form">

        <label>
          Secteur

          <input
            value={form.sector}
            onChange={(event) =>
              update(
                "sector",
                event.target.value
              )
            }
            disabled={saving}
          />

        </label>


        <label>
          Taille

          <input
            value={form.size}
            onChange={(event) =>
              update(
                "size",
                event.target.value
              )
            }
            disabled={saving}
          />

        </label>


        <label>
          Chiffre d'affaires

          <input
            value={form.revenue}
            onChange={(event) =>
              update(
                "revenue",
                event.target.value
              )
            }
            disabled={saving}
          />

        </label>


        <label>
          Zone géographique

          <input
            value={form.geography}
            onChange={(event) =>
              update(
                "geography",
                event.target.value
              )
            }
            disabled={saving}
          />

        </label>

      </div>

    </Modal>
  );
}


/* =========================================
   DIFFERENTIATORS MODAL
========================================= */

function DifferentiatorsModal({
  initialValue,
  saving,
  aiLoading,
  aiSuggestions,
  onClose,
  onSave,
}) {
  const [items, setItems] =
    useState(
      Array.isArray(initialValue)
        ? initialValue
        : []
    );


  function updateItem(
    index,
    value
  ) {
    setItems((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? value
            : item
      )
    );
  }


  function addItem() {
    setItems((current) => [
      ...current,
      "",
    ]);
  }


  function removeItem(index) {
    setItems((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }


  function handleSave() {
    const cleanedItems =
      items
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);

    onSave(cleanedItems);
  }

  /* =========================================
     AI SUGGESTIONS
  ========================================= */

  const handleAiSuggestion = async () => {
    try {
      setAiLoading(true);
      setAiSuggestions([]);

      /*
       * Ici nous brancherons ensuite
       * ton service IA / Edge Function Supabase.
       *
       * Exemple :
       *
       * const suggestions =
       *   await generateDifferentiationSuggestions();
       *
       * setAiSuggestions(suggestions);
       */

      // TEMPORAIRE : simulation
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      setAiSuggestions([
        "Une approche stratégique personnalisée qui combine conseil, marketing et technologie pour transformer les ambitions de croissance en résultats mesurables.",

        "Un accompagnement de bout en bout qui associe réflexion stratégique et mise en œuvre opérationnelle, là où les alternatives se limitent souvent au conseil.",

        "Une approche orientée résultats qui permet aux PME B2B de structurer leur acquisition et leur système commercial avec un accompagnement personnalisé dans la durée.",
      ]);

    } catch (error) {
      console.error(
        "Erreur génération IA :",
        error
      );
    } finally {
      setAiLoading(false);
    }
  };


  /* =========================================
     USE AI SUGGESTION
  ========================================= */

  const useAiSuggestion = (
    suggestion
  ) => {

    /*
     * On cherche d'abord un champ vide.
     * Sinon on ajoute automatiquement
     * une nouvelle différenciation.
     */

    const emptyIndex =
      items.findIndex(
        (item) =>
          !item ||
          !item.trim()
      );

    if (emptyIndex !== -1) {

      updateItem(
        emptyIndex,
        suggestion
      );

    } else {

      setItems((current) => [
        ...current,
        suggestion,
      ]);

    }

    setAiSuggestions([]);
  };




  return (
     <Modal
      title="Différenciation"
      subtitle="Définissez les éléments qui rendent votre entreprise différente."
      onClose={onClose}
      footer={
        <>

          <button
            type="button"
            className="business-modal-cancel"
            onClick={onClose}
            disabled={saving}
          >
            Annuler
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Enregistrement..."
              : "Enregistrer"}
          </button>

        </>
      }
    >

      <div className="business-form">

        {/* =====================================
            AI ACTION
        ===================================== */}

        <div className="ai-assistant-card">

          <div className="ai-assistant-content">

            <div className="ai-assistant-icon">
              <Sparkles
                size={17}
                strokeWidth={2}
              />
            </div>

            <div>

              <strong>
                Besoin d'inspiration ?
              </strong>

              <p>
                Laissez Kalyma AI identifier
                des pistes de différenciation
                à partir de votre profil.
              </p>

            </div>

          </div>

          <button
            type="button"
            className="ai-suggestion-btn"
            onClick={
              handleAiSuggestion
            }
            disabled={
              aiLoading ||
              saving
            }
          >

            <Sparkles
              size={15}
              strokeWidth={2}
            />

            {aiLoading
              ? "Analyse..."
              : "Générer avec l’IA"}

          </button>

        </div>


        {/* =====================================
            AI SUGGESTIONS
        ===================================== */}

        {aiSuggestions.length > 0 && (

          <div className="ai-suggestions-list">

            <div className="ai-suggestions-header">

              <div>

                <Sparkles
                  size={15}
                  strokeWidth={2}
                />

                <strong>
                  Suggestions IA
                </strong>

              </div>

              <button
                type="button"
                className="ai-suggestion-close"
                onClick={() =>
                  setAiSuggestions([])
                }
              >
                ×
              </button>

            </div>


            {aiSuggestions.map(
              (
                suggestion,
                index
              ) => (

                <div
                  className="ai-suggestion-item"
                  key={index}
                >

                  <div className="ai-suggestion-number">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="ai-suggestion-text">
                    {suggestion}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      useAiSuggestion(
                        suggestion
                      )
                    }
                  >
                    Utiliser
                  </button>

                </div>

              )
            )}

          </div>

        )}


        {/* =====================================
            DIFFERENTIATION FIELDS
        ===================================== */}

        <div className="strategy-differentiation-fields">

          {items.map(
            (item, index) => (

              <div
                className="strategy-differentiator-form-row"
                key={index}
              >

                <div className="strategy-differentiator-form-index">
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </div>

                <input
                  value={item}
                  onChange={(event) =>
                    updateItem(
                      index,
                      event.target.value
                    )
                  }
                  placeholder={`Élément ${
                    index + 1
                  }`}
                  disabled={saving}
                />

                <button
                  type="button"
                  className="strategy-delete-button"
                  onClick={() =>
                    removeItem(index)
                  }
                  disabled={
                    saving
                  }
                  title="Supprimer"
                >
                  ×
                </button>

              </div>

            )
          )}

        </div>


        {/* =====================================
            ADD
        ===================================== */}

        <button
          type="button"
          className="business-edit-button"
          onClick={addItem}
          disabled={saving}
        >
          + Ajouter un élément
        </button>

      </div>

    </Modal>
  );
}


/* =========================================
   HELPERS
========================================= */

function getSectionTitle(
  section
) {
  switch (section) {

    case "vision":
      return "Vision";

    case "mission":
      return "Mission";

    case "positioning":
      return "Positionnement";

    default:
      return "Modifier";
  }
}


function getPriorityLabel(
  priority
) {
  switch (priority) {

    case "high":
      return "Prioritaire";

    case "medium":
      return "Important";

    case "low":
      return "Secondaire";

    default:
      return "Important";
  }
}


function getStatusLabel(
  status
) {
  switch (status) {

    case "done":
      return "Terminé";

    case "in_progress":
      return "En cours";

    case "todo":
      return "À faire";

    default:
      return "À faire";
  }
}


/* =========================================
   AI INSIGHT
========================================= */

function getStrategicInsight(
  strategy
) {
  if (!strategy.vision?.trim()) {
    return {
      title:
        "Votre prochaine étape devrait être de clarifier votre vision.",

      description:
        "Une vision claire permet de donner une direction cohérente aux décisions stratégiques et aux priorités de votre entreprise.",
    };
  }


  if (!strategy.mission?.trim()) {
    return {
      title:
        "Votre mission mérite encore d'être clarifiée.",

      description:
        "Votre mission doit expliquer clairement pourquoi votre entreprise existe et quelle transformation elle cherche à créer pour ses clients.",
    };
  }


  if (!strategy.positioning?.trim()) {
    return {
      title:
        "Votre prochaine priorité devrait être le positionnement.",

      description:
        "Votre entreprise a besoin d'une position clairement identifiable pour être comprise et différenciée par son marché.",
    };
  }


  const icpComplete =
    strategy.icp?.sector?.trim() &&
    strategy.icp?.size?.trim() &&
    strategy.icp?.revenue?.trim() &&
    strategy.icp?.geography?.trim();


  if (!icpComplete) {
    return {
      title:
        "Votre prochaine priorité devrait être de préciser votre client idéal.",

      description:
        "Votre positionnement sera plus puissant lorsque votre ICP sera suffisamment précis pour guider vos décisions commerciales et marketing.",
    };
  }


  if (
    !strategy.differentiators ||
    strategy.differentiators.length === 0
  ) {
    return {
      title:
        "Votre prochaine priorité devrait être la différenciation.",

      description:
        "Votre vision, votre mission et votre cible sont relativement claires. Le prochain enjeu consiste à identifier pourquoi votre marché devrait vous choisir plutôt qu'une alternative.",
    };
  }


  return {
    title:
      "Votre fondation stratégique est bien structurée.",

    description:
      "Les principaux éléments de votre stratégie sont renseignés. La prochaine étape consiste maintenant à transformer cette stratégie en priorités concrètes et mesurables.",
  };
}


export default BusinessStrategy;