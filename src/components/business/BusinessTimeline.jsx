import BusinessCard from "./BusinessCard";
import BusinessTimelineItem from "./BusinessTimelineItem";

function BusinessTimeline({
  items = [],
}) {
  return (
    <BusinessCard
      title="Activité récente"
      subtitle="Les dernières évolutions de votre Business"
    >
      <div className="business-timeline">
        {items.map((item) => (
          <BusinessTimelineItem
            key={item.id}
            {...item}
          />
        ))}
      </div>
    </BusinessCard>
  );
}

export default BusinessTimeline;