"use strict";
/* jshint node: true */
/*
 * Model data for CS142 Project #5 - the photo sharing site.
 * This module returns an object called cs142Models with the following functions:
 *
 * cs142Models.userListModel - A function that returns the list of users on the system. The
 * list is returned as an array of objects containing:
 *   id  (number) - The ID of the user.
 *   first_name (string) - The first name of the user.
 *   last_name (string) - The last name of the user.
 *   location (string) - The location of the user.
 *   description (string) - A brief user description.
 *   occupation (string) - The occupation of the user.
 *
 * cs142Models.userModel - A function that returns the info of the specified user. Called
 * with an user ID (id), the function returns n object containing:
 *   id  (number) - The ID of the user.
 *   first_name (string) - The first name of the user.
 *   last_name (string) - The last name of the user.
 *   location (string) - The location of the user.
 *   description (string) - A brief user description.
 *   occupation (string) - The occupation of the user.
 *
 * cs142Models.photoOfUserModel - A function that returns the photos belong to
 * the specified user. Called  with an user ID (id), the function returns n object containing:
 *   id  (number) - The ID of the photo
 *   date_time (date) - he date and time the picture was taken in ISO format.
 *   file_name (string) - The file name in the image directory of the picture.
 *   user {object} - The user info (see the userModel for format) of the picture's owner.
 *   comments: {array of objects} - An array of comment objects containing the properties:
 *        id  (number) - The ID of the comment.
 *        date_time (date) - The date the comment was made in ISO format.
 *        comment (string) - The text of the comment.
 *        user: {object} The user info (see userMode for format) who made the comment
 *        photo: {object} - The photo object of the comment.
 *
 */
