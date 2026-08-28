import React from "react";
import { useNavigate } from "react-router-dom";
import KalymaLogoLight from "../assets/brands/kalyma-logo-light.svg";
import KalymaLogo from "../assets/brands/kalyma-logo.svg";




const FLOW_STEPS = [
  {
    number: "01",
    label: "COMPRENDRE",
    title: "Diagnostic",
    description:
      "Kalyma analyse votre activité, identifie les blocages et fait ressortir les opportunités qui méritent votre attention.",
    icon: "◉",
    path: "/diagnostic",
    color: "gold",
  },
  {
    number: "02",
    label: "DÉCIDER",
    title: "Objectifs",
    description:
      "Transformez les recommandations stratégiques en résultats précis, mesurables et alignés avec vos priorités.",
    icon: "◎",
    path: "/objectifs",
    color: "blue",
  },
  {
    number: "03",
    label: "PLANIFIER",
    title: "Projets",
    description:
      "Chaque objectif devient un chantier structuré avec une logique claire et une progression visible.",
    icon: "◇",
    path: "/projects",
    color: "purple",
  },
  {
    number: "04",
    label: "EXÉCUTER",
    title: "Tâches",
    description:
      "Les projets sont transformés en actions concrètes que vous pouvez prioriser, exécuter et suivre.",
    icon: "✓",
    path: "/tasks",
    color: "green",
  },
  {
    number: "05",
    label: "ACQUÉRIR",
    title: "CRM",
    description:
      "Vos actions commerciales alimentent votre pipeline et vous permettent de suivre chaque opportunité.",
    icon: "◌",
    path: "/crm",
    color: "orange",
  },
  {
    number: "06",
    label: "CONVERTIR",
    title: "Rendez-vous",
    description:
      "Les prospects qualifiés deviennent des rendez-vous avec un contexte commercial clair.",
    icon: "◫",
    path: "/meetings",
    color: "red",
  },
  {
    number: "07",
    label: "SUIVRE",
    title: "Prochaine action",
    description:
      "Après chaque interaction, Kalyma vous aide à identifier et planifier la prochaine action.",
    icon: "→",
    path: "/tasks",
    color: "cyan",
  },
  {
    number: "08",
    label: "RÉSULTAT",
    title: "Client gagné",
    description:
      "Le cycle se termine par un résultat business concret et alimente à nouveau votre pilotage.",
    icon: "★",
    path: "/crm",
    color: "gold",
  },
];

const MODULES = [
  {
    title: "Dashboard",
    question: "Sur quoi dois-je me concentrer maintenant ?",
    path: "/dashboard",
  },
  {
    title: "Diagnostic",
    question: "Qu'est-ce qui bloque ma croissance ?",
    path: "/diagnostic",
  },
  {
    title: "Objectifs",
    question: "Où veux-je aller ?",
    path: "/objectifs",
  },
  {
    title: "Projets",
    question: "Comment atteindre mes objectifs ?",
    path: "/projects",
  },
  {
    title: "Tâches",
    question: "Qu'est-ce que je dois faire ?",
    path: "/tasks",
  },
  {
    title: "CRM",
    question: "Qui dois-je convertir ?",
    path: "/crm",
  },
  {
    title: "Meetings",
    question: "Qui dois-je rencontrer ?",
    path: "/meetings",
  },
];

