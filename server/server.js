require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

// Set up Body Parser Middleware.

app.use(bodyParser.json());

// To Dos Post Route
// -----------------
app.post('/todos', (req,res) => {

    var todo = new Todo({ text: req.body.text });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

// To Dos GET route (return all todos)
// ------------------------------------
app.get('/todos', (req, res) => {
    
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

// To Dos GET a specific To Do. 
// ----------------------------
app.get('/todos/:id', (req,res) => {
    var id = req.params.id;

    if (ObjectID.isValid(id)) {
        
        Todo.findById(id).then((todo) => {
            (todo) ? res.send({todo}) : res.status(404).send();
        }, (e) => {
            res.status(400).send();
        });

    } else {
        //console.log('Invalid ObjectID')
        res.status(404).send();
    }
});

// Delete a specific ToDo (by ID)
// -------------------------------
// Return 404 if invalid ID
// Return 404 if valid ID but not in DB
// Return 200 and ToDo removed if successfully removed. 

app.delete('/todos/:id', (req,res) => {

    var id = req.params.id;

    if (ObjectID.isValid(id)) {
        Todo.findByIdAndRemove(id).then((todo) => {
            todo ? res.send({todo}) : res.status(404).send();
        }).catch((e) => {
            res.status(400).send();
        });

    } else {
        res.status(404).send();
    }

});

// Update a specific To Do.

app.patch('/todos/:id', (req,res) => {

    var id = req.params.id;

    if (ObjectID.isValid) {

        var body = _.pick(req.body, ['text'], ['completed']);
        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
            todo ? res.send({todo}) : res.status(404).send();
        }).catch((e) => {
            res.status(404).send();
        });
            

    } else {
        res.status(404).send();
    }
});

// Create a new User record. POST /users

app.post('/users', (req,res) => {

    var body = _.pick(req.body, ['email'], ['password']);

    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });

});


// GET /users/me 
app.get('/users/me', authenticate,  (req,res) => {
    console.log('XXXXX');
    res.send(req.user);
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };
