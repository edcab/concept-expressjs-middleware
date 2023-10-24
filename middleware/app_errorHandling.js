

const express = require('express');

const app = express();

//My middleware is now global, it will run on every request not matter the path or method don't forget to call next() to continue the request 
// and that the order of the middleware matters
app.use(myMiddleware);
app.use(myMiddleware2);
app.use(errorHandlingMiddleware);

function myMiddleware(req, res, next) {
    console.log('Hello from myMiddleware1!');
    next();
}

function myMiddleware2(req, res, next) {
    console.log('Hello from myMiddleware2!');

    //we are going to throw an error to test the error handling middleware
    const error = new Error('Error thrown from myMiddleware2');

    next(error);
}

function errorHandlingMiddleware(err, req, res, next) {
    console.log('Error handling middleware called');
    console.log(err);

    //we are going to send a response with the error
    //res.send(err.message);
    //we are going to send a response with the error and the status code
    //res.status(500).send(err.message);
    //we are going to send a response with the error and the status code
    res.status(500).json({ error: err.message });
    
}


//once an error happens then the router will not be called
app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



