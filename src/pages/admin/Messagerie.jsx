// src/pages/admin/Messagerie.jsx
//
// Page principale de la messagerie côté coach : reprend exactement
// la disposition à 3 colonnes de la maquette (espace-client-messagerie.html).
// À monter sur la route /messagerie (protégée par un guard admin, comme
// tes autres pages admin).

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthenticatedAdmin } from '../../../services/admin/adminBusinessService';
import { getAuthenticatedUser } from '../../../services/businessProfileService'; // adapte le chemin si ce n'est pas là que vivent tes helpers d'auth
import { listConversations } from '../../../services/messagingService';
import MobileBottomNav from '../../components/admin/MobileBottomNav';
import ClientList from '../../components/messaging/ClientList';
import ContextPanel from '../../components/messaging/ContextPanel';
import ConversationView from '../../components/messaging/ConversationView';
import EnableNotificationsButton from '../../components/notifications/EnableNotificationsButton';

export default function AdminMessagerie() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

   const [isAdmin, setIsAdmin] = useState(false);

  const refreshConversations = useCallback(async () => {
    const data = await listConversations();
    setConversations(data);
    return data;
  }, []);

   useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        await getAuthenticatedAdmin();

        // Si la fonction ne throw pas, l'utilisateur est admin
        setIsAdmin(true);
      } catch (error) {
        console.error("Accès admin refusé :", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  useEffect(() => {
    async function init() {
      const authUser = await getAuthenticatedUser();
      setUser(authUser);

      const data = await refreshConversations();
      if (data.length > 0) setActiveConversation(data[0]);
    }

    init().finally(() => setLoading(false));
  }, [refreshConversations]);

  if (loading || !user) {
    return <div className="app"><p className="muted" style={{ padding: 32 }}>Chargement…</p></div>;
  }

  

    if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Accès administrateur uniquement
          </h1>

          <p className="text-slate-600 leading-relaxed mb-6">
            Cette section est réservée aux administrateurs de la plateforme.
            Vous n'avez pas les autorisations nécessaires pour accéder à cette
            page.
          </p>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="app">
      <aside className="sidebar">
        <a className="logo" href="/">Kalyma<span>.</span></a>

        <div className="menu-label">Navigation</div>
        <div>
        <EnableNotificationsButton userId={user.id}/>
      </div>
        <nav className="menu">
          <a href="/dashboard">Tableau de bord</a>
          <a href="/messagerie" className="active">Messagerie</a>
          <a href="/admin/business">Clients</a>
        </nav>

        <div className="menu-label" style={{ marginTop: 18 }}>Conversations</div>
        <ClientList
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelect={setActiveConversation}
        />
        
      </aside>
       {/* Mobile */}
  <MobileBottomNav user={user} />
      <main className="main">

      {activeConversation ? (
        <>
          <section className="conv-col">
            <div className="conv-topbar">
              <div className="who">
                <div className="avatar">
                  {(activeConversation.business_profiles?.company_name || '?').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{activeConversation.business_profiles?.company_name || 'Client'}</strong>
                  <span>{activeConversation.business_profiles?.sector || ''}</span>
                </div>
              </div>
              <button className="btn btn-ghost" onClick={() => navigate(`/clients/${activeConversation.user_id}`)}>
                Voir la fiche client
              </button>
            </div>

            <ConversationView
              conversationId={activeConversation.id}
              currentUserId={user.id}
              currentRole="coach"
              clientUserId={activeConversation.user_id}
            />
          </section>

          <ContextPanel
            clientUserId={activeConversation.user_id}
            businessProfileId={activeConversation.business_profile_id}
            clientName={activeConversation.business_profiles?.company_name || 'Client'}
            companyName={activeConversation.business_profiles?.sector || ''}
            onOpenDiagnostic={(id) => navigate(`/business/diagnostic/${id}`)}
          />
        </>
      ) : (
        <div className="conv-col" style={{ display: 'grid', placeItems: 'center' }}>
          <p className="muted">Sélectionne un client pour démarrer la conversation.</p>
        </div>
      )}
      </main>
    </div>
  );
}