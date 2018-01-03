var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: { type: String}, 
    completed: { type: Boolean}, 
    completedAt: { type: Number}
});

// var newTodo = new Todo({
//     text: 'Wash the car smudger'
// });


// newTodo.save().then((doc) => {
//     console.log('Saved document: ', doc);
// }, (e) => {
//     console.log('Error saving to DB', e);
// })

var newTodo = new Todo({
    text: 'Go to the Chippy', 
    completed: true,
    completedAt: 999

});


newTodo.save().then((doc) => {
    console.log('Saved document: ', doc);
}, (e) => {
    console.log('Error saving to DB', e);
})
