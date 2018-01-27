const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

// Create some dummy users

const dummyUsers = [{
    _id: userOneID, 
    email: 'jimmy001@gmail.com', 
    password: 'password123!', 
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoID, 
    email: 'billy009@gmail.com', 
    password: 'password345!', 
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoID, access: 'auth'}, 'abc123').toString()
    }]
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(dummyUsers[0]).save();
        var userTwo = new User(dummyUsers[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

// Create some dummy ToDos to load up the DB with.

const dummyTodos = [{_id: new ObjectID(), text: 'To Do 1', _creator: userOneID}, 
                    {_id: new ObjectID(), text: 'To Do 2', _creator: userTwoID}, 
                    {_id: new ObjectID(), text: 'To Do 3', completed: true, _creator: userOneID, completedAt: 1234 }];


const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        // console.log('I removed the records');
        return Todo.insertMany(dummyTodos);
     }).then(() => done());
};

module.exports = { dummyTodos, populateTodos, dummyUsers, populateUsers };
