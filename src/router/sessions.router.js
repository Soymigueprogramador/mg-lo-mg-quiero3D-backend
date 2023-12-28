/*import {Router} from 'express';
import bodyParser from 'body-parser';
import usersController from '../controllers/usersControllers.js';
import passport from 'passport'; 
import dtousuario from '../middlewares/dtUsuarios';

const router = Router ();

router.use(bodyParser.urlencoded({ extended: true }));
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
router.get('/current1', usersController.current1)
router.get('/current',dtousuario, usersController.current)*/










import { Router } from 'express';
import bodyParser from 'body-parser';
import usersController from '../controllers/usersControllers.js';
import passport from 'passport';
import dtousuario from '../middlewares/dtoUsuarios.js';

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/errorLogin', usersController.errorLogin);
router.get('/errorLoginGitHub', usersController.errorLoginGitHub); 
router.get('/errorRegistro', usersController.errorRegistro);

router.get('/loginGitHub', passport.authenticate('loginGitHub', {}), (req, res, next) => {});

router.post('/registro', passport.authenticate('registro', {
    failureRedirect: '/api/sessions/errorRegistro', 
    successRedirect: '/login',
    session: false,
}));

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/errorLogin' }), usersController.Login);

router.get('/callbackGithub', passport.authenticate('loginGitHub', {
    failureRedirect: '/api/sessions/errorLoginGitHub',
}), (req, res, next) => {
    req.session.usuario = req.user;
    return res.redirect('/products');
});

router.get('/logout', usersController.logout);
router.get('/current1', usersController.current1);
router.get('/current', dtousuario, usersController.current);

export default router;