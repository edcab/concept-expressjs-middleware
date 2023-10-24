

const express = require('express');

const app = express();

//My middleware is now global, it will run on every request not matter the path or method don't forget to call next() to continue the request 
// and that the order of the middleware matters
app.use(myMiddleware);
app.use(myMiddleware2);

function myMiddleware(req, res, next) {
    console.log('Hello from myMiddleware1!');
    req.customProperty = 100;
    next();
}

function myMiddleware2(req, res, next) {
    console.log('Hello from myMiddleware2!');
    console.log(`This is the custom property: ${req.customProperty}`);
    req.customProperty = 200;
    next();
}



//once an error happens then the router will not be called
app.get('/', (req, res) => {
    res.send('Hello world!, This is the custom property: ' + req.customProperty);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



