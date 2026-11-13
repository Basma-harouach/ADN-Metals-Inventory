import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Stock from './pages/Stock.jsx'
import Movements from './pages/Movements.jsx'
import Suppliers from './pages/Suppliers.jsx'
import Orders from './pages/Orders.jsx'
import Alerts from './pages/Alerts.jsx'
import Settings from './pages/Settings.jsx'
import './App.css'

const routeTitles = {
  '/': 'Dashboard',
  '/stock': 'Stock',
  '/movements': 'Movements',
  '/suppliers': 'Suppliers',
  '/orders': 'Orders',
  '/alerts': 'Alertes',
  '/settings': 'Paramètres',
}

function Layout() {
  const location = useLocation()
  const [alertsCount, setAlertsCount] = useState(0)

  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('lowStockAlert', (data) => {
      setAlertsCount(data.count || 0)
    })
    socket.on('connected', () => {
      console.log('Connected to alert channel')
    })
    return () => socket.disconnect()
  }, [])

  const currentTitle = useMemo(() => routeTitles[location.pathname] || 'Dashboard', [location.pathname])

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <Topbar title={currentTitle} alertsCount={alertsCount} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/movements" element={<Movements />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App
