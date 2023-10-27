import express from "express";
import fs from 'fs';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const productsPath = './products.json';

const validacionParaAgregarProductos = [
    body('title').notEmpty().isString(),
    body('description').notEmpty().isString(),
    body('code').notEmpty().isString(),
    body('price').notEmpty().isNumeric(),
    body('stock').notEmpty().isNumeric(),
    body('category').notEmpty().isString(),
    body('status').notEmpty().isBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('content-type', 'application/json');
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

//module.exports = validacionParaAgregarProductos;

const validacionParaActualizarProductos = [
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('code').optional().isString(),
    body('price').optional().isNumeric(),
    body('stock').optional().isNumeric(),
    body('category').optional().isString(),
    body('status').optional().isBoolean(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.setHeader('content-type', 'application/json');
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

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

router.get('/products', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = readJSONfile(productsPath);
    res.setHeader('content-type', 'application/json');
    if (limit) {
        const limiteDeProductos = products.slice(0, limit);
        res.json(limiteDeProductos);
    } else {
        res.json(products);
    }
});

router.get('/products/:pid', (req, res) => {
    const producto = readJSONfile(productsPath);
    const product = products.find(p => p.id === req.params.pid);
    res.setHeader('content-type', 'application/json');
    if (product) {
        res.json(product);
    } else {
        res.status(404).end('Producto no encontrado');
    }
});

router.post('/products', validacionParaAgregarProductos, (req, res) => {
    const producto = readJSONfile(productsPath);
    const nuevoProducto = req.body;
    nuevoProducto.id = obtenerUltimoId(products);
    if (nuevoProducto.status = false) {nuevoProducto.status = true};
    producto.push(nuevoProducto);
    escribirUnNuevoArchivoJson(productsPath, producto);
    res.setHeader('content-type', 'application/json');
    res.status(201).json(nuevoProducto);
});

router.put('/products/:pid', validacionParaActualizarProductos, (req, res) => {
    const producto = readJSONfile(productsPath);
    const productId = req.params.pid;
    const actualizarProducto = req.body;

});

export default router;