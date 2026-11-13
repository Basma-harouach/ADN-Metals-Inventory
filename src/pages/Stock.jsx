import { useEffect, useMemo, useState } from 'react'
import axios from '../api/axios.js'
import StockTable from '../components/StockTable.jsx'

const categories = ['Tube cuivre', 'Câble électrique', 'Cuivre affiné', 'Méplat / Barre']
const units = ['ml', 'kg', 'T', 'pcs', 'm']

const Stock = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ref: '', name: '', category: categories[0], quantity: '', minThreshold: '', unit: units[0], unitPrice: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const closeModal = () => {
    setOpen(false)
    setEditing(null)
    setError('')
  }

  const loadProducts = async () => {
    const { data } = await axios.get('/products', { params: { search, category } })
    setProducts(data)
  }

  useEffect(() => { loadProducts() }, [search, category])

  const handleOpen = (product = null) => {
    setError('')
    setEditing(product)
    if (product) {
      setForm({
        ref: product.ref,
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        minThreshold: product.minThreshold,
        unit: product.unit,
        unitPrice: product.unitPrice,
      })
    } else {
      setForm({ ref: '', name: '', category: categories[0], quantity: '', minThreshold: '', unit: units[0], unitPrice: '' })
    }
    setOpen(true)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      minThreshold: Number(form.minThreshold),
      unitPrice: Number(form.unitPrice),
    }

    try {
      if (editing) {
        await axios.put(`/products/${editing._id}`, payload)
      } else {
        await axios.post('/products', payload)
      }
      closeModal()
      loadProducts()
    } catch (saveError) {
      const message = saveError.response?.data?.error || saveError.message || 'Erreur lors de l’enregistrement'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer ${product.name} ?`)) return
    await axios.delete(`/products/${product._id}`)
    loadProducts()
  }

  const filteredProducts = useMemo(() => products, [products])

  return (
    <div className="page-grid">
      <div className="section top-panel card">
        <div>
          <h2>Stock total</h2>
          <p>Recherchez, filtrez et mettez à jour les produits ADN Metals.</p>
        </div>
        <div className="toolbar">
          <div className="search-group">
            <input type="search" placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Toutes catégories</option>
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <button className="primary" onClick={() => handleOpen(null)}>Nouveau produit</button>
        </div>
      </div>

      <StockTable products={filteredProducts} onEdit={handleOpen} onDelete={handleDelete} />

      {open && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Modifier un produit' : 'Ajouter un produit'}</h2>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSave}>
              {error && <div className="form-error">{error}</div>}
              <label>
                Réf
                <input name="ref" value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} required />
              </label>
              <label>
                Nom
                <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label>
                Catégorie
                <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </label>
              <label>
                Quantité
                <input name="quantity" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </label>
              <label>
                Seuil minimum
                <input name="minThreshold" type="number" min="0" value={form.minThreshold} onChange={(e) => setForm({ ...form, minThreshold: e.target.value })} required />
              </label>
              <label>
                Unité
                <select name="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                  {units.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </label>
              <label>
                Prix unitaire (MAD)
                <input name="unitPrice" type="number" step="0.1" min="0" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
              </label>
              <div className="modal-actions">
                <button type="button" className="ghost" onClick={() => setOpen(false)}>Annuler</button>
                <button type="submit" className="primary" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Stock
