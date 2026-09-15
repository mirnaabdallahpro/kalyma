// src/hooks/useConversation.js
//
// Hook qui gère le fil d'une conversation : chargement initial,
// écoute realtime des nouveaux messages, envoi, marquage lu.
// currentRole = 'coach' | 'client' — détermine le sens des compteurs.

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deleteMessage as deleteMessageService,
  editMessage as editMessageService,
  listMessages,
  markConversationRead,
  sendMessage,
  subscribeToMessages,
  subscribeToReactions,
  toggleReaction as toggleReactionService,
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

    const unsubscribeMessages = subscribeToMessages(
      conversationId,
      (newMessage) => {
        setMessages((prev) => {
          // déjà ajouté en optimiste par send() — l'id est identique
          // puisque c'est la même ligne renvoyée par l'insert Supabase
          if (prev.some((m) => m.id === newMessage.id)) return prev;
          return [...prev, { ...newMessage, message_attachments: [], message_reactions: [] }];
        });
        // si le message vient de l'autre partie et que le fil est ouvert, on le marque lu tout de suite
        if (newMessage.sender_role !== currentRole) {
          markConversationRead(conversationId, currentRole).catch(() => {});
        }
      },
      (updatedMessage) => {
        // édition ou suppression — on remplace le message en gardant ses
        // pièces jointes/réactions déjà chargées localement
        setMessages((prev) =>
          prev.map((m) => (m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m))
        );
      }
    );

    const unsubscribeReactions = subscribeToReactions(conversationId, ({ type, reaction }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== reaction.message_id) return m;

          if (type === 'INSERT') {
            const existing = (m.message_reactions || []).find(
              (r) => r.user_id === reaction.user_id && r.emoji === reaction.emoji
            );
            if (existing) {
              // remplace l'entrée optimiste (id temporaire) par la vraie ligne
              // confirmée — sinon on se retrouve avec deux chips pour la même réaction
              return {
                ...m,
                message_reactions: m.message_reactions.map((r) =>
                  r === existing ? reaction : r
                ),
              };
            }
            return { ...m, message_reactions: [...(m.message_reactions || []), reaction] };
          }

          // DELETE
          return {
            ...m,
            message_reactions: (m.message_reactions || []).filter(
              (r) => !(r.user_id === reaction.user_id && r.emoji === reaction.emoji)
            ),
          };
        })
      );
    });

    return () => {
      cancelled = true;
      unsubscribeMessages();
      unsubscribeReactions();
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
        // affichage optimiste immédiat (le realtime rattrapera les autres clients) —
        // même garde-fou que côté onInsert : si l'écho realtime de CE message est
        // arrivé en premier (possible, le websocket peut battre la réponse REST),
        // on évite de l'ajouter une deuxième fois
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, { ...message, message_attachments: attachments, message_reactions: [] }];
        });
      } finally {
        setSending(false);
      }
    },
    [conversationId, currentUserId, currentRole]
  );

  const editMessage = useCallback(async (messageId, content) => {
    const updated = await editMessageService(messageId, content);
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, ...updated } : m)));
  }, []);

  const deleteMessage = useCallback(async (messageId) => {
    const updated = await deleteMessageService(messageId);
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, ...updated, message_attachments: [] } : m))
    );
  }, []);

  const toggleReaction = useCallback(
    async (messageId, emoji) => {
      // optimiste : on met à jour tout de suite, le realtime confirmera
      // (et corrigera si un autre onglet a agi entre-temps)
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const mine = (m.message_reactions || []).find(
            (r) => r.user_id === currentUserId && r.emoji === emoji
          );
          if (mine) {
            return { ...m, message_reactions: m.message_reactions.filter((r) => r.id !== mine.id) };
          }
          return {
            ...m,
            message_reactions: [
              ...(m.message_reactions || []),
              { id: `optimistic-${Date.now()}`, message_id: messageId, user_id: currentUserId, emoji },
            ],
          };
        })
      );
      await toggleReactionService(messageId, emoji);
    },
    [currentUserId]
  );

  return { messages, loading, error, sending, send, editMessage, deleteMessage, toggleReaction, bottomRef };
}