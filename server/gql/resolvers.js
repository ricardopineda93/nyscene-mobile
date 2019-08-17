const { Movie } = require('../database/index');

module.exports = {
  RootQuery: {
    allMovies: () => Movie.findAll()
  }
};
