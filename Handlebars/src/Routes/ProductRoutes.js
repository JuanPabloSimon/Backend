const express = require('express');
const { Router } = express;
const productosRouter = Router();

const { ProductContainer } = require('../models/ProductContainer')
let productsContainer = new ProductContainer();

productosRouter.get('/', (req, res) => {
    const traer = async () => {
        let datos = await productsContainer.getContent();
        res.json({productos: datos});
    }
    traer()
    // let products = productsContainer.getContent();
    // console.log(products);
})
productosRouter.get('/:id', (req, res) => {
    const traer = async () => {
        let product = await productsContainer.getById(req.params.id);
        console.log(product);
        res.json({productos: product});
    }
    traer()
})
productosRouter.post('/', (req, res) => {
    let producto = req.body;

    if (producto) {
        producto = productsContainer.addProduct(producto.name, producto.price, producto.image);
        res.json({result: 'producto guardado', producto: producto})
    } else {
        res.json({result: 'El producto no pudo ser guardado'})
    }
})
productosRouter.put('/:id', (req, res) => {
    let producto = req.body;

    if (producto) {
        producto = productsContainer.editProd(req.params.id, producto);
        res.json({result: 'producto editado', producto: producto})
    } else {
        res.json({result: 'El producto no pudo ser editado'})
    }
})
productosRouter.delete('/:id', (req, res) => {
    productsContainer.deleteById(req.params.id);
    res.json({result: `Producto con id: ${req.params.id} eliminado`});
})


module.exports = productosRouter;