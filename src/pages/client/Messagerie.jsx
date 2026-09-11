// src/pages/client/Messagerie.jsx
//
// Vue client : pas de liste, une seule conversation avec le coach.
// Pas de panneau de contexte non plus — le client n'a pas besoin de voir
// son propre "diagnostic condensé" ici, il l'a déjà sur son tableau de bord.

import { useEffect, useState } from 'react';
import { getAuthenticatedUser, getBusinessProfile } from '../../../services/businessProfileService'; // adapte le chemin si besoin
import { getOrCreateConversation } from '../../../services/messagingService';
import Sidebar from '../../components/dashboard/Sidebar';
import Topbar from '../../components/dashboard/Topbar';
import ConversationView from '../../components/messaging/ConversationView';
import EnableNotificationsButton from '../../components/notifications/EnableNotificationsButton';

export default function ClientMessagerie() {
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const authUser = await getAuthenticatedUser();
      if (!authUser) return; // pas connecté — laisse ton guard de route gérer la redirection

      setUser(authUser);

      const profile = await getBusinessProfile();
      const conv = await getOrCreateConversation(authUser.id, profile?.id ?? null);
      setConversation(conv);
    }

    init().finally(() => setLoading(false));
  }, []);

  if (loading || !user || !conversation) {
    return <p className="muted" style={{ padding: 32 }}>Chargement de la conversation…</p>;
  }

  return (
    <div className="dashboard-body">
      <div className="app">
         <Sidebar />
          <main className="main">
            <Topbar></Topbar>
    <div className="conv-col" style={{ height: '100vh' }}>
      
      <div className="conv-topbar">
        <div className="who">
          <div className="avatar">FT</div>
          <div>
            <strong>Ton coach</strong>
            <span>Suivi ALCHIMIE™</span>
          </div>
        </div>
        <div>
        <EnableNotificationsButton userId={user.id}/>
      </div>
      </div>

      <ConversationView
        conversationId={conversation.id}
        currentUserId={user.id}
        currentRole="client"
        clientUserId={user.id}
      />
    </div>
    </main>
    </div>
    </div>
  );
}