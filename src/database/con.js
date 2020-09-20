// it manages mysql connection

// TODO: change it, so it depends of the environment
let knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.DB_SERVER,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE
    },
    pool: {
        min: 0,
        max: 7
    }
})

// console.log(knex)

const WTFTableName = 'WTF'

knex.schema.hasTable(WTFTableName).then(function (exists) {
    if (!exists) {
        return knex.schema.createTable(WTFTableName, function (t) {
            t.increments('Id').primary()
            t.string('Name', 64)
            t.string('Desc', 256)
        })
    }
})
// TODO: change it, so it depends of the environment
knex.debug(true)
module.exports =  {  knex }