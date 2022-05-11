const { Container } = require('./Container');
const { knexSqLite } = require('../../options/sqlLite3');

class MessagesContainer extends Container {
    constructor() {
        super('mensajes', knexSqLite);
    }
    
    async save(data) {
        try {
            await this.knex(this.table).insert({email: data.email, text: data.text})
            .then(resp => {
                console.log(resp);
            })
        } catch (error) {
            console.log(error);
        }
    }

    sendMessage(email, texto) {
        let mensaje = {
            name: email,
            text: texto,
            
        }
        this.save(mensaje)
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


    async editMessage(id, datosActualizados) {
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

module.exports = { MessagesContainer }