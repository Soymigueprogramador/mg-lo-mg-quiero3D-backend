import {Router} from 'express';
import bodyParser from 'body-parser';
import {config} from '../config/config.js';
import dtoUsuario from '../middlewares/dtoUsuario.js'

export const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

async function errorLogin (req,res)  {
    res.redirect('/login?error=Login con error')    
};

async function errorLoginGitHub (req,res) {
    res.redirect('/loginGitHub?error=**Login con error**')    
};

async function errorRegistro (req,res) {
    res.redirect('/registro?error=Error de registro')    
};

async function Login (req, res, next) {
    req.session.usuario = req.user;
    req.session.admin = false;
    if (req.user && req.user.email === config.EMAIL_ADMINISTRADOR) {
      req.session.admin = true;
    };
    if (req.session.admin) {
      return res.redirect('/admin'); 
    } else {
      return res.redirect('/products'); 
    }
};

async function logout(req,res) {
    await req.session.destroy(e=> console.error(e)),
    res.redirect('/login?mensaje=logout correcto... !')
};

async function current (req,res) {
  const usuario= req.dto.usuario 
  return res.status(200).json({usuario})
};

async function current1 (req,res) {
  return res.redirect('./current')
};
export default {errorLogin, errorLoginGitHub, errorRegistro, Login ,logout, current, current1}