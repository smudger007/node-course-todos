const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// // This removes all ToDos, i.e. {}  - could be more specific if required. 
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findByIdAndRemove('5a55eaa0f95e9a0d98865bef').then((todo) => {
    console.log('To Do Removed was: ');
    console.log(todo);
});
