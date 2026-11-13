import AlertBadge from './AlertBadge.jsx'

const StockTable = ({ products, onEdit, onDelete }) => (
  <div className="card table-card">
    <div className="table-header">
      <h2>Produits en stock</h2>
      <span>{products.length} items</span>
    </div>
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Réf</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Quantité</th>
            <th>Seuil</th>
            <th>Unité</th>
            <th>Prix</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.ref}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>
                <div className="quantity-cell">
                  <span>{product.quantity}</span>
                  <div className="quantity-bar">
                    <div
                      className="quantity-meter"
                      style={{
                        width: `${Math.min(100, Math.round((product.quantity / Math.max(product.minThreshold, 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </td>
              <td>{product.minThreshold}</td>
              <td>{product.unit}</td>
              <td>{product.unitPrice.toFixed(2)} MAD</td>
              <td>
                <AlertBadge 
                  count={product.status === 'ok' ? 0 : product.status === 'low' ? 1 : 2}
                  label={product.status}
                />
              </td>
              <td className="table-actions">
                <button className="ghost" onClick={() => onEdit(product)}>
                  Éditer
                </button>
                <button className="danger ghost" onClick={() => onDelete(product)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default StockTable
