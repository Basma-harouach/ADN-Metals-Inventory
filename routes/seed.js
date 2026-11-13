import express from 'express'
import Product from '../models/Product.js'
import Supplier from '../models/Supplier.js'
import Order from '../models/Order.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    await Product.deleteMany({})
    await Supplier.deleteMany({})
    await Order.deleteMany({})

    const products = await Product.insertMany([
      { ref: 'TC-022-6M', name: 'Tube Cu Ø22mm — 6m', category: 'Tube cuivre', quantity: 620, minThreshold: 100, unit: 'ml', unitPrice: 85 },
      { ref: 'TC-015-FR', name: 'Tube frigo Ø15mm', category: 'Tube cuivre', quantity: 45, minThreshold: 50, unit: 'ml', unitPrice: 62 },
      { ref: 'GR-995-KG', name: 'Granules Cu 99.5%', category: 'Cuivre affiné', quantity: 8200, minThreshold: 2000, unit: 'kg', unitPrice: 78 },
      { ref: 'BI-998-T', name: 'Billette Cu 99.8%', category: 'Cuivre affiné', quantity: 3500, minThreshold: 1000, unit: 'kg', unitPrice: 82 },
      { ref: 'AN-992-T', name: 'Anode Cu 99.2%', category: 'Cuivre affiné', quantity: 0, minThreshold: 1000, unit: 'kg', unitPrice: 75 },
      { ref: 'CE-R-6MM', name: 'Câble élec. rouge 6mm²', category: 'Câble électrique', quantity: 3200, minThreshold: 500, unit: 'm', unitPrice: 14.5 },
      { ref: 'CE-B-4MM', name: 'Câble élec. bleu 4mm²', category: 'Câble électrique', quantity: 1800, minThreshold: 500, unit: 'm', unitPrice: 11.2 },
      { ref: 'MP-80X5', name: 'Méplat Cu 80×5mm', category: 'Méplat / Barre', quantity: 12, minThreshold: 20, unit: 'pcs', unitPrice: 340 },
      { ref: 'BA-25X25', name: 'Barre rectangulaire 25×25', category: 'Méplat / Barre', quantity: 88, minThreshold: 30, unit: 'pcs', unitPrice: 520 },
    ])

    const supplier = await Supplier.create({
      name: 'Fournisseur Atlas Metal',
      contact: 'Karim El Hadi',
      email: 'contact@atlasmetal.ma',
      phone: '+212 600 123 456',
      address: 'Rabat, Maroc',
      products: products.slice(0, 4).map((product) => product._id),
    })

    await Order.create({
      reference: 'ORD-2026-001',
      supplier: supplier._id,
      products: [
        { product: products[0]._id, quantity: 200, unitPrice: 85 },
        { product: products[5]._id, quantity: 500, unitPrice: 14.5 },
      ],
      status: 'en attente',
      totalAmount: 200 * 85 + 500 * 14.5,
    })

    res.json({ success: true, products: products.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
