const { cyan, magenta, bgYellow } = require('chalk');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { db } = require('./database/index');

const PORT = 8080;
const app = express();
const graphqlHTTP = require('express-graphql');

const schema = require('./gql/schema');

//logging middleware:
app.use(morgan('dev'));
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

db.sync().then(() => {
  console.log(cyan('db synced!'));
  app.listen(PORT, () =>
    console.log(magenta.bgYellow(`Serving up the scenes on port ${PORT}!`))
  );
});
