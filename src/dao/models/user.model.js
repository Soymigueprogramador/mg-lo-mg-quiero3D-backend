import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carts1';
const productCollection = 'products1';
const chatCollection = 'chats1';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: [],
    status: { type: Boolean, required: true },
});
productSchema.plugin(mongoosePaginate);

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

const chatSchema = new mongoose.Schema({
    user: String,
    mensaje: String,
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
export const productsModel = mongoose.model(productCollection, productSchema);
export const chatModel = mongoose.model(chatCollection, chatSchema);