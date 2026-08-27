import { useState } from "react";

import { supabase } from "../../../lib/supabase";
import Modal from "../shared/Modal";

const OUTCOMES = [
  { value: "qualifie", label: "Qualifié" },
  { value: "a_relancer", label: "À relancer" },
  { value: "proposition_envoyee", label: "Proposition envoyée" },
  { value: "pas_interesse", label: "Pas intéressé" },
  { value: "gagne", label: "Gagné" },
  { value: "perdu", label: "Perdu" },
];

function MeetingOutcomeModal({ meeting, onClose, onSave }) {
  const [outcome, setOutcome] = useState("qualifie");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

     console.log("-------------------OUTCOME--------------",outcome)

    // Mise à jour du prospect uniquement pour "gagne" ou "perdu"
    if (outcome === "gagne" || outcome === "perdu") {

     
      const { error } = await supabase
        .from("prospects")
        .update({
          stage: outcome,
          closed_at: new Date().toISOString(),
        })
        .eq("id", meeting.prospect_id);

      if (error) {
        console.error("Erreur lors de la mise à jour du prospect :", error);
        return;
      }
    }

    // Continuer le traitement existant du résultat du meeting
    onSave({
      outcome,
      outcomeNotes: notes,
    });
  };

  return (
    <Modal
      title="Que s'est-il passé ?"
      subtitle={meeting.companyName}
      onClose={onClose}
      width={460}
      footer={
        <>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            type="submit"
            form="outcome-form"
            className="btn btn-primary"
          >
            Enregistrer
          </button>
        </>
      }
    >
      <form id="outcome-form" onSubmit={handleSubmit}>
        <div
          className="field field-full"
          style={{ marginBottom: 16 }}
        >
          <label>Résultats</label>

          <div
            className="segmented"
            style={{ flexWrap: "wrap" }}
          >
            {OUTCOMES.map((o) => (
              <button
                type="button"
                key={o.value}
                className={outcome === o.value ? "active" : ""}
                onClick={() => setOutcome(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field field-full">
          <label>Compte-rendu</label>

          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <p
          className="import-hint"
          style={{ marginTop: 10 }}
        >
          Une tâche "prochaine action" sera créée automatiquement selon
          le résultat choisi.
        </p>
      </form>
    </Modal>
  );
}

export default MeetingOutcomeModal;