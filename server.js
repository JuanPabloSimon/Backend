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

const { ProductContainer } = require("./src/models/ProductContainer");
let productsContainer = new ProductContainer();
const { MessagesContainer } = require("./src/models/MessageContainer");
let messageContainer = new MessagesContainer();
const { Normalizador } = require("./src/models/MessageContainer");
const normalizador = new Normalizador();
const { Desnormalizador } = require("./src/models/MessageContainer");
const denormalizador = new Desnormalizador();

// Session
app.use(
  session({
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/sesiones" }),
    secret: "entregable",
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
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("./public/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.render("main");
});

app.post("/login", (req, res) => {
  req.session.newUser = req.body.usuario;
  req.session.logged = true;
  res.redirect("/logged");
});

function checkLogged(req, res, next) {
  if (req.session?.logged == true) {
    return next();
  }

  return res.status(401).send("Usted no tiene permisos");
}

app.get("/logged", checkLogged, (req, res) => {
  res.render("logged", { usuario: req.session.newUser });
});

app.get("/logout", (req, res) => {
  let oldUser = req.session.newUser;

  req.session.destroy((error) => {
    if (error) {
      res.send({ status: "Logout Error", body: error });
    }
  });
  res.render("logout", { usuario: oldUser });
});

app.get("/api/productos-test", checkLogged, (req, res) => {
  let productos = productsContainer.generarProductos();
  res.render("main", { productos: productos, usuario: req.session.newUser });
});
