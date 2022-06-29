const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const PORT = 8080;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const { ProductContainer } = require("./src/models/ProductContainer");
let productsContainer = new ProductContainer();
const { MessagesContainer } = require("./src/models/MessageContainer");
let messageContainer = new MessagesContainer();
const { Normalizador } = require("./src/models/MessageContainer");
const normalizador = new Normalizador();
const { Desnormalizador } = require("./src/models/MessageContainer");
const { callbackify } = require("util");
const denormalizador = new Desnormalizador();
const UserModel = require("./src/models/usuarios");
const { validatePass } = require("./src/utils/passValidator");
const { createHash } = require("./src/utils/hashGenerator");
const routes = require("./src/routes/routes");

// Session
app.use(
  session({
    secret: "entregable",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 6000000,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  })
);

// Server
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/src/views/layouts",
    partialsDir: __dirname + "/src/views/partials/",
  })
);

app.set("view engine", "hbs");
app.set("views", "./src/views");
app.use(express.static("./public/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport

passport.use(
  "login",
  new LocalStrategy((username, password, callback) => {
    UserModel.findOne({ username: username }, (err, user) => {
      if (err) {
        return callback(err);
      }

      if (!user) {
        console.log("No se encontró el Usuario");
        return callback(null, false);
      }

      if (!validatePass) {
        console.log("Contraseña Incorrecta");
        return callback(null, false);
      }

      return callback(null, user);
    });
  })
);

passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, callback) => {
      UserModel.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log("Error al Registrarse");
          return callback(err);
        }

        if (user) {
          console.log("El usuario ya se encuentra registrado");
          return callback(null, false);
        }

        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: username,
          password: createHash(password),
        };

        UserModel.create(newUser, (err, userWithId) => {
          if (err) {
            console.log("Hay un error al Registrarse");
            return callback(err);
          }

          console.log("Registro Satisfactorio");
          console.log(userWithId);
          return callback(null, userWithId);
        });
      });
    }
  )
);

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  UserModel.findById(id, callback);
});

//Rutas

httpServer.listen(8080, () => {
  console.log("SERVER ON en http://localhost:8080");
});

io.on("connection", (socket) => {
  console.log("Cliente conectado");
  let messages = [];
  async function getMessages() {
    let datosNormalizados = await normalizador.normalizar();
    messages = denormalizador.desnormalizar(datosNormalizados);
    socket.emit("messages", messages);
  }
  getMessages();

  socket.on("new-message", (data) => {
    let mensaje = messageContainer.sendMessage(
      data.author.email,
      data.author.nombre,
      data.author.apellido,
      data.author.edad,
      data.author.alias,
      data.author.avatar,
      data.text
    );

    console.log("Mensaje enviado: " + data.text);
    io.sockets.emit("messages", mensaje);
  });
});

// Inicio
app.get("/", routes.getRoot);

// Login

app.get("/login", routes.getLogin);

app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/loginfail" }),
  routes.postLogin
);

app.get("/loginfail", routes.getFaillogin);

//Logged
app.get("/logged", routes.checkAuthentication, (req, res) => {
  let usuario = UserModel.findOne({ _id: req.session.passport.usuario });
  console.log(usuario);
  res.render("logged", {});
});

app.get("/api/productos-test", routes.checkAuthentication, (req, res) => {
  let productos = productsContainer.generarProductos();
  res.render("main", { productos: productos });
});

// Signup

app.get("/signup", routes.getSignup);
app.post(
  "/signup",
  passport.authenticate("signup", { failureRedirect: "/signupfail" }),
  routes.postSignup
);
app.get("/signupfail", routes.getFailsignup);

// Logout
app.get("/logout", routes.getLogout);

// FailRoute
app.get("*", routes.failRoute);
