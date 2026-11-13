const badgeStyles = {
  ok: 'status-ok',
  low: 'status-warning',
  out: 'status-danger',
}

const AlertBadge = ({ count, label }) => {
  const variant = label === 'ok' ? 'ok' : label === 'low' ? 'low' : label === 'out' ? 'out' : 'info'
  return (
    <div className={`alert-badge ${badgeStyles[variant] || 'status-info'}`}>
      {count > 0 && <span className="alert-count">{count}</span>}
      <span>{label}</span>
    </div>
  )
}

export default AlertBadge
