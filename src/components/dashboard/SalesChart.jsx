function SalesChart() {
  const bars = [
    34,
    44,
    39,
    56,
    49,
    67,
    61,
    76,
    70,
    88,
    81,
    94,
  ];

  return (
    <div className="chart">

      {bars.map((height, index) => (
        <i
          key={index}
          className="bar"
          style={{
            height: `${height}%`,
          }}
        />
      ))}

    </div>
  );
}

export default SalesChart;