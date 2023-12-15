import mongoose from 'mongoose'; 
import config from '../config/config';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = ''; //despues guardo los datos en el archivo .env. 

const productsSchema = new mongoose.Schema({
    code : {type:String, unique:true, required:true},
    title: {type:String, required:true },
    description : {type:String, required:true },
    price: {type:Number, required:true },
    stock: {type:Number, required:true },
    category: {type:String, required:true },
    thumbnail: [],
    status: {type:Boolean, required:true} 
});

productSchema.plugin(mongoosePaginate);

export const productModels = mongoose.Schema ( productCollection, productSchema );