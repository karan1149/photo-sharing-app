'use strict';
/*
 * Mocha test of cs142 Project #6 web API.  To run type
 *   node_modules/.bin/mocha serverApiTest.js
 */
/* jshint node: true */

var assert = require('assert');
var http = require('http');
var async = require('async');
var _ = require('lodash');

var cs142models = require('../modelData/photoApp.js').cs142models;

var port = 3000;
var host = 'localhost';

// Valid properties of a user list model
var userListProperties = ['first_name', 'last_name', 'id', 'photosCount', 'commentCount'];
// Valid properties of a user detail model
var userDetailProperties = ['first_name', 'last_name', 'id',
    'location', 'description', 'occupation'];

function assertEqualDates(d1, d2) {

    return (new Date(d1).valueOf() === new Date(d2).valueOf());
}
/*
 * MongoDB automatically adds some properties to our models. We allow
 * these to appear by removing them when before checking
 * for invalid properties.  This way the models are permitted but
 * not required to have these properties.
 */
function removeMongoProperties(model) {
    var copy = JSON.parse(JSON.stringify(model));
    delete copy._id;
    delete copy.__v;
    return copy;
}

describe('CS142 Photo App API - ', function () {


    describe('test /user/list', function (done) {
        var userList;
        var cs142Users = cs142models.userListModel();

        it('can get the list of user', function (done) {
            http.get({
                hostname: host,
                port: port,
                path: '/user/list'
            }, function (response) {
                var responseBody = '';
                response.on('data', function (chunk) {
                    responseBody += chunk;
                });

                response.on('end', function () {
                    assert.strictEqual(response.statusCode, 200, 'HTTP response status code not OK');
                    userList = JSON.parse(responseBody);
                    done();
                });
            });
        });

        it('is an array', function (done) {
            assert(Array.isArray(userList));
            done();
        });

        it('has the correct number elements', function (done) {
            assert.strictEqual(userList.length, cs142Users.length);
            done();
        });


        it('has an entry for each of the users', function (done) {
            async.each(cs142Users, function (realUser, callback) {
                var user = _.find(userList, {
                    first_name: realUser.first_name,
                    last_name: realUser.last_name
                });
                assert(user, 'could not find user ' + realUser.first_name + ' ' + realUser.last_name);
                assert.strictEqual(_.countBy(userList, 'id')[user.id], 1, 'Multiple users with id:' + user.id);
                var extraProps = _.difference(Object.keys(removeMongoProperties(user)), userListProperties);
                assert.strictEqual(extraProps.length, 0, 'user object has extra properties: ' + extraProps);
                callback();
            }, done);
        });

    });

    describe('test /user/:id', function (done) {
        var userList;
        var cs142Users = cs142models.userListModel();

        it('can get the list of user', function (done) {
            http.get({
                hostname: host,
                port: port,
                path: '/user/list'
            }, function (response) {
                var responseBody = '';
                response.on('data', function (chunk) {
                    responseBody += chunk;
                });

                response.on('end', function () {
                    assert.strictEqual(response.statusCode, 200, 'HTTP response status code not OK');
                    userList = JSON.parse(responseBody);
                    done();
                });
            });
        });

        it('can get each of the user detail with /user/:id', function (done) {
            async.each(cs142Users, function (realUser, callback) {
                var user = _.find(userList, {
                    first_name: realUser.first_name,
                    last_name: realUser.last_name
                });
                assert(user, 'could not find user ' + realUser.first_name + ' ' + realUser.last_name);
                var userInfo;
                var id = user.id;
                http.get({
                    hostname: host,
                    port: port,
                    path: '/user/' + id
                }, function (response) {
                    var responseBody = '';
                    response.on('data', function (chunk) {
                        responseBody += chunk;
                    });

                    response.on('end', function () {
                        userInfo = JSON.parse(responseBody);
                        assert.strictEqual(userInfo.id, id);
                        assert.strictEqual(userInfo.first_name, realUser.first_name);
                        assert.strictEqual(userInfo.last_name, realUser.last_name);
                        assert.strictEqual(userInfo.location, realUser.location);
                        assert.strictEqual(userInfo.description, realUser.description);
                        assert.strictEqual(userInfo.occupation, realUser.occupation);

                        var extraProps = _.difference(Object.keys(removeMongoProperties(userInfo)), userDetailProperties);
                        assert.strictEqual(extraProps.length, 0, 'user object has extra properties: ' + extraProps);
                        callback();
                    });
                });
            }, done);
        });

        it('can return a 400 status on an invalid user id', function (done) {
            http.get({
                hostname: host,
                port: port,
                path: '/user/1'
            }, function (response) {
                var responseBody = '';
                response.on('data', function (chunk) {
                    responseBody += chunk;
                });

                response.on('end', function () {
                    assert.strictEqual(response.statusCode, 400);
                    done();
                });
            });
        });

    });

    describe('test /photosOfUser/:id', function (done) {
        var userList;
        var cs142Users = cs142models.userListModel();

        it('can get the list of user', function (done) {
            http.get({
                hostname: host,
                port: port,
                path: '/user/list'
            }, function (response) {
                var responseBody = '';
                response.on('data', function (chunk) {
                    responseBody += chunk;
                });

                response.on('end', function () {
                    assert.strictEqual(response.statusCode, 200, 'HTTP response status code not OK');
                    userList = JSON.parse(responseBody);
                    done();
                });
            });
        });

        it('can get each of the user photos with /photosOfUser/:id', function (done) {
            async.each(cs142Users, function (realUser, callback) {
                // validate the the user is in the list once
                var user = _.find(userList, {
                    first_name: realUser.first_name,
                    last_name: realUser.last_name
                });
                assert(user, 'could not find user ' + realUser.first_name + ' ' + realUser.last_name);
                var photos;
                var id = user.id;
                http.get({
                    hostname: host,
                    port: port,
                    path: '/photosOfUser/' + id
                }, function (response) {
                    var responseBody = '';
                    response.on('data', function (chunk) {
                        responseBody += chunk;
                    });
                    response.on('error', function (err) {
                        callback(err);
                    });

                    response.on('end', function () {
                        assert.strictEqual(response.statusCode, 200, 'HTTP response status code not OK');
                        photos = JSON.parse(responseBody);

                        var real_photos = cs142models.photoOfUserModel(realUser.id);
                        _.forEach(real_photos, function (real_photo) {
                            var matches = _.filter(photos, {file_name: real_photo.file_name});
                            assert.strictEqual(matches.length, 1, ' looking for photo ' +
                                real_photo.file_name);
                            var photo = matches[0];
                            assert.strictEqual(photo.user_id, id);
                            assertEqualDates(photo.date_time, real_photo.date_time);

                            if (real_photo.comments) {
                                assert.strictEqual(photo.comments.length, real_photo.comments.length,
                                    'comments on photo ' + real_photo.file_name);

                                _.forEach(real_photo.comments, function (real_comment) {
                                    var comment = _.find(photo.comments, {comment: real_comment.comment});
                                    assert(comment);
                                    assertEqualDates(comment.date_time, real_comment.date_time);
                                    assert.strictEqual(comment.user.first_name, real_comment.user.first_name);
                                    assert.strictEqual(comment.user.last_name, real_comment.user.last_name);
                                });
                            } else {
                                assert.strictEqual(photo.comments.length, 0);
                            }

                        });
                        callback();
                    });
                });
            }, function (err) {
                done();
            });
        });

        it('can return a 400 status on an invalid id to photosOfUser', function (done) {
            http.get({
                hostname: host,
                port: port,
                path: '/photosOfUser/1'
            }, function (response) {
                var responseBody = '';
                response.on('data', function (chunk) {
                    responseBody += chunk;
                });

                response.on('end', function () {
                    assert.strictEqual(response.statusCode, 400);
                    done();
                });
            });
        });

    });


});
