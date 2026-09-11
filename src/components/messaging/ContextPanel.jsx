// src/components/messaging/ContextPanel.jsx

import { useEffect, useState } from 'react';
import { dimensionLabel, dimensionTagClass, getClientContext } from '../../../services/clientContextService';

export default function ContextPanel({ clientUserId, businessProfileId, clientName, companyName, onOpenDiagnostic }) {
  const [context, setContext] = useState(null);

  useEffect(() => {
    if (!clientUserId) return;
    let cancelled = false;
    getClientContext(clientUserId, businessProfileId).then((data) => {
      if (!cancelled) setContext(data);
    });
    return () => {
      cancelled = true;
    };
  }, [clientUserId, businessProfileId]);

  const initials = (clientName || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="ctx-col">
      <div className="ctx-profile">
        <div className="avatar-lg">{initials}</div>
        <strong>{clientName}</strong>
        <span>{companyName}</span>
      </div>

      {context?.diagnostic ? (
        <>
          <div className="health-score">
            <div className="num">{context.diagnostic.business_score}</div>
            <div className="lbl">
              Score de santé business
              <br />
              Dernier diagnostic : {new Date(context.diagnostic.generated_at).toLocaleDateString('fr-FR')}
            </div>
          </div>

          <div className="ctx-block">
            <h4>Dimensions clés</h4>
            {context.diagnostic.dimensions.map((dim) => (
              <div className="dim-row" key={dim.dimension_key}>
                <span>{dim.name}</span>
                <span className={`dim-tag ${dimensionTagClass(dim.status)}`}>{dimensionLabel(dim.status)}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="muted" style={{ fontSize: '12px' }}>Aucun diagnostic généré pour ce client.</p>
      )}

      <div className="ctx-block">
        <h4>Activité en cours</h4>
        <div className="mini-stats">
          <div className="mini-stat">
            <div className="v">{context?.stats.activeProspects ?? '—'}</div>
            <div className="l">Prospects en pipeline</div>
          </div>
          <div className="mini-stat">
            <div className="v">{context?.stats.overdueTasks ?? '—'}</div>
            <div className="l">Tâches en retard</div>
          </div>
          <div className="mini-stat">
            <div className="v">{context?.stats.activeObjectives ?? '—'}</div>
            <div className="l">Objectifs en cours</div>
          </div>
        </div>
      </div>

      {context?.diagnostic && (
        <button className="btn btn-primary ctx-cta" onClick={() => onOpenDiagnostic?.(context.diagnostic.id)}>
          Ouvrir le diagnostic complet
        </button>
      )}
    </aside>
  );
}