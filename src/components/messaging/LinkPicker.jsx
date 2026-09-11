// src/components/messaging/LinkPicker.jsx
//
// Petit sélecteur : le coach choisit une entité du client (prospect,
// tâche, objectif...) et le composant construit l'attachment "link"
// avec la route interne correspondante.

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { buildInternalLinkAttachment } from '../../../services/messagingService';

const TABS = [
  { key: 'task', label: 'Tâches', table: 'tasks', titleField: 'title' },
  { key: 'prospect', label: 'Prospects (CRM)', table: 'prospects', titleField: 'company_name' },
  { key: 'objective', label: 'Objectifs', table: 'objectives', titleField: 'title' },
];

export default function LinkPicker({ clientUserId, onSelect, onClose }) {
  const [activeTab, setActiveTab] = useState('task');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tab = TABS.find((t) => t.key === activeTab);
    setLoading(true);
    supabase
      .from(tab.table)
      .select('id, ' + tab.titleField)
      .eq('user_id', clientUserId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setItems(data || []))
      .finally(() => setLoading(false));
  }, [activeTab, clientUserId]);

  const handlePick = (item) => {
    const tab = TABS.find((t) => t.key === activeTab);
    const label = item[tab.titleField] || 'Voir';
    onSelect(buildInternalLinkAttachment(activeTab, item.id, label));
    onClose();
  };

  return (
    <div className="link-picker-overlay" onClick={onClose}>
      <div className="link-picker" onClick={(e) => e.stopPropagation()}>
        <div className="link-picker-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`link-picker-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="link-picker-list">
          {loading && <div className="link-picker-empty">Chargement…</div>}
          {!loading && items.length === 0 && (
            <div className="link-picker-empty">Rien à afficher ici pour ce client.</div>
          )}
          {!loading &&
            items.map((item) => {
              const tab = TABS.find((t) => t.key === activeTab);
              return (
                <button key={item.id} className="link-picker-item" onClick={() => handlePick(item)}>
                  {item[tab.titleField] || 'Sans titre'}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* CSS à ajouter dans global.css :

.link-picker-overlay {
    position: fixed; inset: 0;
    background: rgba(4,27,83,0.25);
    display: grid; place-items: center;
    z-index: 1000;
}
.link-picker {
    width: 360px; max-height: 420px;
    background: #fff; border-radius: 16px;
    box-shadow: var(--shadow);
    display: flex; flex-direction: column;
    overflow: hidden;
}
.link-picker-tabs { display: flex; border-bottom: 1px solid var(--line); }
.link-picker-tab {
    flex: 1; padding: 12px; font-size: 12px; font-weight: 700;
    color: var(--muted); border-bottom: 2px solid transparent;
}
.link-picker-tab.active { color: var(--primary); border-color: var(--primary); }
.link-picker-list { overflow-y: auto; padding: 8px; }
.link-picker-item {
    display: block; width: 100%; text-align: left;
    padding: 10px 12px; border-radius: 10px; font-size: 13px;
}
.link-picker-item:hover { background: var(--soft); }
.link-picker-empty { padding: 20px; text-align: center; color: var(--muted); font-size: 12px; }
*/