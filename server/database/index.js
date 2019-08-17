const db = require('./db');
const Scene = require('./scene');
const User = require('./user');
const Favorite = require('./favorites');

Favorite.belongsTo(User);
Favorite.belongsTo(Scene);

module.exports = {
  db,
  Scene,
  User,
  Favorite
};
