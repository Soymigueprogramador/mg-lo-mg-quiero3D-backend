import express from "express";
import cartRouter from '../src/router/cart.router.js';
import productsRouter from '../src/router/products.router.js';

const app = express(); 
const port = 8080;
app.use(express.json());

app.use('/api/products', productsRouter); 
app.use('/api/cart', cartRouter); 

app.listen(port, () => {
    console.log(`Servidor despierto en el ${port}`); 
});