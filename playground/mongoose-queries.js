const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Example To Do ID
// var id = '5a53772a4a7e920954df09a9';

// if (ObjectID.isValid(id)) {

//     // // Find using ID. Note: We don't need to pass in an ObjectID; mongoose converts the string into one!
//     // Todo.find({_id: id}).then((todos) => {
//     //     console.log('Todos', todos);
//     // });

//     // // findOne is similar to above, it just returns the first item found, and not an array of objects!
//     // Todo.findOne({_id: id}).then((todo) => {
//     //     console.log('Todo', todo);
//     // });

//     // findByID - again similar to above, but this time just pass in the ID string. 
//     Todo.findById(id).then((todo) => {
//         console.log('Todo by ID', todo);
//     });
// } else {
//     console.log(`Object ${id} is not valid!!!!!`);
// }


var userID = '5a4cc4cd3c2d8835cc114b56';

User.findById(userID).then((user) => {
    if (user) {
        console.log('User Details: ', user);
    } else {
        console.log('No such User!!!!')
    }
    
}).catch((e) => {
    console.log('ERROR grabbing User', e);
})


