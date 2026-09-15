// src/components/messaging/ConversationView.jsx
//
// Assemble le fil de messages + le composer pour une conversation donnée.
// currentRole: 'coach' (toi, dans la vue admin) ou 'client' (dans l'espace client).

import { useConversation } from '../../hooks/useConversation';
import Composer from './Composer';
import MessageBubble from './MessageBubble';

export default function ConversationView({ conversationId, currentUserId, currentRole, clientUserId }) {
  const { messages, loading, sending, send, editMessage, deleteMessage, toggleReaction, bottomRef } =
    useConversation(conversationId, currentUserId, currentRole);

  if (loading) {
    return <div className="conv-thread"><p className="muted">Chargement de la conversation…</p></div>;
  }

  return (
    <>
      <div className="conv-thread">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentRole={currentRole}
            currentUserId={currentUserId}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onReact={toggleReaction}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <Composer clientUserId={clientUserId} onSend={send} sending={sending} />
    </>
  );
}