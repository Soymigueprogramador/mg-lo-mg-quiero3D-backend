import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carts1';

const cartScheme = new mongoose.Scheme({
    products: [
        new mongoose.Scheme({
            productId: {
                type: mongoose.Scheme.type.objetId,
                required: true,
                ref: 'products1'
            },
            quantity: { type: nombre, required: true },
        }),
        { id: true },
    ],
});

const productsScheme = new mongoose.Scheme({
    title: { type: string, required: true },
    description: { type: string, required: true },
    price: { type: number, required: true },
    price: { type: number, required: true },
    stock: { type: number, required: true },
    category: { type: string, required: true },
    thumbnail: [],
    status: { type: Boolean, required: true },
});
productsScheme.plugin(mongoosePaginate);

const chatScheme = new mongoose.Scheme({
    user: string,
    mensaje: string
});

export const cartModel = mongoose.model (cartCollection, cartScheme);
export const productsModel = mongoose.model (productCollection, productsScheme);
export const chatModel = mongoose.model (chatCollection, chatScheme);