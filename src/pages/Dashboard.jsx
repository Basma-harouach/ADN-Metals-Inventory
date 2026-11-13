import { useEffect, useState } from 'react'
import axios from '../api/axios.js'
import KPICard from '../components/KPICard.jsx'
import AlertBadge from '../components/AlertBadge.jsx'

const categoryColors = {
  'Tube cuivre': '#B87333',
  'Câble électrique': '#8B5A2B',
  'Cuivre affiné': '#2E7D52',
  'Méplat / Barre': '#B87700',
}

const Dashboard = () => {
  const [stats, setStats] = useState({ categoryBreakdown: [], last5Movements: [] })
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const load = async () => {
      const [{ data: statsData }, { data: lowData }] = await Promise.all([
        axios.get('/dashboard/stats'),
        axios.get('/products/alerts/low'),
      ])
      setStats(statsData)
      setAlerts(lowData)
    }
    load()
  }, [])

  const totalProducts = stats.totalProducts || 0
  const totalValue = stats.totalValue || 0
  const criticalCount = stats.criticalCount || 0
  const movementsThisMonth = stats.movementsThisMonth || 0

  return (
    <div className="page-grid">
      <section className="grid-cards">
        <KPICard title="Produits" value={totalProducts} change="Vue globale du stock" accent="ok" />
        <KPICard title="Valeur totale" value={`${totalValue.toFixed(0)} MAD`} change="Valeur marchande estimée" accent="info" />
        <KPICard title="Critiques" value={criticalCount} change="Articles à rapprocher" accent="danger" />
        <KPICard title="Mouvements" value={movementsThisMonth} change="Ce mois-ci" accent="warning" />
      </section>

      <section className="section card chart-card">
        <div className="section-header">
          <h2>Mouvements mensuels</h2>
          <span>Comparaison visuelle</span>
        </div>
        <div className="bar-chart">
          {stats.categoryBreakdown.map((item) => {
            const value = item.count
            const max = Math.max(...stats.categoryBreakdown.map((item) => item.count), 1)
            return (
              <div className="bar-row" key={item._id}>
                <div>{item._id}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.round((value / max) * 100)}%`, background: categoryColors[item._id] }} />
                </div>
                <span>{value}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="section card donut-card">
        <div className="section-header">
          <h2>Répartition par catégorie</h2>
        </div>
        <div className="donut-grid">
          {stats.categoryBreakdown.map((item) => (
            <div key={item._id} className="donut-item">
              <span className="donut-dot" style={{ background: categoryColors[item._id] }} />
              <div>
                <strong>{item._id}</strong>
                <p>{item.count} produits</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section card">
        <div className="section-header">
          <h2>Derniers mouvements</h2>
        </div>
        <div className="table-scroll small-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Produit</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Opérateur</th>
              </tr>
            </thead>
            <tbody>
              {stats.last5Movements.map((movement) => (
                <tr key={movement._id}>
                  <td>{new Date(movement.date).toLocaleDateString()}</td>
                  <td>{movement.product?.name || 'N/A'}</td>
                  <td>{movement.type}</td>
                  <td>{movement.quantity}</td>
                  <td>{movement.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section card alert-panel">
        <div className="section-header">
          <h2>Alertes de stock faible</h2>
          <span>{alerts.length} articles</span>
        </div>
        {alerts.length === 0 ? (
          <p className="empty-state">Aucune alerte active. Le stock est stable.</p>
        ) : (
          <ul className="alert-list">
            {alerts.map((product) => (
              <li key={product._id}>
                <div>
                  <strong>{product.ref}</strong>
                  <span>{product.name}</span>
                </div>
                <div>
                  <AlertBadge count={product.status === 'low' ? 1 : 2} label={product.status} />
                  <span>{product.quantity} / {product.minThreshold}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Dashboard
