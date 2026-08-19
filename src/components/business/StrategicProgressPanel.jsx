import BusinessCard from "./BusinessCard";
import BusinessProgress from "./BusinessProgress";
import BusinessStatusBadge from "./BusinessStatusBadge";

function StrategicProgressPanel({
  items = [],
  completion = 0,
}) {
  return (
    <BusinessCard
      title="Progression stratégique"
      subtitle="État de configuration de votre Business"
    >
      <div className="strategic-progress-list">
        {items.map((item) => (
          <div
            className="strategic-progress-item"
            key={item.id}
          >
            <div className="strategic-progress-main">
              <div>
                <strong>{item.label}</strong>

                {item.description && (
                  <small>
                    {item.description}
                  </small>
                )}
              </div>

              <BusinessStatusBadge
                status={item.status}
              >
                {item.statusLabel}
              </BusinessStatusBadge>
            </div>

            {item.progress !== undefined && (
              <BusinessProgress
                value={item.progress}
                showValue={false}
              />
            )}
          </div>
        ))}
      </div>

      <div className="strategic-progress-total">
        <div>
          <span>Business complété</span>
          <strong>{completion}%</strong>
        </div>

        <BusinessProgress
          value={completion}
          showValue={false}
        />
      </div>
    </BusinessCard>
  );
}

export default StrategicProgressPanel;