import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

const emitLowStock = async (app) => {
  const io = app.get('io')
  if (!io) return
  const lowProducts = await Product.find({ quantity: { $lte: 0 } }).lean()
  const lowThreshold = await Product.find({ $expr: { $lte: ['$quantity', '$minThreshold'] } }).lean()
  const low = lowProducts.concat(lowThreshold).filter((item, index, array) => array.findIndex((entry) => entry._id.equals(item._id)) === index)
  io.emit('lowStockAlert', { count: low.length, products: low })
}

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query
    const filters = {}
    if (search) {
      filters.$or = [
        { ref: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
      ]
    }
    if (category) filters.category = category
    const products = await Product.find(filters).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/alerts/low', async (req, res) => {
  try {
    const products = await Product.find({ $expr: { $lte: ['$quantity', '$minThreshold'] } }).sort({ quantity: 1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body)
    await emitLowStock(req.app)
    res.status(201).json(product)
  } catch (error) {
    // Map low-level MongoDB auth errors to a clearer message for the client
    if (error.name === 'MongoServerError' || /authentication/i.test(error.message)) {
      console.error('MongoDB authentication error:', error)
      return res.status(500).json({ error: 'Database authentication failed. Check server MONGO_URI and credentials.' })
    }
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ error: 'Product not found' })
    await emitLowStock(req.app)
    res.json(product)
  } catch (error) {
    if (error.name === 'MongoServerError' || /authentication/i.test(error.message)) {
      console.error('MongoDB authentication error:', error)
      return res.status(500).json({ error: 'Database authentication failed. Check server MONGO_URI and credentials.' })
    }
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    await emitLowStock(req.app)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
