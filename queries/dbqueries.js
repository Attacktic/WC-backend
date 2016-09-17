var knex = require('../db/knex');
function getPollAnswers(poll_id){
  return knex('polls').where("id", poll_id).first().then(function(poll){
    return knex('poll_answers').whereIn("poll_id", poll_id).then(function(answers){
      poll.answers = answers;
      return poll;
    })
  })
}
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
  },
  getPolls: function(){
    return knex('polls').pluck('id').then(function(ids){
      var all = [];
      ids.forEach(function(id){
        all.push(getPollAnswers(id))
      })
      return Promise.all(all).then(function(polls) {
        return polls;
      });
    })
  },
  deletePoll: function(id){
    return knex('polls').del().where({id: id}).then(function(){
      return knex('poll_answers').del().where({poll_id: id})
    })
  },
  getActivePolls: function(){
    return knex('polls').where('active', 'true').pluck('id').then(function(ids){
      var all = [];
      ids.forEach(function(id){
        all.push(getPollAnswers(id))
      })
      return Promise.all(all).then(function(polls) {
        return polls;
      });
    })
  },
  changeActive: function(id){
    var changeTo = ''
    return knex.raw(`select active from polls where id=${id}`).then(function(polls){
      console.log(polls.rows[0].active)
      if (polls.rows[0].active == "true"){
        changeTo = "false";
      } else {
        changeTo = "true";
      }
      return knex('polls').where('id', id).update({
        'active': changeTo
      })
    })
  },
}
