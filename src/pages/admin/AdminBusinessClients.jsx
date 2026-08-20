import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import {
  getAdminBusinessClients,
} from "../../../services/admin/adminBusinessService";


function AdminBusinessClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getAdminBusinessClients();

      setClients(data);
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Impossible de charger les clients."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredClients =
    clients.filter((client) => {
      const searchValue =
        search.toLowerCase();

      const fullName =
        `${client.first_name ?? ""} ${
          client.last_name ?? ""
        }`.toLowerCase();

      const company =
        client?.company_name
          ?.toLowerCase() ?? "";

      const email =
        client.email?.toLowerCase() ?? "";

      return (
        fullName.includes(searchValue) ||
        company.includes(searchValue) ||
        email.includes(searchValue)
      );
    });

    console.log('2: filteredClients', filteredClients)

  if (loading) {
    return (
      <div className="admin-business-page">
        Chargement des clients...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-business-page">
        <p>{error}</p>

        <button
          className="btn btn-primary"
          onClick={loadClients}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="admin-business-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-page-eyebrow">
            ADMIN / BUSINESS
          </span>

          <h1>
            Clients Business
          </h1>

          <p>
            Analysez les profils business de
            vos clients et générez leurs
            diagnostics stratégiques.
          </p>
        </div>
      </div>

      <div className="admin-business-toolbar">
        <input
          type="search"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <div className="admin-business-clients">
        {filteredClients.map(
          (client) => {
            const business = client;

            const currentDiagnostic =
              client.business_diagnostics?.find(
                (diagnostic) =>
                  diagnostic.is_current
              );

            return (
              <AdminBusinessClientCard
                key={client.id}
                client={client}
                business={business}
                diagnostic={
                  currentDiagnostic
                }
              />
            );
          }
        )}
      </div>
    </div>
  );
}


function AdminBusinessClientCard({
  client,
  business,
  diagnostic,
}) {
  const fullName =
    `${client.first_name ?? ""} ${
      client.last_name ?? ""
    }`.trim();

    const navigate = useNavigate()

  return (
    <div className="admin-business-client-card">
      <div className="admin-business-client-header">
        <div>
          <h3>
            {fullName ||
              client.email}
          </h3>

          <span>
            {client.email}
          </span>
        </div>

        {diagnostic ? (
          <span className="admin-diagnostic-status ready">
            Diagnostic disponible
          </span>
        ) : (
          <span className="admin-diagnostic-status empty">
            Aucun diagnostic
          </span>
        )}
      </div>

      <div className="admin-business-client-body">
        <div>
          <span>
            ENTREPRISE
          </span>

          <strong>
            {business?.company_name ||
              "Non renseignée"}
          </strong>
        </div>

        <div>
          <span>
            SECTEUR
          </span>

          <strong>
            {business?.sector ||
              "Non renseigné"}
          </strong>
        </div>

        <div>
          <span>
            SCORE
          </span>

          <strong>
            {diagnostic
              ? `${diagnostic.business_score}/100`
              : "—"}
          </strong>
        </div>
      </div>

      <div className="admin-business-client-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() =>
            navigate(
              `/admin/business/${client.id}`
            )
          }
        >
          Voir le business
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate(
              `/admin/business/${client.id}/diagnostic`
            )
          }
        >
          {diagnostic
            ? "Voir le diagnostic"
            : "Créer le diagnostic"}
        </button>
      </div>
    </div>
  );
}

export default AdminBusinessClients;