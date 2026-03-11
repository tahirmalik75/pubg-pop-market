import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cardId: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'rejected'],
    default: 'pending',
  },
  paymentProof: {
    type: String, // URL to proof image
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
