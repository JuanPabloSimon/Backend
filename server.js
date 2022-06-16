const express = require('express')
const app = express();
const handlebars = require('express-handlebars');
const PORT = 8080;
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


const { ProductContainer } = require('./src/models/ProductContainer')
let productsContainer = new ProductContainer();
const { MessagesContainer } = require('./src/models/MessageContainer')
let messageContainer = new MessagesContainer()
const {Normalizador} = require('./src/models/MessageContainer')
const normalizador = new Normalizador()
const { Desnormalizador} = require('./src/models/MessageContainer')
const denormalizador = new Desnormalizador()

// Server
app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials/"
    })
);


    
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.json())
app.use(express.urlencoded({extended : true }))

httpServer.listen(8080, () => {
    console.log('SERVER ON en http://localhost:8080');
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    let messages = []
    async function getMessages() {
        let datosNormalizados = await normalizador.normalizar()
        messages = denormalizador.desnormalizar(datosNormalizados) 
        socket.emit('messages', messages);
    }
    getMessages()

    socket.on('new-message', data => {
        let mensaje = messageContainer.sendMessage(data.author.email, data.author.nombre, data.author.apellido, data.author.edad, data.author.alias, data.author.avatar, data.text);

        console.log('Mensaje enviado: ' + data.text);
        io.sockets.emit('messages', mensaje);
    })
})
    

app.get('/', function (req, res) {
    res.render('main',);    
})

app.get('/api/productos-test', function (req, res) {
    let productos = productsContainer.generarProductos()
    res.render('main', {productos: productos});    
})
