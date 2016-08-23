var knex = require('../db/knex');

module.exports = {
  getPass: function(email){
    return knex.raw(`select * from users where email='${email}'`)
  },
  createNew: function(form){
    return knex.raw(`insert into users values(default, '${form.pass}','${form.name}', '${form.email}')`)
  },
  createPoll: function(data){
    return knex('polls').insert({title: `${data.title}`, active: `${data.active}`}).returning('id')
  },
  createAnswer: function(answer){
    return knex('poll_answers').insert({answer: `${answer.text}`, poll_id: answer.poll_id})
  },
  insertVote: function(data){
    return knex('poll_votes').insert({user_id: data.user_id})
  }
}
