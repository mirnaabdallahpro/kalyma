/*import Modal from "../shared/Modal";

function TaskAIModal({ onClose }) {
  return (
    <Modal
      title="Optimiser ma journée"
      subtitle="Recommandation basée sur vos tâches en attente"
      onClose={onClose}
      width={480}
    >
      <div className="diagnostic-list">
        <div className="diagnostic-item">
          <strong>1. Actions commerciales d&apos;abord</strong>
          <p>
            Les relances et rendez-vous ont un impact direct sur votre
            pipeline — traitez-les avant le reste.
          </p>
        </div>

        <div className="diagnostic-item">
          <strong>2. Puis les priorités du diagnostic</strong>
          <p>
            Les recommandations issues de votre diagnostic stratégique
            renforcent votre positionnement à moyen terme.
          </p>
        </div>

        <div className="diagnostic-item">
          <strong>3. Enfin le reste</strong>
          <p>
            Marketing et tâches internes peuvent suivre une fois l&apos;essentiel
            traité.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default TaskAIModal;

*/

import { useEffect, useState } from "react";
import { addResource, deleteResource, getAllProjects, getResourcesForTask } from "../../../services/planning";
import { getTaskContext } from "../../../services/tasks";
import Modal from "../shared/Modal";

const CATEGORIES = ["Business", "CRM", "Commercial", "Marketing", "Stratégie", "Projet"];

