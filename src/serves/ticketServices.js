export { ticketDataManager } from '../dao/ticketDataManager.js';

class DaoTicket {
    constructor(daoTicket) {
        this.daoTicket = new daoTicket();
    }

    async obtenerTicket(cid) {
        return await this.daoTicket.obtenerTicket(cid);
    }

    async obtenerTicketSinPopulate(cid) {
        return await this.daoTicket.obtenerTicketSinPopulate(cid);
    }

    async actualizarTicket(newTicket) {
        return await this.daoTicket.actualizarTicket(newTicket.cid);
    }

    async crearTicket(newTicket) {
        return await this.daoTicket.crearTicket(newTicket);
    }
}

export const ticketServices = new DaoTicket(daoTicket);