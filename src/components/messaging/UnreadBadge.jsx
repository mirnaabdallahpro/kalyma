// src/components/messaging/UnreadBadge.jsx
//
// À placer dans ta sidebar globale, à côté du lien "Messagerie".
// Calcule la somme des unread_by_coach sur toutes les conversations,
// et se tient à jour tout seul via Realtime — utile même quand tu es
// sur une autre page de l'app (CRM, tâches, diagnostic...).
//
// Usage : <Link to="/messagerie">Messagerie <UnreadBadge /></Link>

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { subscribeToConversationUpdates } from '../../../services/messagingService';

export default function UnreadBadge() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadTotal() {
      const { data, error } = await supabase.from('conversations').select('unread_by_coach');
      if (!error && !cancelled) {
        setTotal(data.reduce((sum, c) => sum + (c.unread_by_coach || 0), 0));
      }
    }

    loadTotal();

    // Realtime renvoie la ligne mise à jour à chaque nouveau message ;
    // on refait un total plutôt que de tenter un diff incrémental fragile.
    const unsubscribe = subscribeToConversationUpdates(() => {
      loadTotal();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (total === 0) return null;

  return <span className="ci-unread" style={{ marginLeft: 'auto' }}>{total > 99 ? '99+' : total}</span>;
}