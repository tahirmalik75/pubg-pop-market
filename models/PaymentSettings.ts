import mongoose, { Schema, model, models } from 'mongoose';

const PaymentSettingsSchema = new Schema({
    jazzcashNumber: {
        type: String,
    },
    easypaisaNumber: {
        type: String,
    },
    accountName: {
        type: String,
        required: true,
    },
    bankDetails: {
        type: String,
    },
}, {
    timestamps: true,
});

// Since there should usually only be one set of payment settings, 
// we can implement logic later to ensure only one document exists.
const PaymentSettings = models.PaymentSettings || model('PaymentSettings', PaymentSettingsSchema);

export default PaymentSettings;
