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
  GraphQLSchema,
  GraphQLBoolean
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
    // Resolver to fetch film data from OMDB API
    omdbInfo: {
      type: OMDBType,
      async resolve(parent, args) {
        const { data } = await axios.get(
          `http://www.omdbapi.com/?apikey=640dfac7&i=${parent.imdbId}`
        );
        return data;
      }
    },
    // Resolver to fetch how many favorites a scene has
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
    // Resolver to fetch all of a user's favorites
    favorites: {
      type: new GraphQLList(FavoriteType),
      async resolve(parent, args) {
        const userFavorites = await Favorite.findAll({
          where: {
            userId: parent.id
          }
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
    // Resolver to get scene associated with favorite
    scene: {
      type: SceneType,
      async resolve(parent, args) {
        return await Scene.findByPk(parent.sceneId);
      }
    },
    // Resolver to fetch user associated with favorite
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
  }
});

// Schema mutations:
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signupUser: {
      type: GraphQLBoolean,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args, request) {
        try {
          const user = await User.create({
            email: args.email,
            password: args.password
          });
          request.login(user, error => (error ? error : user));
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            throw new Error('Email already associated with existing account!');
          } else {
            throw new Error(error.message);
          }
        }
      }
    },
    loginUser: {
      type: GraphQLBoolean,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args, request) {
        const user = await User.findOne({ where: { email: args.email } });
        if (!user) {
          throw new Error(
            `Could not find account associated with email: ${args.email}`
          );
        } else if (!user.correctPassword(args.password)) {
          throw new Error(
            `Incorrect password for account associated with: ${args.email}`
          );
        } else {
          request.login(user, error => (error ? error : user));
          console.log(request.sessionID);
          return true;
        }
      }
    },
    logoutUser: {
      type: GraphQLBoolean,
      async resolve(parent, args, request) {
        request.logout();
        request.session.destroy();
        return true;
      }
    },
    addFavorite: {
      type: FavoriteType,
      args: {
        sceneId: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args, request) {
        if (!request.user) throw new Error('Only users can create favorites.');
        const newFavorite = await Favorite.create({
          sceneId: args.sceneId,
          userId: request.user.id
        });
        return newFavorite;
      }
    },
    removeFavorite: {
      type: FavoriteType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args) {
        const removeFavorite = await Favorite.destroy({
          where: {
            id: args.id
          }
        });
        return removeFavorite;
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
    },
    removeUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args) {
        const removeUser = await User.destroy({
          where: {
            id: args.id
          }
        });
        return removeUser;
      }
    },
    removeScene: {
      type: SceneType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args) {
        const removeScene = await Scene.destroy({
          where: {
            id: args.id
          }
        });
        return removeScene;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
