var express = require('express');
var router = express.Router();
var queries = require('../queries/dbqueries');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

router.post('/verify', function(req, res, next) {
  queries.getPass(req.body.email).then(function(result){
    if (result.rows.length === 0){
      res.send("invalid combination")
    }
    else {
        if (bcrypt.compareSync(req.body.pass, result.rows[0].password)){
          res.send("login verified")
        } else {
          res.send("invalid combination")
        }
    }
  })
});

router.post('/createme', function(req, res, next) {
  queries.getPass(req.body.email).then(function(result){
    req.body.pass = bcrypt.hashSync(req.body.pass, salt);
    if (result.rows.length === 0){
      queries.createNew(req.body).then(function(){
        res.send("created user " + req.body.email)
      })
    } else {
      res.send("Email already in use")
    }
  })
});

router.post('/createpoll', function(req, res, next) {
  queries.createPoll(req.body).then(function(pollid){
    console.log("worked fine");
    req.body.answers.forEach(function(answer){
      console.log("still fine");
      answer.poll_id = pollid[0]
      console.log("fine?");
      queries.createAnswer(answer).then(function(){
        console.log("fine???");
      })
    })
    res.send("done")
  })
});

router.get('/polls', function(req, res, next){
  queries.getPolls().then(function(data){
    res.json(data)
  })
})

router.get('/polls/:id/delete', function(req, res, next){
  queries.deletePoll(req.params.id).then(function(){
    res.send("delete poll " + req.params.id)
  })
})

router.get('/polls/active', function(req, res, next){
  queries.getActivePolls().then(function(polls){
    res.json(polls)
  })
})

router.get('/polls/:id/toggleActive', function(req, res, next){
  queries.changeActive(req.params.id).then(function(){
    res.send("done");
  })
})

module.exports = router;
