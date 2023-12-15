import mongoose from 'mongoose'; 
import config from '../config/config';

const chatCollection = ''; //despues guardo los datos en el archivo .env.

const chatSchema = new Schema({
    user: String,
    mensaje: String
});

export const chatModels = mongoose.Schema ( chatCollection, chatSchema );