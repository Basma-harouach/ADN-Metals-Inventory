import express from 'express'
import Movement from '../models/Movement.js'
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
    const movements = await Movement.find().populate('product', 'name ref').sort({ date: -1 })
    res.json(movements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { product: productId, type, quantity, operator, note, date } = req.body
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ error: 'Product not found' })

    let delta = 0
    if (type === 'entree') delta = Math.abs(quantity)
    else if (type === 'sortie') delta = -Math.abs(quantity)
    else delta = quantity

    product.quantity = Math.max(0, product.quantity + delta)
    await product.save()

    const movement = await Movement.create({ product: productId, type, quantity, operator, note, date })
    await emitLowStock(req.app)
    res.status(201).json(await movement.populate('product', 'name ref'))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/product/:productId', async (req, res) => {
  try {
    const movements = await Movement.find({ product: req.params.productId }).populate('product', 'name ref').sort({ date: -1 })
    res.json(movements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
