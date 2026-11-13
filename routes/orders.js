import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

const router = express.Router()

const emitLowStock = async (app) => {
  const io = app.get('io')
  if (!io) return
  const low = await Product.find({ $expr: { $lte: ['$quantity', '$minThreshold'] } }).lean()
  io.emit('lowStockAlert', { count: low.length, products: low })
}

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('supplier', 'name contact email phone').populate('products.product', 'name ref')
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const totalAmount = payload.products.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const order = await Order.create({ ...payload, totalAmount })
    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Order not found' })

    const wasReceived = order.status === 'reçue'
    order.status = status
    await order.save()

    if (status === 'reçue' && !wasReceived) {
      for (const item of order.products) {
        const product = await Product.findById(item.product)
        if (product) {
          product.quantity += item.quantity
          await product.save()
        }
      }
      await emitLowStock(req.app)
    }

    res.json(order)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
