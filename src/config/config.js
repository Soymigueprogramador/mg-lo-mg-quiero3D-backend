import dotenv from 'dotenv'; 
import { Command, Option } from 'commander';

const programa = new Command(); 

let pathenv = './src/.env.${opciones.modo}'; 

dotenv.config({  path: pathenv, override: true });

export const config = {
    MONGO_URL : process.env.MONGO_URL,
    CARTS_COLLECTION : process.env.CARTS_COLLECTION,
    USERS_COLLECTION : process.env.USERS_COLLECTION,
    PRODUCTS_COLLECTION : process.env.PRODUCTS_COLLECTION,
    TICKETS_COLLECTION : process.env.TICKETS_COLLECTION,
    LAST_TICKET_COLLECTION : process.env.LAST_TICKET_COLLECTION,
    MESSAGES_COLLECTION : process.env.MESSAGES_COLLECTION,
    EMAIL_ADMINISTRADOR : process.env.EMAIL_ADMINISTRADOR ,
    PASSWORD_ADMINISTRADOR : process.env.PASSWORD_ADMINISTRADOR, 
    CALL_BACK_GITHUB_URL : process.env.CALL_BACK_GITHUB_URL,
    CLIENT_ID_GITHUB : process.env.CLIENT_ID_GITHUB, 
    CLIENT_SECRETI_GITHUB : process.env.CLIENT_SECRETI_GITHUB,
    SECRET : process.env.SECRET,
    GMAIL_USER : process.env.GMAIL_USER,
    GMAIL_PASS : process.env.GMAIL_PASS,
    PORT : process.env.PORT 
};

export default config;