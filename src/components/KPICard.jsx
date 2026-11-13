const KPICard = ({ title, value, change, accent }) => (
  <div className="kpi-card">
    <div className="kpi-header">
      <span>{title}</span>
      {accent && <span className={`kpi-badge ${accent}`}>{accent}</span>}
    </div>
    <h2>{value}</h2>
    {change && <p className="kpi-change">{change}</p>}
  </div>
)

export default KPICard
