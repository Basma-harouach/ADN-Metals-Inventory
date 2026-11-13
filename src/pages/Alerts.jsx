import { useEffect, useState } from 'react'
import axios from '../api/axios.js'
import AlertBadge from '../components/AlertBadge.jsx'

const Alerts = () => {
  const [alerts, setAlerts] = useState([])

  const loadAlerts = async () => {
    const { data } = await axios.get('/products/alerts/low')
    setAlerts(data)
  }

  useEffect(() => { loadAlerts() }, [])

  return (
    <div className="page-grid">
      <div className="section top-panel card">
        <div>
          <h2>Alertes de stock</h2>
          <p>Surveillez en temps réel les produits sous seuil.</p>
        </div>
      </div>

      <div className="card alert-panel">
        <div className="section-header">
          <h2>Produits critiques</h2>
          <span>{alerts.length} éléments</span>
        </div>
        {alerts.length === 0 ? (
          <p className="empty-state">Aucun produit critique pour l'instant.</p>
        ) : (
          <ul className="alert-list full">
            {alerts.map((product) => (
              <li key={product._id}>
                <div>
                  <strong>{product.ref}</strong>
                  <span>{product.name}</span>
                </div>
                <div>
                  <AlertBadge count={product.status === 'low' ? 1 : 2} label={product.status} />
                  <span>{product.quantity}/{product.minThreshold} {product.unit}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Alerts
