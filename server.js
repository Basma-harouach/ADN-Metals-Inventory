import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import productRoutes from './routes/products.js'
import movementRoutes from './routes/movements.js'
import supplierRoutes from './routes/suppliers.js'
import orderRoutes from './routes/orders.js'
import dashboardRoutes from './routes/dashboard.js'
import seedRoute from './routes/seed.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  },
})

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.set('io', io)

app.use('/api/products', productRoutes)
app.use('/api/movements', movementRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/seed', seedRoute)

app.get('/', (req, res) => {
  res.json({ message: 'ADN Metals Stock API' })
})

io.on('connection', (socket) => {
  socket.emit('connected', { message: 'Socket connected' })
})

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/adnmetals-stock'
const port = process.env.PORT || 5000

mongoose
  .connect(mongoUri)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error)
  })
