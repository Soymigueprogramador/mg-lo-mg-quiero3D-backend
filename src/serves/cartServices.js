export { cartDataManager } from '../dao/cartsDataManager.js';

class DaoCart {
    constructor(daoCart) {
        this.daoCart = new daoCart();
    }

    async obtenerCarrito(cid) {
        return await this.daoCart.obtenerCarrito(cid);
    }

    async obtenerCarritoSinPopulate(cid) {
        return await this.daoCart.obtenerCarritoSinPopulate(cid);
    }

    async actualizarCarrito(newCart) {
        return await this.daoCart.actualizarCarrito(newCart.cid);
    }

    async crearCarrito(newCart) {
        return await this.daoCart.crearCarrito(newCart);
    }
}

export const cartServices = new DaoCart(daoCart);