function PipelineStage({
  title,
  deals,
}) {
  return (
    <div className="stage">

      <h4>
        {title}
      </h4>

      {deals.map((deal) => (
        <div
          className="deal"
          key={deal.company}
        >

          <strong>
            {deal.company}
          </strong>

          <span>
            {deal.amount}
          </span>

        </div>
      ))}

    </div>
  );
}

export default PipelineStage;