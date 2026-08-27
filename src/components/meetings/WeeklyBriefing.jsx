import { useEffect, useState } from "react";
import { getWeeklyBriefing } from "../../services/copilot";

function WeeklyBriefing() {
  const [brief, setBrief] = useState(null);

  useEffect(() => {
    getWeeklyBriefing().then(setBrief).catch(() => setBrief(null));
  }, []);

  if (!brief) return null;

  const lines = [];
  if (brief.relancesToday > 0) {
    lines.push(`${brief.relancesToday} relance${brief.relancesToday > 1 ? "s" : ""} client à faire aujourd'hui.`);
  }
  if (brief.meetingsToday > 0) {
    lines.push(`${brief.meetingsToday} rendez-vous prévu${brief.meetingsToday > 1 ? "s" : ""} aujourd'hui.`);
  }
  if (brief.highPriorityTasks > 0) {
    lines.push(`${brief.highPriorityTasks} tâche${brief.highPriorityTasks > 1 ? "s" : ""} haute priorité en attente.`);
  }
  if (brief.lateObjectives > 0) {
    lines.push(`${brief.lateObjectives} objectif${brief.lateObjectives > 1 ? "s" : ""} en retard sur l'échéance.`);
  }
  if (brief.pendingRecommendation) {
    lines.push(`Recommandation IA non traitée : « ${brief.pendingRecommendation} ».`);
  }

  return (
    <section className="ai copilot-brief">
      <span className="tag">KALYMA AI</span>
      <h3>Votre semaine en un coup d&apos;œil</h3>

      {lines.length === 0 ? (
        <p>Rien d&apos;urgent — bon rythme, continuez comme ça.</p>
      ) : (
        <ul>
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default WeeklyBriefing;
