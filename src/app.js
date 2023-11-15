import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import __dirname from './util.js';
import { ObjectId } from 'mongoose';
import { Server } from 'socket.io';
import cartRouter from '../src/router/cart.router.js';
import productsRouter from '../src/router/products.router.js';
import router from '../src/router/cart.router.js';
import { Socket } from 'socket.io-client';
import { cartModel } from './dao/models/user.model.js';
import { productsModel } from './dao/models/user.model.js';
import { chatModel } from './dao/models/user.model.js';

const app = express();
const port = 8080;

app.use(express.json());
app.engine('handlebars', handlebars.engine()); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', vistasRouter);
//app.use('/products', tuRouterDeProductos); 

app.use('/socket.io', express.static(path.join(__dirname, '../node_modules/socket.io/client-dist')));
app.use(express.json());
leerMensajes();

//app.use('/api', apiRouter);

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

const server = app.listen(port, () => {
    console.log(`Servidor despierto en el ${port}`);
});

let mensajes = [];
leerMensajes();
let usuarios = [];

router.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).render('home');
});

router.get('/chat', (req, res) => {
    res.setHeader('content-type', 'text/html');
    res.status(200).render('chat');
});

app.get('/products', async (req, res) => {
    try {
        const products = await productsModel.find({}).exec();
        const renderProducts = products.map(product => {
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                code: product.code,
                category: product.category,
                stock: product.stock
            };
        });

        res.setHeader('content-type', 'text/html');
        res.status(200).render('productList', { renderProducts });
    } catch (error) {
        console.log('UPS, error en el servidor:', error);
        res.status(500).render('error', { message: 'UPS, error en el servidor' });
    }
});

app.get('/cart/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const validatorObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
        if (!validatorObjectId) {
            res.status(404).send('Identificador del producto invalido');
        } else {
            const cart = await cartModel.findOne({ id: cartId }).populate('products.productsId').exec();
            
            if (cart) {
                const transformerCart = {
                    cartId,
                    products: cart.products.map(product => ({
                        productId: product.productId.id,
                        title: product.productId.title,
                        description: product.productId.description,
                        price: product.productId.price,
                        code: product.productId.code,
                        stock: product.productId.stock,
                        category: product.productId.category,
                        quantity: product.productId.quantity
                    }))
                };
                res.setHeader('content-type', 'text/html');
                res.status(200).render('Cart', { transformerCart });
            } else {
                res.status(404).send('No se ha encontrado un carrito con ese ID');
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

const io = new server(server);
app.locals.io = io;

io.on('connection', socket => {
    console.log('se conecto un usuario nuevo con el id ${socket.id}');
    io.on('mensaje', Data => {
        console.log(Data);
    });
     Socket.on('id', email => {
        console.log('se conecto un usuario con el ${email}');   
        mensajes.push({
            user: 'server',
            mensaje: 'Hola te damos la bienvenida al chat, ¿en que podemos ayudarte?'
        });
        usuarios.push({id: Socket.id, usuarios: email});
        Socket.emit('Bienvenido', mensaje);
        Socket.broadcast.emit('nuevoUsuario', email);
        mensajes.pop();
     });

  socket.on('nuevoMensaje', mensaje => {
    mensajes.push(mensaje);
    io.emit('llegoUnNuevoMensaje', mensaje);
    const nuevoMensaje = new chatModel({
        user: mensaje.user,
        mensaje: mensaje.mensaje
    });
    nuevoMensaje.save()
    .then(() => {
        console.log('Mensaje guardado');
    })
    .catch(error => {
        console.log('Error al guardar el mensaje', error);
    });
  });
});  

socket.on('disconnect', () => {
    console.log('Se desconecto el cliente con el ID ${socket.id}');
    const indice = usuarios.findIndex(usuarios => usuarios.id === socket.id);
    if (indice >= 0) {
        const emailDesconectado = usuarios[indice].usuarios;
        socket.broadcast.emit('desconeccion', emailDesconectado);
        usuarios.splice(indice, 1);
    }
});

async function leerMensajes() {
    try {
        const mensajesDB = await chatModel.find({}, 'user mensaje').exec();
        const mensajeArray = mensajesDB.map((documento) => ({
            user: documento.user,
            mensaje: documento.mensaje
        }));
        mensaje.length = 0; 
        mensaje.push(...mensajeArray);
    } catch (error) {
        console.error('Error al leer los mensajes guardados', error);
    }
};