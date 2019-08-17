const axios = require('axios');
const { Scene } = require('../database/index');

const {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

// Movies Type

const SceneType = new GraphQLObjectType({
  name: 'Scene',
  fields: () => ({
    id: { type: GraphQLInt },
    film: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    locationDetails: { type: GraphQLString },
    boro: { type: GraphQLString },
    neighborhood: { type: GraphQLString },
    imdbLink: { type: GraphQLString },
    imdbId: { type: GraphQLString }
  })
});

// OMDB Type

const OMDBType = new GraphQLObjectType({
  name: 'OMDB',
  fields: () => ({
    Title: { type: GraphQLString },
    Year: { type: GraphQLString },
    Rated: { type: GraphQLString },
    Released: { type: GraphQLString },
    Runtime: { type: GraphQLString },
    Genre: { type: GraphQLString },
    Director: { type: GraphQLString },
    Writer: { type: GraphQLString },
    Actors: { type: GraphQLString },
    Plot: { type: GraphQLString },
    Language: { type: GraphQLString },
    Country: { type: GraphQLString },
    Awards: { type: GraphQLString },
    Poster: { type: GraphQLString },
    Metascore: { type: GraphQLString },
    imdbRating: { type: GraphQLString },
    imdbVotes: { type: GraphQLString },
    imdbID: { type: GraphQLString },
    Type: { type: GraphQLString },
    DVD: { type: GraphQLString },
    BoxOffice: { type: GraphQLString },
    Production: { type: GraphQLString },
    Website: { type: GraphQLString },
    Response: { type: GraphQLString }
  })
});

//Root Query:
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    singleScene: {
      type: SceneType,
      args: { id: { type: GraphQLInt } },
      async resolve(parent, args) {
        return await Scene.findByPk(args.id);
      }
    },
    allScenes: {
      type: new GraphQLList(SceneType),
      async resolve(parent, args) {
        return await Scene.findAll();
      }
    },
    omdbInfo: {
      type: OMDBType,
      args: { imdbID: { type: GraphQLString } },
      resolve(parent, args) {
        return axios
          .get(`http://www.omdbapi.com/?apikey=640dfac7&i=${args.imdbID}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
