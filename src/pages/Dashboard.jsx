import AIRecommendation from "../components/dashboard/AIRecommendation";
import Panel from "../components/dashboard/Panel";
import PipelineStage from "../components/dashboard/PipelineStage";
import PriorityItem from "../components/dashboard/PriorityItem";
import SalesChart from "../components/dashboard/SalesChart";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import Topbar from "../components/dashboard/Topbar";
import UpcomingMeeting from "../components/dashboard/UpcomingMeeting";
import WeeklyBriefing from "../components/dashboard/WeeklyBriefing";

function Dashboard() {
  const stats = [
    {
      label: "Kalyma Score",
      value: "74",
      suffix: "/100",
      trend: "↑ +6 ce mois",
      trendType: "up",
    },
    {
      label: "Pipeline",
      value: "87 000",
      suffix: " MAD",
      trend: "↑ 12% vs mois dernier",
      trendType: "up",
    },
    {
      label: "Prospects actifs",
      value: "64",
      trend: "↑ 8 cette semaine",
      trendType: "up",
    },
    {
      label: "Objectif mensuel",
      value: "62%",
      trend: "31 200 / 50 000 MAD",
      trendType: "default",
    },
  ];

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
                <h1>Bonjour, Fatahou 👋</h1>
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
                <Panel
                  title="Pipeline commercial"
                  subtitle="12 opportunités"
                  className="pipeline-panel"
                >
                  <div className="pipeline">
                    {pipeline.map((stage) => (
                      <PipelineStage
                        key={stage.title}
                        title={stage.title}
                        deals={stage.deals}
                      />
                    ))}
                  </div>
                </Panel>

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
                <UpcomingMeeting />

              </div>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;