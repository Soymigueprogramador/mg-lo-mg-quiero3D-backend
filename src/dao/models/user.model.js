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
    
});

export const cartModel = mongoose.model (cartCollection, cartScheme);
export const productsModel = mongoose.model (productCollection, productsScheme);
export const chatModel = mongoose.model (chatCollection, chatScheme);
