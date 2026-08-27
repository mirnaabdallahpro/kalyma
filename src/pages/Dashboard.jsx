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

  const activeDeals = deals.filter(
  (deal) => !["won", "lost"].includes(deal.stage)
);

const pipelineValue = activeDeals.reduce(
  (total, deal) => total + Number(deal.amount || deal.value || 0),
  0
);

const scoreBusiness = diagnostic?.business_score;

const stats = [
  {
    label: "Kalyma Score",
    value: scoreBusiness,
    suffix: "/100",
   
    trendType: "up",
  },
  {
    label: "Pipeline",
    value: pipelineValue.toLocaleString("fr-FR"),
    suffix: " MAD",
    trend: `${activeDeals.length} opportunité${
      activeDeals.length > 1 ? "s" : ""
    } active${activeDeals.length > 1 ? "s" : ""}`,
    trendType: "up",
  },
  {
    label: "Prospects actifs",
    value: activeDeals.length.toString(),
    trend: `${deals.length} opportunité${
      deals.length > 1 ? "s" : ""
    } au total`,
    trendType: "up",
  },
  {
    label: "Objectif mensuel",
    value: "62%",
    trend: "31 200 / 50 000 MAD",
    trendType: "default",
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
                Lundi 17 août 2026
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
                  <SalesChart />
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

                {/* Priorities */}
                <Panel
                  title="Priorités du jour"
                  subtitle="3 actions"
                >
                  <PriorityItem
                    title="Relancer Atlas Consulting"
                    description="Proposition envoyée il y a 6 jours"
                  />

                  <PriorityItem
                    title="Préparer le RDV AfriTech"
                    description="Aujourd'hui · 15:30"
                    color="accent"
                  />

                  <PriorityItem
                    title="Finaliser l'offre Growth"
                    description="Échéance demain"
                    color="primary"
                  />
                </Panel>

                {/* AI */}
                <AIRecommendation />

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