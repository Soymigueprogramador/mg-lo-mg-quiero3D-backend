import express from "express";
import fs from 'fs';

const router = express.Router();
const cartPath = './cart.json';
const productsPath = './products.json';

const obtenerUltimoId = (item) => {
    if (item.length === 0) {
        return 1;
    }
    const ultimoArticulo = item[item.length - 1];
    return ultimoArticulo + 1;
};

const leerArchivosJson = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data); 
        } else {
            const data = [];
            return data;
        }
    } catch (error) {
        console.log('Error al leer el archivo', error);
    }
};

const escribirUnNuevoArchivoJson = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8'); 
};

router.get('/cart/:cid', (req, res) => {
    const filePath = cartPath; 
    const carts = leerArchivosJson(filePath);
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);
    res.setHeader('content-type', 'application/json'); 
    if (cart) {
        res.json(cart); 
    } else {
        res.status(404).send('UPS!! carrito no encontrado');
    }
});

router.post('/cart/:cid/:products/:pid', (req, res) => {
    const filePath = cartPath; // Agregado filePath
    const carts = leerArchivosJson(filePath);
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = 1;
    let cart = carts.find(c => c.id === cartId); 
    if (!cart) {
        res.setHeader('content-type', 'application/json'); 
        res.status(404).send('UPS!! carrito no encontrado');
    } else {
        const productsPath = 'products.json'; 
        const products = leerArchivosJson(productsPath);
        const product = products.find(p => p.id === productId); 
        if (!product) {
            res.setHeader('content-type', 'application/json'); 
            res.status(404).send('UPS!! producto no encontrado');
            return;
        }
        const productoYaExistente = cart.products.find(p => p.product === productId); 
        if (productoYaExistente) {
            productoYaExistente.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        escribirUnNuevoArchivoJson(filePath, carts); 
        res.setHeader('content-type', 'application/json'); 
        res.status(201).json(cart);
    }
});

export default router;