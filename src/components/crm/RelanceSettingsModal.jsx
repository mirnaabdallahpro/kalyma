import { useEffect, useState } from "react";
import Modal from "../shared/Modal";

const OPTIONS = [3, 4, 5, 7, 30];

function RelanceSettingsModal({ initialSettings, onClose, onSave }) {
  const [intervals, setIntervals] = useState(initialSettings.intervals || [3, 7, 30]);
  const [enabled, setEnabled] = useState(initialSettings.enabled !== false);

  useEffect(() => {
    setIntervals(initialSettings.intervals || [3, 7, 30]);
    setEnabled(initialSettings.enabled !== false);
  }, [initialSettings]);

  const toggle = (day) => {
    setIntervals((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ intervals, enabled });
  };

  return (
    <Modal
      title="Configurer les relances automatiques"
      subtitle="Une séquence de relances est générée à la création de chaque opportunité"
      onClose={onClose}
      width={460}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" form="relance-settings-form" className="btn btn-primary">
            Enregistrer
          </button>
        </>
      }
    >
      <form id="relance-settings-form" onSubmit={handleSubmit}>
        <div className="field field-full" style={{ marginBottom: 18 }}>
          <label className="relance-toggle-label">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Activer les relances automatiques
          </label>
        </div>

        <div className="field field-full">
          <label>Intervalles (en jours après création)</label>
          <div className="relance-options">
            {OPTIONS.map((day) => (
              <button
                type="button"
                key={day}
                className={intervals.includes(day) ? "active" : ""}
                onClick={() => toggle(day)}
                disabled={!enabled}
              >
                J{day}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default RelanceSettingsModal;
