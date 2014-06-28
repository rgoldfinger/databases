var app = {

  init: function(){
    // use setInterval to start repeating functionality
    app.displayUserInput();
    app.fetch();
    app.render();


    setInterval(function() {
      app.fetch();
      app.render();
    }, 1000);

  },

  //current data and state
  chatData: {},
  roomsList: {},
  newRoomsList: {},
  friends: {},
  currentRoom: null,
  userName: null,

  server: 'http://127.0.0.1:8080/1/classes/messages',

  displayUserInput: function() {
    var $textbox = $('<input type="text" placeholder="Enter your username to chat..." id="username-input"></input>');
    var $submitButton = $('<button id="username-submit">Submit</button>');
    $('#input').append([$textbox, $submitButton]);
    $('#username-submit').on('click', function(e){
        e.preventDefault();
        var username = $('#username-input').val();
        app.userName = username;
        $('#input').children().remove();
        app.displayChatInput();
        app.displayRoomCreate();
    });
  },

  displayChatInput: function () {
    $("#header").text(app.userName + "'s chatterbox");

    var $textbox = $('<input type="text" placeholder="Enter your message..." id="message-input"></input>');
    var $sendButton = $('<button id="message-send">Send!</button>');
    $('#input').append([$textbox, $sendButton]);
    $('#message-send').on('click', function(e) {
      e.preventDefault();
      var message = {
        message: $('#message-input').val(),
        username: app.userName,
        roomname: app.currentRoom || "lobby"
      };
      app.send(message);
      $('#message-input').val('');
    });
  },

  displayRoomCreate: function(){
    var $roomInput = $('<input id="create-chatroom" placeholder="Create a NEW chatroom!"></input>');
    var $roomSubmit = $('<button id="room-submit">CREATE!</button>');
    $('#room-select').append([$roomInput, $roomSubmit]);
    $('#room-submit').on('click', function(e){
      e.preventDefault();
      app.currentRoom = $('#create-chatroom').val();
      $('#create-chatroom').val('');
      app.addRoom(app.currentRoom);
      $('#room-menu').val(app.currentRoom);
    });
  },

  send: function(message){
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data){
      },
      error: function(data){
        console.error('you wost da game');
      }
    });
  },

  fetch: function(){
    var urlOptions = '';
    //= '?order=-createdAt';
    if(app.currentRoom !== null){
      urlOptions += '&where={"roomname":"' + app.currentRoom + '"}';
    }
    $.ajax({
      url: app.server + urlOptions,
      type: 'GET',
      success: function(data){
        app.processFetchedData(data);

      },
      error: function(data){
        console.log("Error!!")
      }
    });
  },

  processFetchedData: function (data) {
    app.chatData = data.results;
    _.each(app.chatData, function (item) {
      if (item.roomname) {
        if(!app.roomsList[item.roomname]){
          app.newRoomsList[item.roomname] = true;
        }
      }
    });
  },

  addMessage: function(item) {
    var $messageHTML = $('<p class="chat"><a href="#" class="username">' + _.escape(item.username) + '</a>: ' + _.escape(item.message) + '</p>');
    if (app.friends.hasOwnProperty(_.escape(item.username))) {
      $messageHTML.find('a').addClass('friend');
    }

    $messageHTML.find('a').on('click', function(e){
      console.log('YOU GOT A NEW FRIEND! YAY!!!!!!!!!!1111');
      e.preventDefault();
      app.friends[$(this).text().trim()] = true;
      console.dir(app.friends);
    });
    $('#chats').append($messageHTML);
  },

  addRoom: function (item) {
    var $option = $('<option value="' + _.escape(item) + '">' + _.escape(item) + '</option>');
    $('#room-menu').append($option);
  },

  clearMessages: function() {
    $('#chats').children().remove();
  },

  render: function(){
    _.each(app.newRoomsList, function (item, key) {
      app.addRoom(key);
      app.roomsList[key] = true;
    });
    app.newRoomsList = {};
    app.clearMessages();
    _.each(app.chatData, function(item){
      if(app.currentRoom !== null){
        // debugger;
      }
      if(app.currentRoom === item.roomname || app.currentRoom === null){
        app.addMessage(item);
      }
    });
  },
};


$(document).ready(function() {
  app.init();
  $('#room-menu').change(function(e) {
    var val = $('#room-menu option:selected').text();
    app.currentRoom = val;
    app.render();
  });
});

//
//when bringing in message data, send to process function
//process data to see what rooms exist, and add them to a roomNames object
//add a dropdown menu, populated with roomNames
  //when one is selected, state is changed to indicate current room
//add messages will only add messages where room matches state
