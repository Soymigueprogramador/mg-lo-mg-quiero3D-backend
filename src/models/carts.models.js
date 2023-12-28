import mongoose from 'mongoose'; 
import config from '../config/config';
import userDataManager from '../dao/userDataManager.js';

const cartCollection = ''; //datos a guardar en el archivo .env.
const productsCollection = ''; //datos a guardar en el archivo .env.

const cartsCollection = new mongoose.Schema({
    product: [
        new mongoose.Schema({
            productId: {
                type: mongoose.Schema.Types.object,
                ref: productsCollection
            },
            quantity: { type: Number },
        }),
        { _id: false }
    ],
});

export const cartModels = mongoose.Schema ( cartCollection, cartSchema );