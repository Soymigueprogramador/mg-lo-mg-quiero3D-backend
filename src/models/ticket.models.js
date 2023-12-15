import mongoose from 'mongoose'; 
import config from '../config/config';

const userCollection = '';//despues le agregamos los datos del archivo .env. 
const cartCollection = '';//despues le agregamos los datos del archivo .env. 
const productCollection = '';//despues le agregamos los datos del archivo .env. 
const ticketCollection = '';//despues le agregamos los datos del archivo .env. 

const ticketsSchema = new mongoose.Schema({
    products: [
        new mongoose.Schema({
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: productCollection
            },
            quantity: { type: number },
            price: { type: number }
        }),
        { _id: false }
    ], 
    code: {
        type: String,
        unique: true
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productCollection
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productCollection
    },
    purchase_datetime: {
        type: date,
        default: Date.now()
    },
    taxes: {
        type: number
    }, 
    discuonts: {
        type: number
    },
    amount: {
        type: number
    }
});

const lastSchema = new mongoose.Schema({
    serie: { ype: string, uique: truet }, 
    last: number
});

const lastCollection = ''; //despues le agregamos los datos del archivo .env. 

export const ticketModels = mongoose.model ( ticketCollection, ticketSchema );
export const lastModels = mongoose.model ( lastCollection, lastSchema );