import { useEffect, useState } from "react";

import {
  convertRecommendationToPlan,
  generatePlanAction,
} from "../../../services/planning";

import Modal from "../shared/Modal";

function PlanActionModal({
  recommendation,
  profile,
  onClose,
  onCreated,
}) {
  const [objectiveTitle, setObjectiveTitle] = useState("");
  const [objectiveDescription, setObjectiveDescription] = useState("");

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [tasks, setTasks] = useState([]);

  const [loadingAI, setLoadingAI] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * Génération du plan par l'IA
   */
  useEffect(() => {
    let cancelled = false;

    async function loadPlan() {
      setLoadingAI(true);
      setError("");

      try {
        const plan = await generatePlanAction({
          recommendation,
          profile,
        });

        if (cancelled) return;

        setObjectiveTitle(plan?.objective?.title || "");
        setObjectiveDescription(
          plan?.objective?.description || ""
        );

        setProjectTitle(plan?.project?.title || "");
        setProjectDescription(
          plan?.project?.description || ""
        );

        setTasks(
          Array.isArray(plan?.tasks)
            ? plan.tasks.map((task, index) => ({
                ...task,
                order: task.order || index + 1,
              }))
            : []
        );

        console.log("TASKS, ", tasks)
      } catch (err) {
        console.error(
          "Erreur génération plan IA:",
          err
        );

        if (!cancelled) {
          setError(
            err?.message ||
              "Impossible de générer le plan d'action."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingAI(false);
        }
      }
    }

    loadPlan();

    return () => {
      cancelled = true;
    };
  }, [recommendation, profile]);

  /**
   * Modifier une tâche
   */
  const updateTask = (index, field, value) => {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index
          ? {
              ...task,
              [field]: value,
            }
          : task
      )
    );
  };

  /**
   * Supprimer une tâche
   */
  const removeTask = (index) => {
    setTasks((currentTasks) =>
      currentTasks
        .filter((_, taskIndex) => taskIndex !== index)
        .map((task, taskIndex) => ({
          ...task,
          order: taskIndex + 1,
        }))
    );
  };

  /**
   * Ajouter manuellement une tâche
   */
  const addTask = () => {
    if (tasks.length >= 5) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        title: "",
        description: "",
        priority: "medium",
        deadlineDays:
          currentTasks.length > 0
            ? Number(
                currentTasks[currentTasks.length - 1]
                  .deadlineDays || 7
              ) + 5
            : 5,
        estimatedMinutes: 60,
        order: currentTasks.length + 1,
        dependsOn:
          currentTasks.length > 0
            ? [currentTasks.length]
            : [],
      },
    ]);
  };

  /**
   * Regénérer le plan
   */
  const regeneratePlan = async () => {
    setLoadingAI(true);
    setError("");

    try {
      const plan = await generatePlanAction({
        recommendation,
        profile,
      });

      setObjectiveTitle(plan?.objective?.title || "");
      setObjectiveDescription(
        plan?.objective?.description || ""
      );

      setProjectTitle(plan?.project?.title || "");
      setProjectDescription(
        plan?.project?.description || ""
      );

      setTasks(
        Array.isArray(plan?.tasks)
          ? plan.tasks.map((task, index) => ({
              ...task,
              order: task.order || index + 1,
            }))
          : []
      );
    } catch (err) {
      console.error(
        "Erreur régénération plan IA:",
        err
      );

      setError(
        err?.message ||
          "Impossible de régénérer le plan."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  /**
   * Création définitive du plan
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!objectiveTitle.trim()) {
      setError("L'objectif est obligatoire.");
      return;
    }

    if (!projectTitle.trim()) {
      setError("Le projet est obligatoire.");
      return;
    }

    if (tasks.length < 3) {
      setError(
        "Le plan doit contenir au moins 3 tâches."
      );
      return;
    }

    const invalidTask = tasks.find(
      (task) => !task.title?.trim()
    );

    if (invalidTask) {
      setError(
        "Chaque tâche doit avoir un titre."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result =
        await convertRecommendationToPlan({
          recommendationId: recommendation.id,

          objectiveTitle: objectiveTitle.trim(),
          objectiveDescription:
            objectiveDescription.trim(),

          projectTitle: projectTitle.trim(),
          projectDescription:
            projectDescription.trim(),

          tasks: tasks.map((task, index) => ({
            title: task.title.trim(),
            description:
              task.description?.trim() || "",
            priority:
              task.priority || "medium",
            deadlineDays:
              Number(task.deadlineDays) || 1,
            estimatedMinutes:
              Number(task.estimatedMinutes) || 60,
            order: index + 1,
            dependsOn:
              Array.isArray(task.dependsOn)
                ? task.dependsOn
                : [],
          })),
        });

      onCreated(result);
    } catch (err) {
      console.error(
        "Erreur création plan:",
        err
      );

      setError(
        err?.message ||
          "Impossible de créer le plan."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Transformer en plan d'action"
      subtitle={recommendation?.title}
      onClose={onClose}
      width={720}
      footer={
        <>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={loadingAI || saving}
          >
            Annuler
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={regeneratePlan}
            disabled={loadingAI || saving}
          >
            {loadingAI
              ? "Analyse..."
              : "↻ Regénérer"}
          </button>

          <button
            type="submit"
            form="plan-action-form"
            className="btn btn-primary"
            disabled={
              loadingAI ||
              saving ||
              tasks.length < 3
            }
          >
            {saving
              ? "Création..."
              : "Créer le plan"}
          </button>
        </>
      }
    >
      {loadingAI ? (
        <div
          className="plan-ai-loading"
          style={{
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <div
            className="ai-loader"
            style={{
              width: 42,
              height: 42,
              border: "4px solid #e5e7eb",
              borderTopColor:
                "var(--primary)",
              borderRadius: "50%",
              animation:
                "plan-ai-spin 0.8s linear infinite",
              margin: "0 auto 20px",
            }}
          />

          <strong>
            Kalyma analyse cette recommandation...
          </strong>

          <p
            style={{
              marginTop: 8,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            L'IA construit un plan opérationnel
            avec des tâches, des priorités et des
            échéances adaptées à votre situation.
          </p>
        </div>
      ) : (
        <form
          id="plan-action-form"
          className="form-grid"
          onSubmit={handleSubmit}
        >
          {error && (
            <div
              className="form-error"
              style={{
                gridColumn: "1 / -1",
                padding: 12,
                borderRadius: 8,
                background: "#fff1f2",
                color: "#be123c",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          {/* OBJECTIF */}
          <div className="field field-full">
            <label>Objectif stratégique</label>

            <input
              type="text"
              value={objectiveTitle}
              onChange={(e) =>
                setObjectiveTitle(e.target.value)
              }
              required
            />
          </div>

          <div className="field field-full">
            <label>
              Résultat attendu
            </label>

            <textarea
              rows={3}
              value={objectiveDescription}
              onChange={(e) =>
                setObjectiveDescription(
                  e.target.value
                )
              }
            />
          </div>

          {/* PROJET */}
          <div className="field field-full">
            <label>Projet</label>

            <input
              type="text"
              value={projectTitle}
              onChange={(e) =>
                setProjectTitle(e.target.value)
              }
              required
            />
          </div>

          <div className="field field-full">
            <label>
              Description du projet
            </label>

            <textarea
              rows={2}
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(
                  e.target.value
                )
              }
            />
          </div>

          {/* TÂCHES */}
          <div
            className="field field-full"
            style={{ marginTop: 8 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div>
                <label
                  style={{
                    marginBottom: 3,
                    display: "block",
                  }}
                >
                  Plan d'exécution
                </label>

                <small
                  style={{
                    color: "#6b7280",
                  }}
                >
                  {tasks.length} tâche
                  {tasks.length > 1
                    ? "s"
                    : ""}{" "}
                  proposées par Kalyma
                </small>
              </div>

              {tasks.length < 5 && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={addTask}
                >
                  + Ajouter
                </button>
              )}
            </div>

            <div
              className="plan-task-list"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {tasks.map((task, index) => (
                <div
                  key={`${task.order}-${index}`}
                  className="plan-task-editor"
                  style={{
                    padding: 16,
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: 10,
                    background: "#fafafa",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background:
                          "var(--primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>

                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <input
                        type="text"
                        value={task.title || ""}
                        onChange={(e) =>
                          updateTask(
                            index,
                            "title",
                            e.target.value
                          )
                        }
                        placeholder="Titre de la tâche"
                        required
                        style={{
                          width: "100%",
                          fontWeight: 600,
                        }}
                      />

                      <textarea
                        rows={2}
                        value={
                          task.description || ""
                        }
                        onChange={(e) =>
                          updateTask(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Décrivez concrètement ce qui doit être réalisé..."
                        style={{
                          width: "100%",
                          marginTop: 8,
                        }}
                      />

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 1fr 1fr",
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        <select
                          value={
                            task.priority ||
                            "medium"
                          }
                          onChange={(e) =>
                            updateTask(
                              index,
                              "priority",
                              e.target.value
                            )
                          }
                        >
                          <option value="high">
                            Haute
                          </option>

                          <option value="medium">
                            Moyenne
                          </option>

                          <option value="low">
                            Basse
                          </option>
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={
                            task.deadlineDays ||
                            ""
                          }
                          onChange={(e) =>
                            updateTask(
                              index,
                              "deadlineDays",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          placeholder="Jours"
                          title="Échéance en jours"
                        />

                        <input
                          type="number"
                          min="15"
                          step="15"
                          value={
                            task.estimatedMinutes ||
                            ""
                          }
                          onChange={(e) =>
                            updateTask(
                              index,
                              "estimatedMinutes",
                              Number(
                                e.target.value
                              )
                            )
                          }
                          placeholder="Minutes"
                          title="Temps estimé"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() =>
                        removeTask(index)
                      }
                      disabled={
                        tasks.length <= 3
                      }
                      title="Supprimer"
                      aria-label="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default PlanActionModal;