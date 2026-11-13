import express from 'express'
import Supplier from '../models/Supplier.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().populate('products', 'ref name')
    res.json(suppliers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body)
    res.status(201).json(supplier)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' })
    res.json(supplier)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id)
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
