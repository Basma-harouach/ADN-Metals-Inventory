import { useEffect, useMemo, useState } from 'react'
import axios from '../api/axios.js'

const OrderRow = ({ order, onStatusChange }) => (
  <tr>
    <td>{order.reference}</td>
    <td>{order.supplier?.name || 'N/A'}</td>
    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
    <td>{order.totalAmount.toFixed(2)} MAD</td>
    <td>
      <select value={order.status} onChange={(e) => onStatusChange(order._id, e.target.value)}>
        <option value="en attente">en attente</option>
        <option value="confirmée">confirmée</option>
        <option value="reçue">reçue</option>
        <option value="annulée">annulée</option>
      </select>
    </td>
  </tr>
)

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ reference: '', supplier: '', products: [{ product: '', quantity: '', unitPrice: '' }] })
  const [error, setError] = useState('')

  const loadData = async () => {
    const [{ data: orderData }, { data: suppliersData }, { data: productsData }] = await Promise.all([
      axios.get('/orders'),
      axios.get('/suppliers'),
      axios.get('/products'),
    ])
    setOrders(orderData)
    setSuppliers(suppliersData)
    setProducts(productsData)
  }

  useEffect(() => { loadData() }, [])

  const handleLineChange = (index, field, value) => {
    const updated = [...form.products]
    updated[index][field] = value
    setForm({ ...form, products: updated })
  }

  const addLine = () => {
    setForm({ ...form, products: [...form.products, { product: '', quantity: '', unitPrice: '' }] })
  }

  const removeLine = (index) => {
    const updated = [...form.products]
    updated.splice(index, 1)
    setForm({ ...form, products: updated })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.supplier) {
      setError('Veuillez sélectionner un fournisseur.')
      return
    }

    if (!form.reference.trim()) {
      setError('Veuillez saisir une référence de commande.')
      return
    }

    const invalidLine = form.products.find((entry) => !entry.product || !entry.quantity || Number(entry.quantity) <= 0 || !entry.unitPrice || Number(entry.unitPrice) < 0)
    if (invalidLine) {
      setError('Veuillez renseigner correctement toutes les lignes de produits.')
      return
    }

    const payload = {
      reference: form.reference,
      supplier: form.supplier,
      products: form.products.map((entry) => ({
        product: entry.product,
        quantity: Number(entry.quantity),
        unitPrice: Number(entry.unitPrice),
      })),
    }

    await axios.post('/orders', payload)
    setForm({ reference: '', supplier: '', products: [{ product: '', quantity: '', unitPrice: '' }] })
    loadData()
  }

  const handleStatusChange = async (id, status) => {
    await axios.put(`/orders/${id}/status`, { status })
    loadData()
  }

  const orderCount = orders.length
  const totalAmount = useMemo(() => orders.reduce((sum, order) => sum + order.totalAmount, 0), [orders])

  return (
    <div className="page-grid">
      <div className="section top-panel card split-card">
        <div>
          <h2>Commandes</h2>
          <p>Créez et suivez les statuts de vos bons de commande.</p>
        </div>
        <div className="summary-box">
          <strong>{orderCount}</strong>
          <span>Commandes</span>
          <strong>{totalAmount.toFixed(0)} MAD</strong>
          <span>Valeur totale</span>
        </div>
      </div>

      <div className="card panel-form">
        <h3>Créer une commande</h3>
        <form onSubmit={handleSubmit}>
          {error && <div className="form-error" role="alert">{error}</div>}
          <label>
            Référence
            <input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required />
          </label>
          <label>
            Fournisseur
            <select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })}>
              <option value="">Sélectionner</option>
              {suppliers.map((item) => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </label>

          {form.products.map((entry, index) => (
            <div className="order-line" key={index}>
              <select value={entry.product} onChange={(e) => handleLineChange(index, 'product', e.target.value)} required>
                <option value="">Produit</option>
                {products.map((item) => (
                  <option key={item._id} value={item._id}>{item.ref}</option>
                ))}
              </select>
              <input type="number" placeholder="Quantité" min="1" value={entry.quantity} onChange={(e) => handleLineChange(index, 'quantity', e.target.value)} required />
              <input type="number" placeholder="Prix unité" step="0.1" min="0" value={entry.unitPrice} onChange={(e) => handleLineChange(index, 'unitPrice', e.target.value)} required />
              {form.products.length > 1 && <button type="button" className="ghost danger small" onClick={() => removeLine(index)}>×</button>}
            </div>
          ))}

          <button type="button" className="ghost" onClick={addLine}>Ajouter une ligne</button>
          <button type="submit" className="primary">Créer la commande</button>
        </form>
      </div>

      <div className="card table-card">
        <div className="table-header">
          <h2>Liste des commandes</h2>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Fournisseur</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order._id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders
