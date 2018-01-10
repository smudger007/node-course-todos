const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');


// Create some dummy ToDos to load up the DB with.

const dummyTodos = [{_id: new ObjectID(), text: 'To Do 1'}, 
                    {_id: new ObjectID(), text: 'To Do 2'}, 
                    {_id: new ObjectID(), text: 'To Do 3', completed: true, completedAt: 1234 }];

// Prior to each test we want to Remove all existing documents and then add some Dummy entries. 

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(dummyTodos);
    }).then(() => done());
});


describe('POST /todos', () => {

    it('should create a new Todo', (done) => {

        var text = 'blah blah blah';
        
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err,res) => {

            if (err) {
                return done(err);
            }
            
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe('blah blah blah');
                done();
            }).catch((e) => done(e));
        });
    });

    it('should NOT create a new Todo', (done) => {

        request(app)
            .post('/todos')
            .send('{}')
            .expect(400)
            .end((err,res) => {
                if (err) {
                    return done(err);
                }
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e));
            });
    });

});

describe('GET /todos', () => {
    it('should get all Todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(3);
        })
        .end(done);
    });
});


describe('GET /todos:id', () => {

    it('should return todo doc', (done) => {

        request(app)
            .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(dummyTodos[0].text)
            })
            .end(done)
    });

    it('should return a 404 if todo not found', (done) => {

        var nonID = new ObjectID().toHexString();
        
        request(app)
            .get(`/todos/${nonID}`)
            .expect(404)
            .end(done)
    });

    it('should return a 404 if invalid ObjectID', (done) => {

        request(app)
            .get('/todos/1234')
            .expect(404)
            .end(done);

    });


});

describe('DELETE /todos/:id', () => {

    it('should remove a Todo', (done) => {
        var hexID = dummyTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err,res) => {
                if (err) {
                    return done(err);
                }
                // Now check to see entry has been removed from the DB.

                Todo.findById(hexID).then((todo) => {                    
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));

            });

    });

    it('should return 404 if TODO not found', (done) => {
        var nonID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${nonID}`)
            .expect(404)
            .end(done);
            
    });

    it('should return 404 if invalid ID', (done) => {
        
        request(app)
            .delete('/todos/asdfg')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {

    it('should update To Do', (done) => {

        var hexID = dummyTodos[0]._id.toHexString();
        var body = { text: 'To Do 1 - BUT I HAVE BEEN UPDATED', completed: true };

        request(app)
            .patch(`/todos/${hexID}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBeTruthy();
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeGreaterThanOrEqual(0);
            })
            .end(done);

    });

    it('should clear completedAt when completed is set to False', (done) => {

        var hexID = dummyTodos[2]._id.toHexString();
        var body = { text: 'To Do 3 - BUT I HAVE BEEN UPDATED', completed: false };

        request(app)
            .patch(`/todos/${hexID}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done);
    });
});