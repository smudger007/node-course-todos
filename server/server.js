var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} = require('./models/user');

var app = express();

// Set up Body Parser Middleware.

app.use(bodyParser.json());

// To Dos Post Route

app.post('/todos', (req,res) => {

    var todo = new Todo({ text: req.body.text });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

// To Dos GET route (return all todos)

app.get('/todos', (req, res) => {
    
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});



app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = { app };
