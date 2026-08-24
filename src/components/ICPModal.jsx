import { useState } from "react";
import Modal from "./business/Modal";

function ICPModal({
  initialValue,
  saving,
  onClose,
  onSave,
}) {
  const [activeTab, setActiveTab] = useState("identity");

  const [form, setForm] = useState({
    // ==================================================
    // 01 — IDENTITÉ DU CLIENT
    // ==================================================
    clientType: initialValue?.clientType ?? "",
    persona: initialValue?.persona ?? "",
    role: initialValue?.role ?? "",
    seniority: initialValue?.seniority ?? "",
    decisionMaker: initialValue?.decisionMaker ?? "",

    // ==================================================
    // 02 — SECTEUR / MARCHÉ
    // ==================================================
    sector: initialValue?.sector ?? "",
    subsector: initialValue?.subsector ?? "",
    niche: initialValue?.niche ?? "",
    microNiche: initialValue?.microNiche ?? "",
    companyType: initialValue?.companyType ?? "",
    companySize: initialValue?.companySize ?? "",
    employeeCount: initialValue?.employeeCount ?? "",
    companyAge: initialValue?.companyAge ?? "",
    structure: initialValue?.structure ?? "",
    businessModel: initialValue?.businessModel ?? "",

    // ==================================================
    // 03 — PROFIL ÉCONOMIQUE
    // ==================================================
    revenue: initialValue?.revenue ?? "",
    revenueGrowth: initialValue?.revenueGrowth ?? "",
    profitability: initialValue?.profitability ?? "",
    budget: initialValue?.budget ?? "",
    purchasingPower: initialValue?.purchasingPower ?? "",
    averageTicket: initialValue?.averageTicket ?? "",
    lifetimeValue: initialValue?.lifetimeValue ?? "",
    recurrencePotential: initialValue?.recurrencePotential ?? "",
    upsellPotential: initialValue?.upsellPotential ?? "",

    // ==================================================
    // 04 — GÉOGRAPHIE
    // ==================================================
    geography: initialValue?.geography ?? "",
    country: initialValue?.country ?? "",
    region: initialValue?.region ?? "",
    city: initialValue?.city ?? "",
    languages: initialValue?.languages ?? [],
    marketPriority: initialValue?.marketPriority ?? "",
    remotePossible: initialValue?.remotePossible ?? false,
    physicalPresenceRequired:
      initialValue?.physicalPresenceRequired ?? false,
    timezone: initialValue?.timezone ?? "",

    // ==================================================
    // 05 — MATURITÉ
    // ==================================================
    businessStage: initialValue?.businessStage ?? "",
    organizationalMaturity:
      initialValue?.organizationalMaturity ?? "",
    digitalMaturity:
      initialValue?.digitalMaturity ?? "",
    salesMaturity:
      initialValue?.salesMaturity ?? "",
    marketingMaturity:
      initialValue?.marketingMaturity ?? "",

    // ==================================================
    // 06 — SITUATION / CONTEXTE
    // ==================================================
    currentSituation:
      initialValue?.currentSituation ?? "",
    growthContext:
      initialValue?.growthContext ?? "",
    currentChallenges:
      initialValue?.currentChallenges ?? [],
    buyingTrigger:
      initialValue?.buyingTrigger ?? "",
    urgencyLevel:
      initialValue?.urgencyLevel ?? "",

    // ==================================================
    // 07 — PROBLÈMES / PAINS
    // ==================================================
    primaryProblem:
      initialValue?.primaryProblem ?? "",
    secondaryProblems:
      initialValue?.secondaryProblems ?? [],
    painPoints:
      initialValue?.painPoints ?? [],
    problemCauses:
      initialValue?.problemCauses ?? [],
    problemConsequences:
      initialValue?.problemConsequences ?? [],
    costOfInaction:
      initialValue?.costOfInaction ?? "",

    // ==================================================
    // 08 — OBJECTIFS
    // ==================================================
    businessGoals:
      initialValue?.businessGoals ?? [],
    measurableGoals:
      initialValue?.measurableGoals ?? [],
    desiredOutcomes:
      initialValue?.desiredOutcomes ?? "",
    growthObjectives:
      initialValue?.growthObjectives ?? [],

    // ==================================================
    // 09 — RECHERCHE / COMPORTEMENT DIGITAL
    // ==================================================
    searchChannels:
      initialValue?.searchChannels ?? [],
    contentConsumption:
      initialValue?.contentConsumption ?? [],
    onlineBehavior:
      initialValue?.onlineBehavior ?? [],
    researchBehavior:
      initialValue?.researchBehavior ?? [],
    socialPlatforms:
      initialValue?.socialPlatforms ?? [],

    // ==================================================
    // 10 — COMPORTEMENT D'ACHAT
    // ==================================================
    buyingBehavior:
      initialValue?.buyingBehavior ?? "",
    decisionProcess:
      initialValue?.decisionProcess ?? "",
    decisionDuration:
      initialValue?.decisionDuration ?? "",
    decisionMakersCount:
      initialValue?.decisionMakersCount ?? "",
    influencers:
      initialValue?.influencers ?? [],
    users:
      initialValue?.users ?? [],
    prescribers:
      initialValue?.prescribers ?? [],
    salesCycle:
      initialValue?.salesCycle ?? "",

    // ==================================================
    // 11 — CRITÈRES D'ACHAT
    // ==================================================
    buyingCriteria:
      initialValue?.buyingCriteria ?? "",
    primaryBuyingCriterion:
      initialValue?.primaryBuyingCriterion ?? "",
    roiExpectation:
      initialValue?.roiExpectation ?? "",
    proofRequirements:
      initialValue?.proofRequirements ?? [],

    // ==================================================
    // 12 — OBJECTIONS / FREINS
    // ==================================================
    objections:
      initialValue?.objections ?? "",
    priceSensitivity:
      initialValue?.priceSensitivity ?? "",
    trustBarriers:
      initialValue?.trustBarriers ?? [],
    changeResistance:
      initialValue?.changeResistance ?? "",

    // ==================================================
    // 13 — SIGNAUX / INTENTION
    // ==================================================
    buyingSignals:
      initialValue?.buyingSignals ?? [],
    intentLevel:
      initialValue?.intentLevel ?? "",
    intentScore:
      initialValue?.intentScore ?? 0,

    // ==================================================
    // 14 — PSYCHOLOGIE
    // ==================================================
    values:
      initialValue?.values ?? [],
    motivations:
      initialValue?.motivations ?? [],
    fears:
      initialValue?.fears ?? [],
    aspirations:
      initialValue?.aspirations ?? [],
    personalityTraits:
      initialValue?.personalityTraits ?? [],

    // ==================================================
    // 15 — QUALIFICATION
    // ==================================================
    idealFit:
      initialValue?.idealFit ?? "",
    strategicValue:
      initialValue?.strategicValue ?? "",
    deliveryFit:
      initialValue?.deliveryFit ?? "",
    profitabilityPotential:
      initialValue?.profitabilityPotential ?? "",
    longTermPotential:
      initialValue?.longTermPotential ?? "",
    referralPotential:
      initialValue?.referralPotential ?? "",
    qualificationCriteria:
      initialValue?.qualificationCriteria ?? [],
    disqualificationCriteria:
      initialValue?.disqualificationCriteria ?? [],
    priorityLevel:
      initialValue?.priorityLevel ?? "",
    fitScore:
      initialValue?.fitScore ?? 0,
    overallScore:
      initialValue?.overallScore ?? 0,
  });

  // ==================================================
  // UPDATE
  // ==================================================

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ==================================================
  // ARRAY UPDATE
  // ==================================================

  const updateArray = (field, value) => {
    const array = value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    update(field, array);
  };

  const arrayValue = (field) => {
    return Array.isArray(form[field])
      ? form[field].join("\n")
      : "";
  };

  // ==================================================
  // SAVE
  // ==================================================

  const handleSave = () => {
    onSave(form);
  };

  // ==================================================
  // TABS
  // ==================================================

  const tabs = [
    {
      id: "identity",
      number: "01",
      label: "Identité",
    },
    {
      id: "market",
      number: "02",
      label: "Marché",
    },
    {
      id: "economic",
      number: "03",
      label: "Économique",
    },
    {
      id: "geography",
      number: "04",
      label: "Géographie",
    },
    {
      id: "maturity",
      number: "05",
      label: "Maturité",
    },
    {
      id: "situation",
      number: "06",
      label: "Situation",
    },
    {
      id: "problems",
      number: "07",
      label: "Problèmes",
    },
    {
      id: "goals",
      number: "08",
      label: "Objectifs",
    },
    {
      id: "digital",
      number: "09",
      label: "Digital",
    },
    {
      id: "buying",
      number: "10",
      label: "Achat",
    },
    {
      id: "criteria",
      number: "11",
      label: "Critères",
    },
    {
      id: "objections",
      number: "12",
      label: "Freins",
    },
    {
      id: "intent",
      number: "13",
      label: "Intention",
    },
    {
      id: "psychology",
      number: "14",
      label: "Psychologie",
    },
    {
      id: "qualification",
      number: "15",
      label: "Qualification",
    },
  ];

  // ==================================================
  // NAVIGATION
  // ==================================================

  const currentIndex = tabs.findIndex(
    (tab) => tab.id === activeTab
  );

  const goPrevious = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const goNext = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  // ==================================================
  // REUSABLE FIELD
  // ==================================================

  const Field = ({
    label,
    children,
    hint,
    full = false,
  }) => (
    <label
      className={`icp-field ${
        full ? "icp-field-full" : ""
      }`}
    >
      <span className="icp-field-label">
        {label}
      </span>

      {children}

      {hint && (
        <small className="icp-field-hint">
          {hint}
        </small>
      )}
    </label>
  );

  // ==================================================
  // SELECT
  // ==================================================

const Select = ({
  value,
  onChange,
  options,
  placeholder = "Sélectionner",
}) => (
  <select
    className="icp-form-select"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={saving}
  >
    <option value="">
      {placeholder}
    </option>

    {options.map((option) => (
      <option
        key={option.value}
        value={option.value}
      >
        {option.label}
      </option>
    ))}
  </select>
);

  // ==================================================
  // TEXTAREA ARRAY
  // ==================================================

  const ArrayField = ({
    label,
    field,
    placeholder,
    hint,
    full = true,
  }) => (
    <Field
      label={label}
      hint={
        hint ||
        "Une valeur par ligne."
      }
      full={full}
    >
      <textarea
        rows={4}
        value={arrayValue(field)}
        onChange={(e) =>
          updateArray(
            field,
            e.target.value
          )
        }
        placeholder={placeholder}
        disabled={saving}
      />
    </Field>
  );

  return (
    <Modal
      title="Client idéal"
      subtitle="Définissez précisément votre ICP pour piloter votre stratégie commerciale, marketing et acquisition."
      onClose={onClose}
      width={1100}
      footer={
        <>
          <div className="icp-footer-navigation">
            <button
              type="button"
              className="business-modal-cancel"
              onClick={goPrevious}
              disabled={
                saving || currentIndex === 0
              }
            >
              ← Précédent
            </button>

            {currentIndex <
              tabs.length - 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goNext}
                disabled={saving}
              >
                Suivant →
              </button>
            )}
          </div>

          <div className="icp-footer-actions">
            <button
              type="button"
              className="business-modal-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Annuler
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Enregistrement..."
                : "Enregistrer l'ICP"}
            </button>
          </div>
        </>
      }
    >
      <div className="icp-modal-layout">

        {/* ==================================================
            TABS
        ================================================== */}

        <div className="icp-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`icp-tab ${
                activeTab === tab.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(tab.id)
              }
              disabled={saving}
            >
              <span className="icp-tab-number">
                {tab.number}
              </span>

              <span className="icp-tab-label">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="icp-tab-content">

          {/* ==================================================
              01 — IDENTITÉ
          ================================================== */}

          {activeTab === "identity" && (
            <div className="icp-form-section">
              <SectionHeader
                number="01"
                title="Identité du client idéal"
                description="Définissez précisément qui est votre client idéal et la personne avec laquelle vous souhaitez travailler."
              />

              <div className="icp-form-grid">

                <Field label="Type de client">
                  <Select
                    value={form.clientType}
                    onChange={(value) =>
                      update(
                        "clientType",
                        value
                      )
                    }
                    options={[
                      {
                        value: "company",
                        label: "Entreprise",
                      },
                      {
                        value: "entrepreneur",
                        label: "Entrepreneur",
                      },
                      {
                        value: "freelancer",
                        label: "Freelance",
                      },
                      {
                        value: "professional",
                        label: "Professionnel",
                      },
                      {
                        value: "individual",
                        label: "Particulier",
                      },
                    ]}
                  />
                </Field>

                <Field label="Persona">
                  <input
                    type="text"
                    value={form.persona}
                    onChange={(e) =>
                      update(
                        "persona",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Coach business expérimentée"
                    disabled={saving}
                  />
                </Field>

                <Field label="Rôle">
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) =>
                      update(
                        "role",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Fondatrice, CEO, consultante..."
                    disabled={saving}
                  />
                </Field>

                <Field label="Niveau hiérarchique">
                  <Select
                    value={form.seniority}
                    onChange={(value) =>
                      update(
                        "seniority",
                        value
                      )
                    }
                    options={[
                      {
                        value: "founder",
                        label: "Fondateur",
                      },
                      {
                        value: "c_level",
                        label: "C-Level",
                      },
                      {
                        value: "executive",
                        label: "Direction",
                      },
                      {
                        value: "senior_manager",
                        label: "Senior Management",
                      },
                      {
                        value: "manager",
                        label: "Management",
                      },
                      {
                        value: "operational",
                        label: "Opérationnel",
                      },
                    ]}
                  />
                </Field>

                <Field label="Décideur principal">
                  <Select
                    value={form.decisionMaker}
                    onChange={(value) =>
                      update(
                        "decisionMaker",
                        value
                      )
                    }
                    options={[
                      {
                        value: "founder",
                        label: "Fondateur",
                      },
                      {
                        value: "ceo",
                        label: "CEO / Dirigeant",
                      },
                      {
                        value: "executive",
                        label: "Direction générale",
                      },
                      {
                        value: "department_head",
                        label: "Responsable de département",
                      },
                      {
                        value: "manager",
                        label: "Manager",
                      },
                      {
                        value: "procurement",
                        label: "Achats",
                      },
                      {
                        value: "influencer",
                        label: "Influenceur / Prescripteur",
                      },
                    ]}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              02 — MARCHÉ
          ================================================== */}

          {activeTab === "market" && (
            <div className="icp-form-section">
              <SectionHeader
                number="02"
                title="Secteur, marché et entreprise"
                description="Définissez le contexte économique et sectoriel des entreprises que vous ciblez."
              />

              <div className="icp-form-grid">

                <Field label="Secteur d'activité">
                  <Select
                    value={form.sector}
                    onChange={(value) =>
                      update(
                        "sector",
                        value
                      )
                    }
                    options={[
                      {
                        value: "technology",
                        label: "Technologie / IT",
                      },
                      {
                        value: "consulting",
                        label: "Conseil",
                      },
                      {
                        value: "finance",
                        label: "Finance / Banque / Assurance",
                      },
                      {
                        value: "education",
                        label: "Éducation / Formation",
                      },
                      {
                        value: "health",
                        label: "Santé",
                      },
                      {
                        value: "retail",
                        label: "Commerce / Retail",
                      },
                      {
                        value: "real_estate",
                        label: "Immobilier",
                      },
                      {
                        value: "industry",
                        label: "Industrie",
                      },
                      {
                        value: "construction",
                        label: "Construction / BTP",
                      },
                      {
                        value: "logistics",
                        label: "Transport / Logistique",
                      },
                      {
                        value: "hospitality",
                        label: "Hôtellerie / Restauration",
                      },
                      {
                        value: "professional_services",
                        label: "Services professionnels",
                      },
                      {
                        value: "marketing",
                        label: "Marketing / Communication",
                      },
                      {
                        value: "ecommerce",
                        label: "E-commerce",
                      },
                      {
                        value: "other",
                        label: "Autre",
                      },
                    ]}
                  />
                </Field>

                <Field label="Sous-secteur">
                  <input
                    type="text"
                    value={form.subsector}
                    onChange={(e) =>
                      update(
                        "subsector",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Coaching, conseil RH, SaaS B2B..."
                    disabled={saving}
                  />
                </Field>

                <Field label="Niche">
                  <input
                    type="text"
                    value={form.niche}
                    onChange={(e) =>
                      update(
                        "niche",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Coaching pour dirigeants"
                    disabled={saving}
                  />
                </Field>

                <Field label="Micro-niche">
                  <input
                    type="text"
                    value={form.microNiche}
                    onChange={(e) =>
                      update(
                        "microNiche",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Coachs business introvertis"
                    disabled={saving}
                  />
                </Field>

                <Field label="Type d'entreprise">
                  <Select
                    value={form.companyType}
                    onChange={(value) =>
                      update(
                        "companyType",
                        value
                      )
                    }
                    options={[
                      {
                        value: "startup",
                        label: "Startup",
                      },
                      {
                        value: "tpe",
                        label: "TPE",
                      },
                      {
                        value: "pme",
                        label: "PME",
                      },
                      {
                        value: "eti",
                        label: "ETI",
                      },
                      {
                        value: "corporate",
                        label: "Grand groupe",
                      },
                      {
                        value: "agency",
                        label: "Agence",
                      },
                      {
                        value: "firm",
                        label: "Cabinet",
                      },
                      {
                        value: "freelance",
                        label: "Indépendant",
                      },
                    ]}
                  />
                </Field>

                <Field label="Taille">
                  <Select
                    value={form.companySize}
                    onChange={(value) =>
                      update(
                        "companySize",
                        value
                      )
                    }
                    options={[
                      {
                        value: "solo",
                        label: "Indépendant / Solo",
                      },
                      {
                        value: "1-5",
                        label: "1–5 salariés",
                      },
                      {
                        value: "6-10",
                        label: "6–10 salariés",
                      },
                      {
                        value: "11-50",
                        label: "11–50 salariés",
                      },
                      {
                        value: "51-250",
                        label: "51–250 salariés",
                      },
                      {
                        value: "251-500",
                        label: "251–500 salariés",
                      },
                      {
                        value: "501-1000",
                        label: "501–1 000 salariés",
                      },
                      {
                        value: "1000+",
                        label: "Plus de 1 000",
                      },
                    ]}
                  />
                </Field>

                <Field label="Nombre de salariés">
                  <input
                    type="text"
                    value={form.employeeCount}
                    onChange={(e) =>
                      update(
                        "employeeCount",
                        e.target.value
                      )
                    }
                    placeholder="Ex. 5–10"
                    disabled={saving}
                  />
                </Field>

                <Field label="Âge de l'entreprise">
                  <input
                    type="text"
                    value={form.companyAge}
                    onChange={(e) =>
                      update(
                        "companyAge",
                        e.target.value
                      )
                    }
                    placeholder="Ex. 3 à 5 ans"
                    disabled={saving}
                  />
                </Field>

                <Field label="Structure">
                  <Select
                    value={form.structure}
                    onChange={(value) =>
                      update(
                        "structure",
                        value
                      )
                    }
                    options={[
                      {
                        value: "solo",
                        label: "Solo",
                      },
                      {
                        value: "small_team",
                        label: "Petite équipe",
                      },
                      {
                        value: "functional",
                        label: "Organisation fonctionnelle",
                      },
                      {
                        value: "matrix",
                        label: "Organisation matricielle",
                      },
                      {
                        value: "holding",
                        label: "Groupe / Holding",
                      },
                    ]}
                  />
                </Field>

                <Field label="Modèle économique">
                  <Select
                    value={form.businessModel}
                    onChange={(value) =>
                      update(
                        "businessModel",
                        value
                      )
                    }
                    options={[
                      {
                        value: "b2b",
                        label: "B2B",
                      },
                      {
                        value: "b2c",
                        label: "B2C",
                      },
                      {
                        value: "b2b2c",
                        label: "B2B2C",
                      },
                      {
                        value: "subscription",
                        label: "Abonnement",
                      },
                      {
                        value: "services",
                        label: "Prestations de services",
                      },
                      {
                        value: "ecommerce",
                        label: "E-commerce",
                      },
                      {
                        value: "marketplace",
                        label: "Marketplace",
                      },
                      {
                        value: "mixed",
                        label: "Hybride",
                      },
                    ]}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              03 — ÉCONOMIQUE
          ================================================== */}

          {activeTab === "economic" && (
            <div className="icp-form-section">
              <SectionHeader
                number="03"
                title="Profil économique"
                description="Mesurez la capacité économique et le potentiel commercial de votre client idéal."
              />

              <div className="icp-form-grid">

                <Field label="Chiffre d'affaires">
                  <Select
                    value={form.revenue}
                    onChange={(value) =>
                      update(
                        "revenue",
                        value
                      )
                    }
                    options={[
                      {
                        value: "under-100k",
                        label: "Moins de 100 k€",
                      },
                      {
                        value: "100k-500k",
                        label: "100 k€ – 500 k€",
                      },
                      {
                        value: "500k-1m",
                        label: "500 k€ – 1 M€",
                      },
                      {
                        value: "1m-5m",
                        label: "1 M€ – 5 M€",
                      },
                      {
                        value: "5m-10m",
                        label: "5 M€ – 10 M€",
                      },
                      {
                        value: "10m-50m",
                        label: "10 M€ – 50 M€",
                      },
                      {
                        value: "50m+",
                        label: "Plus de 50 M€",
                      },
                    ]}
                  />
                </Field>

                <Field label="Croissance du CA">
                  <Select
                    value={form.revenueGrowth}
                    onChange={(value) =>
                      update(
                        "revenueGrowth",
                        value
                      )
                    }
                    options={[
                      {
                        value: "declining",
                        label: "En baisse",
                      },
                      {
                        value: "stable",
                        label: "Stable",
                      },
                      {
                        value: "low",
                        label: "Faible croissance",
                      },
                      {
                        value: "moderate",
                        label: "Croissance modérée",
                      },
                      {
                        value: "high",
                        label: "Forte croissance",
                      },
                      {
                        value: "very_high",
                        label: "Très forte croissance",
                      },
                    ]}
                  />
                </Field>

                <Field label="Rentabilité">
                  <Select
                    value={form.profitability}
                    onChange={(value) =>
                      update(
                        "profitability",
                        value
                      )
                    }
                    options={[
                      {
                        value: "loss",
                        label: "Déficitaire",
                      },
                      {
                        value: "break_even",
                        label: "À l'équilibre",
                      },
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Correcte",
                      },
                      {
                        value: "high",
                        label: "Élevée",
                      },
                    ]}
                  />
                </Field>

                <Field label="Budget disponible">
                  <Select
                    value={form.budget}
                    onChange={(value) =>
                      update(
                        "budget",
                        value
                      )
                    }
                    options={[
                      {
                        value: "under_500",
                        label: "Moins de 500 €",
                      },
                      {
                        value: "500_2000",
                        label: "500 € – 2 000 €",
                      },
                      {
                        value: "2000_5000",
                        label: "2 000 € – 5 000 €",
                      },
                      {
                        value: "5000_10000",
                        label: "5 000 € – 10 000 €",
                      },
                      {
                        value: "10000_25000",
                        label: "10 000 € – 25 000 €",
                      },
                      {
                        value: "25000_50000",
                        label: "25 000 € – 50 000 €",
                      },
                      {
                        value: "50000_plus",
                        label: "Plus de 50 000 €",
                      },
                    ]}
                  />
                </Field>

                <Field label="Pouvoir d'achat">
                  <Select
                    value={form.purchasingPower}
                    onChange={(value) =>
                      update(
                        "purchasingPower",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyen",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                      {
                        value: "very_high",
                        label: "Très élevé",
                      },
                    ]}
                  />
                </Field>

                <Field label="Ticket moyen">
                  <input
                    type="text"
                    value={form.averageTicket}
                    onChange={(e) =>
                      update(
                        "averageTicket",
                        e.target.value
                      )
                    }
                    placeholder="Ex. 1 500 €"
                    disabled={saving}
                  />
                </Field>

                <Field label="Lifetime Value">
                  <input
                    type="text"
                    value={form.lifetimeValue}
                    onChange={(e) =>
                      update(
                        "lifetimeValue",
                        e.target.value
                      )
                    }
                    placeholder="Ex. 8 000 €"
                    disabled={saving}
                  />
                </Field>

                <Field label="Potentiel de récurrence">
                  <Select
                    value={
                      form.recurrencePotential
                    }
                    onChange={(value) =>
                      update(
                        "recurrencePotential",
                        value
                      )
                    }
                    options={[
                      {
                        value: "none",
                        label: "Faible / Aucun",
                      },
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyen",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                    ]}
                  />
                </Field>

                <Field label="Potentiel d'upsell">
                  <Select
                    value={
                      form.upsellPotential
                    }
                    onChange={(value) =>
                      update(
                        "upsellPotential",
                        value
                      )
                    }
                    options={[
                      {
                        value: "none",
                        label: "Aucun",
                      },
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyen",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                    ]}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              04 — GÉOGRAPHIE
          ================================================== */}

          {activeTab === "geography" && (
            <div className="icp-form-section">
              <SectionHeader
                number="04"
                title="Géographie"
                description="Définissez précisément où se trouvent vos clients idéaux et comment vous pouvez les servir."
              />

              <div className="icp-form-grid">

                <Field label="Zone géographique">
                  <Select
                    value={form.geography}
                    onChange={(value) =>
                      update(
                        "geography",
                        value
                      )
                    }
                    options={[
                      {
                        value: "local",
                        label: "Local",
                      },
                      {
                        value: "national",
                        label: "National",
                      },
                      {
                        value: "regional",
                        label: "Régional",
                      },
                      {
                        value: "europe",
                        label: "Europe",
                      },
                      {
                        value: "africa",
                        label: "Afrique",
                      },
                      {
                        value: "francophone_africa",
                        label: "Afrique francophone",
                      },
                      {
                        value: "international",
                        label: "International",
                      },
                      {
                        value: "global",
                        label: "Mondial",
                      },
                    ]}
                  />
                </Field>

                <Field label="Pays ciblés">
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) =>
                      update(
                        "country",
                        e.target.value
                      )
                    }
                    placeholder="Ex. France, Maroc, Belgique..."
                    disabled={saving}
                  />
                </Field>

                <Field label="Région">
                  <input
                    type="text"
                    value={form.region}
                    onChange={(e) =>
                      update(
                        "region",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Île-de-France, Casablanca..."
                    disabled={saving}
                  />
                </Field>

                <Field label="Ville">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      update(
                        "city",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Paris, Casablanca..."
                    disabled={saving}
                  />
                </Field>

                <ArrayField
                  label="Langues"
                  field="languages"
                  placeholder={"Français\nAnglais\nArabe"}
                  full={false}
                />

                <Field label="Priorité du marché">
                  <Select
                    value={
                      form.marketPriority
                    }
                    onChange={(value) =>
                      update(
                        "marketPriority",
                        value
                      )
                    }
                    options={[
                      {
                        value: "primary",
                        label: "Marché prioritaire",
                      },
                      {
                        value: "secondary",
                        label: "Marché secondaire",
                      },
                      {
                        value: "test",
                        label: "Marché à tester",
                      },
                    ]}
                  />
                </Field>

                <Field label="Vente à distance possible">
                  <div className="icp-toggle">
                    <input
                      type="checkbox"
                      checked={
                        form.remotePossible
                      }
                      onChange={(e) =>
                        update(
                          "remotePossible",
                          e.target.checked
                        )
                      }
                      disabled={saving}
                    />
                    <span>
                      Oui, la prestation peut être délivrée à distance
                    </span>
                  </div>
                </Field>

                <Field label="Présence physique requise">
                  <div className="icp-toggle">
                    <input
                      type="checkbox"
                      checked={
                        form.physicalPresenceRequired
                      }
                      onChange={(e) =>
                        update(
                          "physicalPresenceRequired",
                          e.target.checked
                        )
                      }
                      disabled={saving}
                    />
                    <span>
                      Une présence physique est nécessaire
                    </span>
                  </div>
                </Field>

                <Field label="Fuseau horaire">
                  <input
                    type="text"
                    value={form.timezone}
                    onChange={(e) =>
                      update(
                        "timezone",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Europe/Paris"
                    disabled={saving}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              05 — MATURITÉ
          ================================================== */}

          {activeTab === "maturity" && (
            <div className="icp-form-section">
              <SectionHeader
                number="05"
                title="Maturité"
                description="Évaluez le niveau de maturité business, organisationnelle, digitale, commerciale et marketing."
              />

              <div className="icp-form-grid">

                <Field label="Stade business">
                  <Select
                    value={form.businessStage}
                    onChange={(value) =>
                      update(
                        "businessStage",
                        value
                      )
                    }
                    options={[
                      {
                        value: "idea",
                        label: "Idée",
                      },
                      {
                        value: "launch",
                        label: "Lancement",
                      },
                      {
                        value: "early",
                        label: "Premiers clients",
                      },
                      {
                        value: "growth",
                        label: "Croissance",
                      },
                      {
                        value: "scale",
                        label: "Scale-up",
                      },
                      {
                        value: "mature",
                        label: "Mature",
                      },
                      {
                        value: "restructuring",
                        label: "Restructuration",
                      },
                    ]}
                  />
                </Field>

                <Field label="Maturité organisationnelle">
                  <Select
                    value={
                      form.organizationalMaturity
                    }
                    onChange={(value) =>
                      update(
                        "organizationalMaturity",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "developing",
                        label: "En développement",
                      },
                      {
                        value: "moderate",
                        label: "Intermédiaire",
                      },
                      {
                        value: "advanced",
                        label: "Avancée",
                      },
                      {
                        value: "mature",
                        label: "Mature",
                      },
                    ]}
                  />
                </Field>

                <Field label="Maturité digitale">
                  <Select
                    value={
                      form.digitalMaturity
                    }
                    onChange={(value) =>
                      update(
                        "digitalMaturity",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "basic",
                        label: "Basique",
                      },
                      {
                        value: "moderate",
                        label: "Intermédiaire",
                      },
                      {
                        value: "advanced",
                        label: "Avancée",
                      },
                      {
                        value: "high",
                        label: "Très avancée",
                      },
                    ]}
                  />
                </Field>

                <Field label="Maturité commerciale">
                  <Select
                    value={form.salesMaturity}
                    onChange={(value) =>
                      update(
                        "salesMaturity",
                        value
                      )
                    }
                    options={[
                      {
                        value: "none",
                        label: "Structuration inexistante",
                      },
                      {
                        value: "basic",
                        label: "Basique",
                      },
                      {
                        value: "developing",
                        label: "En développement",
                      },
                      {
                        value: "structured",
                        label: "Structurée",
                      },
                      {
                        value: "advanced",
                        label: "Avancée",
                      },
                    ]}
                  />
                </Field>

                <Field label="Maturité marketing">
                  <Select
                    value={
                      form.marketingMaturity
                    }
                    onChange={(value) =>
                      update(
                        "marketingMaturity",
                        value
                      )
                    }
                    options={[
                      {
                        value: "none",
                        label: "Inexistante",
                      },
                      {
                        value: "basic",
                        label: "Basique",
                      },
                      {
                        value: "developing",
                        label: "En développement",
                      },
                      {
                        value: "structured",
                        label: "Structurée",
                      },
                      {
                        value: "advanced",
                        label: "Avancée",
                      },
                    ]}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              06 — SITUATION
          ================================================== */}

          {activeTab === "situation" && (
            <div className="icp-form-section">
              <SectionHeader
                number="06"
                title="Situation & contexte"
                description="Comprenez dans quel contexte votre prospect devient susceptible d'acheter."
              />

              <div className="icp-form-grid">

                <Field
                  label="Situation actuelle"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.currentSituation
                    }
                    onChange={(e) =>
                      update(
                        "currentSituation",
                        e.target.value
                      )
                    }
                    placeholder="Décrivez la situation actuelle du client idéal..."
                    disabled={saving}
                  />
                </Field>

                <Field
                  label="Contexte de croissance"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.growthContext
                    }
                    onChange={(e) =>
                      update(
                        "growthContext",
                        e.target.value
                      )
                    }
                    placeholder="Dans quel contexte de croissance se trouve-t-il ?"
                    disabled={saving}
                  />
                </Field>

                <ArrayField
                  label="Défis actuels"
                  field="currentChallenges"
                  placeholder={
                    "Manque de clients\nPositionnement flou\nÉquipe insuffisante"
                  }
                />

                <Field label="Déclencheur d'achat">
                  <textarea
                    rows={4}
                    value={
                      form.buyingTrigger
                    }
                    onChange={(e) =>
                      update(
                        "buyingTrigger",
                        e.target.value
                      )
                    }
                    placeholder="Quel événement déclenche généralement l'achat ?"
                    disabled={saving}
                  />
                </Field>

                <Field label="Niveau d'urgence">
                  <Select
                    value={
                      form.urgencyLevel
                    }
                    onChange={(value) =>
                      update(
                        "urgencyLevel",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Modéré",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                      {
                        value: "critical",
                        label: "Critique",
                      },
                    ]}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              07 — PROBLÈMES
          ================================================== */}

          {activeTab === "problems" && (
            <div className="icp-form-section">
              <SectionHeader
                number="07"
                title="Problèmes & pains"
                description="Identifiez les problèmes, leurs causes, leurs conséquences et le coût de l'inaction."
              />

              <div className="icp-form-grid">

                <Field
                  label="Problème principal"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.primaryProblem
                    }
                    onChange={(e) =>
                      update(
                        "primaryProblem",
                        e.target.value
                      )
                    }
                    placeholder="Quel est le problème principal que votre offre permet de résoudre ?"
                    disabled={saving}
                  />
                </Field>

                <ArrayField
                  label="Problèmes secondaires"
                  field="secondaryProblems"
                  placeholder={
                    "Problème secondaire 1\nProblème secondaire 2"
                  }
                />

                <ArrayField
                  label="Points de douleur"
                  field="painPoints"
                  placeholder={
                    "Frustration\nPerte de temps\nManque de visibilité"
                  }
                />

                <ArrayField
                  label="Causes des problèmes"
                  field="problemCauses"
                  placeholder={
                    "Mauvais positionnement\nManque de ressources\nAbsence de stratégie"
                  }
                />

                <ArrayField
                  label="Conséquences"
                  field="problemConsequences"
                  placeholder={
                    "Perte de chiffre d'affaires\nStress\nOpportunités manquées"
                  }
                />

                <Field
                  label="Coût de l'inaction"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.costOfInaction
                    }
                    onChange={(e) =>
                      update(
                        "costOfInaction",
                        e.target.value
                      )
                    }
                    placeholder="Que se passe-t-il si le problème n'est pas résolu ?"
                    disabled={saving}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              08 — OBJECTIFS
          ================================================== */}

          {activeTab === "goals" && (
            <div className="icp-form-section">
              <SectionHeader
                number="08"
                title="Objectifs & résultats"
                description="Définissez ce que votre client idéal cherche concrètement à atteindre."
              />

              <div className="icp-form-grid">

                <ArrayField
                  label="Objectifs business"
                  field="businessGoals"
                  placeholder={
                    "Augmenter le CA\nAcquérir de nouveaux clients\nAméliorer la rentabilité"
                  }
                />

                <ArrayField
                  label="Objectifs mesurables"
                  field="measurableGoals"
                  placeholder={
                    "Atteindre 10k€/mois\n+30% de CA\n20 nouveaux clients"
                  }
                />

                <Field
                  label="Résultats recherchés"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.desiredOutcomes
                    }
                    onChange={(e) =>
                      update(
                        "desiredOutcomes",
                        e.target.value
                      )
                    }
                    placeholder="Quel résultat concret souhaite-t-il obtenir grâce à votre solution ?"
                    disabled={saving}
                  />
                </Field>

                <ArrayField
                  label="Objectifs de croissance"
                  field="growthObjectives"
                  placeholder={
                    "Expansion géographique\nAugmentation du panier moyen\nDéveloppement de l'équipe"
                  }
                />

              </div>
            </div>
          )}

          {/* ==================================================
              09 — DIGITAL
          ================================================== */}

          {activeTab === "digital" && (
            <div className="icp-form-section">
              <SectionHeader
                number="09"
                title="Recherche & comportement digital"
                description="Comprenez comment votre ICP recherche de l'information et découvre des solutions."
              />

              <div className="icp-form-grid">

                <ArrayField
                  label="Canaux de recherche"
                  field="searchChannels"
                  placeholder={
                    "Google\nLinkedIn\nYouTube\nRecommandations"
                  }
                />

                <ArrayField
                  label="Consommation de contenu"
                  field="contentConsumption"
                  placeholder={
                    "Articles\nPodcasts\nVidéos\nWebinaires"
                  }
                />

                <ArrayField
                  label="Comportement en ligne"
                  field="onlineBehavior"
                  placeholder={
                    "Compare plusieurs offres\nSuit des experts\nParticipe à des communautés"
                  }
                />

                <ArrayField
                  label="Comportement de recherche"
                  field="researchBehavior"
                  placeholder={
                    "Recherche sur Google\nDemande des recommandations\nCompare les avis"
                  }
                />

                <ArrayField
                  label="Réseaux sociaux"
                  field="socialPlatforms"
                  placeholder={
                    "LinkedIn\nInstagram\nFacebook\nYouTube"
                  }
                />

              </div>
            </div>
          )}

          {/* ==================================================
              10 — ACHAT
          ================================================== */}

          {activeTab === "buying" && (
            <div className="icp-form-section">
              <SectionHeader
                number="10"
                title="Comportement d'achat"
                description="Décrivez le fonctionnement réel du processus de décision."
              />

              <div className="icp-form-grid">

                <Field
                  label="Comportement d'achat"
                  full
                >
                  <textarea
                    rows={4}
                    value={
                      form.buyingBehavior
                    }
                    onChange={(e) =>
                      update(
                        "buyingBehavior",
                        e.target.value
                      )
                    }
                    placeholder="Comment ce client achète-t-il habituellement ?"
                    disabled={saving}
                  />
                </Field>

                <Field
                  label="Processus de décision"
                  full
                >
                  <textarea
                    rows={4}
                    value={
                      form.decisionProcess
                    }
                    onChange={(e) =>
                      update(
                        "decisionProcess",
                        e.target.value
                      )
                    }
                    placeholder="Décrivez les étapes entre la découverte et l'achat."
                    disabled={saving}
                  />
                </Field>

                <Field label="Durée de décision">
                  <input
                    type="text"
                    value={
                      form.decisionDuration
                    }
                    onChange={(e) =>
                      update(
                        "decisionDuration",
                        e.target.value
                      )
                    }
                    placeholder="Ex. 2 à 4 semaines"
                    disabled={saving}
                  />
                </Field>

                <Field label="Nombre de décideurs">
                  <input
                    type="text"
                    value={
                      form.decisionMakersCount
                    }
                    onChange={(e) =>
                      update(
                        "decisionMakersCount",
                        e.target.value
                      )
                    }
                    placeholder="Ex. 1 à 3"
                    disabled={saving}
                  />
                </Field>

                <ArrayField
                  label="Influenceurs"
                  field="influencers"
                  placeholder={
                    "CEO\nDirecteur commercial\nConsultant externe"
                  }
                />

                <ArrayField
                  label="Utilisateurs"
                  field="users"
                  placeholder={
                    "Équipe commerciale\nDirection\nÉquipe marketing"
                  }
                />

                <ArrayField
                  label="Prescripteurs"
                  field="prescribers"
                  placeholder={
                    "Expert-comptable\nConsultant\nPartenaire"
                  }
                />

                <Field label="Cycle de vente">
                  <input
                    type="text"
                    value={
                      form.salesCycle
                    }
                    onChange={(e) =>
                      update(
                        "salesCycle",
                        e.target.value
                      )
                    }
                    placeholder="Ex. 30 à 60 jours"
                    disabled={saving}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              11 — CRITÈRES
          ================================================== */}

          {activeTab === "criteria" && (
            <div className="icp-form-section">
              <SectionHeader
                number="11"
                title="Critères d'achat"
                description="Identifiez ce qui fait réellement basculer la décision en votre faveur."
              />

              <div className="icp-form-grid">

                <Field
                  label="Critères d'achat"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.buyingCriteria
                    }
                    onChange={(e) =>
                      update(
                        "buyingCriteria",
                        e.target.value
                      )
                    }
                    placeholder="Prix, expertise, réputation, accompagnement, rapidité..."
                    disabled={saving}
                  />
                </Field>

                <Field label="Critère principal">
                  <input
                    type="text"
                    value={
                      form.primaryBuyingCriterion
                    }
                    onChange={(e) =>
                      update(
                        "primaryBuyingCriterion",
                        e.target.value
                      )
                    }
                    placeholder="Ex. Expertise"
                    disabled={saving}
                  />
                </Field>

                <Field label="Attente de ROI">
                  <textarea
                    rows={4}
                    value={
                      form.roiExpectation
                    }
                    onChange={(e) =>
                      update(
                        "roiExpectation",
                        e.target.value
                      )
                    }
                    placeholder="Quel retour sur investissement attend-il ?"
                    disabled={saving}
                  />
                </Field>

                <ArrayField
                  label="Preuves nécessaires"
                  field="proofRequirements"
                  placeholder={
                    "Témoignages\nÉtudes de cas\nDémonstration\nRéférences"
                  }
                />

              </div>
            </div>
          )}

          {/* ==================================================
              12 — OBJECTIONS
          ================================================== */}

          {activeTab === "objections" && (
            <div className="icp-form-section">
              <SectionHeader
                number="12"
                title="Objections & freins"
                description="Identifiez ce qui peut empêcher, ralentir ou bloquer la décision."
              />

              <div className="icp-form-grid">

                <Field
                  label="Objections fréquentes"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.objections
                    }
                    onChange={(e) =>
                      update(
                        "objections",
                        e.target.value
                      )
                    }
                    placeholder="C'est trop cher, je dois réfléchir, nous avons déjà une solution..."
                    disabled={saving}
                  />
                </Field>

                <Field label="Sensibilité au prix">
                  <Select
                    value={
                      form.priceSensitivity
                    }
                    onChange={(value) =>
                      update(
                        "priceSensitivity",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyenne",
                      },
                      {
                        value: "high",
                        label: "Élevée",
                      },
                      {
                        value: "very_high",
                        label: "Très élevée",
                      },
                    ]}
                  />
                </Field>

                <ArrayField
                  label="Freins liés à la confiance"
                  field="trustBarriers"
                  placeholder={
                    "Manque de références\nNouvelle marque\nPeu de témoignages"
                  }
                />

                <Field label="Résistance au changement">
                  <Select
                    value={
                      form.changeResistance
                    }
                    onChange={(value) =>
                      update(
                        "changeResistance",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Modérée",
                      },
                      {
                        value: "high",
                        label: "Élevée",
                      },
                    ]}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              13 — INTENTION
          ================================================== */}

          {activeTab === "intent" && (
            <div className="icp-form-section">
              <SectionHeader
                number="13"
                title="Signaux d'achat & intention"
                description="Identifiez les signaux indiquant qu'un prospect est réellement prêt à acheter."
              />

              <div className="icp-form-grid">

                <ArrayField
                  label="Signaux d'achat"
                  field="buyingSignals"
                  placeholder={
                    "Demande de devis\nDemande de rendez-vous\nTéléchargement d'une offre\nQuestion sur le prix"
                  }
                />

                <Field label="Niveau d'intention">
                  <Select
                    value={
                      form.intentLevel
                    }
                    onChange={(value) =>
                      update(
                        "intentLevel",
                        value
                      )
                    }
                    options={[
                      {
                        value: "cold",
                        label: "Froid",
                      },
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "medium",
                        label: "Moyen",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                      {
                        value: "hot",
                        label: "Très chaud",
                      },
                    ]}
                  />
                </Field>

                <Field label="Score d'intention">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      form.intentScore
                    }
                    onChange={(e) =>
                      update(
                        "intentScore",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    disabled={saving}
                  />
                </Field>

              </div>
            </div>
          )}

          {/* ==================================================
              14 — PSYCHOLOGIE
          ================================================== */}

          {activeTab === "psychology" && (
            <div className="icp-form-section">
              <SectionHeader
                number="14"
                title="Psychologie & motivations"
                description="Comprenez ce qui motive profondément votre client idéal et influence ses décisions."
              />

              <div className="icp-form-grid">

                <ArrayField
                  label="Valeurs"
                  field="values"
                  placeholder={
                    "Liberté\nExcellence\nAuthenticité\nIndépendance"
                  }
                />

                <ArrayField
                  label="Motivations"
                  field="motivations"
                  placeholder={
                    "Gagner du temps\nAugmenter les revenus\nÊtre reconnu"
                  }
                />

                <ArrayField
                  label="Peurs"
                  field="fears"
                  placeholder={
                    "Échouer\nPerdre de l'argent\nFaire le mauvais choix"
                  }
                />

                <ArrayField
                  label="Aspirations"
                  field="aspirations"
                  placeholder={
                    "Développer son entreprise\nGagner en liberté\nDevenir une référence"
                  }
                />

                <ArrayField
                  label="Traits de personnalité"
                  field="personalityTraits"
                  placeholder={
                    "Ambitieux\nPrudent\nAnalytique\nIndépendant"
                  }
                />

              </div>
            </div>
          )}

          {/* ==================================================
              15 — QUALIFICATION
          ================================================== */}

          {activeTab === "qualification" && (
            <div className="icp-form-section">
              <SectionHeader
                number="15"
                title="Qualification & scoring"
                description="Déterminez objectivement si un prospect correspond réellement à votre ICP."
              />

              <div className="icp-form-grid">

                <Field
                  label="Profil idéal"
                  full
                >
                  <textarea
                    rows={5}
                    value={
                      form.idealFit
                    }
                    onChange={(e) =>
                      update(
                        "idealFit",
                        e.target.value
                      )
                    }
                    placeholder="Décrivez le profil qui correspond parfaitement à votre ICP."
                    disabled={saving}
                  />
                </Field>

                <Field label="Valeur stratégique">
                  <Select
                    value={
                      form.strategicValue
                    }
                    onChange={(value) =>
                      update(
                        "strategicValue",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyenne",
                      },
                      {
                        value: "high",
                        label: "Élevée",
                      },
                      {
                        value: "very_high",
                        label: "Très élevée",
                      },
                    ]}
                  />
                </Field>

                <Field label="Adéquation de livraison">
                  <Select
                    value={
                      form.deliveryFit
                    }
                    onChange={(value) =>
                      update(
                        "deliveryFit",
                        value
                      )
                    }
                    options={[
                      {
                        value: "poor",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyenne",
                      },
                      {
                        value: "good",
                        label: "Bonne",
                      },
                      {
                        value: "excellent",
                        label: "Excellente",
                      },
                    ]}
                  />
                </Field>

                <Field label="Potentiel de rentabilité">
                  <Select
                    value={
                      form.profitabilityPotential
                    }
                    onChange={(value) =>
                      update(
                        "profitabilityPotential",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyen",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                      {
                        value: "very_high",
                        label: "Très élevé",
                      },
                    ]}
                  />
                </Field>

                <Field label="Potentiel long terme">
                  <Select
                    value={
                      form.longTermPotential
                    }
                    onChange={(value) =>
                      update(
                        "longTermPotential",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyen",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                      {
                        value: "very_high",
                        label: "Très élevé",
                      },
                    ]}
                  />
                </Field>

                <Field label="Potentiel de recommandation">
                  <Select
                    value={
                      form.referralPotential
                    }
                    onChange={(value) =>
                      update(
                        "referralPotential",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "moderate",
                        label: "Moyen",
                      },
                      {
                        value: "high",
                        label: "Élevé",
                      },
                      {
                        value: "very_high",
                        label: "Très élevé",
                      },
                    ]}
                  />
                </Field>

                <ArrayField
                  label="Critères de qualification"
                  field="qualificationCriteria"
                  placeholder={
                    "Budget suffisant\nProblème urgent\nDécideur identifié"
                  }
                />

                <ArrayField
                  label="Critères de disqualification"
                  field="disqualificationCriteria"
                  placeholder={
                    "Budget insuffisant\nPas de besoin réel\nMauvais secteur"
                  }
                />

                <Field label="Niveau de priorité">
                  <Select
                    value={
                      form.priorityLevel
                    }
                    onChange={(value) =>
                      update(
                        "priorityLevel",
                        value
                      )
                    }
                    options={[
                      {
                        value: "low",
                        label: "Faible",
                      },
                      {
                        value: "medium",
                        label: "Moyenne",
                      },
                      {
                        value: "high",
                        label: "Haute",
                      },
                      {
                        value: "critical",
                        label: "Critique",
                      },
                    ]}
                  />
                </Field>

                <Field label="Score d'adéquation">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      form.fitScore
                    }
                    onChange={(e) =>
                      update(
                        "fitScore",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    disabled={saving}
                  />
                </Field>

                <Field label="Score global">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      form.overallScore
                    }
                    onChange={(e) =>
                      update(
                        "overallScore",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    disabled={saving}
                  />
                </Field>

              </div>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
}

// ======================================================
// SECTION HEADER
// ======================================================

function SectionHeader({
  number,
  title,
  description,
}) {
  return (
    <div className="icp-form-section-header">
      <span>{number}</span>

      <div>
        <div
          style={{
            marginBottom: "0.3rem",
          }}
        >
          <strong>{title}</strong>
        </div>

        <small>
          {description}
        </small>
      </div>
    </div>
  );
}

export default ICPModal;