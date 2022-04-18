//instanciar variables
const express = require('express');
const res = require('express/lib/response');
const  { Router } = express;
const app = express();
const router = Router();
const fs = require('fs')

// Lógica 


class Contenedor {
    constructor(archivo) {
        // this.productos = producto
        this.id = 0
        this.direc= archivo
        this.archivo = fs.writeFileSync(archivo, '{"productos": []}')
    }
    
}

let p = new Contenedor('./productos.json')

//Servidor
app.use('/api/productos', router)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : true }))


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})


let id = 0;

router.get('/', (req, resp) => {
    let data = fs.readFileSync('./productos.json', 'utf-8')
    let arreglo = JSON.parse(data).productos
    let html = '<h2> Lista de  Productos </h2> <ul>'
    arreglo.forEach(element => {
        html += '<li>' + element.name +'</li>'
    });
    html += '</ul>'
    
    console.log(arreglo);
    resp.send(html)
})

app.get('/api/productos/:id', (req, resp) => {
    let data = fs.readFileSync('./productos.json', 'utf-8')
    let arreglo = JSON.parse(data).productos
    let ID = req.params.id
    const validation = () => {
        return arreglo.some(item => item.id == ID)
    }
    let prod = arreglo.filter(element => element.id == ID)
    console.log(validation());
    const validar = () => {
        if(validation()) {
            resp.json(prod)
        } else {
            resp.json({error: 'producto no encontrado'})
        }
    }
    validar()
})
app.post('/api/productos', (req, resp) => {
    let data = fs.readFileSync('./productos.json', 'utf-8')
    let arreglo = JSON.parse(data).productos
    id++
    let product = {name: req.body.nombre, price: req.body.precio, url: req.body.urlimagen, id: id }
    arreglo.push(product)
    fs.writeFileSync('./productos.json', JSON.stringify({productos: arreglo}))
    console.log(product);
    resp.json(product)
})
app.put('/api/productos/:id', (req, resp) => {
    let data = fs.readFileSync('./productos.json', 'utf-8')
    let arreglo = JSON.parse(data).productos
    let ID = req.params.id
    let prod = arreglo.filter(element => element.id == ID)
    prod = {name: req.body.nombre, price: req.body.precio, url: req.body.urlimagen, id: ID}
    const newArreglo = arreglo.filter(element => element.id != ID )
    newArreglo.push(prod)
    fs.writeFile('./productos.json', JSON.stringify({productos: newArreglo}), error => {
        if (error) { 
            console.log('Eror inesperado', error);
        } else {
            console.log('Se elimino el producto indicado');
        }
    })
    resp.json({
        result: 'edit by id',
        id: req.params.id,
        body: prod
    })
})
app.delete('/api/productos/:id', (req, resp) => {
    let data = fs.readFileSync('./productos.json', 'utf-8')
    let arreglo = JSON.parse(data).productos
    let ID = req.params.id
    const prodDeleted = arreglo.filter(element => element.id == ID )
    const newArreglo = arreglo.filter(element => element.id != ID )
    fs.writeFile('./productos.json', JSON.stringify({productos: newArreglo}), error => {
        if (error) { 
            console.log('Eror inesperado', error);
        } else {
            console.log('Se elimino el producto indicado');
        }
    })

    resp.json({
        result: 'delete by id',
        id: req.params.id,
        productDeleted: prodDeleted,
    })
})


const server = app.listen(8080, () => {
    console.log('App express escuchando en el puerto 8080');
});

