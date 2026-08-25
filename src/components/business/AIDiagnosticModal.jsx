import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import {
  createBusinessDiagnostic,
  setCurrentBusinessDiagnostic,
} from "../../../services/businessDiagnostics";
import { createDiagnosticTasks } from "../../../services/tasks";
import Modal from "./Modal";


function AIDiagnosticModal({ profile, onClose }) {
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosticId, setDiagnosticId] = useState(null);
  const [creatingTasks, setCreatingTasks] = useState(false);
const [tasksCreated, setTasksCreated] = useState(false);

  useEffect(() => {
    if (profile) {
      generateDiagnostic();
    }
  }, [profile]);

  async function handleCreateTasks() {
  try {
    setCreatingTasks(true);

    await createDiagnosticTasks(
      diagnostic.priorities,
      diagnosticId,
      profile
    );

    setTasksCreated(true);
  } catch (err) {
    console.error(
      "Erreur création des tâches :",
      err
    );

    setError(
      "Impossible de créer les tâches à partir du diagnostic."
    );
  } finally {
    setCreatingTasks(false);
  }
}


/*
  async function generateDiagnostic() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke(
        "business-ai-diagnostic",
        {
          body: {
            profile,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (!data?.success || !data?.diagnostic) {
        throw new Error(
          data?.error || "Diagnostic invalide."
        );
      }

      setDiagnostic(data.diagnostic);
    } catch (err) {
      console.error(
        "Erreur génération diagnostic :",
        err
      );

      setError(
        err?.message ||
          "Impossible de générer le diagnostic."
      );
    } finally {
      setLoading(false);
    }
  }

  */

  async function generateDiagnostic() {
  try {
    setLoading(true);
    setError(null);
    setTasksCreated(false);

    const { data, error } =
      await supabase.functions.invoke(
        "business-ai-diagnostic",
        {
          body: {
            profile,
          },
        }
      );

    if (error) {
      throw error;
    }

    if (!data?.success || !data?.diagnostic) {
      throw new Error(
        data?.error || "Diagnostic invalide."
      );
    }

    const aiDiagnostic = data.diagnostic;

    // ─────────────────────────────
    // 1. Identifier les éléments clés
    // ─────────────────────────────

    const strongestPoint =
      [...(aiDiagnostic.points || [])]
        .sort((a, b) => b.score - a.score)[0];

    const weakestPoint =
      [...(aiDiagnostic.points || [])]
        .sort((a, b) => a.score - b.score)[0];

    const firstPriority =
      aiDiagnostic.priorities?.[0] || null;

    // ─────────────────────────────
    // 2. Créer le diagnostic en BDD
    // ─────────────────────────────

   const savedDiagnostic =
  await createBusinessDiagnostic({
    source: "ai",

    business_score:
      aiDiagnostic.overallScore ?? 0,

    synthesis_title:
      "Diagnostic stratégique",

    synthesis_description:
      aiDiagnostic.summary ?? "",

    strength_dimension:
      strongestPoint?.key ?? null,

    strength_score:
      strongestPoint?.score ?? null,

    priority_dimension:
      weakestPoint?.key ?? null,

    priority_score:
      weakestPoint?.score ?? null,

    next_action_title:
      firstPriority?.title ?? null,

    next_action_description:
      firstPriority?.description ?? null,

    input_snapshot: profile,

    ai_provider: "google",

    ai_model: "gemini",

    generation_started_at:
      new Date().toISOString(),

    generated_at:
      new Date().toISOString(),

    status: "draft",
  });

await setCurrentBusinessDiagnostic(
  savedDiagnostic.id
);

setDiagnosticId(savedDiagnostic.id);

setDiagnostic(aiDiagnostic);

    // ─────────────────────────────
    // 3. Stocker l'ID du diagnostic
    // ─────────────────────────────

    setDiagnosticId(savedDiagnostic.id);

    // ─────────────────────────────
    // 4. Afficher le diagnostic
    // ─────────────────────────────

    setDiagnostic(aiDiagnostic);

  } catch (err) {
    console.error(
      "Erreur génération diagnostic :",
      err
    );

    setError(
      err?.message ||
        "Impossible de générer le diagnostic."
    );
  } finally {
    setLoading(false);
  }
}

  function getStatusLabel(status) {
    switch (status) {
      case "excellent":
        return "Excellent";

      case "good":
        return "Solide";

      case "attention":
        return "À renforcer";

      case "critical":
        return "Critique";

      default:
        return "À analyser";
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "excellent":
        return "diagnostic-status excellent";

      case "good":
        return "diagnostic-status good";

      case "attention":
        return "diagnostic-status attention";

      case "critical":
        return "diagnostic-status critical";

      default:
        return "diagnostic-status";
    }
  }

  return (
    <Modal
      title="Diagnostic stratégique complet"
      subtitle="Analyse générée à partir de votre profil business"
      onClose={onClose}
        width={760}
    >
      {loading && (
        <div className="diagnostic-loading">
          <div className="diagnostic-loader">
            <span />
            <span />
            <span />
          </div>



          <strong>
            <>
            <div className="ai-analysis-loader">
              <div className="ai-loader-orbit">
                <div className="ai-loader-core">
                  <Loader2
                    size={28}
                    strokeWidth={2}
                    className="ai-spinner"
                  />
                </div>
              </div>

              <div className="ai-analysis-content">
                <span className="ai-analysis-title">
                  Analyse IA en cours
                  <span className="ai-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>

                <span className="ai-analysis-subtitle">
                  Analyse de votre business et détection des opportunités...
                </span>
              </div>
            </div>
          </>
            
          </strong>

          <p>
            Kalyma analyse actuellement votre
            positionnement, votre cible, vos offres et
            vos fondations business.
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="diagnostic-error">
          <strong>
            Impossible de générer le diagnostic
          </strong>

          <p>{error}</p>

          <button
            type="button"
            onClick={generateDiagnostic}
          >
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && diagnostic && (
        <div className="diagnostic-content">

          {/* SCORE GLOBAL */}

          <div className="diagnostic-score-card">
            <div>
              <span className="diagnostic-score-label">
                Score global
              </span>

              <strong className="diagnostic-score">
                {diagnostic.overallScore}
                <small>/100</small>
              </strong>
            </div>

            <div className="diagnostic-score-description">
              <span>
                Diagnostic stratégique
              </span>

              <p>
                {diagnostic.summary}
              </p>
            </div>
          </div>

          {/* DIMENSIONS */}

          <div className="diagnostic-section">
            <div className="diagnostic-section-header">
              <h3>
                Fondations de votre business
              </h3>

              <span>
                {diagnostic.points.length} dimensions
              </span>
            </div>

            <div className="diagnostic-list">
              {diagnostic.points.map((point) => (
                <div
                  className="diagnostic-item"
                  key={point.key}
                >
                  <div className="diagnostic-item-header">
                    <div>
                      <strong>
                        {point.label}
                      </strong>

                      <span
                        className={getStatusClass(
                          point.status
                        )}
                      >
                        {getStatusLabel(
                          point.status
                        )}
                      </span>
                    </div>

                    <strong className="diagnostic-item-score">
                      {point.score}/100
                    </strong>
                  </div>

                  <p className="diagnostic-finding">
                    {point.finding}
                  </p>

                  {point.recommendation && (
                    <div className="diagnostic-recommendation">
                      <span>
                        Recommandation
                      </span>

                      <p>
                        {point.recommendation}
                      </p>
                    </div>
                  )}

                  {point.priority === "high" && (
                    <div className="diagnostic-priority">
                      Priorité élevée
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FORCES */}

          {diagnostic.strengths?.length > 0 && (
            <div className="diagnostic-section">
              <div className="diagnostic-section-header">
                <h3>
                  Vos points forts
                </h3>
              </div>

              <div className="diagnostic-strengths">
                {diagnostic.strengths.map(
                  (strength, index) => (
                    <div
                      className="diagnostic-strength"
                      key={index}
                    >
                      <span>✓</span>

                      <p>{strength}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* PRIORITÉS */}

          {diagnostic.priorities?.length > 0 && (
            <div className="diagnostic-section">
              <div className="diagnostic-section-header">
                <h3>
                  Vos prochaines priorités
                </h3>
              </div>

       <div className="diagnostic-priorities">
  {diagnostic.priorities.map(
    (priority, index) => (
      <div
        className="diagnostic-priority-item"
        key={index}
      >
        <span>
          {index + 1}
        </span>

        <div className="diagnostic-priority-item-content">

          <h4 className="diagnostic-priority-title">
            {priority.title}
          </h4>

          <p className="diagnostic-priority-description">
            {priority.description}
          </p>

          <div className="diagnostic-priority-meta">

            <span
              className={
                priority.priority === "high"
                  ? "diagnostic-priority-high"
                  : "diagnostic-priority-medium"
              }
            >
              {priority.priority === "high"
                ? "Priorité élevée"
                : "Priorité moyenne"}
            </span>

            <span
              className={
                priority.impact === "high"
                  ? "diagnostic-impact-high"
                  : "diagnostic-impact-medium"
              }
            >
              {priority.impact === "high"
                ? "Impact élevé"
                : "Impact moyen"}
            </span>

          </div>
        </div>
      </div>
    )
  )}
</div>
            </div>

            
          )}

          {/* ACTION */}

          <div className="diagnostic-actions">
  {!tasksCreated ? (
    <button
      type="button"
      className="diagnostic-create-tasks-button"
      onClick={handleCreateTasks}
      disabled={creatingTasks}
    >
       {creatingTasks
    ? "Création en cours..."
    : `Créer mes ${diagnostic.priorities?.length || 0} actions prioritaires`}
    </button>
  ) : (
    <div className="diagnostic-tasks-created">
      ✓ Vos actions prioritaires ont été ajoutées
      à votre gestion des tâches.
    </div>
  )}
</div>

          <div className="diagnostic-footer">
            <button
              type="button"
              className="diagnostic-refresh-button"
              onClick={generateDiagnostic}
            >
              Relancer le diagnostic
            </button>
          </div>

        </div>
      )}
    </Modal>
  );
}

export default AIDiagnosticModal;