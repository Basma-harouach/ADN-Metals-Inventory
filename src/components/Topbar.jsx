import AlertBadge from './AlertBadge.jsx'

const Topbar = ({ title, alertsCount }) => (
  <header className="topbar">
    <div>
      <h1>{title}</h1>
      <p className="subtitle">ADN Metals inventory operations dashboard</p>
    </div>
    <div className="topbar-actions">
      <AlertBadge count={alertsCount} label="Alerte stock faible" />
    </div>
  </header>
)

export default Topbar
