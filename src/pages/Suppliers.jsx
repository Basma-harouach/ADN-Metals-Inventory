import { useEffect, useState } from 'react'
import axios from '../api/axios.js'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [form, setForm] = useState({ name: '', contact: '', email: '', phone: '', address: '' })

  const loadSuppliers = async () => {
    const { data } = await axios.get('/suppliers')
    setSuppliers(data)
  }

  useEffect(() => { loadSuppliers() }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await axios.post('/suppliers', form)
    setForm({ name: '', contact: '', email: '', phone: '', address: '' })
    loadSuppliers()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce fournisseur ?')) return
    await axios.delete(`/suppliers/${id}`)
    loadSuppliers()
  }

  return (
    <div className="page-grid">
      <div className="section top-panel card">
        <div>
          <h2>Fournisseurs</h2>
          <p>Gérez les contacts et produits liés aux fournisseurs.</p>
        </div>
      </div>

      <div className="card split-card">
        <div>
          <h3>Créer un fournisseur</h3>
          <form className="panel-form" onSubmit={handleSubmit}>
            <label>
              Nom
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Contact
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label>
              Téléphone
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label>
              Adresse
              <textarea rows="3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </label>
            <button className="primary" type="submit">Ajouter</button>
          </form>
        </div>

        <div>
          <h3>Liste des fournisseurs</h3>
          <div className="supplier-list">
            {suppliers.map((supplier) => (
              <div className="supplier-card" key={supplier._id}>
                <div>
                  <h4>{supplier.name}</h4>
                  <p>{supplier.contact}</p>
                  <p>{supplier.phone}</p>
                  <p>{supplier.email}</p>
                </div>
                <div className="supplier-actions">
                  <button className="ghost danger" onClick={() => handleDelete(supplier._id)}>Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Suppliers
