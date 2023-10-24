const express = require('express');
// express-session: This middleware is used to manage user sessions in your Express application. It can be used to store and manage session data, allowing users to remain authenticated and maintain state across different HTTP requests.
const session = require('express-session');
// Mongoose is an Object Data Modeling (ODM) library for MongoDB 
const mongoose = require('mongoose');

//connect-mongo library to store session data in the MongoDB database.
const MongoStore = require('connect-mongo');

const app = express();

// //we are going to connect to the database
// const dbUrl = 'mongodb://localhost:27017/tutorial_db';
// const dbOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// };

// const connection = mongoose.createConnection(dbUrl, dbOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const sessionStore = new MongoStore({
//     mongooseConnection: connection,
//     collection: 'sessions'
// });


// we are going to use the session middleware and 
// we are going to pass in an object with a secret property.
// The secret property is used to sign the session ID cookie.
// The secret is used to sign the session ID cookie.
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(
        { 
            mongoUrl: 'mongodb://localhost:27017/tutorial_db', 
            collectionName: 'sessions' 
        }, 
    ),
    // the cookie property is used to configure the session ID cookie.
    // The maxAge property is used to set the expiry time of the cookie in milliseconds.
    // In this case, we are setting the expiry time to 1 day.
    // 1000 milliseconds * 60 seconds * 60 minutes * 24 hours = 1 day
    // The cookiw will be a part of the response sent to the client.
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

/*when we get a Get request to the root of our application, 
we are going to send a response with the text Hello World.  
and we are going to listen on port 3000.
*/
app.get('/', (req, res) => {

/**
 * tutorial_db> db.sessions.find();
[
  {
    _id: '-Uo9aZgIpoyLTWTLYyW2uq6Nx80unx52',
    expires: ISODate("2023-10-22T15:04:21.618Z"),
    session: '{"cookie":{"originalMaxAge":86400000,"expires":"2023-10-22T15:04:21.618Z",
    "httpOnly":true,"path":"/"},"viewCount":33}'
  }
]
 */

    if(req.session.viewCount) {
        req.session.viewCount++;
    } else {
        req.session.viewCount = 1;
    }

    res.send('Hello World, you have visited this page ' + req.session.viewCount + ' times');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


/** when we are in the app the cookie will be created with a name and value
 * every request that we make to the server will have the cookie
 * the cookie will be sent to the server
 * the server will verify the cookie
 * the server will check the cookie and check the session id
 * the server will check the session id in the database
 * if the session id is valid the server will send the response
 */