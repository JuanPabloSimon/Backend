const { Container } = require('./Container');
const { knexMysql } = require('../../options/mariaDB');



class ProductContainer extends Container {
    constructor() {
        super('productos', knexMysql);
    }
    
    async save(data) {
        try {
            await this.knex(this.table).insert({name: data.name, price: data.price, image: data.image})
            .then(resp => {
                console.log(resp);
            })
        } catch (error) {
            console.log(error);
        }
    }

    addProduct(nombre, precio, image) {
        let product = {
            name: nombre,
            price: precio,
            image: image,
        }
        this.save(product)
    }


    async getContent() {
        try {
            const datos = await this.knex(this.table).select("*").then(resp => {
                return resp
            }).catch(error => {
                console.log(error);
            })
            return [...datos];
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id) {
        try {
            const datos = await this.knex(this.table).select("*").where('id', id)
            .then(resp => {
                return resp
            }).catch(error => {
                console.log(error);
            })
            return [...datos];
        } catch (error) {
            console.log(error);
        }
    }


    async editProd(id, datosActualizados) {
        await this.knex(this.table).where({id: id}).update(datosActualizados)
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
    }

    async deleteById(id) {
        await  this.knex(this.table).where({id: id}).del()
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
        }
    }



module.exports = { ProductContainer }