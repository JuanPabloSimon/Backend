const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const util = require("util");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv");
dotenv.config();
const ENV = process.env.NODE_ENV;
const { fork } = require("child_process");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

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
const { generarNumeros } = require("./src/utils/getRandomNumber");

//compression
// const compression = require("compression");
// app.use(compression);

// Log
const log4js = require("log4js");

log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    miLoggerWarn: { type: "file", filename: "warn.log" },
    miLoggerError: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miLoggerConsole"], level: "info" },
    fileError: { appenders: ["miLoggerError"], level: "error" },
    warnError: { appenders: ["miLoggerWarn"], level: "warn" },
  },
});

//Yargs

const yargs = require("yargs/yargs")(process.argv.slice(2));
const PORT = process.env.PORT || 8080;

const MODE = yargs.default({
  MODE: "fork",
}).argv.MODE;

if (MODE === "cluster") {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    httpServer.listen(PORT, () => {
      console.log(`Server corriendo en puerto: ${PORT} en modo cluster`);
    });
  }
} else {
  httpServer.listen(PORT, () => {
    console.log(`SERVER ON en http://localhost:${PORT} en modo fork`);
  });
}

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
        console.log("No se encontr?? el Usuario");
        return callback(null, false);
      }

      if (!validatePass) {
        console.log("Contrase??a Incorrecta");
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
            const loggerError = log4js.getLogger("fileError");
            loggerError.error(`Error en logueo ${err}`);
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
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:${PORT}/logged' - M??todo: 'GET'`);
  let usuario = req.user.firstName;
  let email = req.user.username;
  res.render("logged", { usuario: usuario, email: email });
});

app.get("/api/productos-test", routes.checkAuthentication, (req, res) => {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(
    `Ruta: 'http://localhost:${PORT}/api/productos-test' - M??todo: 'GET'`
  );
  let usuario = req.user.firstName;
  let email = req.user.username;
  let productos = productsContainer.generarProductos();
  res.render("main", { productos: productos, usuario: usuario, email: email });
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

//INFO Y NUMEROS RANDOM
let datosSesion = [
  {
    name: "Argumentos de Entrada",
    value: process.argv,
  },
  {
    name: "Nombre Plaforma",
    value: process.platform,
  },
  {
    name: "Version Node",
    value: process.version,
  },
  {
    name: "Path de Ejecuci??n",
    value: process.execPath,
  },
  {
    name: "Process ID",
    value: process.pid,
  },
  {
    name: "Carpeta del Proyecto",
    value: process.cwd(),
  },
  {
    name: "Cantidad De N??cleos",
    value: require("os").cpus().length,
  },
];

let memoria = {
  name: "Memoria Total Reservada",
  value: {
    rss: process.memoryUsage().rss,
    heapTotal: process.memoryUsage().heapTotal,
    heapUsed: process.memoryUsage().heapUsed,
    external: process.memoryUsage().external,
    arrayBuffers: process.memoryUsage().arrayBuffers,
  },
};

app.get("/info", (req, res) => {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(`Ruta: 'http://localhost:${PORT}/info' - M??todo: 'GET'`);
  res.render("info", { info: datosSesion, memoria: memoria });
});

//Fork

process.on("message", (cant) => {
  let numeros = generarNumeros(cant);
  process.send(numeros);
});

app.get("/api/randoms", (req, res) => {
  const loggerDefault = log4js.getLogger();
  loggerDefault.info(
    `Ruta: 'http://localhost:8080/api/randoms' - M??todo: 'GET'`
  );
  let cant = req.query.cantidad || 100;
  const forked = fork("./childProcess.js");
  forked.send(cant);
  forked.on("message", (numeros) => {
    res.json({ numeros: numeros });
  });
});

// FailRoute
app.get("*", routes.failRoute);
