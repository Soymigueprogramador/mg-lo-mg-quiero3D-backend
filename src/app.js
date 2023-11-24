import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { ObjectId } from 'mongoose';
import { Server } from 'socket.io';
import cartRouter from '../src/router/cart.router.js';
import productsRouter from '../src/router/products.router.js';
import { cartModel } from './dao/models/user.model.js';
import { productsModel } from './dao/models/user.model.js';
import { chatModel } from './dao/models/user.model.js';
import __dirname from './util.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';


const app = express();
const port = 8000;

app.use(express.json());
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, '/public')));
app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')));

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

app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).render('home');
});

app.get('/chat', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).render('chat');
});

const io = new Server(server);

app.locals.io = io;

io.on('connection', (socket) => {
    console.log(`Se conectó un usuario nuevo con el id ${socket.id}`);
    socket.on('id', (email) => {
        console.log(`Se conectó un usuario con el ${email}`);
        mensajes.push({
            user: 'server',
            mensaje: 'Hola, te damos la bienvenida al chat. ¿En qué podemos ayudarte?',
        });
        usuarios.push({ id: socket.id, usuario: email });
        socket.emit('Bienvenido', mensajes);
        socket.broadcast.emit('nuevoUsuario', email);
        mensajes.pop();
    });

    socket.on('nuevoMensaje', (mensaje) => {
        mensajes.push(mensaje);
        io.emit('llegoUnNuevoMensaje', mensaje);
        const nuevoMensaje = new chatModel({
            user: mensaje.user,
            mensaje: mensaje.mensaje,
        });
        nuevoMensaje.save()
            .then(() => {
                console.log('Mensaje guardado');
            })
            .catch((error) => {
                console.log('Error al guardar el mensaje', error);
            });
    });
    socket.on('disconnect', () => {
        console.log(`Se desconectó el cliente con el ID ${socket.id}`);
        const indice = usuarios.findIndex((usuario) => usuario.id === socket.id);
        if (indice >= 0) {
            const emailDesconectado = usuarios[indice].usuario;
            socket.broadcast.emit('desconeccion', emailDesconectado);
            usuarios.splice(indice, 1);
        }
    });
});

const username = 'soymigueprogramador';
const password = 'loquiero3d';
const dbName = 'MG-lo-quiero-3d-database';

const url = `mongodb+srv://${username}:${password}@mg-lo-quiero-3d-databas.ph2h9f6.mongodb.net/${dbName}?retryWrites=true&w=majority`;

/*const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }*/



mongoose.connect('mongodb+srv://soymigueprogramador:<password>@mg-lo-quiero-3d-databas.ph2h9f6.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
    // Resto de tu código aquí
  })
  .catch((error) => {
    console.error('No me pude conectar a la base de datos', error);
    process.exit(1);
  });

async function run() {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log("Conectado a MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

async function findChats() {
  let retries = 1; 
  while (retries > 0) {
    try {
      const result = await ChatModel.findChats();
      return result;
    } catch (error) {
      console.error('Error al leer los mensajes guardados', error);
      retries--;
    }
  }
  console.error('Operación de búsqueda fallida después de varios intentos');
  return null;
}
findChats();

async function leerMensajes() {
    try {
        const mensajesDB = await chatModel.find({}, 'user mensaje').exec();
        const mensajeArray = mensajesDB.map((documento) => ({
            user: documento.user,
            mensaje: documento.mensaje,
        }));
        mensajes.length = 0;
        mensajes.push(...mensajeArray);
    } catch (error) {
        console.error('Error al leer los mensajes guardados', error);
    }
};