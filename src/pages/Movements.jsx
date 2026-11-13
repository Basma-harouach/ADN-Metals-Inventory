import { useEffect, useMemo, useState } from 'react'
import axios from '../api/axios.js'
import MovementModal from '../components/MovementModal.jsx'

const Movements = () => {
  const [movements, setMovements] = useState([])
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)

  const loadData = async () => {
    const [{ data: movementData }, { data: productsData }] = await Promise.all([
      axios.get('/movements'),
      axios.get('/products'),
    ])
    setMovements(movementData)
    setProducts(productsData)
  }

  useEffect(() => { loadData() }, [])

  const handleSubmit = async (payload) => {
    await axios.post('/movements', payload)
    setModalOpen(false)
    loadData()
  }

  const visibleMoves = useMemo(() => {
    if (filter === 'all') return movements
    return movements.filter((item) => item.type === filter)
  }, [filter, movements])

  return (
    <div className="page-grid">
      <div className="section top-panel card">
        <div>
          <h2>Historique des mouvements</h2>
          <p>Suivez les entrées, sorties et ajustements de stock.</p>
        </div>
        <div className="toolbar">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="entree">Entrées</option>
            <option value="sortie">Sorties</option>
            <option value="ajustement">Ajustements</option>
          </select>
          <button className="primary" onClick={() => setModalOpen(true)}>Ajouter</button>
        </div>
      </div>

      <div className="card table-card">
        <div className="table-header">
          <h2>Mouvements récents</h2>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Produit</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Opérateur</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {visibleMoves.map((movement) => (
                <tr key={movement._id}>
                  <td>{new Date(movement.date).toLocaleDateString()}</td>
                  <td>{movement.product?.name || 'N/A'}</td>
                  <td>{movement.type}</td>
                  <td>{movement.quantity}</td>
                  <td>{movement.operator}</td>
                  <td>{movement.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MovementModal open={modalOpen} onClose={() => setModalOpen(false)} products={products} onSubmit={handleSubmit} />
    </div>
  )
}

export default Movements
