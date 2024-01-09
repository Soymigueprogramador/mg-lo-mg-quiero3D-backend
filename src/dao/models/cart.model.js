import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: [
        new mongoose.Schema({
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: productCollection,
            },
            quantity: { type: Number, required: true },
        }),
    ],
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);
