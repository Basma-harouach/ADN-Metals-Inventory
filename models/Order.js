import mongoose from 'mongoose'

const orderProductSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    products: { type: [orderProductSchema], default: [] },
    status: {
      type: String,
      enum: ['en attente', 'confirmée', 'reçue', 'annulée'],
      default: 'en attente',
    },
    totalAmount: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
)

export default mongoose.model('Order', orderSchema)
