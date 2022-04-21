const express = require('express')
const fs = require('fs')
const app = express();
const handlebars = require('express-handlebars');
const PORT = 8080;

// Creacion de PRoductos 
class Contenedor {
    constructor(archivo) {
        // this.productos = producto
        this.id = 0
        this.direc= archivo
        this.archivo = fs.writeFileSync(archivo, '{"productos": []}')
    }
    
}

let p = new Contenedor('./productos.json')
let id = 0

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
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({extended : true }))
    
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/productos', function (req, res) {
    let data = fs.readFileSync('./productos.json', 'utf-8');
    let arreglo = JSON.parse(data).productos;
    res.render('main', {productos: arreglo});    
})

app.post('/productos', function (req, res) {
    let data = fs.readFileSync('./productos.json', 'utf-8')
    let arreglo = JSON.parse(data).productos
    id++
    let product = {name: req.body.nombre, price: req.body.precio, url: req.body.urlimagen, id: id }
    arreglo.push(product)
    fs.writeFileSync('./productos.json', JSON.stringify({productos: arreglo}))
    console.log(product);
    res.sendFile(__dirname + '/public/index.html')
})

const server = app.listen(PORT, () => {
    console.log('App expres escuchando el puerto ' + server.address().port);
})