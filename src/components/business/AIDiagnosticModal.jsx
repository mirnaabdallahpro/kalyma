
import {
  Check,
  Info,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../../../lib/supabase";

import {
  createBusinessDiagnostic,
  setCurrentBusinessDiagnostic,
} from "../../../services/businessDiagnostics";

import {
  createDiagnosticTasks,
} from "../../../services/tasks";

import Modal from "./Modal";

import DiagnosticPDFButton from "./DiagnosticPDF";
function AIDiagnosticModal({
  profile,
  onClose,
}) {

  const [
    diagnostic,
    setDiagnostic,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);

  const [
    diagnosticId,
    setDiagnosticId,
  ] = useState(null);

  const [
    creatingTasks,
    setCreatingTasks,
  ] = useState(false);

  const [
    tasksCreated,
    setTasksCreated,
  ] = useState(false);

  // ============================================================
  // AMÉLIORATION DU DIAGNOSTIC
  // ============================================================

  const [
    improvementModalOpen,
    setImprovementModalOpen,
  ] = useState(false);

  const [
    improvementReason,
    setImprovementReason,
  ] = useState("");

  const [
    improving,
    setImproving,
  ] = useState(false);

  const [
    diagnosticVersion,
    setDiagnosticVersion,
  ] = useState(1);


  // ============================================================
  // GÉNÉRATION AUTOMATIQUE
  // ============================================================

  useEffect(() => {

    if (profile) {
      generateDiagnostic();
    }

  }, [profile]);


  // ============================================================
  // CREATE TASKS
  // ============================================================

  async function handleCreateTasks() {

    if (
      !diagnostic ||
      !diagnostic.priorities?.length ||
      !diagnosticId
    ) {
      return;
    }

    try {

      setCreatingTasks(true);

      setError(null);

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


  // ============================================================
  // GENERATE DIAGNOSTIC
  // ============================================================

  async function generateDiagnostic({
    improvementFeedback = null,
    previousDiagnostic = null,
    version = 1,
  } = {}) {

    try {

      setLoading(true);

      setError(null);

      setTasksCreated(false);

      const userId =
        profile?.user_id ||
        profile?.userId;


      if (!userId) {

        throw new Error(
          "Impossible d'identifier l'utilisateur."
        );

      }


      // ========================================================
      // APPEL EDGE FUNCTION
      // ========================================================

      const {
        data,
        error: invokeError,
      } =
        await supabase.functions.invoke(
          "business-ai-diagnostic",
          {
            body: {

              profile,

              userId,

              // ------------------------------------------------
              // CONTEXTE D'AMÉLIORATION
              // ------------------------------------------------

              improvement: Boolean(
                improvementFeedback
              ),

              improvementFeedback:
                improvementFeedback || null,

              previousDiagnostic:
                previousDiagnostic || null,

              diagnosticVersion:
                version,

            },
          }
        );


      if (invokeError) {
        throw invokeError;
      }


      if (
        !data?.success ||
        !data?.diagnostic
      ) {

        throw new Error(
          data?.error ||
            "Diagnostic invalide."
        );

      }


      const aiDiagnostic =
        data.diagnostic;


      // ========================================================
      // STRONGEST POINT
      // ========================================================

      const strongestPoint =
        [
          ...(aiDiagnostic.points || []),
        ]
          .sort(
            (a, b) =>
              b.score - a.score
          )[0];


      // ========================================================
      // WEAKEST POINT
      // ========================================================

      const weakestPoint =
        [
          ...(aiDiagnostic.points || []),
        ]
          .sort(
            (a, b) =>
              a.score - b.score
          )[0];


      // ========================================================
      // FIRST PRIORITY
      // ========================================================

      const firstPriority =
        aiDiagnostic
          .priorities?.[0] ||
        null;


      // ========================================================
      // SAVE DIAGNOSTIC
      // ========================================================

      const savedDiagnostic =
        await createBusinessDiagnostic({

          source: "ai",

          business_score:
            aiDiagnostic
              .overallScore ??
            0,

          synthesis_title:
            `Diagnostic stratégique ${
              version > 1
                ? `V${version}`
                : ""
            }`,

          synthesis_description:
            aiDiagnostic.summary ??
            "",

          strength_dimension:
            strongestPoint?.key ??
            null,

          strength_score:
            strongestPoint?.score ??
            null,

          priority_dimension:
            weakestPoint?.key ??
            null,

          priority_score:
            weakestPoint?.score ??
            null,

          next_action_title:
            firstPriority?.title ??
            null,

          next_action_description:
            firstPriority?.description ??
            null,

          input_snapshot:
            profile,

          ai_provider:
            "google",

          ai_model:
            "gemini",

          generation_started_at:
            new Date().toISOString(),

          generated_at:
            new Date().toISOString(),

          status:
            "draft",

        });


      await setCurrentBusinessDiagnostic(
        savedDiagnostic.id
      );


      setDiagnosticId(
        savedDiagnostic.id
      );

      setDiagnostic(
        aiDiagnostic
      );

      setDiagnosticVersion(
        version
      );


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


  // ============================================================
  // OUVRIR LE FEEDBACK GLOBAL
  // ============================================================

  function openImprovementModal() {

    if (improving) {
      return;
    }

    setImprovementReason("");

    setImprovementModalOpen(true);

  }


  // ============================================================
  // FERMER LE FEEDBACK
  // ============================================================

  function closeImprovementModal() {

    if (improving) {
      return;
    }

    setImprovementModalOpen(false);

    setImprovementReason("");

  }


  // ============================================================
  // AMÉLIORER LE DIAGNOSTIC
  // ============================================================

  async function handleImproveDiagnostic() {

    if (
      !improvementReason ||
      improving ||
      !diagnostic
    ) {
      return;
    }


    try {

      setImproving(true);

      setImprovementModalOpen(false);

      setError(null);


      const nextVersion =
        diagnosticVersion + 1;


      await generateDiagnostic({

        improvementFeedback:
          improvementReason,

        previousDiagnostic:
          diagnostic,

        version:
          nextVersion,

      });


    } catch (err) {

      console.error(
        "Erreur amélioration diagnostic :",
        err
      );

      setError(
        err?.message ||
          "Impossible d'améliorer le diagnostic."
      );

    } finally {

      setImproving(false);

    }
  }


  // ============================================================
  // STATUS LABEL
  // ============================================================

  function getStatusLabel(
    status
  ) {

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


  // ============================================================
  // STATUS CLASS
  // ============================================================

  function getStatusClass(
    status
  ) {

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


  // ============================================================
  // FEEDBACK LABEL
  // ============================================================

  function getImprovementLabel(
    reason
  ) {

    switch (reason) {

      case "too_generic":
        return "Le diagnostic reste trop générique";

      case "not_relevant":
        return "Certaines recommandations ne sont pas pertinentes";

      case "already_done":
        return "Certaines recommandations sont déjà réalisées";

      case "not_priority":
        return "Les priorités proposées ne correspondent pas à ma situation";

      case "not_understood":
        return "Le diagnostic manque de clarté";

      case "too_repetitive":
        return "Le diagnostic répète des éléments déjà analysés";

      default:
        return "";

    }
  }


  return (

    <Modal
      title="Diagnostic stratégique complet"
      subtitle={
        diagnosticVersion > 1
          ? `Analyse IA améliorée — version ${diagnosticVersion}`
          : "Analyse générée à partir de votre profil business"
      }
      onClose={onClose}
      width={760}
    >

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (

        <div className="diagnostic-loading">

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

                {improving
                  ? "Amélioration du diagnostic"
                  : "Analyse IA en cours"}

                <span className="ai-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>

              </span>


              <span className="ai-analysis-subtitle">

                {improving
                  ? "Kalyma réévalue votre situation à partir de votre feedback..."
                  : "Analyse de votre business et détection des opportunités..."}

              </span>

            </div>

          </div>


          <p>

            {improving
              ? "Kalyma compare le diagnostic précédent, votre feedback et votre situation actuelle afin de produire une analyse plus pertinente."
              : "Kalyma analyse actuellement votre positionnement, votre cible, vos offres et vos fondations business."}

          </p>

        </div>

      )}


      {/* ======================================================
          ERROR
      ====================================================== */}

      {!loading && error && (

        <div className="diagnostic-error">

          <strong>
            Impossible de générer le diagnostic
          </strong>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              generateDiagnostic({
                previousDiagnostic:
                  diagnostic,
                version:
                  diagnosticVersion,
              })
            }
          >
            Réessayer
          </button>

        </div>

      )}


      {/* ======================================================
          DIAGNOSTIC
      ====================================================== */}

      {!loading &&
        !error &&
        diagnostic && (

          <div className="diagnostic-content">


            {/* ==================================================
                VERSION
            ================================================== */}

            {diagnosticVersion > 1 && (

              <div className="diagnostic-version-badge">

                <Sparkles size={15} />

                Diagnostic amélioré — version{" "}
                {diagnosticVersion}

              </div>

            )}


            {/* ==================================================
                SCORE GLOBAL
            ================================================== */}

            <div className="diagnostic-score-card">

              <div>

                <span className="diagnostic-score-label">
                  Score global
                </span>

                <strong className="diagnostic-score">

                  {diagnostic.overallScore}

                  <small>
                    /100
                  </small>

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


            {/* ==================================================
                DIMENSIONS
            ================================================== */}

            <div className="diagnostic-section">

              <div className="diagnostic-section-header">

                <h3>
                  Fondations de votre business
                </h3>

                <span>
                  {diagnostic.points.length}
                  {" "}
                  dimensions
                </span>

              </div>


              <div className="diagnostic-list">

                {diagnostic.points.map(
                  (point) => (

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


                          {/* ==================================
                              WHY
                          ================================== */}

                          {point.recommendationReason && (

                            <div className="diagnostic-recommendation-reason">

                              <div>

                                <Info
                                  size={16}
                                />

                                <strong>
                                  Pourquoi cette recommandation ?
                                </strong>

                              </div>

                              <p>
                                {point.recommendationReason}
                              </p>

                            </div>

                          )}


                          {/* ==================================
                              EVIDENCE
                          ================================== */}

                          {point.evidence?.length > 0 && (

                            <div className="diagnostic-evidence">

                              <div className="diagnostic-evidence-title">

                                <Info
                                  size={15}
                                />

                                <span>
                                  Ce qui justifie cette recommandation
                                </span>

                              </div>


                              {point.evidence.map(
                                (
                                  evidence,
                                  index
                                ) => (

                                  <div
                                    className="diagnostic-evidence-item"
                                    key={index}
                                  >

                                    <strong>
                                      {evidence.source}
                                    </strong>

                                    <p>
                                      {evidence.observation}
                                    </p>

                                  </div>

                                )
                              )}

                            </div>

                          )}

                        </div>

                      )}


                      {point.priority === "high" && (

                        <div className="diagnostic-priority">

                          Priorité élevée

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            </div>


            {/* ==================================================
                STRENGTHS
            ================================================== */}

            {diagnostic.strengths?.length > 0 && (

              <div className="diagnostic-section">

                <div className="diagnostic-section-header">

                  <h3>
                    Vos points forts
                  </h3>

                </div>


                <div className="diagnostic-strengths">

                  {diagnostic.strengths.map(
                    (
                      strength,
                      index
                    ) => (

                      <div
                        className="diagnostic-strength"
                        key={index}
                      >

                        <span>
                          ✓
                        </span>

                        <p>
                          {strength}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* ==================================================
                PRIORITIES
            ================================================== */}

            {diagnostic.priorities?.length > 0 && (

              <div className="diagnostic-section">

                <div className="diagnostic-section-header">

                  <h3>
                    Vos prochaines priorités
                  </h3>

                </div>


                <div className="diagnostic-priorities">

                  {diagnostic.priorities.map(
                    (
                      priority,
                      index
                    ) => (

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


                          {priority.reason && (

                            <div className="diagnostic-priority-reason">

                              <Info
                                size={15}
                              />

                              <p>

                                <strong>
                                  Pourquoi maintenant :
                                </strong>

                                {" "}

                                {priority.reason}

                              </p>

                            </div>

                          )}


                          {priority.evidence?.length > 0 && (

                            <div className="diagnostic-priority-evidence">

                              {priority.evidence.map(
                                (
                                  evidence,
                                  evidenceIndex
                                ) => (

                                  <div
                                    key={evidenceIndex}
                                  >

                                    <strong>
                                      {evidence.source}
                                    </strong>

                                    <span>
                                      {evidence.observation}
                                    </span>

                                  </div>

                                )
                              )}

                            </div>

                          )}


                          <div className="diagnostic-priority-meta">

                            <span
                              className={
                                priority.priority ===
                                "high"
                                  ? "diagnostic-priority-high"
                                  : priority.priority ===
                                    "low"
                                  ? "diagnostic-priority-low"
                                  : "diagnostic-priority-medium"
                              }
                            >

                              {priority.priority ===
                              "high"
                                ? "Priorité élevée"
                                : priority.priority ===
                                  "low"
                                ? "Priorité faible"
                                : "Priorité moyenne"}

                            </span>


                            <span
                              className={
                                priority.impact ===
                                "high"
                                  ? "diagnostic-impact-high"
                                  : priority.impact ===
                                    "low"
                                  ? "diagnostic-impact-low"
                                  : "diagnostic-impact-medium"
                              }
                            >

                              {priority.impact ===
                              "high"
                                ? "Impact élevé"
                                : priority.impact ===
                                  "low"
                                ? "Impact faible"
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


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="diagnostic-actions">
                <DiagnosticPDFButton
                  diagnostic={diagnostic}
                  profile={profile}
                />

              {!tasksCreated ? (

                

                <button
                  type="button"
                  className="diagnostic-create-tasks-button"
                  onClick={
                    handleCreateTasks
                  }
                  disabled={
                    creatingTasks
                  }
                >

                  {creatingTasks
                    ? "Création en cours..."
                    : `Créer mes ${
                        diagnostic.priorities
                          ?.length || 0
                      } actions prioritaires`}

                </button>

              ) : (

                <div className="diagnostic-tasks-created">

                  <Check size={17} />

                  <span>
                    Vos actions prioritaires ont été ajoutées à votre gestion des tâches.
                  </span>

                </div>

              )}

            </div>


            {/* ==================================================
                AMÉLIORER LE DIAGNOSTIC
            ================================================== */}

            <div className="diagnostic-improvement-section">

              <div className="diagnostic-improvement-content">

                <div className="diagnostic-improvement-icon">

                  <Sparkles size={20} />

                </div>


                <div>

                  <strong>
                    Le diagnostic peut encore être amélioré
                  </strong>

                  <p>

                    Vous pouvez demander à Kalyma de réanalyser
                    votre situation avec votre feedback.
                    Le prochain diagnostic tiendra compte
                    de cette version et évitera de répéter
                    les mêmes recommandations.

                  </p>

                </div>

              </div>


              <button
                type="button"
                className="diagnostic-improve-button"
                onClick={
                  openImprovementModal
                }
                disabled={
                  improving
                }
              >

                <RefreshCw size={17} />

                Améliorer ce diagnostic

              </button>

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="diagnostic-footer">

              <span>

                Version {diagnosticVersion}

              </span>

            </div>

          </div>

        )}


      {/* ========================================================
          IMPROVEMENT FEEDBACK MODAL
      ======================================================== */}

      {improvementModalOpen && (

        <div className="diagnostic-feedback-overlay">

          <div className="diagnostic-feedback-modal">

            <div className="diagnostic-feedback-modal-header">

              <div>

                <span>
                  Amélioration du diagnostic
                </span>

                <h3>
                  Comment pouvons-nous rendre cette analyse plus pertinente ?
                </h3>

              </div>


              <button
                type="button"
                onClick={
                  closeImprovementModal
                }
                disabled={
                  improving
                }
              >
                ×
              </button>

            </div>


            <p className="diagnostic-feedback-intro">

              Kalyma va utiliser votre réponse comme une
              contrainte pour la prochaine analyse.
              Le diagnostic précédent sera également transmis
              à l'IA afin qu'elle puisse identifier ce qui doit
              réellement évoluer plutôt que simplement reformuler
              les mêmes recommandations.

            </p>


            <div className="diagnostic-feedback-options">


              {/* TOO GENERIC */}

              <label>

                <input
                  type="radio"
                  name="diagnostic-improvement"
                  value="too_generic"
                  checked={
                    improvementReason ===
                    "too_generic"
                  }
                  onChange={(event) =>
                    setImprovementReason(
                      event.target.value
                    )
                  }
                />

                <span>
                  Le diagnostic reste trop générique
                </span>

              </label>


              {/* NOT RELEVANT */}

              <label>

                <input
                  type="radio"
                  name="diagnostic-improvement"
                  value="not_relevant"
                  checked={
                    improvementReason ===
                    "not_relevant"
                  }
                  onChange={(event) =>
                    setImprovementReason(
                      event.target.value
                    )
                  }
                />

                <span>
                  Certaines recommandations ne sont pas pertinentes
                </span>

              </label>


              {/* ALREADY DONE */}

              <label>

                <input
                  type="radio"
                  name="diagnostic-improvement"
                  value="already_done"
                  checked={
                    improvementReason ===
                    "already_done"
                  }
                  onChange={(event) =>
                    setImprovementReason(
                      event.target.value
                    )
                  }
                />

                <span>
                  Certaines recommandations sont déjà réalisées
                </span>

              </label>


              {/* NOT PRIORITY */}

              <label>

                <input
                  type="radio"
                  name="diagnostic-improvement"
                  value="not_priority"
                  checked={
                    improvementReason ===
                    "not_priority"
                  }
                  onChange={(event) =>
                    setImprovementReason(
                      event.target.value
                    )
                  }
                />

                <span>
                  Les priorités proposées ne correspondent pas à ma situation
                </span>

              </label>


              {/* NOT UNDERSTOOD */}

              <label>

                <input
                  type="radio"
                  name="diagnostic-improvement"
                  value="not_understood"
                  checked={
                    improvementReason ===
                    "not_understood"
                  }
                  onChange={(event) =>
                    setImprovementReason(
                      event.target.value
                    )
                  }
                />

                <span>
                  Le diagnostic manque de clarté
                </span>

              </label>


              {/* REPETITIVE */}

              <label>

                <input
                  type="radio"
                  name="diagnostic-improvement"
                  value="too_repetitive"
                  checked={
                    improvementReason ===
                    "too_repetitive"
                  }
                  onChange={(event) =>
                    setImprovementReason(
                      event.target.value
                    )
                  }
                />

                <span>
                  Le diagnostic répète des éléments déjà analysés
                </span>

              </label>

            </div>


            {/* ==================================================
                PREVIOUS VERSION
            ================================================== */}

            <div className="diagnostic-feedback-recommendation">

              <Sparkles size={18} />

              <div>

                <strong>
                  Nouvelle analyse
                </strong>

                <p>

                  Kalyma va générer la version{" "}
                  {diagnosticVersion + 1}
                  {" "}en tenant compte de votre feedback
                  et du diagnostic actuel.

                </p>

              </div>

            </div>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div className="diagnostic-feedback-actions">

              <button
                type="button"
                onClick={
                  closeImprovementModal
                }
                disabled={
                  improving
                }
              >
                Annuler
              </button>


              <button
                type="button"
                disabled={
                  !improvementReason ||
                  improving
                }
                onClick={
                  handleImproveDiagnostic
                }
              >

                {improving
                  ? "Amélioration..."
                  : "Améliorer le diagnostic"}

              </button>

            </div>

          </div>

        </div>

      )}

    </Modal>

  );
}


export default AIDiagnosticModal;

