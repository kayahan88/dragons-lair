const express = require('express');
const session = require('express-session');
const massive = require('massive');
require('dotenv').config();
const authController = require('./controllers/authController');
const treasureController = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');


const {CONNECTION_STRING, SESSION_SECRET} = process.env;


const app = express();
const PORT = 4000

app.use(express.json())

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

//auth endpoints
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);
app.get('/auth/logout', authController.logout);

app.get('/api/treasure/dragon', treasureController.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureController.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly,treasureController.addUserTreasure);



massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
})
.then(dbInstance => {
    app.set('db', dbInstance);
    app.listen(PORT, () => console.log(`Listening on port ${PORT} and db connected`))
})
.catch(err => console.log(err));

