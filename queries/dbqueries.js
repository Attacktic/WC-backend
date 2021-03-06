var knex = require('../db/knex');
function getPollAnswers(poll_id){
  return knex('polls').where("id", poll_id).first().then(function(poll){
    return knex('poll_answers').whereIn("poll_id", poll_id).then(function(answers){
      var all = [];
      answers.forEach(function(answer){
        all.push(knex('poll_votes').whereIn("answer_id", answer.id).then(function(votes){
          answer.votes = votes;
          return answer;
        }))
      })
      return Promise.all(all).then(function(answers) {
        poll.answers = answers;
        return poll;
      });
    })
  })
}
module.exports = {
  getPass: function(email){
    return knex.raw(`select * from users where email='${email}'`)
  },
  createNew: function(form){
    return knex.raw(`insert into users values(default,'${form.email}', '${form.name}', '${form.pass}')`)
  },
  createPoll: function(data){
    return knex('polls').insert({title: `${data.title}`, active: `${data.active}`}).returning('id')
  },
  createAnswer: function(answer){
    return knex('poll_answers').insert({answer: `${answer.text}`, poll_id: answer.poll_id, img: `${answer.img}`})
  },
  insertVote: function(data){
  return knex.raw(`select id from users where email='${data.username.replace(/"/g,"")}'`).then(function(user){
    return knex('poll_votes').insert({answer_id: data.answer_id, user_id: user.rows[0].id}).then(function(){
      return knex.raw(`select points from users where id=${user.rows[0].id}`).then(function(newdata){
        if (newdata.rows[0].points == null){
          return knex.raw(`update users set points = 1 where id=${user.rows[0].id}`)
        } else {
          return knex.raw(`update users set points = ${newdata.rows[0].points+1} where id=${user.rows[0].id}`)
        }
      })
    })
  })
  },
  getPolls: function(){
    return knex('polls').pluck('id').then(function(ids){
      var all = [];
      ids.forEach(function(id){
        all.push(getPollAnswers(id))
      })
      return Promise.all(all).then(function(polls){
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
        return polls
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
  resetVotes: function(pollid){
    return knex.raw(`select poll_votes.id from poll_votes join poll_answers on poll_votes.answer_id = poll_answers.id where poll_answers.poll_id=${pollid}`).then(function(ids){
      var all = [];
      ids.rows.forEach(function(id){
        all.push(knex.raw(`delete from poll_votes where id=${id.id}`))
      })
      return Promise.all(all).then(function() {
        return "done"
      });
    })
  },
  weekVotes: function(){
    function getMonday(d) {
      d = new Date(d);
      var day = d.getDay()
      var diff = d.getDate() - day + (day == 0 ? -6:1);
      var adiff = d.getDate() + (7-day) + (day == 0 ? -6:1);
      return [new Date(d.setDate(diff)),new Date(d.setDate(adiff))] ;
    }

    return knex.raw(`select user_id from poll_votes where created BETWEEN '${getMonday(new Date())[0].toISOString().slice(0, 19).replace('T', ' ')}' AND '${getMonday(new Date())[1].toISOString().slice(0, 19).replace('T', ' ')}'`).then(function(ids){
      var all = [];
      ids.rows.forEach(function(id){
        all.push(knex.raw(`select first_name, email from users where id=${id.user_id}`))
      })
      return Promise.all(all).then(function(users){
        return users;
      })
    })
    //select * from poll_votes where created BETWEEN '2016-09-20 00:00:01' AND '2016-09-25 23:59:59';
  }
}
