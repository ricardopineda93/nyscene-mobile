const passport = require('passport');
const graphqlHTTP = require('express-graphql');
const schema = require('../gql/schema');

const gqlMiddleware = graphqlHTTP((req, res) => {
  return new Promise((resolve, reject) => {
    const next = (user, info = {}) => {
      resolve({
        schema,
        graphiql: true,
        context: {
          user: user || null
        }
      });
    };
    passport.authenticate('local', { session: true }, (err, user) => {
      next(user);
    })(req, res, next);
  });
});

module.exports = {
  gqlMiddleware
};
