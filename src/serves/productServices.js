export { productDataManager } from '../dao/productDataManager.js';

class DaoProduct {
    constructor(daoProduct) {
        this.daoProduct = new daoProduct();
    }

    async obtenerProducto(cid) {
        return await this.daoProduct.obtenerProducto(cid);
    }

    async obtenerProductoSinPopulate(cid) {
        return await this.daoProduct.obtenerProductoSinPopulate(cid);
    }

    async actualizarProducto(newProduct) {
        return await this.daoProduct.actualizarProducto(newProduct.cid);
    }

    async crearProducto(newProduct) {
        return await this.daoProduct.crearProducto(newProduct);
    }
}

export const productServices = new DaoProduct(daoProduct);