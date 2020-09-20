module.exports = {
    development: {
        client: "mysql2",
        connection: {
            port: process.env.DB_PORT,
            host: process.env.DB_SERVER,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASS,
          },
        seeds: {
            directory: './seeds'
        }
      }
}


