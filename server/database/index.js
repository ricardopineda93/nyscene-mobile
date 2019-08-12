const db = require('./db');
const Movies = require('./movies');
const User = require('./user');
const Favorite = require('./favorites');

Favorite.belongsTo(User);
Favorite.belongsTo(Movies);

module.exports = {
  db,
  Movies,
  User,
  Favorite
};
