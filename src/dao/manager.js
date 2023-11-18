import mongoose, { Mongoose } from "mongoose"; 
import mongoosePaginate from 'mongoose-paginate-v2'; 
import { cartModel } from '../dao/models/user.model';
import { productsModel } from "../dao/models/user.model";
import { Router } from "express";
import { body, validationResult } from 'express-validator'; 
import { ObjectId } from "mongoose";
const { MongoClient, ServerApiVersion } = require('mongodb');

const router = Router(); 

Mongoose.connect('mongodb+srv://soymigueprogramador:<password>@mg-lo-quiero-3d-databas.ph2h9f6.mongodb.net/?retryWrites=true&w=majority');

router.get('/carts/:cid', async (req, res) => {
    try{
        const cartId = req.params.cid;
        const validObjetId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
        if(!validObjetId) {
            res.status(404).send('Carrito invalido');
        } else {
            const cart = await cartModel.findOne({ id: cartId }).exec();
            if(cartId) {
                res.json(cart);
            } else {
                res.status(404).send('Carrito no encontrado');
            }
        }
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

router.post('/cart/:cid/products/:cid', async (req, res) => {
    try{
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = 1;
        const validObjetId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
        if(!validObjetId) {
            res.status(404).send('Carrito invalido');
        } else {
            const cart = await cartModel.findOne({ id: cartId }).exec();
            if(cartId) {
                res.json(cart);
            } else {
                res.status(404).send('Carrito no encontrado');
                return
            }
        }
        const vAlidObjetId = ObjectId.isValid(cartId) ? new ObjectId(productId) : null;
        if(!validObjetId) {
            res.status(404).send('Carrito invalido');
        } else {
            const existinProduct = cart.products.find((p) => productId.productId === productId);
            if(existinProduct) {
                existinProduct.quantity += quantity;
            } else {
                const product = await productsModel.findOne({ id: productId }).exec();
                if(product) {
                    cart.products({ productId, quantity });
                } else {
                    res.status(404).send('Carrito no encontrado');
                }
            }
        }
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

router.post('/carts/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const quantity = 1;
        const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
        if (!validObjectId) {
            res.status(404).send('Producto invalido');
        } else {
            const product = await productsModel.findOne({ id: productId }).exec();
            if(!product) {
                res.status(404).send('Producto no encontrado');
                return
            }
            const newCart = new cartModel({
                products: [{ productId, quantity }]
            });
            await newCart.save();
            res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
        if (!validObjectId) {
            res.status(404).send('Carrito invalido');
        } else {
            let cart = await cartModel.findOne({ id: cartId }).exec();
            if(!cart) {
                res.status(404).send('Carrito no encontrado');
                return
            } 
            const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
            if (!validObjectId) {
                res.status(404).send('Producto invalido');
            } else {
                const indice = cart.products.findIndex((product) => String(productId) === productId);
                if (indice !== -1) {
                    cart.products.splice(indice, 1);
                } else {
                    res.status(404).send('Producto no existe en este carrito');
                    return;
                }
                await cart.save();
                res.status(201).json(cart);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

router.put('/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productIdToFind = req.params.pid;
    const cantidad = parseInt(req.body.quantity);
    if (isNaN(cantidad) || cantidad<=0) {
      res.status(404).send('La cantidad debe ser un número mayor a cero');
      return
    }
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      } else {        
        const cart = await cartModel.findOne({ _id : cartId }).exec();
        if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
        }
        const indice  = cart.products.findIndex((product) => String(product.productId) === productIdToFind);
            if (indice!==-1) {    
              cart.products[indice].quantity=cantidad;
              await cart.save();
              res.status(201).json(cart);
            } else { 
              res.status(404).send('Producto no encontrado');
              return;                    
            };
      }
  }
   catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

router.put('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const nuevoCarrito = req.body;    
    const validObjectId = ObjectId.isValid(cartId) ? new ObjectId(cartId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador del carrito invalido");
      return;
      }        
    const cart = await cartModel.findOne({ _id : cartId }).exec();
    if (!cart) {
          res.status(404).send('Carrito no encontrado');
          return;
      }
  
  if (Array.isArray(nuevoCarrito.products) && nuevoCarrito.products.length > 0) {
    const validacionExitosa = await Promise.all(
      nuevoCarrito.products.map(async (item) => {
        if (!ObjectId.isValid(item.productId)) { 
         
          return false; 
        }
     
        const productExists = await productModel.exists({ _id: item.productId }); 
        return productExists && typeof item.quantity === 'number' && item.quantity > 0;
      })
    );
    if (validacionExitosa.every((isValid) => isValid)) {
      cart.products=nuevoCarrito.products
      await cart.save();
      res.status(200).json({ mensaje: 'Carrito actualizado con éxito' });
    } else {
      res.status(400).json({ error: 'El contenido del carrito no es válido' });
    }
  } else {
    res.status(400).json({ error: 'El contenido del carrito esta vacio o no es valido' });
  }
      }
   catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

  const validateAddProduct = [
      body('title').notEmpty().isString(),
      body('description').notEmpty().isString(),
      body('code').notEmpty().isString(),
      body('price').notEmpty().isNumeric(),
      body('stock').notEmpty().isNumeric(),
      body('category').notEmpty().isString(),
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

router.get('/products', async (req, res) => {
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
    const products = await productModel.paginate(combinedFilter, options);
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
});

router.get('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
        const product = await productModel.findOne({ _id: productId}).exec();
        if (product) {
          res.json(product);
        } else {
          res.status(404).send('Producto no encontrado');
        }
      }
  } catch (error) {
    res.status(500).send(`Error en el servidor ${error}`);
  }
});

router.post('/products', validateAddProduct, async (req, res) => {
    try {
      const newProduct = req.body;
      const existingProduct = await productModel.findOne({ code: newProduct.code }).exec();
      if (existingProduct) {
        res.status(400).send('El producto con este código ya existe');
        return;
      }
      const product = new productModel({ ...newProduct});
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).send('Error en el servidor');
    }
  });

router.put('/products/:pid', validateUpdateProduct, async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
    const product = await productModel.findOne({ _id : productId }).exec();
    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }
    for (const key in updatedProduct) {
      if (updatedProduct.hasOwnProperty(key)) {
        product[key] = updatedProduct[key];
      }
    }
    await product.save();
    res.status(200).json(product);
  }
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

router.delete('/products/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const validObjectId = ObjectId.isValid(productId) ? new ObjectId(productId) : null;
    if (!validObjectId) { 
      res.status(404).send("Identificador de Producto invalido");
      } else {
    const product = await productModel.findOne({ _id : productId }).exec();
    if (!product) {
      res.status(404).send('Producto no encontrado');
      return;
    }
    await product.deleteOne({ _id : productId })
    res.status(200).send(`Producto con ID ${productId} eliminado`)
  }
  } catch (error) {
    console.error(error)
    res.status(500).send('Error en el servidor')
  }
});

export default router;