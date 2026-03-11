import mongoose, { Schema, model, models } from 'mongoose';

const CardSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
    },
    image: {
        type: String, // URL to the image
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
    },
    stock: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Card = models.Card || model('Card', CardSchema);

export default Card;
