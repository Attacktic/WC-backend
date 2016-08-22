require('dotenv').config();
module.exports = {
      development: {
        client: 'pg',
        connection: 'postgres://localhost/loginusers'
      },
      production:{
        client: 'pg',
        connection: process.env.DATABASE_URL + '?ssl=true'
      }
}
