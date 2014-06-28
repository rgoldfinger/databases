var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/


exports.db = {

//get all rooms
  getRooms : function(callback){

    dbConnection.query("SELECT id_room, room_name 'roomname' FROM Rooms", function(err, results){
      if(err) throw err;
      callback(results);
    });
  },
//get all messages
  getMessages : function(callback){
    dbConnection.query("SELECT m.message_text 'message', u.user_name 'username', r.room_name 'roomname' FROM Messages m LEFT JOIN Users u ON (m.id_user = u.id_user) LEFT JOIN Rooms r ON (m.id_room = r.id_room)", function(err, results){
      if(err) throw err;
      callback(results);
    });
  },

//get messages for room
//TODO wrap in getIdForRoom
  getMessagesForRoom : function(room,callback){
    room = dbConnection.escape(room);
    dbConnection.query("SELECT m.message_text 'message', u.user_name 'username', r.room_name 'roomname' FROM Messages m  LEFT JOIN Rooms r ON (m.id_room = r.id_room) LEFT JOIN Users u ON (m.id_user = r.id_user) WHERE r.room_name = " + room
      , function(err, results){
      if(err) throw err;
      callback(results);
    });
  },

//post new message
  postMessage : function(messagesObj,callback){
    console.log(messagesObj);

    exports.db.getIdForUser(messagesObj.username, function(idUser){
      exports.db.getIdForRoom(messagesObj.roomname, function(idRoom){
        var args = [idUser, idRoom, messagesObj.message];
        dbConnection.query("INSERT INTO Messages (id_user, id_room, message_text) VALUES (?,?,?)", args, function(err){
          if(err) throw err;
          callback();
        });
      });
    });


  },

//post new room
  postRoom : function(room, callback){
    dbConnection.query("INSERT INTO Rooms (room_name) VALUES (?)", [room], function(err){
      if(err) throw err;
      callback(results.insertId);
    });
  },

//post new user
  postUser : function(user, callback){
    dbConnection.query("INSERT INTO Users (user_name) VALUES (?)", [user], function(err, results){
      if(err) throw err;
      callback(results.insertId);
    });
  },

  getIdForUser : function(user, callback){
    dbConnection.query("SELECT u.id_user FROM Users u WHERE u.user_name = ?", [user], function(err, results){
      if(err) throw err;
      if(!results.length){
        exports.db.postUser(user, callback);
      }else{
        callback(results[0].id_user);
      }
    });
  },

  getIdForRoom : function(room, callback){
    dbConnection.query("SELECT r.id_room FROM Rooms r WHERE r.room_name = ?", [room], function(err, results){
      if(err) throw err;
      if(!results.length){
        exports.db.postRoom(room, callback);
      }else{
        callback(results[0].id_room);
      }
    });
  }
};


