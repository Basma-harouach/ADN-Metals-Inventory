import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Tube cuivre', 'Câble électrique', 'Cuivre affiné', 'Méplat / Barre'],
      required: true,
    },
    quantity: { type: Number, required: true, default: 0 },
    minThreshold: { type: Number, required: true, default: 0 },
    unit: { type: String, enum: ['ml', 'kg', 'T', 'pcs', 'm'], required: true },
    unitPrice: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

productSchema.virtual('status').get(function () {
  if (this.quantity <= 0) return 'out'
  if (this.quantity <= this.minThreshold) return 'low'
  return 'ok'
})

export default mongoose.model('Product', productSchema)