function HowItWorks() {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <main className="lp-body how-it-works-page">

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav className="lp-nav lp-nav-solid">
        <div className="lp-nav-inner">
          <button
            className="lp-logo how-logo-button"
            onClick={() => goTo("/")}
            type="button"
          >
             <img src={KalymaLogo} style={{width:"150px"}} alt="Kalyma" />
          </button>

          <div className="lp-nav-links">
            <button onClick={() => goTo("/dashboard")}>
              Dashboard
            </button>

            <button onClick={() => goTo("/diagnostic")}>
              Diagnostic
            </button>

            <button onClick={() => goTo("/crm")}>
              CRM
            </button>

            <button onClick={() => goTo("/tasks")}>
              Tâches
            </button>
          </div>

          <button
            className="lp-nav-cta"
            onClick={() => goTo("/dashboard")}
            type="button"
          >
            Accéder à Kalyma
          </button>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="lp-hero how-hero">
        <div className="lp-hero-pattern" />

        <div className="lp-hero-inner">
          <span className="lp-eyebrow">
            COMMENT FONCTIONNE KALYMA
          </span>

          <h1 className="lp-hero-title">
            De la <em>stratégie</em>
            <br />
            à l'action.
          </h1>

          <p className="lp-hero-sub">
            Kalyma transforme les informations de votre entreprise
            en décisions, puis vos décisions en actions concrètes,
            jusqu'au résultat.
          </p>

          <div className="how-hero-actions">
            <button
              className="lp-hero-cta"
              onClick={() => goTo("/diagnostic")}
            >
              Commencer mon diagnostic
            </button>

            <button
              className="lp-hero-secondary"
              onClick={() => {
                document
                  .getElementById("kalyma-flow")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Découvrir le fonctionnement ↓
            </button>
          </div>

          <div className="lp-stat-strip">
            <div className="lp-stat">
              <strong>01</strong>
              <span>Comprendre</span>
            </div>

            <div className="lp-stat">
              <strong>02</strong>
              <span>Décider</span>
            </div>

            <div className="lp-stat">
              <strong>03</strong>
              <span>Exécuter</span>
            </div>

            <div className="lp-stat">
              <strong>04</strong>
              <span>Convertir</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section className="lp-section how-intro-section">
        <div className="lp-section-inner lp-visible">

          <div className="how-intro-grid">

            <div>
              <span className="lp-eyebrow lp-eyebrow-dark">
                UN SEUL SYSTÈME
              </span>

              <h2 className="lp-h2">
                Kalyma ne juxtapose pas des outils.
              </h2>
            </div>

            <div className="how-intro-text">
              <p>
                CRM, tâches, objectifs, rendez-vous et diagnostic
                ne fonctionnent pas comme des modules isolés.
              </p>

              <p>
                Chaque information peut alimenter une autre partie
                du système afin de créer une continuité entre votre
                réflexion stratégique et votre exécution quotidienne.
              </p>

              <div className="how-highlight">
                <span>La logique Kalyma</span>
                <strong>
                  Comprendre → Décider → Planifier → Exécuter →
                  Vendre → Suivre
                </strong>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FLOW
      ====================================================== */}

      <section
        id="kalyma-flow"
        className="lp-section how-flow-section"
      >
        <div className="lp-section-inner lp-visible">

          <div className="how-section-heading">
            <span className="lp-eyebrow lp-eyebrow-dark">
              LE FLOW KALYMA
            </span>

            <h2 className="lp-h2">
              Une boucle qui transforme
              <br />
              les décisions en résultats.
            </h2>

            <p>
              Chaque étape apporte du contexte à la suivante.
              Le système conserve ainsi le pourquoi derrière chaque action.
            </p>
          </div>

          <div className="how-flow">

            {FLOW_STEPS.map((step, index) => (
              <React.Fragment key={step.number}>

                <article
                  className={`how-flow-card how-flow-${step.color}`}
                  onClick={() => goTo(step.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      goTo(step.path);
                    }
                  }}
                >
                  <div className="how-flow-card-top">
                    <span className="how-flow-number">
                      {step.number}
                    </span>

                    <span className="how-flow-icon">
                      {step.icon}
                    </span>
                  </div>

                  <span className="how-flow-label">
                    {step.label}
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  <span className="how-flow-link">
                    Explorer →
                  </span>
                </article>

                {index < FLOW_STEPS.length - 1 && (
                  <div className="how-flow-arrow">
                    →
                  </div>
                )}

              </React.Fragment>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          WHY DIAGNOSTIC
      ====================================================== */}

      <section className="lp-section how-diagnostic-section">
        <div className="lp-section-inner lp-visible">

          <div className="how-diagnostic-grid">

            <div className="how-diagnostic-copy">
              <span className="lp-eyebrow lp-eyebrow-dark">
                01 — COMPRENDRE
              </span>

              <h2 className="lp-h2">
                Tout commence par
                <br />
                le diagnostic.
              </h2>

              <p>
                Avant de vous demander quoi faire, Kalyma cherche
                à comprendre votre situation.
              </p>

              <p>
                Le diagnostic identifie les points forts, les blocages,
                les opportunités et les priorités susceptibles d'avoir
                le plus d'impact.
              </p>

              <button
                className="how-dark-button"
                onClick={() => goTo("/diagnostic")}
              >
                Voir mon diagnostic →
              </button>
            </div>

            <div className="how-diagnostic-card">

              <div className="diagnostic-card-header">
                <span>DIAGNOSTIC IA</span>
                <span className="diagnostic-status">
                  ANALYSÉ
                </span>
              </div>

              <div className="diagnostic-score">
                <div>
                  <span>Score stratégique</span>
                  <strong>72</strong>
                </div>

                <small>/100</small>
              </div>

              <div className="diagnostic-lines">

                <div>
                  <span>Positionnement</span>
                  <strong>72</strong>
                </div>

                <div>
                  <span>Acquisition</span>
                  <strong>64</strong>
                </div>

                <div>
                  <span>Offre</span>
                  <strong>81</strong>
                </div>

                <div>
                  <span>Vente</span>
                  <strong>58</strong>
                </div>

              </div>

              <div className="diagnostic-recommendation">
                <span>RECOMMANDATION IA</span>

                <p>
                  Clarifier la proposition de valeur principale
                  afin de faciliter la compréhension de votre offre.
                </p>

                <strong>
                  Priorité P1 — Impact élevé
                </strong>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          WHY TRACEABILITY
      ====================================================== */}

      <section className="lp-section how-context-section">
        <div className="lp-section-inner lp-visible">

          <div className="how-section-heading">
            <span className="lp-eyebrow lp-eyebrow-dark">
              LA TRAÇABILITÉ
            </span>

            <h2 className="lp-h2">
              Chaque action garde
              <br />
              son contexte.
            </h2>

            <p>
              Une tâche n'est jamais simplement une tâche.
              Kalyma conserve le lien entre le problème détecté,
              la décision prise et l'action réalisée.
            </p>
          </div>

          <div className="how-context-chain">

            <div className="context-node">
              <span>DIAGNOSTIC</span>
              <strong>Problème identifié</strong>
            </div>

            <div className="context-line">
              →
            </div>

            <div className="context-node">
              <span>RECOMMANDATION</span>
              <strong>Clarifier l'offre</strong>
            </div>

            <div className="context-line">
              →
            </div>

            <div className="context-node">
              <span>OBJECTIF</span>
              <strong>Repositionner l'offre</strong>
            </div>

            <div className="context-line">
              →
            </div>

            <div className="context-node">
              <span>PROJET</span>
              <strong>Refonte du positionnement</strong>
            </div>

            <div className="context-line">
              →
            </div>

            <div className="context-node">
              <span>TÂCHE</span>
              <strong>Reformuler la promesse</strong>
            </div>

          </div>

          <div className="how-context-result">
            <span>Pourquoi cette tâche existe ?</span>

            <strong>
              Parce qu'une analyse du diagnostic a identifié
              un problème de positionnement.
            </strong>
          </div>

        </div>
      </section>

      {/* =====================================================
          MODULES
      ====================================================== */}

      <section className="lp-section how-modules-section">
        <div className="lp-section-inner lp-visible">

          <div className="how-section-heading">
            <span className="lp-eyebrow lp-eyebrow-dark">
              LES MODULES
            </span>

            <h2 className="lp-h2">
              Chaque module répond
              <br />
              à une question.
            </h2>
          </div>

          <div className="how-modules-grid">

            {MODULES.map((module, index) => (
              <button
                key={module.title}
                className="how-module-card"
                onClick={() => goTo(module.path)}
                type="button"
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{module.title}</strong>

                <p>{module.question}</p>

                <small>Ouvrir →</small>
              </button>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          DASHBOARD
      ====================================================== */}

      <section className="lp-section how-dashboard-section">
        <div className="lp-section-inner lp-visible">

          <div className="how-dashboard-grid">

            <div>
              <span className="lp-eyebrow">
                LE CHEF D'ORCHESTRE
              </span>

              <h2 className="lp-h2 lp-h2-light">
                Le Dashboard ne vous
                <br />
                donne pas plus d'informations.
                <br />
                Il vous donne une priorité.
              </h2>

              <p className="how-dashboard-copy">
                Kalyma observe vos objectifs, vos tâches,
                vos prospects, vos rendez-vous et vos recommandations
                pour déterminer ce qui mérite votre attention maintenant.
              </p>

              <button
                className="lp-hero-cta"
                onClick={() => goTo("/dashboard")}
              >
                Ouvrir mon Dashboard →
              </button>
            </div>

            <div className="how-dashboard-card">

              <div className="dashboard-card-top">
                <div>
                  <span>JEUDI 27 AOÛT</span>
                  <strong>Votre journée</strong>
                </div>

                <span className="dashboard-ai">
                  KALYMA AI
                </span>
              </div>

              <div className="dashboard-priority main-priority">
                <span>01 — PRIORITÉ</span>

                <strong>
                  Relancer 3 prospects qualifiés
                </strong>

                <button onClick={() => goTo("/crm")}>
                  Voir le CRM →
                </button>
              </div>

              <div className="dashboard-priority">
                <span>02 — IMPORTANT</span>

                <strong>
                  Préparer le rendez-vous de 14h
                </strong>

                <button onClick={() => goTo("/meetings")}>
                  Voir le rendez-vous →
                </button>
              </div>

              <div className="dashboard-priority">
                <span>03 — STRATÉGIQUE</span>

                <strong>
                  Votre objectif est à 40 %
                </strong>

                <button onClick={() => goTo("/objectifs")}>
                  Voir l'objectif →
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="lp-section how-final-section">
        <div className="lp-section-inner lp-visible">

          <span className="lp-eyebrow lp-eyebrow-dark">
            PRÊT À PILOTER AUTREMENT ?
          </span>

          <h2 className="lp-h2">
            Comprenez votre activité.
            <br />
            Décidez quoi faire.
            <br />
            <em>Faites-le.</em>
          </h2>

          <p>
            Kalyma transforme votre stratégie en système d'exécution.
          </p>

          <div className="how-final-actions">
            <button
              className="lp-hero-cta"
              onClick={() => goTo("/diagnostic")}
            >
              Faire mon diagnostic gratuit
            </button>

            <button
              className="how-final-link"
              onClick={() => goTo("/dashboard")}
            >
              Accéder à mon espace →
            </button>
          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="how-footer">
        <div className="lp-section-inner">

          <div className="how-footer-brand">
            <img src={KalymaLogoLight} style={{width:"180px"}} alt="Kalyma" />
          </div>

          <p>
            L'OS opérationnel des entrepreneurs.
          </p>

          <div className="how-footer-links">
            <button onClick={() => goTo("/dashboard")}>
              Dashboard
            </button>

            <button onClick={() => goTo("/diagnostic")}>
              Diagnostic
            </button>

            <button onClick={() => goTo("/crm")}>
              CRM
            </button>

            <button onClick={() => goTo("/tasks")}>
              Tâches
            </button>
          </div>

        </div>
      </footer>

    </main>
  );
}

export default HowItWorks;