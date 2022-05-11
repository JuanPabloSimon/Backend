const { knexMysql } = require('./options/mariaDB')
const { knexSqLite } = require('./options/sqlLite3')

const createTable1 = async () => {
    await knexMysql.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.string('name');
        table.integer('price');
        table.string('image');
    });
}
const createTable2 = async () => {
    await knexSqLite.schema.createTable('mensajes', table => {
        table.increments('id').primary();
        table.string('email')
        table.string('text')
        table.string('day');
        table.string('time');
    });
}

createTable1(knexMysql);
createTable2(knexSqLite);
  