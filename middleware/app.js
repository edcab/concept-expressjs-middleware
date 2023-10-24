const express = require('express');

const app = express();

function myMiddleware(req, res, next) {
    console.log('Hello from myMiddleware!');
    next();
}

function myMiddleware2(req, res, next) {
    console.log('Hello from myMiddleware2!');
    next();
}


app.get('/', myMiddleware, myMiddleware2, (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});



