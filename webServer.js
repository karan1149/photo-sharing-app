"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be implemented:
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
var async = require('async');


// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();

mongoose.connect('mongodb://localhost/cs142project6');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.count({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

var listIsComplete = function listIsComplete(result){
  var returnValue = true;
  result.forEach(function(user){
    if (!('photosCount' in user && 'commentCount' in user)){
      returnValue = false;
    }
  });
  return returnValue;
}

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
  User.find({}, {first_name: 1, last_name: 1, id: 1}, function (errOriginal, resultOriginal) {
    var result = JSON.parse(JSON.stringify(resultOriginal));
    if (errOriginal){
      response.status(500).send(errOriginal.message);
    } else {
      result.forEach(function(value, index){
        Photo.find({user_id: value._id}, function(errPhoto, resultPhoto){
          if (errPhoto){
            response.status(500).send(errPhoto.message);
          } else {
            result[index].photosCount = resultPhoto.length;
            Photo.find({ comments: { $elemMatch: { user_id: value._id } } }, function(errComment, resultComment){
              if (errComment){
                response.status(500).send(errComment.message);
              } else {
                result[index].commentCount = 0;
                resultComment.forEach(function(photoValue){
                  photoValue.comments.forEach(function(commentValue){
                    if (String(commentValue.user_id) === value._id){
                      result[index].commentCount++;
                    }
                  });
                });
                if (listIsComplete(result)){
                  if (!response.headersSent) response.status(200).send(result);
                }
              }
            });
          }
        });
      });
    }
  });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
  User.findOne({_id: request.params.id}, function (err, result) {
    if (err){
      response.status(400).send(err.message);
    } else {
      if (result){
        if (!response.headersSent) response.status(200).send(result);
      } else {
        response.status(400).send("Invalid ID");
      }

    }
  });
});

var hasCommentUsers = function hasCommentUsers(result){
  var returnValue = true;
  result.forEach(function(photo){
    photo.comments.forEach(function(comment){
      if (!('user' in comment)){
        returnValue = false;
      }
    });
  });
  return returnValue;
}

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {

  Photo.find({user_id: request.params.id}, function (err, resultOriginal) {
    if (err){
      response.status(400).send(err.message);
    } else {
      var result = JSON.parse(JSON.stringify(resultOriginal));
      User.findOne({_id: request.params.id}, {first_name: 1, last_name: 1}, function(errOriginal, resultOriginal){
        if (errOriginal){
          response.status(500).send(errOriginal.message);
        } else {

          result.forEach(function(photo, ind){

            result[ind].user = resultOriginal;
            photo.comments.forEach(function(value, index){
                User.findOne({_id: value.user_id}, {first_name: 1, last_name: 1, _id: 0}, function (errUser, resultUser) {
                  if (errUser){
                    response.status(500).send(errUser.message);
                  } else {
                    result[ind].comments[index].user = resultUser;
                    if (hasCommentUsers(result)){
                      if (result){
                        if (!response.headersSent) response.status(200).send(result);
                      } else {
                        response.status(400).send("Invalid ID");
                      }
                    }

                  }
                });
            });
          });
        }
      });
    }
  });
});

/*
 * URL /comments/:id - Return the Comments for User (id)
 */
app.get('/commentsOfUser/:id', function (request, response) {
  Photo.find({ comments: { $elemMatch: { user_id: request.params.id } } }, function(errPhotos, resultPhotos){
    if (errPhotos){
      response.status(500).send(errPhotos.message);
    } else {
      User.findOne({_id: request.params.id}, {first_name: 1, last_name: 1}, function(errUser, resultUser){
        if (resultUser === null){
          response.status(400).send("Invalid ID");
        } else {
          if (errUser){
            response.status(500).send(errUser.message);
          } else {
            var comments = [];
            resultPhotos.forEach(function(photo){
              photo.comments.forEach(function(comment){
                if (String(comment.user_id) === request.params.id){
                  comment.file_name = photo.file_name;
                  comments.push(comment);
                }
              });
            });
            comments.forEach(function(comment, index){
              console.log(comments, index);
              comments[index].user = resultUser;
            });
            if (!response.headersSent) response.status(200).send(comments);
          }
        }
      });
    }
  });
});



var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
