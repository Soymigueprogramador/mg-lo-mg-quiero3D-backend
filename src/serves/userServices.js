export { usersDataManager as DAOUsers } from "../dao/userDataManager.js";

class UserService {
    constructor(daoUsers) {
        this.daoUsers = new daoUsers();
    }

    async obtenerUser(cid) {
        return await this.daoUsers.obtenerUser(cid);
    }

    async obtenerUserSinPopulate(cid) {
        return await this.daoUsers.obtenerUserSinPopulate(cid);
    }

    async actualizarUser(newUser) {
        return await this.daoUsers.actualizarUser(newUser);
    }

    async crearUser(newUser) {
        return await this.daoUsers.crearUser(newUser);
    }
}

export const usersServices = new UserService(DAOUsers);
