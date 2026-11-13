import express from 'express'
import Product from '../models/Product.js'
import Movement from '../models/Movement.js'

const router = express.Router()

router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const totalValueData = await Product.aggregate([
      { $project: { total: { $multiply: ['$quantity', '$unitPrice'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const totalValue = totalValueData[0]?.total || 0
    const criticalCount = await Product.countDocuments({ $expr: { $lte: ['$quantity', '$minThreshold'] } })
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const movementsThisMonth = await Movement.countDocuments({ date: { $gte: monthStart } })
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ])
    const last5Movements = await Movement.find().populate('product', 'name ref').sort({ date: -1 }).limit(5)

    res.json({
      totalProducts,
      totalValue,
      criticalCount,
      movementsThisMonth,
      categoryBreakdown,
      last5Movements,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
