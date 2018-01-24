require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

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
        console.log('In GET /todos');
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

    // console.log(`email = ${body.email} - password = ${body.password} `);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        console.log('Im here...');
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        console.log('Error', e);
        res.status(400).send(e);
    });

});


//GET /users/me 
app.get('/users/me', authenticate,  (req,res) => {
    console.log('XXXXX');
    res.send(req.user);
});

// POST /users/login - V1   
// Accept email and password. Check this matches an entry in the DB (password hashed of course.)

// app.post('/users/login', (req, res) => {

//     var body = _.pick(req.body, ['email'], ['password']);
    
//     // Now search for the user in the DB

//     User.findOne({email: body.email}).then((user) => {

//         if (!user) {
//             res.status(401).send();
//         } else {
//             bcrypt.compare(body.password, user.password, (err, result) => {
//                 result ? res.send(body) : res.status(401).send(); 
//             });
//         }
//     }).catch((e) => {
//         console.log('General Error during Authentication', e);
//         res.status(400).send(e);
//     });
// });


// POST /users/login - V2   
// Accept email and password. Check this matches an entry in the DB (password hashed of course.
app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email'], ['password']);

    // console.log('Before User Send', body);

    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            // console.log('Just before sending back', token);
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    });

});

// Log out user

app.delete('/users/me/token', authenticate, (req, res) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };
