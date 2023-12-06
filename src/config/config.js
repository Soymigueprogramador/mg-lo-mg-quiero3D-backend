import dotenv from 'dotenv'; 
import { command, option } from 'commander';

const programa = new command(); 

let pathenv = './src/.env.${opciones.modo}'; 

dotenv.config({  path: pathenv, override: true });

export const config = {
    // desde aca voy a ir configurando todos los datos que van en el archivo .env
};