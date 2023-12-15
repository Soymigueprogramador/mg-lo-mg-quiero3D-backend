import {Router} from 'express';
import bodyParser from 'body-parser';
import usersController from '../controllers/usersController.js';
export const router = Router ();
router.use(bodyParser.urlencoded({ extended: true }));
import passport from 'passport'; 
import dtousuario from '../middlewares/dtoUsuario.js';

router.get ('/errorLogin', usersController.errorLogin);
router.get ('/errorLoginGitHub', usersController.errorLogin);
router.get ('/errorRegistro', usersController.errorRegistro);
router.get('/loginGitHub', passport.authenticate('loginGitHub', {}), (req, res, next) => { });

router.post('/registro', passport.authenticate('registro', {
    failureRedirect: '/api/sesions/errorRegistro',
    successRedirect: '/login', 
    session: false, 
}))

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sesions/errorLogin' }), usersController.Login)  

router.get('/callbackGithub',  passport.authenticate('loginGitHub', 
        { 
            failureRedirect: '/api/sesions/errorLoginGitHub'
            
        } 
    ),(req, res, next) => { 
    req.session.usuario = req.user;
    return res.redirect ('/products')
    });  

router.get('/logout', usersController.logout)

router.get('/current1', usersController.current1)

router.get('/current',dtousuario, usersController.current)