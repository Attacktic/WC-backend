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

router.get('/reset/:pollid', function(req, res, next){
    queries.resetVotes(req.params.pollid).then(function(){
      res.send("reset " + req.params.pollid);
    })
})

router.post('/createpoll', function(req, res, next) {
  queries.createPoll(req.body).then(function(pollid){
    req.body.answers.forEach(function(answer){
      answer.poll_id = pollid[0]
      queries.createAnswer(answer).then(function(){
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
router.post('/polls/upload', function(req, res, next){
  cloudinary.uploader.upload(req.body.imgurl, function(result) {
    //console.log("IMG data? " + result);
    res.send("DONE? " + result)
  });
})

router.post('/polls/:id/questions/:question_id', function(req, res, next){
  queries.addImgUrl(req.params.id).then(function(){
    res.send("added img");
  })
})

router.post('/votes/new', function(req, res, next){
  queries.insertVote(req.body).then(function(){
    res.send("created vote");
  })
})

router.post('/user/data', function(req, res, next){
  queries.getPass(req.body.username).then(function(data){
    res.send(data);
  })
})

router.get('/weekvotes', function(req, res, next){
  queries.weekVotes().then(function(data){
    for (var i in data){
      console.log(data[i]);
    }
    res.send(data.rows);
  })
})

module.exports = router;
