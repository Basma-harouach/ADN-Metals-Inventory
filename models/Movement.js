import mongoose from 'mongoose'

const movementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['entree', 'sortie', 'ajustement'], required: true },
    quantity: { type: Number, required: true },
    operator: { type: String, default: 'Admin' },
    note: { type: String, default: '' },
    date: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
)

export default mongoose.model('Movement', movementSchema)
