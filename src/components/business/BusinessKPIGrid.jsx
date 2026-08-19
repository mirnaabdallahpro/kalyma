import BusinessStatCard from "./BusinessStatCard";

function BusinessKPIGrid({ stats }) {
  return (
    <div className="business-kpi-grid">
      {stats.map((stat) => (
        <BusinessStatCard
          key={stat.id}
          {...stat}
        />
      ))}
    </div>
  );
}

export default BusinessKPIGrid;