export { userModel } from '../dao/userDataManager.js';

class userDao {
    constructor() {
        this.DaoUser = new UserDao(); 
    }

    async obtenerUser(cid) {
        return await this.daoUser.obtenerUser(cid);
    };

    async obtenerUserSinPopulate(cid) {
        return await this.daoUser.obtenerUserSinPopulate(cid);
    };

    async actualizarUser(newUser) {
        return await this.daoUser.actualizarUser(newUser);
    };

    async crearUser(newUser) {
        return await this.daoUser.crearUser(newUser);
    };
}

export const usersServices = new usersServices (DAOUsers);