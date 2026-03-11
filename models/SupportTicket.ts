import mongoose, { Schema, model, models } from 'mongoose';

const SupportTicketSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Allow guest support eventually if needed, but for now we'll use session
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved', 'closed'],
        default: 'open',
    },
}, {
    timestamps: true,
});

const SupportTicket = models.SupportTicket || model('SupportTicket', SupportTicketSchema);

export default SupportTicket;
