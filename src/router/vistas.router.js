import express from 'express';
import { getProducts }  from './products.router.js'; 

const router = express.Router(); 

router.get('/', (req, res) => {
    res.render('index', {});
});

router.get('/realtimeproducts', (req, res) => {
    return products = getProducts();
    res.render('realTimeProducts', { products });
});

router.get('/home', (req, res) => {
     return products = getProducts();
     res.render('home', { products });
});

export default router; 