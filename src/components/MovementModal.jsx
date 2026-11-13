import { useState } from 'react'

const MovementModal = ({ open, onClose, products, onSubmit }) => {
  const [form, setForm] = useState({ product: '', type: 'entree', quantity: '', operator: '', note: '' })

  if (!open) return null

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
  }

  const submit = (event) => {
    event.preventDefault()
    if (!form.product || !form.quantity) return
    onSubmit({ ...form, quantity: Number(form.quantity) })
    setForm({ product: '', type: 'entree', quantity: '', operator: '', note: '' })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-shell">
        <div className="modal-header">
          <h2>Ajouter un mouvement</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <form className="modal-form" onSubmit={submit}>
          <label>
            Produit
            <select value={form.product} onChange={handleChange('product')}>
              <option value="">Sélectionnez</option>
              {products.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.ref} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Type
            <select value={form.type} onChange={handleChange('type')}>
              <option value="entree">Entrée</option>
              <option value="sortie">Sortie</option>
              <option value="ajustement">Ajustement</option>
            </select>
          </label>
          <label>
            Quantité
            <input type="number" value={form.quantity} min="0" onChange={handleChange('quantity')} />
          </label>
          <label>
            Opérateur
            <input type="text" value={form.operator} onChange={handleChange('operator')} placeholder="Admin" />
          </label>
          <label>
            Note
            <textarea value={form.note} onChange={handleChange('note')} rows="3" />
          </label>
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MovementModal
