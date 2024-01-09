import { ObjectId } from "mongodb";
import { productServices } from "../services/productsServices.js";
import { cartModel } from "../models/cart.model.js";
import { cartsServices } from "../services/cartsServices.js";
import { ticketsServices } from "../services/ticketsServices.js";
import { usersServices } from "../services/usersServices.js";
import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transport = nodemailer.createTransport({
    service: "gmail",
    port: config.PORT,
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASS,
    },
});

async function getCarrito(req, res) {
    try {
        const cartId = req.params.cid;
        const validObjectId = ObjectId.isValid(cartId)
            ? new ObjectId(cartId)
            : null;
        if (!validObjectId) {
            res.status(404).send("Identificador del carrito invalido");
        } else {
            const cart = await cartsServices.obtenerCarrito(cid);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send("Carrito no encontrado");
            }
        }
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
}

async function agregarProducto(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = 1;
        const validObjectId = ObjectId.isValid(cartId)
            ? new ObjectId(cartId)
            : null;
        if (!validObjectId) {
            res.status(404).send("Identificador del carrito invalido");
        } else {
            const cart = await cartsServices.obtenerCarritoSinPopulate(cartId);
            if (!cart) {
                res.status(404).send("Carrito no encontrado");
                return;
            }
            const validObjectId = ObjectId.isValid(productId)
                ? new ObjectId(productId)
                : null;
            if (!validObjectId) {
                res.status(404).send("Identificador de Producto invalido");
                return;
            } else {
                const existingProduct = cart.products.find(
                    (p) => p.productId == productId
                );
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    const product = await productServices.obtenerProducto(
                        productId
                    );
                    if (product) {
                        cart.products.push({ productId, quantity });
                    } else {
                        res.status(404).send("Producto no encontrado");
                        return;
                    }
                }
                await cartsServices.actualizarCarrito(cart, cartId);
                res.status(201).json(cart);
            }
        }
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
}

