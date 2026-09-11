// src/components/messaging/MessageBubble.jsx
//
// Rend un message avec ses pièces jointes. Réutilise les classes CSS
// (.msg-row, .bubble, .attach-shot, .attach-link) définies dans
// espace-client-messagerie.html — à reporter dans ton global.css.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScreenshotUrl } from '../../../services/messagingService';

function ScreenshotAttachment({ attachment }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getScreenshotUrl(attachment.url).then((signed) => {
      if (!cancelled) setUrl(signed);
    });
    return () => {
      cancelled = true;
    };
  }, [attachment.url]);

  return (
    <div className="attach-shot">
      {url ? <img src={url} alt={attachment.label || 'Capture d\'écran'} /> : null}
      {attachment.label ? <div className="cap">{attachment.label}</div> : null}
    </div>
  );
}

function LinkAttachment({ attachment }) {
  const navigate = useNavigate();
  return (
    <button className="attach-link" onClick={() => navigate(attachment.internal_path)}>
      <span className="al-dot" />
      {attachment.label}
      <span className="al-arrow">→</span>
    </button>
  );
}

export default function MessageBubble({ message, currentRole }) {
  const isMine = message.sender_role === currentRole;
  const time = new Date(message.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`msg-row ${isMine ? 'coach' : 'client'}`}>
      <div>
        {message.content ? <div className="bubble">{message.content}</div> : null}

        {(message.message_attachments || []).map((attachment) =>
          attachment.type === 'screenshot' ? (
            <ScreenshotAttachment key={attachment.id} attachment={attachment} />
          ) : (
            <LinkAttachment key={attachment.id} attachment={attachment} />
          )
        )}

        <div className="msg-time">{time}</div>
      </div>
    </div>
  );
}