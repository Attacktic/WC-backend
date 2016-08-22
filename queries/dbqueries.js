var knex = require('../db/knex');

module.exports = {
  getPass: function(email){
    return knex.raw(`select * from users where email='${email}'`)
  },
  createNew: function(form){
    return knex.raw(`insert into users values(default, '${form.pass}','${form.name}', '${form.email}')`)
  }
}
