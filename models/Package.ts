import mongoose from 'mongoose'

export interface IPackage {
  _id: string
  name: string
  popularityAmount: number
  price: number
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new mongoose.Schema<IPackage>(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    popularityAmount: {
      type: Number,
      required: [true, 'Popularity amount is required'],
      min: [1, 'Popularity amount must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema)
