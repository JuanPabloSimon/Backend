const path = require("path")

const knexSqLite = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, "./DB/ecommerce.sqlite") 
    },
    useNullAsDefault: true
})

module.exports = { knexSqLite };