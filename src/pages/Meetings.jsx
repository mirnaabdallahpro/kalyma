import { useEffect, useState } from "react";
import { closeMeetingWithOutcome, deleteMeeting, getMeetings } from "../../services/meetings";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import MeetingCard from "../components/meetings/MeetingCard";
import MeetingOutcomeModal from "../components/meetings/Meetingoutcomemodal";
import ConfirmModal from "../components/shared/ConfirmModal";
import "../styles/meetings.css";


function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [outcomeTarget, setOutcomeTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setErrorMsg("");
      setMeetings(await getMeetings());
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de charger les rendez-vous.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOutcome = async ({ outcome, outcomeNotes }) => {
    if (!outcomeTarget) return;
    try {
      const { meeting } = await closeMeetingWithOutcome(outcomeTarget.id, { outcome, outcomeNotes });
      setMeetings((prev) => prev.map((m) => (m.id === meeting.id ? meeting : m)));
    } catch (err) {
      setErrorMsg(err?.message || "Impossible d'enregistrer le compte-rendu.");
    } finally {
      setOutcomeTarget(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMeeting(deleteTarget.id);
      setMeetings((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de supprimer.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const upcoming = meetings.filter((m) => m.status === "scheduled");
  const past = meetings.filter((m) => m.status !== "scheduled");

  return (
    <div className="dashboard-body">
      <div className="app">
        <Sidebar />
        <main className="main">
          <Topbar />
          <div className="content">
            <div className="welcome">
              <div>
                <h1>Rendez-vous</h1>
                <p>Programme un RDV depuis une opportunité CRM. il apparaît ici.</p>
              </div>
            </div>

            {errorMsg && (
              <div className="task-error-banner">
                {errorMsg}
                <button type="button" onClick={load}>Réessayer</button>
              </div>
            )}

            {loading ? (
              <p className="task-loading">Chargement…</p>
            ) : (
              <>
                <section className="panel">
                  <div className="panel-head">
                    <h3>À venir</h3>
                    <span className="muted">{upcoming.length}</span>
                  </div>
                  {upcoming.length === 0 ? (
                    <p className="empty-state">Aucun rendez-vous programmé.</p>
                  ) : (
                    upcoming.map((m) => (
                      <MeetingCard key={m.id} meeting={m} onClose={setOutcomeTarget} onDelete={setDeleteTarget} />
                    ))
                  )}
                </section>

                <section className="panel" style={{ marginTop: 18 }}>
                  <div className="panel-head">
                    <h3>Historique</h3>
                    <span className="muted">{past.length}</span>
                  </div>
                  {past.length === 0 ? (
                    <p className="empty-state">Aucun rendez-vous passé.</p>
                  ) : (
                    past.map((m) => (
                      <MeetingCard key={m.id} meeting={m} onClose={setOutcomeTarget} onDelete={setDeleteTarget} />
                    ))
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {outcomeTarget && (
        <MeetingOutcomeModal
          meeting={outcomeTarget}
          onClose={() => setOutcomeTarget(null)}
          onSave={handleOutcome}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Supprimer ce rendez-vous avec "${deleteTarget.companyName}" ?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default Meetings;