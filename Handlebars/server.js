const express = require('express')
const app = express();
const handlebars = require('express-handlebars');
const PORT = 8080;
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productosRouter = require('./src/Routes/ProductRoutes')
app.use('/api/productos', productosRouter);
const { ProductContainer } = require('./src/models/ProductContainer')
let productsContainer = new ProductContainer();
const messageRoutes = require('./src/Routes/MessagesRoutes')
app.use('/api/mensajes', messageRoutes);
const { MessagesContainer } = require('./src/models/MessageContainer')
let messageContainer = new MessagesContainer()


let products = [];
let messages = [];
// Server
app.engine(
    "hbs", 
    handlebars.engine({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + "/public",
        partialsDir: __dirname + "/views/partials/"
    })
);
    
    
app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('./public'));

httpServer.listen(8080, () => {
    console.log('SERVER ON en http://localhost:8080');
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('new-message', data => {
        let mensaje = messageContainer.addProduct(data.email, data.text);
        console.log('Mensaje enviado: ' + data.text);
        io.sockets.emit('messages', mensaje);
    })

    socket.on('new-product', data => {
        let producto = productsContainer.addProduct(data.name, data.price, data.image);
        console.log('Producto agregado: ' + data.name);
        io.sockets.emit('products', producto)
    })


})
    

app.get('/', function (req, res) {
    res.render('main',);    
})

