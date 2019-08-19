const axios = require('axios');
const { Scene, User, Favorite } = require('../database/index');
const {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLSchema
} = require('graphql');

// Scenes Type

const SceneType = new GraphQLObjectType({
  name: 'Scene',
  fields: () => ({
    id: { type: GraphQLID },
    film: { type: GraphQLString },
    lat: { type: GraphQLFloat },
    lng: { type: GraphQLFloat },
    locationDetails: { type: GraphQLString },
    boro: { type: GraphQLString },
    neighborhood: { type: GraphQLString },
    imdbLink: { type: GraphQLString },
    imdbId: { type: GraphQLString },
    omdbInfo: {
      type: OMDBType,
      async resolve(parent, args) {
        const { data } = await axios.get(
          `http://www.omdbapi.com/?apikey=640dfac7&i=${parent.imdbId}`
        );
        return data;
      }
    },
    favorites: {
      type: new GraphQLList(FavoriteType),
      async resolve(parent, args) {
        const favorites = await Favorite.findAll({
          where: {
            sceneId: parent.id
          }
        });
        return favorites;
      }
    }
  })
});

// Users Type

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    salt: { type: GraphQLString },
    googleId: { type: GraphQLString },
    favorites: {
      type: new GraphQLList(FavoriteType),
      async resolve(parent, args) {
        const userFavorites = await Favorite.findAll({
          where: {
            userId: parent.id
          },
          include: [{ model: Scene }]
        });
        return userFavorites;
      }
    }
  })
});

// Favorites Type

const FavoriteType = new GraphQLObjectType({
  name: 'Favorite',
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLInt },
    sceneId: { type: GraphQLInt },
    scene: {
      type: SceneType,
      async resolve(parent, args) {
        return await Scene.findByPk(parent.sceneId);
      }
    },
    user: {
      type: UserType,
      async resolve(parent, args) {
        return await User.findByPk(parent.userId);
      }
    }
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
    imdbID: { type: GraphQLID },
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
      args: { id: { type: GraphQLID } },
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
    singleUser: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return await User.findByPk(args.id);
      }
    },
    allUsers: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        return await User.findAll();
      }
    }
    // allUserFavorites: {
    //   type: new GraphQLList(FavoriteType),
    //   args: { userId: { type: GraphQLID } },
    //   async resolve(parent, args) {
    //     const userFavorites = await Favorite.findAll({
    //       where: {
    //         userId: args.userId
    //       },
    //       include: [{ model: Scene }]
    //     });
    //     return userFavorites;
    //   }
    // }
    // omdbInfo: {
    //   type: OMDBType,
    //   args: { imdbID: { type: GraphQLID } },
    //   async resolve(parent, args) {
    //     const { data } = await axios.get(
    //       `http://www.omdbapi.com/?apikey=640dfac7&i=${args.imdbID}`
    //     );
    //     return data;
    //   }
    // }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const newUser = await User.create({
          email: args.email,
          password: args.password
        });
        return newUser;
      }
    },
    addFavorite: {
      type: FavoriteType,
      args: {
        sceneId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        const newFavorite = await Favorite.create({
          sceneId: args.sceneId,
          userId: args.userId
        });
        return newFavorite;
      }
    },
    addScene: {
      type: SceneType,
      args: {
        film: { type: new GraphQLNonNull(GraphQLString) },
        lat: { type: new GraphQLNonNull(GraphQLFloat) },
        lng: { type: new GraphQLNonNull(GraphQLFloat) },
        locationDetails: { type: GraphQLString },
        boro: { type: new GraphQLNonNull(GraphQLString) },
        neighborhood: { type: new GraphQLNonNull(GraphQLString) },
        imdbLink: { type: new GraphQLNonNull(GraphQLString) },
        imdbId: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        const newScene = await Scene.create({
          film: args.film,
          lat: args.lat,
          lng: args.lng,
          locationDetails: args.locationDetails,
          boro: args.boro,
          neighborhood: args.neighborhood,
          imdbLink: args.imdbLink,
          imdbId: args.imdbId
        });
        return newScene;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
