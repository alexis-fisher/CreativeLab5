var express = require('express');
var router = express.Router();
var request = require('request');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

// We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var dbUrl = 'mongodb://localhost:27017/pokemon';

// we will use this variable later to insert and retrieve a "collection" of data
var collection

// Use connect method to connect to the Server
MongoClient.connect(dbUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    // HURRAY!! We are connected. :)
    console.log('Connection established to', dbUrl);

    // do some work here with the database.
    collection = db.collection('pokemon');
    collection.remove(); // Remove anything that was there before
    collection.insert(pokemon, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "pokemon" collection. The documents inserted with "_id" are:', result.length, result);
      }

      // Dont Close the connection, so we can use it in other routes
      // db.close();
    })  
  
  }
});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html', { root: 'public' });
});

router.get('/pokemon', function(req, res,next) {
  Comment.find(function(err, pokemon) {
    if(err) {
      console.log(err);
      return next(err);
    } 
    res.json(pokemon);
  });
});

router.post('/pokemon', function(req, res,next) {
    var p = new Comment(req.body);
    p.save(function (err, p) {
      if (err) {
        return next(err);
      } 
      res.json(p);
    });
});

router.get('/pokemon/:p', function(req, res) {
  res.json(req.p);
});

router.param('p', function(req, res, next, id) {
  var query = Comment.findById(id);
  query.exec(function (err, p){
    if (err) { return next(err); }
    if (!p) { return next(new Error("can't find comment")); }
    req.p = p;
    return next();
  });
});

router.put('/pokemon/:p/upvote', function(req, res, next) {
  req.p.upvote(function(err, p){ 
    if (err) { return next(err); }
    res.json(p);
  });
});

router.put('/pokemon/:p/downvote',function(req,res,next){
  req.p.downvote(function(err,p){
    if(err) {return next(err);}
    res.json(p);
  });
});

router.delete('/pokemon/:p', function(req, res) {
  console.log("in Delete");
  req.p.remove();
  res.json(req.p);
});

module.exports = router;

/**
 * This array of pokemon will represent a piece of data in our 'database'
 */
var pokemon = [
  {
    name: 'Anonymous',
    avatarUrl: 'http://piximus.net/media/35597/hilarious-posts-you-can-only-find-on-tumblr-3.jpg',
    upvotes: 0
  },
  {
    name: 'Anonymous',
    avatarUrl: 'http://piximus.net/media/35597/hilarious-posts-you-can-only-find-on-tumblr-5.jpg',
    upvotes: 0
  }
];
