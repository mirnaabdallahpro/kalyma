import { useEffect, useState } from "react";
import {
  getCurrentBusinessDiagnosticFull,
} from "../../services/businessDiagnostics";
import { getMeetings } from "../../services/meetings";
import PipelineBoardDashboard from "../components/crm/PipelineBoardDashboard";
import AIRecommendation from "../components/dashboard/AIRecommendation";
import Panel from "../components/dashboard/Panel";
import PriorityItem from "../components/dashboard/PriorityItem";
import SalesChart from "../components/dashboard/SalesChart";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import Topbar from "../components/dashboard/Topbar";
import UpcomingMeeting from "../components/dashboard/UpcomingMeeting";
import WeeklyBriefing from "../components/dashboard/WeeklyBriefing";

import { NavLink } from "react-router-dom";
import {
  getOffersForSelect,
  getProspects,
  getRelanceSettings,
  getUpcomingRelances
} from "../../services/crm";

function Dashboard() {
 

  const pipeline = [
    {
      title: "Lead · 18",
      deals: [
        {
          company: "Atlas Consulting",
          amount: "8 000 MAD",
        },
        {
          company: "Nova Agency",
          amount: "5 500 MAD",
        },
      ],
    },
    {
      title: "RDV · 7",
      deals: [
        {
          company: "Maroc Business",
          amount: "12 000 MAD",
        },
        {
          company: "AfriTech",
          amount: "18 000 MAD",
        },
      ],
    },
    {
      title: "Proposition · 4",
      deals: [
        {
          company: "Studio M",
          amount: "15 000 MAD",
        },
        {
          company: "Growth Lab",
          amount: "20 000 MAD",
        },
      ],
    },
    {
      title: "Négociation · 2",
      deals: [
        {
          company: "Digital Pro",
          amount: "9 500 MAD",
        },
      ],
    },
  ];

  const [deals, setDeals] = useState([]);
  const [offers, setOffers] = useState([]);
  const [relances, setRelances] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const [relanceSettings, setRelanceSettings] = useState({ intervals: [3, 7, 30], enabled: true });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [diagnostic, setDiagnostic] = useState(null);




  const loadAll = async () => {
    try {
      setErrorMsg("");
      const [dealsData, offersData, relancesData, settingsData, meetingsData, diagnosticData ] = await Promise.all([
        getProspects(),
        getOffersForSelect(),
        getUpcomingRelances(),
        getRelanceSettings(),
        getMeetings(),
        getCurrentBusinessDiagnosticFull()
      ]);

      setDeals(dealsData);
      setOffers(offersData);
      setRelances(relancesData);
      setRelanceSettings(settingsData);
      setMeetings(meetingsData);
      setDiagnostic(diagnosticData);
     
    } catch (err) {
      setErrorMsg(err?.message || "Impossible de charger le CRM pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const activeOffers = offers.filter(
  (offer) => offer.status === "active"
);

const now = new Date();

// ==========================================
// PÉRIODES
// ==========================================

const currentPeriodStart = new Date(now);
currentPeriodStart.setDate(now.getDate() - 7);

const previousPeriodStart = new Date(now);
previousPeriodStart.setDate(now.getDate() - 14);

// ==========================================
// OPPORTUNITÉS PAR PÉRIODE
// ==========================================

// 7 derniers jours
const currentPeriodDeals = deals.filter((deal) => {
  const date = new Date(deal.created_at);

  return date >= currentPeriodStart && date <= now;
});

// 7 jours précédents
const previousPeriodDeals = deals.filter((deal) => {
  const date = new Date(deal.created_at);

  return date >= previousPeriodStart && date < currentPeriodStart;
});

// ==========================================
// DEALS ACTUELS
// ==========================================

const activeDeals = deals.filter(
  (deal) => !["gagne", "perdu"].includes(deal.stage)
);

const wonDeals = deals.filter(
  (deal) => deal.stage === "gagne"
);

const lostDeals = deals.filter(
  (deal) => deal.stage === "perdu"
);

const closedDeals = [...wonDeals, ...lostDeals];

// ==========================================
// PIPELINE ACTUEL
// ==========================================

const pipelineValue = activeDeals.reduce(
  (total, deal) => total + Number(deal.amount || 0),
  0
);

// ==========================================
// PIPELINE PÉRIODE PRÉCÉDENTE
// ==========================================

const previousActiveDeals = previousPeriodDeals.filter(
  (deal) => !["gagne", "perdu"].includes(deal.stage)
);

const previousPipelineValue = previousActiveDeals.reduce(
  (total, deal) => total + Number(deal.amount || 0),
  0
);

// ==========================================
// PROSPECTS ACTUELS
// ==========================================

const activeDealsCount = activeDeals.length;

// Prospects actifs sur la période précédente
const previousActiveDealsCount = previousActiveDeals.length;

// ==========================================
// CLIENTS
// ==========================================

const totalClients = wonDeals.length;

// ==========================================
// CHIFFRE D'AFFAIRES
// ==========================================

const revenue = wonDeals.reduce(
  (total, deal) => total + Number(deal.amount || 0),
  0
);

// ==========================================
// TAUX DE CONVERSION
// ==========================================

const conversionRate =
  closedDeals.length > 0
    ? (wonDeals.length / closedDeals.length) * 100
    : 0;

// ==========================================
// CALCUL DES TENDANCES
// ==========================================

const calculateTrend = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
};

const pipelineTrend = calculateTrend(
  pipelineValue,
  previousPipelineValue
);

const activeDealsTrend = calculateTrend(
  activeDealsCount,
  previousActiveDealsCount
);

// ==========================================
// SCORE BUSINESS
// ==========================================

const scoreBusiness = diagnostic?.business_score ?? 0;

// ==========================================
// STATS DASHBOARD
// ==========================================

const stats = [
  {
    label: "Kalyma Score",
    value: scoreBusiness,
    suffix: "/100",
    trend: "Score actuel",
    trendType: "up",
  },

  {
    label: "Pipeline",
    value: pipelineValue.toLocaleString("fr-FR"),
    suffix: " MAD",
    trend: `${pipelineTrend >= 0 ? "+" : ""}${pipelineTrend.toFixed(
      0
    )}% vs période précédente`,
    trendType: pipelineTrend >= 0 ? "up" : "down",
  },

  {
    label: "Prospects actifs",
    value: activeDealsCount.toString(),
    trend: `${activeDealsTrend >= 0 ? "+" : ""}${activeDealsTrend.toFixed(
      0
    )}% vs période précédente`,
    trendType: activeDealsTrend >= 0 ? "up" : "down",
  },

  {
    label: "Clients accompagnés",
    value: totalClients,
    trend: `${conversionRate.toFixed(0)}% de conversion`,
    trendType: conversionRate >= 20 ? "up" : "down",
  },
];

  return (
    <div className="dashboard-body">
      <div className="app">

        <Sidebar />

        <main className="main">

          <Topbar />

          <div className="content">

            {/* Welcome */}
            <div className="welcome">
              <div>
                <h1>Bonjour 👋</h1>
                <p>
                  Voici ce qui mérite votre attention aujourd'hui.
                </p>
              </div>

             <div className="date">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Kalyma AI Copilot — brief hebdo */}
            <WeeklyBriefing />

            {/* KPI */}
            <section className="cards" style={{ marginTop: 18 }}>
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  {...stat}
                />
              ))}
            </section>

            {/* Main dashboard grid */}
            <div className="grid-main">

              {/* LEFT */}
              <div>

                {/* Performance */}
                <Panel
                  title="Performance commerciale"
                  subtitle="30 derniers jours"
                >
                  <SalesChart deals={deals}/>
                </Panel>


                {/* Pipeline */}
                <div style={{marginTop:"0.9rem"}}
                >
                   <PipelineBoardDashboard
                    deals={deals.filter((d) =>
                      ["lead", "qualification", "nurturing", "rdv"].includes(d.stage)
                    )}
                    
                  />
                </div>

              </div>

              {/* RIGHT */}
              <div>

                {/* Offres actives */}
                <Panel
  title="Offres actives"
  subtitle={`${activeOffers.length} ${
    activeOffers.length > 1 ? "offres" : "offre"
  }`}
>
  {activeOffers.length > 0 ? (
    <>
      {activeOffers.slice(0, 2).map((offer) => (
        <PriorityItem
          key={offer.id}
          title={offer.name.trim()}
          description={`${Number(offer.price).toLocaleString(
            "fr-FR"
          )} ${offer.currency}`}
        />
      ))}

      <NavLink
        to="/business/offers"
        className="panel-more-link"
      >
        Voir toutes les offres →
      </NavLink>
    </>
  ) : (
    <PriorityItem
      title="Aucune offre active"
      description="Créez votre première offre commerciale"
    />
  )}
</Panel>

                {/* AI */}
                <AIRecommendation recommendations={[]}/>

                {/* Meeting */}
                <UpcomingMeeting meetings={meetings}/>

              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;