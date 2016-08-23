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
    console.log(req.body);
    req.body.pass = bcrypt.hashSync(req.body.pass, salt);
    console.log(req.body);
    if (result.rows.length === 0){
      queries.createNew(req.body).then(function(){
        res.send("created user " + req.body.email)
      })
    } else {
      res.send("Email already in use")
    }
  })
});

router.get('/createpoll', function(req, res, next) {
  /*var values = {
    title: "Which drink do you like the most?",
    answers: [{text:'a1'}, {text:'a2'}, {text:'a3'}, {text:'a4'}]
  }*/
  queries.createPoll(req.body).then(function(pollid){
    req.body.answers.forEach(function(answer){
      answer.poll_id = pollid[0]
      queries.createAnswer(answer).then(function(){
        console.log("done");
      })
    })
  })
});
module.exports = router;
