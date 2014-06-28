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
    dbConnection.query("SELECT room_name 'roomname' FROM Rooms", function(err, results){
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
  getMessagesForRoom : function(room,callback){
    dbConnection.query("SELECT m.message_text 'message', u.user_name 'username', r.room_name 'roomname' FROM Messages m  LEFT JOIN Rooms r ON (m.room_id = r.room_id) LEFT JOIN Users u ON (m.user_id = r.user_id) WHERE r.room_name = " + room
      , function(err, results){
      if(err) throw err;
      callback(results);
    });
  },
//post new message
  postMessage : function(messagesObj){


  },
//post new room
  postRoom : function(room){

  },
//post new user
  postUser : function(user){

  }
};


