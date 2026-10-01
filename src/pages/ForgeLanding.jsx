import { useEffect, useState } from "react";

/* Landing page — THE FORGE (ALCHIMIE™)
   Utilise les classes du design system « lp-* » de Kalyma.
   déjà être définies dans ton CSS global. */
import Footer from "../components/landing/Footer";

const CALENDLY_URL = "https://calendly.com/kalyma/appel-de-cadrage-le-signal";

// Couleurs Kalyma appliquées à l'intérieur du widget Calendly
// (les 3 seuls paramètres que Calendly autorise à personnaliser,
// sans le # devant le code hexadécimal)
const CALENDLY_COLORS = {
  primary_color: "f4b740", // jaune Kalyma — boutons et créneaux sélectionnés
  text_color: "1c2431", // navy Kalyma — texte du widget
  background_color: "ffffff", // fond du widget
};

function useCalendlyScript() {
  useEffect(() => {
    if (!document.querySelector('link[href*="calendly.com/assets/external/widget.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(link);
    }

    if (!window.Calendly && !document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
}

function openCalendlyPopup(offerName) {
  if (window.Calendly) {
    const params = new URLSearchParams({
      utm_content: offerName,
      ...CALENDLY_COLORS,
    });
    window.Calendly.initPopupWidget({
      url: `${CALENDLY_URL}?${params.toString()}`,
    });
  }
}
 
function OfferDetailCard({ offer }) {
  return (
    <div className={`lp-offer-detail ${offer.featured ? "lp-offer-detail-featured" : ""}`}>
      <span className="lp-offer-tag">{offer.tag}</span>
      <h3 className="lp-offer-detail-name">{offer.name}</h3>
      <p className="lp-offer-detail-promise">{offer.promise}</p>

      <div className="lp-offer-meta-row">
        {offer.meta.map((m) => (
          <div className="lp-offer-meta-item" key={m.label}>
            <strong>{m.label}</strong>
            <span>{m.value}</span>
          </div>
        ))}
      </div>

      <p className="lp-offer-section-label">Ce que vous obtenez concrètement</p>
      <ul className="lp-offer-checklist">
        {offer.deliverables.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>

      <div className="lp-offer-stack">
        <p className="lp-offer-stack-title">Ce que ça vaut réellement</p>
        {offer.stack.map((s) => (
          <div className="lp-offer-stack-row" key={s.label}>
            <span>{s.label}</span>
            <span>{s.value}</span>
          </div>
        ))}
        <div className="lp-offer-stack-total">
          <span>Valeur totale</span>
          <span>{offer.stackTotal}</span>
        </div>
      </div>

      <div className="lp-offer-price-block">
        <div className="lp-offer-price-from">{offer.priceFrom}</div>
        <div className="lp-offer-price-value">
          {offer.price} <small>{offer.priceUnit}</small>
        </div>
      </div>

      <div className="lp-offer-guarantee">
        <b>{offer.guaranteeTitle} : </b>
        {offer.guaranteeText}
      </div>

      <div className="lp-offer-bonus-scarcity">
        <div>
          <b>Bonus inclus</b>
          {offer.bonus}
        </div>
        <div>
          <b>Places</b>
          {offer.scarcity}
        </div>
      </div>

      <button
        type="button"
        onClick={() => openCalendlyPopup(offer.name)}
        className={`btn ${offer.featured ? "btn-yellow" : "btn-ghost-light"}`}
      >
        Choisir {offer.name}
      </button>
    </div>
  );
}


const CTA_HREF = "#candidater"; // remplace par ton lien de prise de rendez-vous
const COHORT_DATE = "lundi 2 novembre 2026";

const problems = [
  ["« Mais concrètement, tu fais quoi ? »", "Ton activité demande cinq minutes d'explication, et en face on hoche la tête sans vraiment comprendre."],
  ["Un positionnement en retard sur ton niveau", "Ton profil et ton offre racontent encore la version de tes débuts, pas celle d'aujourd'hui."],
  ["Tu publies, personne ne t'écrit", "Tu es vue, mais ta valeur n'est pas comprise : la visibilité ne se transforme pas en conversations."],
  ["Des prospects qui ne te correspondent pas", "Tes appels découverte n'aboutissent pas, parce que ton message attire à côté."],
  ["Une offre premium difficile à vendre", "Ton positionnement ne justifie pas naturellement le prix que tu veux assumer."],
  ["Trop de stratégies, aucun déclic", "Formation, refonte d'offre, plus de posts : le problème se situe en amont, alors il persiste."],
];

const pillars = [
  ["Le cœur de ton expertise", "La carte de ta valeur : ce que tu fais mieux ou autrement, et le problème que tu possèdes.",
    <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>],
  ["Un positionnement et une offre", "Positionnement, promesse et architecture d'offre, avec un prix que ton positionnement justifie.",
    <><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /></>],
  ["Un message installé", "Profil LinkedIn, pitch de 10 secondes, page d'offre et argumentaire réécrits.",
    <path d="M4 5h16v11H9l-5 4V5Z" />],
  ["Des conversations enclenchées", "Plan d'activation, scripts et ajustements chaque semaine pendant 6 semaines.",
    <path d="M4 12h16M14 6l6 6-6 6" />],
];

const steps = [
  ["Sem. 1-2", "Décoder", "Ton business, tes clients, tes résultats et tes contradictions passent au crible."],
  ["Sem. 1-2", "Révéler", "Tu identifies le cœur de ton expertise, le problème que tu possèdes et ta cible prioritaire."],
  ["Sem. 3-4", "Positionner", "Positionnement, promesse, offre et prix alignés sur ta vraie valeur."],
  ["Sem. 5-6", "Traduire", "Ton profil, ton pitch, ta page d'offre et ton argumentaire parlent le langage de ta cible."],
  ["Sem. 6", "Valider", "Trois personnes de ta cible testent ton message : le comprennent-elles en 10 secondes ?"],
  ["Sem. 7-12", "Activer", "Plan de conversations, scripts et ajustements chaque semaine jusqu'à la semaine 12."],
];

const forgeIncludes = [
  "Décoder, Révéler, Positionner, Traduire",
  "Activation en boucle pendant 6 semaines",
  "Bonus : bibliothèque de structures de posts",
  "Bonus : script de qualification et gestion des objections",
  "Bonus : grille de test « 10 secondes »",
  "Bonus : audit de recalibrage à J+30",
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lp-section-inner, .lp-journey-svg");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add(e.target.classList.contains("lp-journey-svg") ? "lp-journey-drawn" : "lp-visible");
          io.unobserve(e.target);
        }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function OfferCard({ tag, title, price, text, items, cta, featured }) {
  return (
    <div className={`lp-offer-card${featured ? " lp-offer-featured" : ""}`}>
      <span className="lp-offer-tag">{tag}</span>
      <h3>{title}</h3>
      <div className="lp-offer-price">{price}</div>
      <p style={items ? { flex: "none" } : undefined}>{text}</p>
      {items && (
        <ul style={{ flex: 1, margin: "0 0 22px", padding: "0 0 0 18px", color: "var(--lp-on-dark)", fontSize: 13, lineHeight: 1.7 }}>
          {items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      )}
      <a className="lp-nav-cta" href={CTA_HREF} style={{ display: "block", textAlign: "center" }}>{cta}</a>
    </div>
  );
}

export default function ForgeLanding() {
  const [solid, setSolid] = useState(false);
  useCalendlyScript();

  useReveal();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-body">
      <nav className={`lp-nav${solid ? " lp-nav-solid" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo">The <span>Forge</span></div>
          <div className="lp-nav-links">
            <a href="#probleme">Le problème</a>
            <a href="#methode">Le parcours</a>
            <a href="#offre">L'offre</a>
            <a href="#garantie">La garantie</a>
          </div>
          <button className="lp-nav-cta"   onClick={() => openCalendlyPopup("The Forge")}>Candidater</button>
        </div>
      </nav>

      <header className="lp-hero">
        <div className="lp-hero-pattern" />
        <div className="lp-hero-inner">
          <span className="lp-eyebrow">Programme de 90 jours pour expertes B2B</span>
          <h1 className="lp-hero-title">
            Ton expertise est réelle. <em>Ton marché doit enfin la comprendre.</em>
          </h1>
          <p className="lp-hero-sub">
            The Forge t'aide à identifier le cœur de ton expertise, à en faire un positionnement clair et à ouvrir les bonnes conversations commerciales, en 12 semaines.
          </p>
          <div className="lp-hero-cta">
            <button className="lp-nav-cta" onClick={() => openCalendlyPopup("The Forge")} style={{ padding: "14px 26px", fontSize: 14 }}>Candidater à la prochaine cohorte</button>
            <a className="lp-hero-secondary" href="#methode">Voir le parcours</a>
          </div>
        </div>
        <div className="lp-stat-strip">
          <span><em>12</em> semaines</span>
          <span><em>5</em> places par cohorte</span>
          <span><em>2 h</em> par semaine maximum</span>
          <span>Garantie <em>Clarté</em> à la semaine 6</span>
        </div>
      </header>

      <section className="lp-section lp-section-light" id="probleme">
        <div className="lp-section-inner">
          <span className="lp-eyebrow lp-eyebrow-dark">Le vrai problème</span>
          <h2 className="lp-h2">Ce n'est pas un problème de visibilité. C'est un écart.</h2>
          <p className="lp-lead">Ta valeur réelle et ce que ton marché en perçoit ne sont plus au même niveau. Plus tu expliques, plus ton message se complique.</p>
          <div className="lp-problem-grid">
            {problems.map(([t, p]) => (
              <div className="lp-problem-card" key={t}><h3>{t}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section-dark">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">Le résultat</span>
          <h2 className="lp-h2 lp-h2-light">Ce que tu as en main à J+90</h2>
          <div className="lp-pillars-grid">
            {pillars.map(([t, p, icon]) => (
              <div className="lp-pillar-card" key={t}>
                <svg className="lp-pillar-icon" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
                <h3>{t}</h3><p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section-light" id="methode">
        <div className="lp-section-inner">
          <span className="lp-eyebrow lp-eyebrow-dark">Le parcours</span>
          <h2 className="lp-h2">12 semaines : six pour construire, six pour tester face au marché</h2>
          <div className="lp-journey-svg-wrap">
            <svg className="lp-journey-svg" viewBox="0 0 1000 140" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength="1" d="M83 90 Q166 40 250 50 T417 90 T583 50 T750 90 T917 50" />
              {[[83, 90], [250, 50], [417, 90], [583, 50], [750, 90], [917, 50]].map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="7" />
              ))}
            </svg>
          </div>
          <div className="lp-journey-grid">
            {steps.map(([n, t, p]) => (
              <div className="lp-journey-card" key={t}>
                <span className="lp-journey-num">{n}</span><h3>{t}</h3><p>{p}</p>
              </div>
            ))}
          </div>
          <p className="lp-lead">Accompagnement asynchrone structuré : exercices guidés, retours en audio ou vidéo sous 48 h ouvrées et 3 points en direct de 45 minutes (semaines 2, 6 et 12).</p>
        </div>
      </section>

      <section className="lp-section lp-section-dark" id="offre">
        <div className="lp-section-inner">
          <span className="lp-eyebrow">L'offre</span>
          <h2 className="lp-h2 lp-h2-light">Choisis ton point d'entrée</h2>
          <div className="lp-offers-grid">
            <OfferCard
              tag="Point d'entrée" title="The Signal" price="Diagnostic d'entrée"
              text="Un premier regard sur ton positionnement pour voir où ton message se brouille. Déduit du prix de The Forge si tu t'inscris dans les 7 jours."
              cta="Demander le diagnostic"
            />
            <OfferCard
              featured tag="Programme principal" title="The Forge" price="2 900 € ou 3 × 1 000 €"
              text="12 semaines pour passer de « compétente mais difficile à comprendre » à « mon marché comprend pourquoi me choisir »."
              items={forgeIncludes} cta="Candidater"
            />
            <OfferCard
              tag="3 places" title="Cohorte fondatrice" price="2 400 €"
              text="Le même programme au tarif fondateur, en échange d'un témoignage et d'une étude de cas à la fin des 90 jours."
              cta="Candidater à la cohorte fondatrice"
            />
          </div>
        </div>
      </section>

      <section className="lp-section lp-section-light" id="garantie">
        <div className="lp-section-inner">
          <span className="lp-eyebrow lp-eyebrow-dark">Le cadre</span>
          <h2 className="lp-h2">Un cadre clair, dans les deux sens</h2>
          <div className="lp-problem-grid">
            <div className="lp-problem-card">
              <h3>La garantie Clarté</h3>
              <p>À la fin de la semaine 6, si tu as fait les exercices et que 3 personnes de ta cible ne comprennent pas ton positionnement en 10 secondes, je retravaille avec toi sans frais jusqu'à ce que ce soit le cas, dans la limite de 6 semaines supplémentaires.</p>
            </div>
            <div className="lp-problem-card">
              <h3>The Forge est pour toi si…</h3>
              <p>Tu as déjà des clients et une vraie expertise. Ta valeur dépasse la façon dont ton marché la perçoit. Tu es prête à faire des choix et à les appliquer.</p>
            </div>
            <div className="lp-problem-card">
              <h3>The Forge n'est pas pour toi si…</h3>
              <p>Tu démarres ton activité, tu cherches surtout des abonnés ou à apprendre LinkedIn, ou tu veux que quelqu'un fasse tout à ta place.</p>
            </div>
          </div>
          <p className="lp-lead">Je ne promets pas de te ramener des clients : je crée les conditions pour qu'on te comprenne. L'exécution commerciale reste un travail partagé.</p>
        </div>
      </section>

      <section className="lp-section lp-section-dark" id="candidater">
        <div className="lp-section-inner" style={{ textAlign: "center" }}>
          <h2 className="lp-h2 lp-h2-light" style={{ margin: "0 auto" }}>Prochaine cohorte : {COHORT_DATE}</h2>
          <p style={{ color: "var(--lp-on-dark)", maxWidth: 520, margin: "16px auto 30px", fontSize: 15.5, lineHeight: 1.7 }}>
            5 places, parce que je relis chaque livrable personnellement. Les inscriptions ferment une semaine avant le démarrage.
          </p>
          <button className="lp-nav-cta" onClick={() => openCalendlyPopup("The Forge")} style={{ padding: "14px 26px", fontSize: 14 }}>Candidater à la prochaine cohorte</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}