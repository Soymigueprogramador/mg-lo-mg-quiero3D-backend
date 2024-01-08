import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { ObjectId } from 'mongoose';
import { Server } from 'socket.io';
import cartRouter from '../src/router/cart.router.js';
import productsRouter from '../src/router/products.router.js';
import { productsModel } from './dao/models/user.model.js';
import { chatModel } from './dao/models/user.model.js';
import __dirname from './utils.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
import { conectameMongodb } from './config/config.db.js'; 
import dotenv from 'dotenv'; 
import apiCartRouter from './router/cart.router.js';
import apiProductsRouter from './router/products.router.js';
import vistasRouter from './router/vistas.router.js';  
import sessions from 'express-sessions'; 
import ConnectMongo from 'connect-mongo';
import inicializandoPassport from './middlewares/passport-config.js'; 
import passport from 'passport'; 
import config from './config/config.js'; 
import sessionsRouter from './router/sessions.router.js';
import passportGitHub from 'passport-github2';
import passportConfig from './middlewares/passport-config.js';
import { cartModels } from './models/carts.models.js';

const app = express();
const port = 8080;

app.use(express.json());
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')));
app.use(passport, initialize());
app.use(passport, sessions());
app.use('/api/sessions', sessionsRouter);
app.use('/', vistasRouter);

//app.use({});

app.use(express.json());

leerMensajes();

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

const server = app.listen(port, () => {
    console.log(`Servidor despierto en el ${port}`);
});

const mensajes = [];
leerMensajes();
const usuarios = [];

app.use('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('home');
});

app.use('/chat', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('chat');
});