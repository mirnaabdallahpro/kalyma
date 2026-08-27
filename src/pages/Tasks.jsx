import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getAllTasks,
  reorderTasks,
  updateTask,
} from "../../services/tasks";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import ConfirmModal from "../components/shared/ConfirmModal";
import PlanActionModal from "../components/tasks/PlanActionModal";
import ProgressPanel from "../components/tasks/ProgressPanel";
import TaskAIPanel from "../components/tasks/TaskAIPanel";
import TaskColumn from "../components/tasks/TaskColumn";
import TaskFormModal from "../components/tasks/TaskFormModal";
import "../styles/tasks.css";


import {
  getBusinessProfile
} from "../../services/businessProfileService";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";
import { mapBusinessProfile } from "../utils/businessProfileMapper";


const STATUSES = ["todo", "in_progress", "done"];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [draggingId, setDraggingId] = useState(null);
  const [formState, setFormState] = useState(null); // null | { status } | task
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [planTarget, setPlanTarget] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

     const [profile, setProfile] = useState(null);



   async function loadProfile() {
  try {
    setLoading(true);
    setError(null);

    console.log("1. Recherche du profil...");

    let data = await getBusinessProfile();

    console.log("2. Profil récupéré :", data);

    console.log("5. Mapping du profil...");

    setProfile(mapBusinessProfile(data));

  } catch (err) {
    console.error("❌ ERREUR LOAD PROFILE :", err);
    console.error("message:", err?.message);
    console.error("code:", err?.code);
    console.error("details:", err?.details);
    console.error("hint:", err?.hint);

    setError(
      "Impossible de charger votre profil Business."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadProfile();
  }, []);

  const loadTasks = async () => {
    try {
      setErrorMsg("");
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setErrorMsg(
        err?.message || "Impossible de charger les tâches pour le moment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const findTask = (id) => tasks.find((t) => t.id === id);

  // Déplace une tâche (changement de statut et/ou de position),
  // met à jour l'affichage tout de suite, puis persiste en base.
  const moveTask = async (taskId, newStatus, beforeId) => {
    const dragged = findTask(taskId);
    if (!dragged) return;

    const rest = tasks.filter((t) => t.id !== taskId);
    const updated = { ...dragged, status: newStatus };

    let nextTasks;
    if (!beforeId) {
      nextTasks = [...rest, updated];
    } else {
      const insertIndex = rest.findIndex((t) => t.id === beforeId);
      nextTasks =
        insertIndex === -1
          ? [...rest, updated]
          : [...rest.slice(0, insertIndex), updated, ...rest.slice(insertIndex)];
    }

    setTasks(nextTasks);

    // Ordre final, dans la même source que la tâche déplacée,
    // pour la colonne cible — c'est ce qui est persisté.
    const bucketOrderedIds = nextTasks
      .filter((t) => t.source === dragged.source && t.status === newStatus)
      .map((t) => t.id);

    try {
      await reorderTasks(dragged.source, bucketOrderedIds, taskId, newStatus);
    } catch (err) {
      setErrorMsg(
        err?.message || "Le déplacement n'a pas pu être enregistré."
      );
      loadTasks(); // resynchronise avec la base en cas d'échec
    }
  };

  const handleSaveTask = async (form) => {
    setSaving(true);
    try {
      if (form.id) {
        // Seules les tâches manuelles sont éditables depuis ce formulaire
        const updated = await updateTask(form.id, {
          title: form.title,
          category: form.category,
          meta: form.meta,
          priorityColor: form.priorityColor,
          status: form.status,
          priority: form.priority,
          dueDate: form.dueDate,
          estimatedMinutes: form.estimatedMinutes,
          projectId: form.projectId,
          notes: form.notes,

        }, form.source);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await createTask({
          title: form.title,
          category: form.category,
          meta: form.meta,
          priorityColor: form.priorityColor,
          status: form.status,
          priority: form.priority,
          dueDate: form.dueDate,
          estimatedMinutes: form.estimatedMinutes,
          projectId: form.projectId,
          notes: form.notes,

        });
        setTasks((prev) => [...prev, created]);
      }
      setFormState(null);
    } catch (err) {
      setErrorMsg(err?.message || "Impossible d'enregistrer la tâche.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTask(deleteTarget.id, deleteTarget.source);
      setTasks((currentTasks) =>
      currentTasks.filter(
        (item) =>
          !(
            item.id === deleteTarget.id &&
            item.source === deleteTarget.source
          )
      )
    );
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de supprimer la tâche.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const priorityTask = tasks.find(
    (t) => t.status !== "done" && t.priorityColor === "secondary"
  );

  return (
    <div className="dashboard-body">
      <div className="app">
        <Sidebar />

        <main className="main">
          <Topbar />

          <div className="content">
            <div className="welcome">
              <div>
                <h1>Tâches</h1>
                <p>Concentrez-vous sur ce qui fait avancer votre business.</p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setFormState({ status: "todo" })}
              >
                + Nouvelle tâche
              </button>
            </div>

            {errorMsg && (
              <div className="task-error-banner">
                {errorMsg}
                <button type="button" onClick={loadTasks}>
                  Réessayer
                </button>
              </div>
            )}

            {loading ? (
              <p className="task-loading">Chargement des tâches…</p>
            ) : (
              <>
                <div className="task-board">
                  {STATUSES.map((status) => (
                    <TaskColumn
                      key={status}
                      status={status}
                      tasks={tasks.filter((t) => t.status === status)}
                      draggingId={draggingId}
                      onDragStart={setDraggingId}
                      onDragEnd={() => setDraggingId(null)}
                      onDropBefore={(beforeId) =>
                        moveTask(draggingId, status, beforeId)
                      }
                      onDropEnd={() => moveTask(draggingId, status, null)}
                      onAdd={(s) => setFormState({ status: s })}
                      onEdit={(task) => setFormState(task)}
                      onDelete={(task) => setDeleteTarget(task)}
                      onPlanAction={(task) => setPlanTarget(task)}
                      onViewDetails={setSelectedTask}
                    />
                  ))}
                </div>

                <div className="grid-main" style={{ marginTop: 18 }}>
                  <ProgressPanel percent={percent} done={done} total={total} />
                  <TaskAIPanel task={priorityTask} />
                </div>
              </>
            )}
          </div>
        </main>
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      </div>

      {formState && (
        <TaskFormModal
          initialTask={formState.id ? formState : null}
          defaultStatus={formState.status}
          onClose={() => (saving ? null : setFormState(null))}
          onSave={handleSaveTask}
        />
      )}

            {planTarget && (
        <PlanActionModal
          recommendation={planTarget}
          profile={profile}
          onClose={() => setPlanTarget(null)}
          onCreated={() => {
            setPlanTarget(null);
            loadTasks();
          }}
        />
      )}


      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer "${deleteTarget.title}" ? Cette action est irréversible.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
    
  );
}

export default Tasks;
