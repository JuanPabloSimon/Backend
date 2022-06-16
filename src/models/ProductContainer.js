let faker = require('faker');
faker.locale = 'es';



class ProductContainer{
    
    generarProductos() {
        const productos = []

        for (let index = 0; index < 5; index++) {
            const producto = {
                id: faker.datatype.number(),
                nombre: faker.commerce.product() ,
                precio: faker.commerce.price(),
                foto: faker.image.abstract()
            }   
            productos.push(producto)
        }
        return productos
    }
    
}


module.exports = { ProductContainer }