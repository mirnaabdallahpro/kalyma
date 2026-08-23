import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { createDiagnosticTasks } from "../../../services/tasks";
import Modal from "./Modal";


function AIDiagnosticModal({ profile, onClose }) {
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      diagnostic.priorities
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
      width={560}
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
              <Loader2
                size={15}
                strokeWidth={2}
                className="ai-spinner"
              />
              Analyse de votre business...
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

                      <p>{priority}</p>
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