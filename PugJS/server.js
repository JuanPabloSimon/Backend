const express = require('express');
const PORT = 8080;
const fs = require('fs')
const app = express();

// Creación de productos

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

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/productos', function (req, res) {
    let data = fs.readFileSync('./productos.json', 'utf-8');
    let arreglo = JSON.parse(data).productos;
    res.render('main.pug', {productos: arreglo});    
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



// template pseudo codigo que utilizan variables variables
// variables
// template engine --> juntar template con las variables






const server = app.listen(PORT, () => {
    console.log("Aplicacion express escuchando en el puerto " + server.address().port);
});