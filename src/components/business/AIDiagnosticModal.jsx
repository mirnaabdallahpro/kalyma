import Modal from "./Modal";

function AIDiagnosticModal({ profile, onClose }) {
  const points = [
    {
      label: "Positionnement",
      text: `Votre positionnement est jugé "${profile.positioning}". Continuez à le rappeler dans chaque prise de parole publique pour renforcer la mémorisation.`,
    },
    {
      label: "Proposition de valeur",
      text: `Complète à ${profile.valuePropositionScore}%. Ajoutez un résultat chiffré ou une preuve concrète pour la rendre plus tangible.`,
    },
    {
      label: "Offres",
      text: `${profile.offersCount} offre(s) structurée(s). Le prochain levier est la différenciation entre elles pour clarifier le parcours client.`,
    },
    {
      label: "Preuve sociale",
      text: "Aucun témoignage client n'est encore centralisé. C'est le prochain point à traiter pour renforcer la conversion.",
    },
  ];

  return (
    <Modal
      title="Diagnostic stratégique complet"
      subtitle="Analyse générée à partir de votre profil business"
      onClose={onClose}
      width={560}
    >
      <div className="diagnostic-list">
        {points.map((p) => (
          <div className="diagnostic-item" key={p.label}>
            <strong>{p.label}</strong>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default AIDiagnosticModal;
