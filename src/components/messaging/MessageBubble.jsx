// src/components/messaging/MessageBubble.jsx
//
// Rend un message avec ses pièces jointes, ses réactions, et les actions
// modifier/supprimer/réagir. Réutilise les classes CSS de la maquette
// + les ajouts pour .msg-actions/.reaction-*/.emoji-picker (voir
// messaging-missing.css).

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScreenshotUrl } from '../../../services/messagingService';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

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

/** Regroupe les réactions par emoji : [{ emoji, count, mine }] */
function groupReactions(reactions, currentUserId) {
  const groups = new Map();
  for (const r of reactions || []) {
    const g = groups.get(r.emoji) || { emoji: r.emoji, count: 0, mine: false };
    g.count += 1;
    if (r.user_id === currentUserId) g.mine = true;
    groups.set(r.emoji, g);
  }
  return [...groups.values()];
}

export default function MessageBubble({ message, currentRole, currentUserId, onEdit, onDelete, onReact }) {
  const isMine = message.sender_role === currentRole;
  const isDeleted = !!message.deleted_at;
  const isEdited = !!message.edited_at && !isDeleted;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const time = new Date(message.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const reactionGroups = groupReactions(message.message_reactions, currentUserId);

  const handleSaveEdit = async () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== message.content) {
      await onEdit(message.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Supprimer ce message ?')) {
      onDelete(message.id);
    }
  };

  const handlePickEmoji = (emoji) => {
    onReact(message.id, emoji);
    setShowEmojiPicker(false);
  };

  if (isDeleted) {
    return (
      <div className={`msg-row ${isMine ? 'coach' : 'client'}`}>
        <div>
          <div className="bubble bubble-deleted">Message supprimé</div>
          <div className="msg-time">{time}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`msg-row ${isMine ? 'coach' : 'client'}`}>
      <div className="msg-content">
        {isEditing ? (
          <div className="msg-edit-box">
            <textarea
              className="msg-edit-textarea"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={2}
              autoFocus
            />
            <div className="msg-edit-actions">
              <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>Enregistrer</button>
            </div>
          </div>
        ) : (
          <>
            {message.content ? <div className="bubble">{message.content}</div> : null}

            {(message.message_attachments || []).map((attachment) =>
              attachment.type === 'screenshot' ? (
                <ScreenshotAttachment key={attachment.id} attachment={attachment} />
              ) : (
                <LinkAttachment key={attachment.id} attachment={attachment} />
              )
            )}

            {reactionGroups.length > 0 && (
              <div className="reaction-bar">
                {reactionGroups.map((g) => (
                  <button
                    key={g.emoji}
                    className={`reaction-chip ${g.mine ? 'mine' : ''}`}
                    onClick={() => onReact(message.id, g.emoji)}
                  >
                    {g.emoji} {g.count > 1 ? g.count : ''}
                  </button>
                ))}
              </div>
            )}

            <div className="msg-time">
              {time}
              {isEdited ? <span className="msg-edited-tag"> · modifié</span> : null}
            </div>
          </>
        )}

        {!isEditing && (
          <div className="msg-actions">
            <div className="msg-actions-emoji-wrap">
              <button className="msg-action-btn" onClick={() => setShowEmojiPicker((v) => !v)}>
                🙂
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button key={emoji} className="emoji-picker-item" onClick={() => handlePickEmoji(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isMine && (
              <>
                <button className="msg-action-btn" onClick={() => setIsEditing(true)}>✏️</button>
                <button className="msg-action-btn" onClick={handleDelete}>🗑️</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}