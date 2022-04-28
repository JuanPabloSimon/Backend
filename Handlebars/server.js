const express = require('express')
const fs = require('fs')
const app = express();
const handlebars = require('express-handlebars');
const PORT = 8080;
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);






// Creacion de PRoductos 
class Contenedor {
    constructor(archivo, conjunto) {
        this.archivo = fs.writeFileSync(archivo, '{' + conjunto + ': []}')
    }
    
}

let p = new Contenedor('./productos.json', '"productos"')
let m = new Contenedor('./mensajes.json', '"mensajes"')

const messages = [
    { author: "Local", text: 'Hola, dejanos tu consulta aquí abajo', time: 00 },
];

const data = fs.readFileSync('./productos.json', 'utf-8')
let products = JSON.parse(data).productos

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
// app.use(express.json())
// app.use(express.urlencoded({extended : true }))

httpServer.listen(8080, () => {
    console.log('SERVER ON en http://localhost:8080');
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.emit('messages', messages);
    socket.emit('products', products);

    socket.on('new-message', data => {
        let info = fs.readFileSync('./mensajes.json', 'utf-8')
        let arreglo = JSON.parse(info).mensajes
        messages.push(data);
        arreglo.push(data)
        fs.writeFileSync('./mensajes.json', JSON.stringify({Mensajes: arreglo}))
        io.sockets.emit('messages', messages);
    })

    socket.on('new-product', data => {
        products.push(data);
        let info = fs.readFileSync('./productos.json', 'utf-8')
        let arreglo = JSON.parse(info).productos
        arreglo.push(data)
        fs.writeFileSync('./productos.json', JSON.stringify({productos: arreglo}))
        io.sockets.emit('products', products)
    })


})
    
// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/public/index.hbs')
// })

app.get('/', function (req, res) {
    res.render('main',);    
})

// app.post('/', function (req, res) {
//     let data = fs.readFileSync('./productos.json', 'utf-8')
//     let arreglo = JSON.parse(data).productos
//     id++
//     let product = {name: req.body.nombre, price: req.body.precio, url: req.body.urlimagen, id: id }
//     arreglo.push(product)
//     fs.writeFileSync('./productos.json', JSON.stringify({productos: arreglo}))
//     console.log(product);
//     res.render('main', {productos: arreglo});    
// })
