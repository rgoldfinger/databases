
exports.User = sequelize.define('User', {
  username: Sequelize.STRING
});

exports.Message = sequelize.define('Message' {
  userid: Sequelize.INTEGER,
  text: Sequelize.STRING,
  roomname: Sequelize.STRING
});

exports.Room = sequelize.define('Room', {
  roomname: Sequelize.STRING
});
