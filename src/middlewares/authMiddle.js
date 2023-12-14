export function usuario (req, res, next) {
    if(!req.session.usuario) {
        return res.status(400).send('Te tenes que loguear');
    };
    if(req.session.usuario.typeofuser === 'usuario') {
        next();
    } else {
        res.status(400).send('No podes entrar');
    }
};

export function administrador (req, res, next) {
    if(!req.session.usuario) {
        return res.status(400).send('Te tenes que loguear');
    };
    if(req.session.usuario.typeofuser === 'administrador') {
        next();
    } else {
        res.status(400).send('No podes entrar');
    }
};

export const autorizacion1 = (req, res, next) => {
    if(req.session.usuario) {
        next();
    } else {
        return res.redirect('/login');
    }
};

export const autorizacion2 = (req, res, next) => {
    if(req.session.usuario) {
        return res.redirect('/products');
    } else {
        next();
    }
};