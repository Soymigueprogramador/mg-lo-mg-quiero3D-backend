import express from "express";
import fs from 'fs';

const router = express.Router();
const cartPath = 'cart.json';
const productsPath = 'products.json';

const obtenerUltimoId = (item) => {
    if (item.length === 0) {
        return 1; 1;escribirUnNuevoArchivo
    }
    const ultimoArticulo = item[ item.length -1 ];
    return ultimoArticulo + 1;
};

const leerArchivosJson = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return json.parse(data);
        } else {
            const data = [];
            return data;
        }
    } catch (error) {
        console.log('Error al leer el archivo', error);
    }
};

const escribirUnNuevoArchivoJson = (filePath, data) => {
    fs.writeFileSync(filePath, json.stringify(data, null, 2), 'utf-8');
};

router.get('/cart/:cid', (req, res) => {
    const carts = readJSONfile(filePath);
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);
    res.setHeaders('content-type', 'aplication.json');
    if (cart) {
        res.json
    } else {
        res.status(404).send('UPS!! carrito no encontrado');
    }
});

router.post('/cart/:cid/:products/:pid', (req, res) => {
    const carts = readJSONfile(filePath);
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = 1;
    let cart = null;
    carts.find(c => c.id === cartId);
    if (!cart) {
        res.setHeaders('content-type', 'aplication.json');
        res.status(404).send('UPS!! carrito no encontrado');
    } else {

    }
    const products = readJSONfile(filePath);
    const product = products.find(c => c.id === productsId);
    if (!product) {
        res.setHeaders('content-type', 'aplication.json');
        res.status(404).send('UPS!! producto no encontrado');
        return;
    } 
    const productoYaExistente = cart.products.find(p => p.products === productsId);
    if (productoYaExistente) {
        productoYaExistente.quantity += quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }
    readJSONfile(cartPath, carts);
    res.setHeaders('content-type', 'aplication.json');
    res.status(201).json(cart);
});

router.post('/cart/:cid/:products/:pid', (req, res) => {
    const carts = readJSONfile(filePath);
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = 1;
    let cart = null;
    carts.find(c => c.id === cartId);
    if (!cart) {
        res.setHeaders('content-type', 'aplication.json');
        res.status(404).send('UPS!! carrito no encontrado');
    } else {

    }
    const products = readJSONfile(filePath);
    const product = products.find(c => c.id === productsId);
    if (!product) {
        res.setHeaders('content-type', 'aplication.json');
        res.status(404).send('UPS!! producto no encontrado');
        return;
    }
    let cartsId = getLastId(cart);
    cart = { id: cartsId, products: [{ "product": productId, "quantity": quantity }]};
        carts.push({ id: cartsId, products: [{ "product": productId, "quantity": quantity }]});
        writeJSONfile(cartsPath, carts);
        res.setHeaders('content-type', 'aplication.json');
        res.status(201).json(cart);
});

export default router;