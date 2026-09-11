// src/components/messaging/Composer.jsx

import { useRef, useState } from 'react';
import { uploadScreenshot } from '../../../services/messagingService';
import LinkPicker from './LinkPicker';

export default function Composer({ clientUserId, onSend, sending }) {
  const [text, setText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [showLinkPicker, setShowLinkPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const attachment = await uploadScreenshot(file, clientUserId);
      setPendingAttachments((prev) => [...prev, attachment]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleLinkSelected = (attachment) => {
    setPendingAttachments((prev) => [...prev, attachment]);
  };

  const removeAttachment = (index) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!text.trim() && pendingAttachments.length === 0) return;
    await onSend(text.trim(), pendingAttachments);
    setText('');
    setPendingAttachments([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="composer">
      {pendingAttachments.length > 0 && (
        <div className="composer-pending">
          {pendingAttachments.map((a, i) => (
            <span key={i} className="pending-chip">
              {a.type === 'screenshot' ? '🖼' : '🔗'} {a.label}
              <button onClick={() => removeAttachment(i)}>✕</button>
            </span>
          ))}
        </div>
      )}

      <div className="composer-tools">
        <button className="tool-chip" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          🖼 {uploading ? 'Envoi…' : 'Capture d\'écran'}
        </button>
        <button className="tool-chip" onClick={() => setShowLinkPicker(true)}>
          🔗 Lien vers une page
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFile} />
      </div>

      <div className="composer-box">
        <textarea
          rows={1}
          placeholder="Écrire une instruction…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={handleSend} disabled={sending}>
          →
        </button>
      </div>

      {showLinkPicker && (
        <LinkPicker
          clientUserId={clientUserId}
          onSelect={handleLinkSelected}
          onClose={() => setShowLinkPicker(false)}
        />
      )}
    </div>
  );
}

/* CSS à ajouter dans global.css :

.composer-pending { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.pending-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px; border-radius: 999px;
    background: var(--soft); border: 1px solid var(--line);
    font-size: 11px; color: var(--primary);
}
.pending-chip button { color: var(--muted); font-size: 11px; }
*/