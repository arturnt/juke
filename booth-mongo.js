
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

SongProvider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

//getCollection

SongProvider.prototype.getCollection= function(callback) {
  this.db.collection('rooms', function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

//findAll
SongProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//findById
SongProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.findOne({_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//save
SongProvider.prototype.save = function(room, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {

        collection.insert(room, function() {
          callback(null, room);
        });

      }
    });
};

exports.SongProvider = SongProvider;	
