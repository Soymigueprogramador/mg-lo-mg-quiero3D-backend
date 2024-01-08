/*import mongoose from 'mongoose';
import { cartModels } from '../models/carts.models.js';
import userModel from '../models/user.model.js';
import {Router} from 'express';
import {createHash} from '../util.js';
import {config} from '../config/config.js'
import inicializaPassport from '../models/user.models.js';


const router = Router ()

mongoose.connect(config.MONGO_URL);

export class usersDataManager { 

async obtenerUsuarioPorEmail (direccionDeCorreo)
{
  try {       
    const existingUser = await userModel.findOne({ email: direccionDeCorreo.username}).exec();
    return existingUser
   }
   catch (error) {
    console.error(`Error en el servidor ${error}`);
    }
};

async obtenerUsuarioPorId   (id)
{
  try {
     const existingUser = await userModel.findOne({ _id: id}).exec();
    return existingUser
   }
   catch (error) {
    console.error(`Error en el servidor ${error}`);
    }
};

async obtenerUsuarioPorCartid   (CartId)
{
  try {
    const existingUser = await userModel.findOne({ cartId: CartId}).exec();
    return existingUser
   }
   catch (error) {
    console.error(`Error en el servidor ${error}`);
    }
};

async crearUsuario  (name,email,password,typeofuser,last_name,age)
{
  let cartId
  try {
    const newCart = new cartModel({
      products: []
    });
    await newCart.save();
    cartId = newCart._id
  }
   catch (error) {
    consosle.error(error)
  }
  try {
    password=createHash(password);

    const user = new userModel({name,email,password,cartId,typeofuser,last_name, age});
    await user.save();
    return user;
   }
   catch (error) {
    console.error('*error en el servidor*');
    console.error(error);
    }
}
}

export default usersDataManager*/



import mongoose from 'mongoose'
import {config} from '../config/config.js';

const usersCollection = 'usuarios';

const userSchema = new mongoose.Schema ({
    name : String,
    email: {type: String, unique:true},
    password : String,
    cartId : {required : true, type:mongoose.Schema.Types.ObjectId},
    typeofuser : String,
    age : Number,
    last_name : String
})

export const userModel = mongoose.model (usersCollection, userSchema)