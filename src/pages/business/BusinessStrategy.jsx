import { useState } from "react";

import BusinessCard from "../../components/business/BusinessCard";
import Modal from "../../components/business/Modal";

function BusinessStrategy() {
  const [strategy, setStrategy] = useState({
    vision:
      "Construire une entreprise de référence dans son marché grâce à une croissance rentable, prévisible et durable.",

    mission:
      "Aider les PME à structurer leur stratégie, leur acquisition et leurs opérations afin de transformer leur potentiel en croissance concrète.",

    positioning:
      "Partenaire stratégique des PME B2B qui souhaitent structurer leur système commercial et accélérer leur croissance.",

    icp: {
      sector: "PME B2B",
      size: "10 à 50 employés",
      revenue: "1 à 10 M MAD / an",
      geography: "Maroc",
    },

    differentiators: [
      "Approche stratégique personnalisée",
      "Combinaison conseil + marketing + technologie",
      "Accompagnement dans la durée",
    ],

    priorities: [
      {
        id: 1,
        title: "Clarifier le positionnement",
        description:
          "Affiner la cible, la promesse et la différenciation.",
        status: "in_progress",
        priority: "high",
      },
      {
        id: 2,
        title: "Structurer le système commercial",
        description:
          "Mettre en place un processus de prospection et de conversion prévisible.",
        status: "todo",
        priority: "high",
      },
      {
        id: 3,
        title: "Développer l'acquisition",
        description:
          "Construire une machine d'acquisition basée sur LinkedIn, contenu et SEO.",
        status: "todo",
        priority: "medium",
      },
    ],
  });

  const [editingSection, setEditingSection] =
    useState(null);

  const [priorityModal, setPriorityModal] =
    useState(null);

  const [newPriority, setNewPriority] =
    useState({
      title: "",
      description: "",
      priority: "medium",
    });

  /* =========================================
     SAVE STRATEGY SECTION
  ========================================= */

  const handleSaveSection = (section, value) => {
    setStrategy((current) => ({
      ...current,
      [section]: value,
    }));

    setEditingSection(null);
  };

  /* =========================================
     SAVE ICP
  ========================================= */

  const handleSaveICP = (icp) => {
    setStrategy((current) => ({
      ...current,
      icp,
    }));

    setEditingSection(null);
  };

  /* =========================================
     ADD PRIORITY
  ========================================= */

  const handleAddPriority = (event) => {
    event.preventDefault();

    if (!newPriority.title.trim()) {
      return;
    }

    const priority = {
      id: Date.now(),
      ...newPriority,
      status: "todo",
    };

    setStrategy((current) => ({
      ...current,
      priorities: [
        ...current.priorities,
        priority,
      ],
    }));

    setNewPriority({
      title: "",
      description: "",
      priority: "medium",
    });

    setPriorityModal(null);
  };

  /* =========================================
     TOGGLE PRIORITY STATUS
  ========================================= */

  const togglePriorityStatus = (id) => {
    setStrategy((current) => ({
      ...current,

      priorities: current.priorities.map(
        (priority) => {
          if (priority.id !== id) {
            return priority;
          }

          return {
            ...priority,
            status:
              priority.status === "done"
                ? "todo"
                : "done",
          };
        }
      ),
    }));
  };

  /* =========================================
     DELETE PRIORITY
  ========================================= */

  const deletePriority = (id) => {
    setStrategy((current) => ({
      ...current,

      priorities: current.priorities.filter(
        (priority) =>
          priority.id !== id
      ),
    }));
  };

  return (
    <div className="business-strategy-page">

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
          <span>Maturité stratégique</span>

          <strong>78%</strong>

          <small>
            Bonne base · À renforcer
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
            >
              Modifier
            </button>
          }
        >
          <div className="strategy-big-text">
            {strategy.vision}
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
            >
              Modifier
            </button>
          }
        >
          <div className="strategy-big-text">
            {strategy.mission}
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
              setEditingSection("positioning")
            }
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
              {strategy.positioning}
            </h2>

          </div>

          <div className="strategy-positioning-status">

            <span className="strategy-status-dot" />

            <div>
              <strong>Positionnement défini</strong>

              <small>
                Votre positionnement est exploitable
                mais peut encore être différencié.
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
          >
            Modifier
          </button>
        }
      >

        <div className="strategy-icp-grid">

          <StrategyData
            label="Secteur"
            value={strategy.icp.sector}
          />

          <StrategyData
            label="Taille"
            value={strategy.icp.size}
          />

          <StrategyData
            label="Chiffre d'affaires"
            value={strategy.icp.revenue}
          />

          <StrategyData
            label="Zone géographique"
            value={strategy.icp.geography}
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
              setEditingSection("differentiators")
            }
          >
            Modifier
          </button>
        }
      >

        <div className="strategy-differentiators">

          {strategy.differentiators.map(
            (item, index) => (
              <div
                className="strategy-differentiator"
                key={index}
              >
                <span>
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <p>{item}</p>
              </div>
            )
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
          >
            + Ajouter
          </button>
        }
      >

        <div className="strategy-priorities">

          {strategy.priorities.map(
            (priority, index) => (
              <StrategyPriority
                key={priority.id}
                priority={priority}
                index={index}
                onToggle={() =>
                  togglePriorityStatus(
                    priority.id
                  )
                }
                onDelete={() =>
                  deletePriority(
                    priority.id
                  )
                }
              />
            )
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

          <span>KALYMA AI · ANALYSE STRATÉGIQUE</span>

          <h3>
            Votre prochaine priorité devrait
            être la différenciation.
          </h3>

          <p>
            Votre vision et votre cible sont
            relativement claires. Le principal
            risque actuel est que votre
            positionnement reste trop proche des
            alternatives existantes.
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
          EDIT MODAL
      ===================================== */}

      {editingSection &&
        editingSection !== "icp" &&
        editingSection !==
          "differentiators" && (
          <StrategyTextModal
            title={getSectionTitle(
              editingSection
            )}
            value={
              strategy[editingSection]
            }
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
          onClose={() =>
            setEditingSection(null)
          }
          onSave={handleSaveICP}
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
              >
                Annuler
              </button>

              <button
                type="submit"
                form="priority-form"
                className="btn btn-primary"
              >
                Ajouter
              </button>
            </>
          }
        >

          <form
            id="priority-form"
            onSubmit={handleAddPriority}
            className="business-form"
          >

            <label>
              Nom de la priorité

              <input
                value={newPriority.title}
                onChange={(event) =>
                  setNewPriority({
                    ...newPriority,
                    title:
                      event.target.value,
                  })
                }
                placeholder="Ex. Structurer le système commercial"
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
                  setNewPriority({
                    ...newPriority,
                    description:
                      event.target.value,
                  })
                }
                placeholder="Décrivez ce que vous souhaitez accomplir."
              />
            </label>

            <label>
              Niveau de priorité

              <select
                value={
                  newPriority.priority
                }
                onChange={(event) =>
                  setNewPriority({
                    ...newPriority,
                    priority:
                      event.target.value,
                  })
                }
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
        {String(index + 1).padStart(
          2,
          "0"
        )}
      </div>

      <div className="strategy-priority-content">

        <div className="strategy-priority-title">

          <strong>
            {priority.title}
          </strong>

          <span
            className={`priority-badge ${priority.priority}`}
          >
            {priority.priority === "high"
              ? "Prioritaire"
              : priority.priority ===
                "medium"
              ? "Important"
              : "Secondaire"}
          </span>

        </div>

        <p>
          {priority.description}
        </p>

      </div>

      <span
        className={`strategy-priority-status ${priority.status}`}
      >
        {priority.status === "done"
          ? "Terminé"
          : priority.status ===
            "in_progress"
          ? "En cours"
          : "À faire"}
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
  onClose,
  onSave,
}) {
  const [text, setText] =
    useState(value);

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
          >
            Annuler
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onSave(text)
            }
          >
            Enregistrer
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
  onClose,
  onSave,
}) {
  const [form, setForm] =
    useState(initialValue);

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
          >
            Annuler
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              onSave(form)
            }
          >
            Enregistrer
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
          />
        </label>

      </div>

    </Modal>
  );
}

/* =========================================
   HELPERS
========================================= */

function getSectionTitle(section) {
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

export default BusinessStrategy;