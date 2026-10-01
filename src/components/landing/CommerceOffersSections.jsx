import useScrollReveal from "../../hooks/useScrollReveal";
import "./CommerceOffersSection.css";
import { OfferDetailCard, useCalendlyScript } from "./OfferShared";

const commerceOffers = [
  {
    tag: "Offre commerce",
    name: "La Vitrine",
    promise:
      "Être trouvable, crédible et joignable en ligne — pour que vos clients vous trouvent sans dépendre uniquement du bouche-à-oreille.",
    meta: [
      { label: "Pour qui", value: "Commerçants import-export, textile, beauté, restauration encore uniquement sur le réseau physique" },
      { label: "Délai", value: "10 jours ouvrés" },
      { label: "Effort demandé", value: "1h30 au total (photos + prise en main)" },
    ],
    deliverables: [
      "Une vitrine digitale (catalogue en ligne mobile, connecté à WhatsApp Business pour recevoir les commandes directement)",
      "Votre fiche Google Business optimisée et positionnée pour les recherches locales",
      "Un système simple de relance client (liste structurée + messages prêts à envoyer, sans logiciel compliqué)",
      "Un kit de 10 visuels prêts à poster sur Instagram/TikTok avec un calendrier de publication sur 30 jours",
      "Une session de prise en main d'1h pour être autonome — Kalyma ne garde pas les clés de votre outil",
    ],
    stack: [
      { label: "Vitrine digitale + intégration WhatsApp Business", value: "2 000 MAD" },
      { label: "Fiche Google Business optimisée + stratégie avis", value: "800 MAD" },
      { label: "Système de relance client (liste + messages prêts)", value: "1 200 MAD" },
      { label: "Kit 10 visuels + calendrier de publication 30 jours", value: "900 MAD" },
      { label: "Session de prise en main (1h)", value: "500 MAD" },
    ],
    stackTotal: "5 400 MAD",
    priceFrom: "Valeur réelle : 5 400 MAD",
    price: "2 490 MAD",
    priceUnit: "paiement unique",
    guaranteeTitle: "Garantie « vitrine en ligne ou remboursé »",
    guaranteeText:
      "si votre vitrine digitale n'est pas fonctionnelle et en ligne sous 10 jours ouvrés, vous êtes intégralement remboursé.",
    bonus: "Accès à un groupe WhatsApp d'entraide entre commerçants accompagnés par Kalyma",
    scarcity: "Limité à 10 vitrines par mois pour garantir un accompagnement personnalisé",
    featured: false,
  },
  {
    tag: "Offre premium commerce",
    name: "Le Comptoir",
    promise:
      "Votre vitrine digitale, gérée pour vous chaque mois — vous vous occupez de vos clients, Kalyma s'occupe de votre visibilité.",
    meta: [
      { label: "Pour qui", value: "Commerçants qui ont déjà La Vitrine (ou un site/catalogue existant) et veulent que ça vive sans y consacrer de temps" },
      { label: "Engagement", value: "Sans minimum de durée, résiliable avec 30 jours de préavis" },
      { label: "Effort demandé", value: "Envoyer vos nouveaux produits/photos par WhatsApp une fois par semaine" },
    ],
    deliverables: [
      "Mise à jour continue du catalogue en ligne (nouveaux produits, prix, ruptures de stock)",
      "Gestion de votre réputation en ligne : réponse aux avis, relance des clients satisfaits",
      "8 à 12 publications réseaux sociaux par mois, calendrier adapté à votre secteur",
      "Optimisation de votre présence sur les plateformes de livraison (Glovo, Jumia) si pertinent",
      "Campagnes de relance WhatsApp mensuelles vers votre base de clients existants",
      "Un point mensuel de 20 minutes pour valider les priorités du mois suivant",
    ],
    stack: [
      { label: "Gestion continue du catalogue", value: "800 MAD" },
      { label: "Gestion de la réputation (avis Google/Facebook)", value: "500 MAD" },
      { label: "8 à 12 publications réseaux sociaux + calendrier", value: "1 200 MAD" },
      { label: "Optimisation plateformes de livraison", value: "600 MAD" },
      { label: "Campagnes de relance WhatsApp mensuelles", value: "700 MAD" },
      { label: "Point mensuel de suivi", value: "400 MAD" },
    ],
    stackTotal: "4 200 MAD / mois",
    priceFrom: "Valeur réelle : 4 200 MAD / mois",
    price: "1 990 MAD",
    priceUnit: "/ mois",
    guaranteeTitle: "Garantie « satisfait ou mois offert »",
    guaranteeText:
      "si à la fin du premier mois vous n'êtes pas satisfait du travail réalisé, le mois suivant vous est offert, sans engagement à poursuivre après.",
    bonus: "Audit gratuit de vos marges et de votre pricing en entrée de programme.",
    scarcity: "15 commerces suivis en simultané maximum, pour garantir une vraie régularité",
    featured: true,
  },
];

function CommerceOffersSections() {
  const [ref, visible] = useScrollReveal();
  useCalendlyScript();

  return (
    <section id="offres-commerce" className="lp-section lp-section-dark lp-section-commerce" ref={ref}>
      <div className={`lp-section-inner ${visible ? "lp-visible" : ""}`}>
        <span className="lp-eyebrow lp-eyebrow-commerce">Pour les commerçants</span>
        <h2 className="lp-h2 lp-h2-light">
          Import-export, textile, beauté, restauration : deux offres pour exister en ligne.
        </h2>
        <p className="lp-offer-note">
          Pas de jargon stratégique ici — une vitrine qui fonctionne, et quelqu'un qui la fait
          vivre pendant que vous gérez vos clients et votre stock.
        </p>

        <div className="lp-offers-detail-grid lp-offers-detail-grid-2col">
          {commerceOffers.map((o) => (
            <OfferDetailCard offer={o} key={o.name} />
          ))}
        </div>

        <p className="lp-offer-note">
          Le Comptoir prend le relais naturellement après La Vitrine, une fois que votre
          présence en ligne est en place.
        </p>
      </div>
    </section>
  );
}

export default CommerceOffersSections;