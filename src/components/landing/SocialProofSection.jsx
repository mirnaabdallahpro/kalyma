import lexcallLogo from "../../assets/logos/lexcall.png";
import moovicarLogo from "../../assets/logos/moovicar.png";


function SocialProofSection() {
  const clients = [
    { name: "Entreprise 1", logo: moovicarLogo},
    { name: "Entreprise 2", logo: lexcallLogo },
    { name: "Entreprise 1", logo: moovicarLogo },
   
  ];

  return (
   <section className="lp-section lp-section-light lp-social-proof">
  <div className="lp-section-inner">
    <span className="lp-eyebrow lp-eyebrow-dark">
      Premiers partenaires
    </span>

    <h2 className="lp-h2">
      Ils nous font confiance pour structurer leur activité.
    </h2>

    <p className="lp-lead">
      Kalyma accompagne actuellement ses premiers clients. Les
      témoignages et études de cas seront publiés ici au fil des
      résultats obtenus.
    </p>

    <div className="lp-proof-slots">
      {clients.map((client) => (
        <div className="lp-proof-slot" key={client.name}>
          <img
            src={client.logo}
            alt={`Logo ${client.name}`}
            className="lp-client-logo"
          />
        </div>
      ))}
    </div>
  </div>
</section>
  );
}

export default SocialProofSection;