const express = require('express')
const app = express();
const expreesLayouts = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session')
require('dotenv').config()
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
    // Database connection

const url = 'mongodb://localhost/pizza';


mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});


// Session store
let mongoStore = new MongoDbStore({
        mongooseConnection: connection,
        collection: 'sessions'
    })
    // Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

// Assets
app.use(flash())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())



// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


app.use(expreesLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs')
app.use(express.static('public'))

require('./routes/web')(app)

app.listen(PORT, () => {

    console.log(`Server is Starting on Port ${PORT}`)
})