(function() {
   // Create init users.

   var im = {id: 1, first_name: "Ian", last_name: "Malcolm", 
             location: "Austin, TX", description: "Should've stayed in the car.", occupation: "Mathematician"};
   var er = {id: 2, first_name: "Ellen", last_name: "Ripley", 
             location: "Nostromo", description: "Lvl 6 rating. Pilot.", occupation: "Warrant Officer"};
   var pt = {id: 3, first_name: "Peregrin", last_name: "Took", 
             location: "Gondor", description: "Home is behind, the world ahead... " + 
             "And there are many paths to tread. Through shadow, to the edge of night, " + 
             "until the stars are all alight... Mist and shadow, cloud and shade, " + 
             "all shall fade... all... shall... fade... ", occupation: "Thain"};
   var rk = {id: 4, first_name: "Rey", last_name: "Kenobi", 
             location: "D'Qar", description: "Excited to be here!", occupation: "Rebel"};
   var al = {id: 5, first_name: "April", last_name: "Ludgate", 
             location: "Pawnee, IN", description: "Witch", occupation: "Animal Control"};
   var jo = {id: 6, first_name: "John", last_name: "Ousterhout",
             location: "Stanford, CA", description: "<i>CS142!</i>", occupation: "Professor"};

   var users = [im, er, pt, rk, al, jo];

   // Create initial photos.
   var photo1 = {id: 1, date_time: "2012-08-30 10:44:23", file_name: "ouster.jpg", user: jo};
   var photo2 = {id: 2, date_time: "2009-09-13 20:00:00", file_name: "malcolm2.jpg", user: im};
   var photo3 = {id: 3, date_time: "2009-09-13 20:05:03", file_name: "malcolm1.jpg", user: im};
   var photo4 = {id: 4, date_time: "2013-11-18 18:02:00", file_name: "ripley1.jpg", user: er};
   var photo5 = {id: 5, date_time: "2013-09-20 17:30:00", file_name: "ripley2.jpg", user: er};
   var photo6 = {id: 6, date_time: "2009-07-10 16:02:49", file_name: "kenobi1.jpg", user: rk};
   var photo7 = {id: 7, date_time: "2010-03-18 23:48:00", file_name: "kenobi2.jpg", user: rk};
   var photo8 = {id: 8, date_time: "2010-08-30 14:26:00", file_name: "kenobi3.jpg", user: rk};
   var photo9 = {id: 9, date_time: "2013-12-03 09:02:00", file_name: "took1.jpg", user: pt};
   var photo10 = {id: 10, date_time: "2013-12-03 09:03:00", file_name: "took2.jpg", user: pt};
   var photo11 = {id: 11, date_time: "2013-09-04 09:16:32", file_name: "ludgate1.jpg", user: al};
   var photo12 = {id: 12, date_time: "2008-10-16 17:12:28", file_name: "kenobi4.jpg", user: rk};

   var photos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7,
      photo8, photo9, photo10, photo11, photo12];

   // Create initial comments.
   var comment1 = {
      id: 1,
      date_time: "2012-09-02 14:01:00",
      comment: "Learning new programming languages is hard... " + 
      "it's so easy to forget a </div>!", user: jo, photo: photo1
   };

   var comment2 = {
      id: 2,
      date_time: "2013-09-06 14:02:00",
      comment: "This is another comment, with a bit more text; " +
      "if the text gets long enough, does it wrap properly " +
      "from line to line?", user: jo, photo: photo1
   };

   var comment3 = {
      id: 3,
      date_time: "2013-09-08 14:06:00",
      comment: "If you see this text in <b>boldface</b> " +
      "then HTML escaping isn't working properly.", user: jo, photo: photo1
   };

   var comment4 = {
      id: 4,
      date_time: "2009-09-14 18:07:00",
      comment: "If there is one thing the history of evolution has" +
      " taught us it's that life will not be contained. Life breaks " +
      "free, it expands to new territories and crashes through " + 
      "barriers, painfully, maybe even dangerously, but, uh... well, " +
      "there it is. Life finds a way.", user: im, photo: photo2
   };

   var comment5 = {
      id: 5,
      date_time: "2013-11-28 17:45:13",
      comment: "Back from my trip. Did IQs just... drop sharply while I was " +
      "away?", user: er, photo: photo5
   };

   var comment6 = {
      id: 6,
      date_time: "2013-11-02 14:07:00",
      comment: "Hey Rey, great form. Love what " +
      "you do with the scavenged tech, got any tips?", user: er, photo: photo7
   };

   var comment7 = {
      id: 7,
      date_time: "2013-11-02 14:07:00",
      comment: "Definitely! I love your work! I'm away on a trip at " +
      "the moment, but let's meet up when I get back! :)", user: rk, photo: photo7
   };

   var comment8 = {
      id: 8,
      date_time: "2010-09-06 13:59:33",
      comment: "Made a new friend today! Well, they followed me " + 
      "home, anyway.", user: rk, photo: photo8
   };

   var comment9 = {
      id: 9,
      date_time: "2008-10-16 18:04:55",
      comment: "Wouldn't get anywhere without this beauty! " +
      "Completely built from scraps by hand, but she goes at top " +
      "speeds that'll rival any First Order piece of junk.", user: rk, photo: photo12
   };

   var comment10 = {
      id: 10,
      date_time: "2013-12-04 13:12:00",
      comment: "What do you mean you haven't heard of second " + 
      "breakfast?", user: pt, photo: photo10
   };

   var comment11 = {
      id: 11,
      date_time: "2013-09-04 10:14:32",
      comment: "Beautiful yet cold and aloof. Loner. Does not obey, " + 
      "occasionally chooses to cooperate. ", user: al, photo: photo11
   };
   
   var comment12 = {
      id: 12,
      date_time: "2016-01-04 2:00:01",
      comment: "Which one are you?", user: al, photo: photo9
   };
   
   var comment13 = {
      id: 13,
      date_time: "2016-01-04 2:04:01",
      comment: "The tall one.", user: pt, photo: photo9
   };
   
   var comments = [comment1, comment2, comment3, comment4, comment5, comment6, comment7, 
   comment8, comment9, comment10, comment11, comment12, comment13];

   comments.forEach(function (comment) {
      var photo = comment.photo;
      if (!photo.comments) {
         photo.comments = [];
      }
      photo.comments.push(comment);
   });

   var userListModel = function() {
      return users;
   };

   var userModel = function(userId) {
      for (var i = 0; i < users.length; i++) {
         if (users[i].id === userId) {
            return users[i];
         }
      }
      return null;
   };

   var photoOfUserModel = function(userId) {
      return photos.filter(function (photo) {
         return (photo.user.id === userId);
      });
   };

   var cs142models =  {
      userListModel: userListModel,
      userModel: userModel,
      photoOfUserModel: photoOfUserModel
   };

   if( typeof exports !== 'undefined' ) {
      // We're being loaded by the Node.js module loader ('require') so we use its
      // conventions of returning the object in exports.
      exports.cs142models = cs142models;
   } else {
      // We're not in the Note.js module loader so we assume we're being loaded
      // by the browser into the DOM.
      window.cs142models = cs142models;
   }
})();
