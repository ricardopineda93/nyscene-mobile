const { cyan, magenta, bgYellow } = require('chalk');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const { User, db } = require('./database/index');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const PORT = 8080;
const app = express();
const sessionStore = new SequelizeStore({ db });
const graphqlHTTP = require('express-graphql');
const schema = require('./gql/schema');
const { passportMiddleware } = require('./middlewares/passport');
const passport = require('passport');

//logging middleware:
app.use(morgan('dev'));

app.use(
  session({
    secret: 'The most robust of secrets...',
    store: sessionStore,
    resave: false,
    saveUninitialized: true
  })
);

// Is this even being used? Probably not, will need a seperate route to handle
app.use(passportMiddleware);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use('/graphql', graphqlHTTP({ schema, graphiql: true })); // context defaults to 'request'

db.sync().then(() => {
  console.log(cyan('db synced!'));
  app.listen(PORT, () =>
    console.log(magenta.bgYellow(`Serving up the scenes on port ${PORT}!`))
  );
});
