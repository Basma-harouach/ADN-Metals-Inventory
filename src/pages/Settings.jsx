const Settings = () => (
  <div className="page-grid">
    <div className="section top-panel card">
      <div>
        <h2>Paramètres</h2>
        <p>Informations sur la société et gestion des alertes.</p>
      </div>
    </div>

    <div className="card split-card">
      <div>
        <h3>ADN Metals</h3>
        <p>Entreprise marocaine spécialisée dans les produits en cuivre et la distribution industrielle.</p>
        <div className="info-list">
          <div>
            <span>Adresse</span>
            <p>Casablanca, Maroc</p>
          </div>
          <div>
            <span>Téléphone</span>
            <p>+212 523 000 000</p>
          </div>
          <div>
            <span>Email</span>
            <p>contact@adnmetals.ma</p>
          </div>
        </div>
      </div>

      <div>
        <h3>Seuils d'alerte</h3>
        <p>Réglez les seuils et surveillez les paramètres du stock.</p>
        <div className="settings-card">
          <label>
            Seuil par défaut
            <input type="number" defaultValue={100} />
          </label>
          <label>
            Notification email
            <input type="email" placeholder="alerte@adnmetals.ma" />
          </label>
          <button className="primary">Enregistrer</button>
        </div>
      </div>
    </div>

    <div className="card panel-form">
      <h3>Gestion des utilisateurs</h3>
      <p>Ce tableau de bord prévoit un espace utilisateur à venir.</p>
      <div className="placeholder-box">
        <span>Création de compte, rôles et accès seront bientôt disponibles.</span>
      </div>
    </div>
  </div>
)

export default Settings
