import { useState } from "react";
import Modal from "../shared/Modal";

function QualificationModal({ deal, onClose, onSave }) {
  const [besoin, setBesoin] = useState(deal.qualificationBesoin || false);
  const [budget, setBudget] = useState(deal.qualificationBudget || false);
  const [timing, setTiming] = useState(deal.qualificationTiming || false);
  const [authority, setAuthority] = useState(deal.qualificationAuthority || false);

  const qualified = besoin && budget && timing && authority;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ besoin, budget, timing, authority });
  };

  return (
    <Modal
      title="Qualifier le prospect"
      subtitle={deal.companyName}
      onClose={onClose}
      width={460}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            form="qualification-form"
            className={`btn ${qualified ? "btn-primary" : "btn-yellow"}`}
          >
            {qualified ? "Qualifier → RDV" : "Envoyer en Nurturing"}
          </button>
        </>
      }
    >
      <form id="qualification-form" onSubmit={handleSubmit}>
        <label className="qualif-check-row">
          <input
            type="checkbox"
            checked={besoin}
            onChange={(e) => setBesoin(e.target.checked)}
          />
          <div>
            <strong>Besoin</strong>
            <p>Le prospect a le problème que nous savons résoudre.</p>
          </div>
        </label>

        <label className="qualif-check-row">
          <input
            type="checkbox"
            checked={budget}
            onChange={(e) => setBudget(e.target.checked)}
          />
          <div>
            <strong>Budget</strong>
            <p>Il a les moyens de financer l&apos;offre concernée.</p>
          </div>
        </label>

        <label className="qualif-check-row">
          <input
            type="checkbox"
            checked={timing}
            onChange={(e) => setTiming(e.target.checked)}
          />
          <div>
            <strong>Timing</strong>
            <p>Il est prêt à démarrer l&apos;accompagnement dès aujourd&apos;hui.</p>
          </div>
        </label>

        <label className="qualif-check-row">
          <input
            type="checkbox"
            checked={authority}
            onChange={(e) => setAuthority(e.target.checked)}
          />
          <div>
            <strong>Autorité</strong>
            <p>Le contact a le pouvoir de décider, ou l&apos;accès direct au décideur.</p>
          </div>
        </label>

        <p className={`qualif-result ${qualified ? "qualif-result-ok" : "qualif-result-wait"}`}>
          {qualified
            ? "Les 3 critères sont réunis — le prospect passera directement en RDV."
            : "Au moins un critère manque — le prospect basculera en Nurturing avec une nouvelle séquence de relances."}
        </p>
      </form>
    </Modal>
  );
}

export default QualificationModal;