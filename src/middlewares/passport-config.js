import passport from "passport";
import local from 'passport-local';
import crypto from 'crypto';
import GitHubStrategy from 'passport-github2';
import { config } from '../config/config.js';
import isValidatorPassword from '../utils.js';
import { usersServices } from '../serves/userServices.js';

const app = express();

const inicializaPassport = () => {
  passport.use(
    'registro',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { name, email, last_name, age } = req.body;
        try {
          if (!name || !email || !password) {
            return done(null, false);
          }
          if (!validarCorreoElectronico(email)) {
            return done(null, false);
          }
          const existeUsuario = await usersServices.obtenerUsuarioPorEmail(email);
          if (existeUsuario) {
            return done(null, false);
          }
          password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');
          const typeofuser = 'user';
          const usuario = await usersServices.crearUsuario(name, email, password, typeofuser, last_name, age);
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const emailAdministrador = config.EMAIL_ADMINISTRADOR;
          const passwordAdministrador = config.PASSWORD_ADMINISTRADOR;
          let adminUsuario = {};
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
            return done(null, false);
          }
          password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');
          const usuario = await usersServices.obtenerUsuarioPorEmail(username);
          if (!usuario) {
            return done(null, false);
          }
          if (!isValidPassword(password, usuario.password)) {
            return done(null, false);
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    'loginGitHub',
    new GitHubStrategy.Strategy(
      {
        callbackURL: config.CALL_BACK_GITHUB_URL,
        clientID: config.CLIENT_ID_GITHUB,
        clientSecret: config.CLIENT_SECRETI_GITHUB,
      },
      async (token, tokenfresh, profile, done) => {
        try {
          const username = profile._json.email;
          let usuario = await usersServices.obtenerUsuarioPorEmail(username);
          if (!usuario) {
            const typeofuser = 'user';
            usuario = await usersServices.crearUsuario(profile._json.name, profile._json.email, 'github', typeofuser);
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    return done(null, usuario.id);
  });

  passport.deserializeUser(async (id, done) => {
    if (id !== '1') {
      const usuario = await usersServices.obtenerUsuarioPorId(id);
      return done(null, usuario);
    } else {
      const usuario = {
        nombre: 'Administrador',
        carrito: null,
        email: config.EMAIL_ADMINISTRADOR,
        typeofuser: 'admin',
        id: '1',
      };
      return done(null, usuario);
    }
  });
};

export default inicializaPas