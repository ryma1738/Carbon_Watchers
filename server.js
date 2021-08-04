const path = require('path');
const express = require('express');
const apiRoutes = require('./controllers/api');
const sequelize = require('./db/connection');
const session = require("express-session");
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3001;



//start session
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: 'Super secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};



app.use(session(sess));



app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));


// turn on routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.render("index");
});

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});