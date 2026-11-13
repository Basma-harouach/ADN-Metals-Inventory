import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/stock', label: 'Stock' },
  { path: '/movements', label: 'Movements' },
  { path: '/suppliers', label: 'Suppliers' },
  { path: '/orders', label: 'Orders' },
  { path: '/alerts', label: 'Alerts' },
  { path: '/settings', label: 'Settings' },
]

const Sidebar = () => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark">ADN</div>
      <div>
        <p className="brand-label">ADN Metals</p>
        <span>Gestion de stock</span>
      </div>
    </div>

    <nav className="nav-list">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
)

export default Sidebar
