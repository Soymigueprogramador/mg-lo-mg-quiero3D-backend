//haciendo las importaciones.
import express from "express";
import cartRouter from './router/cart.router';
import productsRouter from './router/products.js';

//levantando el servidor.
const app = Express();
const port = 8080;
app.use(express.json());

//mencionando a las apis que voy a tratar de usar. 
app.use('/api', productRouter);
app.use('/api', cartRouter);

//despertando al servidor para que escuche. 
app.listen(port, () => {
    console.log('servidor despierto en el ${port}');
});