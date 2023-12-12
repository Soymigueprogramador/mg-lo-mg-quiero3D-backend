import { ObjectId } from 'mongodb';
import { productServices } from '../services/productsServices.js';
import {Router} from 'express';
const router = Router ()
import bodyParser from 'body-parser';
import { body, validationResult } from 'express-validator';

router.use(bodyParser.urlencoded({ extended: true }));

async function getProducts (req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sortOrder = req.query.sort; 
    const query = req.query.query || ''; 
    const filter = {}; 
    if (req.query.category) {
      filter.category = req.query.category; 
    }
    if (req.query.stock) {
      filter.stock = req.query.stock; 
    }
     
    const options = {
      page,
      limit,
      sort: sortOrder ? { price: sortOrder === 'desc' ? -1 : 1 } : null,
    };
    const combinedFilter = {
      ...filter
    };
    const products = await productServices.obtenerProductos(combinedFilter, options);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < products.totalPages ? page + 1 : null;
    const response = {
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sortOrder}&query=${query}` : null,
      nextLink: nextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sortOrder}&query=${query}` : null,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error en el servidor',error });
    console.error(error)
  }
};

async function getProductById (req, res) {
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
        const product = await productServices.obtenerProducto(productId);
        if (product) {
          res.json(product);
        } else {
          res.status(404).send('Producto no encontrado');
        }
      }
  } catch (error) {
    res.status(500).send(`Error en el servidor ${error}`);
  }
};

async function crearProducto(req, res) {
  try {
    const newProduct = req.body;
    const existingProduct = await productServices.obtenerProductoPorCodigo(newProduct.code);
    if (existingProduct) {
      res.status(400).send('El producto con este código ya existe');
      return;
    }

    await productServices.crearProducto(newProduct);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
}

async function actualizarProducto (req, res) {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const validateUpdateProduct = [
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
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({ errors: errors.array() });
          }
          next();
        }
      ];
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
    const product = await productServices.obtenerProducto(productId);
    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    for (const key in updatedProduct) {
      if (updatedProduct.hasOwnProperty(key)) {
        product[key] = updatedProduct[key];
      }
    }

    await productServices.actualizarProducto(product,productId);

    res.status(200).json(product);
  }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
};

async function borrarProducto(req, res) {
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
    const product = await productServices.obtenerProducto(productId);
    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }

    await productServices.eliminarProducto(productId)
    const options = {
      page: 1,
      limit: 10000000000000
    }
    const updatedProducts = await productServices.obtenerProductos({},options);
    res.status(200).json({ message: 'Producto eliminado', products: updatedProducts })
  }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error en el servidor')
  }
};
export default {getProducts, getProductById, crearProducto, actualizarProducto, borrarProducto };