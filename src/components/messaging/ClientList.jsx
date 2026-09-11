// src/components/messaging/ClientList.jsx

const HEALTH_CLASS = {
  solide: 'health-solide',
  a_optimiser: 'health-optimiser',
  prioritaire: 'health-prioritaire',
  critique: 'health-critique',
};

function initials(name) {
  return (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function ClientList({ conversations, activeConversationId, onSelect }) {
  return (
    <div className="client-list">
      {conversations.map((conv) => {
        const companyName = conv.business_profiles?.company_name || 'Sans profil';
        const healthClass = HEALTH_CLASS[conv.health_status] || 'health-optimiser';

        return (
          <div
            key={conv.id}
            className={`client-item ${conv.id === activeConversationId ? 'active' : ''}`}
            onClick={() => onSelect(conv)}
          >
            <div className={`ci-health ${healthClass}`} />
            <div className="avatar-sm">{initials(companyName)}</div>
            <div className="ci-info">
              <div className="ci-name">{companyName}</div>
              <div className="ci-last">{conv.last_message_preview || 'Aucun message pour l\'instant'}</div>
            </div>
            {conv.unread_by_coach > 0 && <div className="ci-unread">{conv.unread_by_coach}</div>}
          </div>
        );
      })}

      {conversations.length === 0 && (
        <p className="muted" style={{ padding: '12px', fontSize: '12px' }}>
          Aucune conversation pour l'instant.
        </p>
      )}
    </div>
  );
}