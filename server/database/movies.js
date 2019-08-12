const Sequelize = require('sequelize');
const db = require('./db');

const Movies = db.define('movies', {
  film: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 1800,
      max: 2999
    }
  },
  director: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lat: {
    type: Sequelize.DECIMAL(9, 6),
    allowNull: false,
    validate: {
      max: 90.0,
      min: -90.0,
      notEmpty: true
    }
  },
  lng: {
    type: Sequelize.DECIMAL(9, 6),
    allowNull: false,
    validate: {
      max: 180.0,
      min: -180.0,
      notEmpty: true
    }
  },
  locationDetails: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'N/A'
  },
  boro: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  neighborhood: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  media: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Film'
  },
  imdbLink: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
      notEmpty: true,
      contains: 'imdb.com/title/t'
    }
  },
  imdbId: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [9, 9]
    }
  }
});

module.exports = Movies;