async function crearCarrito(req, res) {
    try {
        const productId = req.params.pid;
        const quantity = 1;
        const validObjectId = ObjectId.isValid(productId)
            ? new ObjectId(productId)
            : null;
        if (!validObjectId) {
            res.status(404).send("Identificador de Producto invalido");
        } else {
            const product = await obtenerProducto(productId);
            if (!product) {
                res.status(404).send("Producto no encontrado");
                return;
            }
            const newCart = new cartModel({
                products: [{ productId, quantity }],
            });
            await cartsServices.crearCarrito(newCart);
            res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(500).send(`Error en el servidor ${error}`);
    }
}

async function procesoDeCompra(req, res) {
    try {
        const cartId = req.params.cid;
        const cart = await cartsServices.obtenerCarrito(cartId);
        if (!cart) {
            res.status(404).send("Carrito no encontrado");
            return;
        }
        let updatedCart = cart;
        const productsToTicket = [];
        const productsToWait = [];
        for (let i = 0; i < cart.products.length; i++) {
            const ProductId = cart.products[i].productId._id;
            const Cantidad = cart.products[i].quantity;
            const Precio = cart.products[i].productId.price;
            let newStock = 0;
            if (cart.products[i].productId.stock >= cart.products[i].quantity) {
                let itemDelTicket = {
                    productId: ProductId,
                    quantity: Cantidad,
                    price: Precio,
                };
                productsToTicket.push(itemDelTicket);
                newStock = cart.products[i].productId.stock - Cantidad;
            } else {
                const Cantidad = cart.products[i].productId.stock;
                const CantidadRemanente =
                    cart.products[i].quantity -
                    cart.products[i].productId.stock;
                if (Cantidad) {
                    const itemDelTicket = {
                        productId: ProductId,
                        quantity: Cantidad,
                        price: Precio,
                    };
                    productsToTicket.push(itemDelTicket);
                }
                const itemRemanente = {
                    ProductId: ProductId,
                    Cantidad: CantidadRemanente,
                };
                productsToWait.push(itemRemanente);
            }
            const producto = await productServices.obtenerProducto(ProductId);
            producto.stock = newStock;
            await productServices.actualizarProducto(producto, ProductId);
        }
        const totalTicket = productsToTicket.reduce((total, item) => {
            const subtotal = item.price * item.quantity;
            return total + subtotal;
        }, 0);
        const discounts = 0;
        const taxes = 0;
        const amount = totalTicket - discounts + taxes;
        let emailContent = "";
        let sendermail = "";
        const user = await usersServices.obtenerUsuarioPorCartid(cartId);
        const userId = user._id;
        const useremail = user.email;
        if (productsToTicket.length !== 0) {
            let codigoMayor = await ticketsServices.obtenerCodigoMayor();
            codigoMayor++;
            const codigo = codigoMayor.toString();
            const newtickect = {
                products: productsToTicket,
                code: codigo,
                cartId: cartId,
                userId: userId,
                taxes: taxes,
                discounts: discounts,
                amount: amount,
            };
            ticketsServices.crearTicket(newtickect);
            const useremail = user.email;
            const sendermail = config.GMAIL_USER;
            let subject = `Ticket de compra ${codigo}`;
            let emailContent =
                '<table border="1"><tr><th>Identificador del Producto</th><th>Cantidad</th><th>Precio</th></tr>';
            productsToTicket.forEach((item) => {
                emailContent += `<tr><td>${item.productId}</td><td>${item.quantity}</td><td>${item.price}</td></tr>`;
            });
            emailContent += "</table>";
            await transport.sendMail({
                from: sendermail,
                to: useremail,
                subject: subject,
                html: `<h3> Gracias por su compra </h3> 
          <h4> El total de su compra es : </h4> 
          ${amount}
          <h4> El detalle de su compra es el siguiente : <h4>
          ${emailContent}
          `,
            });
        }
        updatedCart.products = [];

        if (productsToWait.length > 0) {
            for (let n = 0; n < productsToWait.length; n++) {
                const itemToWait = {
                    quantity: productsToWait[n].Cantidad,
                    productId: productsToWait[n].ProductId,
                };
                updatedCart.products.push(itemToWait);
            }
        }
        cartsServices.actualizarCarrito(updatedCart, cartId);

        if (productsToTicket.length !== 0) {
            let subject = `Carrito de compra ${cartId}`;
            emailContent =
                '<table border="1"><tr><th>Identificador del Producto</th><th>Cantidad</th></tr>';
            productsToWait.forEach((item) => {
                emailContent += `<tr><td>${item.ProductId}</td><td>${item.Cantidad}</td></tr>`;
            });
            emailContent += "</table>";
            await transport.sendMail({
                from: sendermail,
                to: useremail,
                subject: subject,
                html: `<h3> Lamentablemente no tenemos suficiente stock para cumplir con la totalidad de su pedido </h3> 
              <h4> El detalle de los items pendientes es el siguiente : <h4>
              ${emailContent}
              `,
            });
        }
        let mensaje = "";
        if ((productsToWait.length === 0) & (productsToTicket.length > 0)) {
            mensaje = "Compra exitosa";
        }
        if ((productsToWait.length > 0) & (productsToTicket.length === 0)) {
            mensaje =
                "Todos los productos seleccionados no tienen staock, intentelo en otro momento";
        }
        if ((productsToWait.length > 0) & (productsToTicket.length > 0)) {
            mensaje =
                "Algunos productos seleccionados no tenian stock suficiente, la compra fue efectuada , pero los remanentes quedan esperando existencias, intentelo en otro momento";
        }
        if ((productsToWait.length === 0) & (productsToTicket.length === 0)) {
            mensaje = "Carrito vacío";
        }
        return res.redirect(`/carts?mensaje=${mensaje}`);
    } catch (error) {
        console.error(
            `-Purchase Process - Error al enviar el correo: ${error}`
        );
        res.status(500).send(`- Purchase Process -Error en el servidor`, error);
    }
}
async function eliminarProductoDelCarrito(req, res) {
    try {
        const cartId = req.params.cid;
        const productIdToFind = req.params.pid;
        const validObjectId = ObjectId.isValid(cartId)
            ? new ObjectId(cartId)
            : null;
        if (!validObjectId) {
            res.status(404).send("Identificador del carrito invalido");
        } else {
            const cart = await cartsServices.obtenerCarrito(cartId);
            if (!cart) {
                res.status(404).send("Carrito no encontrado");
                return;
            }
            const validObjectId = ObjectId.isValid(productIdToFind)
                ? new ObjectId(productIdToFind)
                : null;
            if (!validObjectId) {
                res.status(404).send("Identificador de Producto invalido");
            } else {
                const indice = cart.products.findIndex(
                    (product) =>
                        String(product.productId._id) ===
                        String(productIdToFind)
                );
                if (indice !== -1) {
                    cart.products.splice(indice, 1);
                } else {
                    res.status(404).send("Producto no encontrado");
                    return;
                }
            }
            await cartsServices.actualizarCarrito(cart, cartId);
            res.status(201).json(cart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
}

async function eliminarTodosProductosDelCarrito(req, res) {
    try {
        const cartId = req.params.cid;
        const validObjectId = ObjectId.isValid(cartId)
            ? new ObjectId(cartId)
            : null;
        if (!validObjectId) {
            res.status(404).send("Identificador del carrito invalido");
        } else {
            const cart = await cartsServices.obtenerCarrito(cartId);
            if (!cart) {
                res.status(404).send("Carrito no encontrado");
                return;
            } else {
                cart.products.length = 0;
                await cartsServices.actualizarCarrito(cart, cartId);
                res.status(201).json(cart);
            }
        }
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
}

async function actualizarCantidadDeUnProducto(req, res) {
    try {
        const cartId = req.params.cid;
        const productIdToFind = req.params.pid;
        const cantidad = parseInt(req.body.quantity);
        if (isNaN(cantidad) || cantidad <= 0) {
            res.status(404).send(
                "La cantidad debe ser un número positivo mayor que cero"
            );
            return;
        }
        const validObjectId = ObjectId.isValid(cartId)
            ? new ObjectId(cartId)
            : null;
        if (!validObjectId) {
            res.status(404).send("Identificador del carrito invalido");
        } else {
            const cart = await cartsServices.obtenerCarrito(cartId);
            if (!cart) {
                res.status(404).send("Carrito no encontrado");
                return;
            }
            const indice = cart.products.findIndex(
                (product) => String(product.productId) === productIdToFind
            );
            if (indice !== -1) {
                cart.products[indice].quantity = cantidad;
                await cartsServices.actualizarCarrito(cart, cartId);
                res.status(201).json(cart);
            } else {
                res.status(404).send("Producto no encontrado");
                return;
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error en el servidor");
    }
}

async function actualizarTodoElCarrito(req, res) {
    try {
        const cartId = req.params.cid;
        const nuevoCarrito = req.body;
        const validObjectId = ObjectId.isValid(cartId)
            ? new ObjectId(cartId)
            : null;
        if (!validObjectId) {
            res.status(404).send("Identificador del carrito invalido");
            return;
        }
        const cart = await cartsServices.obtenerCarrito(cartId);
        if (!cart) {
            res.status(404).send("Carrito no encontrado");
            return;
        }
        if (
            Array.isArray(nuevoCarrito.products) &&
            nuevoCarrito.products.length > 0
        ) {
            const validacionExitosa = await Promise.all(
                nuevoCarrito.products.map(async (item) => {
                    if (!ObjectId.isValid(item.productId)) {
                        return false;
                    }
                    const productExists = await productServices.obtenerProducto(
                        item.productId
                    );
                    return (
                        productExists &&
                        typeof item.quantity === "number" &&
                        item.quantity > 0
                    );
                })
            );
            if (validacionExitosa.every((isValid) => isValid)) {
                cart.products = nuevoCarrito.products;
                await cartsServices.actualizarCarrito(cart, cartId);
                res.status(200).json({
                    mensaje: "Carrito actualizado con éxito",
                });
            } else {
                res.status(400).json({
                    error: "El contenido del carrito no es válido",
                });
            }
        } else {
            res.status(400).json({
                error: "El contenido del carrito esta vacio o no es valido",
            });
        }
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
}
export default {
    getCarrito,
    agregarProducto,
    crearCarrito,
    eliminarProductoDelCarrito,
    procesoDeCompra,
    eliminarTodosProductosDelCarrito,
    actualizarCantidadDeUnProducto,
    actualizarTodoElCarrito,
};
