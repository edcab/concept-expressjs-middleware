

const express = require('express');

const app = express();

//My middleware is now global, it will run on every request not matter the path or method don't forget to call next() to continue the request 
// and that the order of the middleware matters
app.use(myMiddleware);
app.use(myMiddleware2);

function myMiddleware(req, res, next) {
    console.log('Hello from myMiddleware1!');
    next();
}

function myMiddleware2(req, res, next) {
    console.log('Hello from myMiddleware2!');
    next();
}


// app.get('/', myMiddleware2, (req, res) => {
//     res.send('Hello World!');
// });

//we are going to modify the path to implement the middleware globally
app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



