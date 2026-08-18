import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function ComingSoon({ title }) {
  return (
    <div className="dashboard-body">
      <div className="app">
        <Sidebar />

        <main className="main">
          <Topbar />

          <div className="content">
            <div className="welcome">
              <div>
                <h1>{title}</h1>
                <p>Ce module arrive bientôt.</p>
              </div>
            </div>

            <div
              className="panel"
              style={{ textAlign: "center", padding: "60px 24px" }}
            >
              <h3 style={{ marginTop: 0 }}>🚧 {title} — bientôt <span style={{ color: "var(--accent)" }}>disponible</span></h3>
              <p
                style={{
                  color: "var(--muted)",
                  maxWidth: 420,
                  margin: "10px auto 0",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                }}
              >
                Ce module fait partie de la roadmap Kalyma OS et sera activé
                prochainement.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ComingSoon;
