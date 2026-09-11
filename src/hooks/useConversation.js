// src/hooks/useConversation.js
//
// Hook qui gère le fil d'une conversation : chargement initial,
// écoute realtime des nouveaux messages, envoi, marquage lu.
// currentRole = 'coach' | 'client' — détermine le sens des compteurs.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  listMessages,
  markConversationRead,
  sendMessage,
  subscribeToMessages,
} from '../../services/messagingService';

export function useConversation(conversationId, currentUserId, currentRole) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    setLoading(true);
    listMessages(conversationId)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));

    // marque lu à l'ouverture du fil
    markConversationRead(conversationId, currentRole).catch(() => {});

    const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
      setMessages((prev) => [...prev, { ...newMessage, message_attachments: [] }]);
      // si le message vient de l'autre partie et que le fil est ouvert, on le marque lu tout de suite
      if (newMessage.sender_role !== currentRole) {
        markConversationRead(conversationId, currentRole).catch(() => {});
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [conversationId, currentRole]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const send = useCallback(
    async (content, attachments = []) => {
      if (!content.trim() && attachments.length === 0) return;
      setSending(true);
      try {
        const message = await sendMessage({
          conversationId,
          senderId: currentUserId,
          senderRole: currentRole,
          content,
          attachments,
        });
        // affichage optimiste immédiat (le realtime rattrapera les autres clients)
        setMessages((prev) => [...prev, { ...message, message_attachments: attachments }]);
      } finally {
        setSending(false);
      }
    },
    [conversationId, currentUserId, currentRole]
  );

  return { messages, loading, error, sending, send, bottomRef };
}