import passport from 'passport';
import local from 'passport-local';
import crypto from 'crypto';
import GitHubStrategy from 'passport-github2';
import {config} from '../config/config.js'
import {isValidPassword} from '../util.js';
import { usersServices } from '../services/usersServices.js';
import userDataManager from '../dao/userDataManager.js';

const inicializaPassport = () => {

passport.use ('registro', new local.Strategy(
    {
      usernameField : 'email', passReqToCallback : true
    },
    async (req,username,password, done) => { 
      const {name, email, last_name, age} = req.body;
      try {
        if (!name || !username || !password) {
        return done (null,false)
      }
      if (!validarCorreoElectronico(username)) {
          return done (null, false)
      }
      const existeUsuario = await usersServices.obtenerUsuarioPorEmail(username)
      if (existeUsuario) {
         return done (null, false)
      }
      password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')
      let typeofuser='user'
      const usuario = usersServices.crearUsuario(name,email,password,typeofuser,last_name,age)
      return done (null,usuario)
      }
    catch (error){
      return done(error)
    }
  }
  )),

passport.use('login', new local.Strategy({
usernameField:'email', passReqToCallback : true
}, async(req,username, password, done)=> {
  try {
    const emailAdministrador = config.EMAIL_ADMINISTRADOR
    const passwordAdministrador = config.PASSWORD_ADMINISTRADOR
    let adminUsuario = {}
    req.usuario = {}
    if (username === emailAdministrador && password === passwordAdministrador) {
      // Si las credenciales coinciden con el administrador
     adminUsuario = {
        nombre: 'Administrador',
        carrito: null,
        email: username,
        typeofuser: 'admin',
        id: '1',
      };
      return done(null, adminUsuario);
    }
    if (!username || !password) {
       return done (null,false)
    }
    password=crypto.createHmac('sha256','palabraSecreta').update(password).digest('base64')
    req.usuario = await usersServices.obtenerUsuarioPorEmail({username })
    if(!req.usuario) {
      return done (null,false)
    } else {
      
    if (!isValidPassword(password,req.usuario.password)) {
      return done (null,false)
    } 
    return done (null,req.usuario)}
  } catch (error){
    return done (error)
  }
}) )

passport.use('loginGitHub', new GitHubStrategy.Strategy({
  callbackURL:config.CALL_BACK_GITHUB_URL,
  clientID:config.CLIENT_ID_GITHUB ,
  clientSecret:config.CLIENT_SECRETI_GITHUB
  }, async(token,tokenfresh, profile, done)=> {
    try {
      let username = profile._json.email
      let usuario= await usersServices.obtenerUsuarioPorEmail({username})
      if(!usuario) {
        let typeofuser='user'
        usuario = await usersServices.crearUsuario (profile._json.name,profile._json.email,'github',typeofuser)
        return done (null,usuario)
      } else {
        return done (null,usuario)
      }
    } catch (error){
      return done (error)
    }
  }) )

passport.serializeUser((usuario, done) => {
  return done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    if (id!=='1') {let usuario = await usersServices.obtenerUsuarioPorId (id);
    return done(null,usuario)
  } else {
    let usuario = {
      nombre : 'Administrador',
      carrito : null,
      email : config.EMAIL_ADMINISTRADOR,
      typeofuser : 'admin',
      id:'1'
    };
    return done(null, usuario)
  }
  }
);

function validarCorreoElectronico(correo) {
  const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return expresionRegular.test(correo);
}
}

export default inicializaPassport;