function TaskFormModal({ initialTask, defaultStatus, onClose, onSave }) {
  const isEdit = Boolean(initialTask);
  const isManual = !initialTask || initialTask.source === "manual";

  const [form, setForm] = useState({
    title: initialTask?.title || "",
    category: initialTask?.category || CATEGORIES[0],
    meta: initialTask?.meta || "",
    priorityColor: initialTask?.priorityColor || "accent",
    status: initialTask?.status || defaultStatus || "todo",
    priority: initialTask?.priority || "medium",
    dueDate: initialTask?.dueDate || "",
    estimatedMinutes: initialTask?.estimatedMinutes || "",
    objectiveId: initialTask?.objectiveId || "",
    projectId: initialTask?.projectId || "",
    notes: initialTask?.notes || "",
  });

  const [projects, setProjects] = useState([]);
  const [context, setContext] = useState(null);
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: "", url: "" });

  useEffect(() => {
    getAllProjects().then(setProjects).catch(() => {});
    if (initialTask) {
      getTaskContext(initialTask).then(setContext).catch(() => {});
      if (isManual) {
        getResourcesForTask(initialTask.id).then(setResources).catch(() => {});
      }
    }
  }, [initialTask, isManual]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const setColor = (priorityColor) => setForm((f) => ({ ...f, priorityColor }));
  const setPriority = (priority) => setForm((f) => ({ ...f, priority }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...initialTask,
      ...form,
      estimatedMinutes: form.estimatedMinutes ? Number(form.estimatedMinutes) : null,
    });
  };

  const handleAddResource = async () => {
    if (!newResource.title.trim() || !initialTask) return;
    const created = await addResource({
      taskId: initialTask.id,
      type: newResource.url ? "link" : "note",
      title: newResource.title,
      url: newResource.url,
    });
    setResources((prev) => [...prev, created]);
    setNewResource({ title: "", url: "" });
  };

  const handleDeleteResource = async (id) => {
    await deleteResource(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Modal
      title={isEdit ? "Modifier la tâche" : "Nouvelle tâche"}
      onClose={onClose}
      width={560}
      footer={
        isManual && (
          <>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" form="task-form" className="btn btn-primary">
              {isEdit ? "Enregistrer" : "Créer la tâche"}
            </button>
          </>
        )
      }
    >
      {context && (context.objectiveTitle || context.projectTitle || context.prospectName || context.dependsOnTitle) && (
        <div className="task-why-box">
          <strong>Pourquoi cette tâche existe</strong>
          {context.objectiveTitle && <p>Objectif : {context.objectiveTitle}</p>}
          {context.projectTitle && <p>Projet : {context.projectTitle}</p>}
          {context.prospectName && <p>Prospect associé : {context.prospectName}</p>}
          {context.dependsOnTitle && (
            <p>
              Dépend de « {context.dependsOnTitle} » (
              {context.dependsOnStatus === "done" ? "terminée" : "pas encore terminée"})
            </p>
          )}
        </div>
      )}

      <form id="task-form" className="form-grid" onSubmit={handleSubmit}>
        <div className="field field-full">
          <label>Titre</label>
          <input
            type="text"
            value={form.title}
            onChange={update("title")}
            placeholder="Relancer Atlas Consulting"
            required
            disabled={!isManual}
          />
        </div>

        <div className="field">
          <label>Catégorie</label>
          <select value={form.category} onChange={update("category")} disabled={!isManual}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Échéance / note</label>
          <input
            type="text"
            value={form.meta}
            onChange={update("meta")}
            placeholder="10:00 ou Échéance aujourd'hui"
            disabled={!isManual}
          />
        </div>

        <div className="field">
          <label>Date d&apos;échéance</label>
          <input type="date" value={form.dueDate} onChange={update("dueDate")} disabled={!isManual} />
        </div>

        <div className="field">
          <label>Durée estimée (min)</label>
          <input
            type="number"
            value={form.estimatedMinutes}
            onChange={update("estimatedMinutes")}
            placeholder="45"
            disabled={!isManual}
          />
        </div>

        {isManual && (
          <div className="field field-full">
            <label>Priorité (urgence)</label>
            <div className="segmented">
              <button type="button" className={form.priority === "high" ? "active" : ""} onClick={() => setPriority("high")}>
                Haute
              </button>
              <button type="button" className={form.priority === "medium" ? "active" : ""} onClick={() => setPriority("medium")}>
                Moyenne
              </button>
              <button type="button" className={form.priority === "low" ? "active" : ""} onClick={() => setPriority("low")}>
                Basse
              </button>
            </div>
          </div>
        )}

        <div className="field field-full">
          <label>Couleur (affichage carte)</label>
          <div className="segmented">
            <button type="button" className={form.priorityColor === "secondary" ? "active" : ""} onClick={() => setColor("secondary")} disabled={!isManual}>
              Haute
            </button>
            <button type="button" className={form.priorityColor === "accent" ? "active" : ""} onClick={() => setColor("accent")} disabled={!isManual}>
              Moyenne
            </button>
            <button type="button" className={form.priorityColor === "muted" ? "active" : ""} onClick={() => setColor("muted")} disabled={!isManual}>
              Basse
            </button>
          </div>
        </div>

        {isManual && (
          <div className="field">
            <label>Projet lié</label>
            <select value={form.projectId} onChange={update("projectId")}>
              <option value="">Aucun</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field field-full">
          <label>Statut</label>
          <select value={form.status} onChange={update("status")}>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminé</option>
          </select>
        </div>

        <div className="field field-full">
          <label>Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={update("notes")}
            placeholder="Contexte, précisions…"
            disabled={!isManual}
          />
        </div>
      </form>

      {isManual && initialTask && (
        <div className="task-resources-block">
          <strong>Ressources</strong>

          {resources.length === 0 && <p className="empty-state">Aucune ressource liée.</p>}

          {resources.map((r) => (
            <div className="task-resource-row" key={r.id}>
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer">
                  🔗 {r.title}
                </a>
              ) : (
                <span>📝 {r.title}</span>
              )}
              <button type="button" onClick={() => handleDeleteResource(r.id)}>
                ✕
              </button>
            </div>
          ))}

          <div className="task-resource-add">
            <input
              type="text"
              placeholder="Titre de la ressource"
              value={newResource.title}
              onChange={(e) => setNewResource((r) => ({ ...r, title: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Lien (optionnel)"
              value={newResource.url}
              onChange={(e) => setNewResource((r) => ({ ...r, url: e.target.value }))}
            />
            <button type="button" className="btn btn-ghost btn-small" onClick={handleAddResource}>
              + Ajouter
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default TaskFormModal;