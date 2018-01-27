const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed');

// Add seed Users and Todos before each test
beforeEach(populateUsers);
beforeEach(populateTodos);

// beforeEach(populateUsers);

describe('POST /todos', () => {

    it('should create a new Todo', (done) => {

        var text = 'blah blah blah';
        
        request(app)
        .post('/todos')
        .set('x-auth', dummyUsers[0].tokens[0].token)
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
            .set('x-auth', dummyUsers[0].tokens[0].token)
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
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2); // Should be 2 for this specific user
        })
        .end(done);
    });
});


describe('GET /todos:id', () => {

    it('should return todo doc', (done) => {

        request(app)
            .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(dummyTodos[0].text)
            })
            .end(done)
    });

    it('should not return a todo doc created by another user', (done) => {

        request(app)
            .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end(done)
    });


    it('should return a 404 if todo not found', (done) => {

        var nonID = new ObjectID().toHexString();
        
        request(app)
            .get(`/todos/${nonID}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return a 404 if invalid ObjectID', (done) => {

        request(app)
            .get('/todos/1234')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done);

    });
});

describe('DELETE /todos/:id', () => {

    it('should remove a Todo', (done) => {
        var hexID = dummyTodos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
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

    it('should not remove a Todo owned by someone else', (done) => {
        var hexID = dummyTodos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end((err,res) => {
                if (err) {
                    return done(err);
                }
                // Now check to see entry has been removed from the DB.

                Todo.findById(hexID).then((todo) => {                    
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => done(e));

            });

    });

    it('should return 404 if TODO not found', (done) => {
        var nonID = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${nonID}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end(done);
            
    });

    it('should return 404 if invalid ID', (done) => {
        
        request(app)
            .delete('/todos/asdfg')
            .set('x-auth', dummyUsers[1].tokens[0].token)
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
            .set('x-auth', dummyUsers[0].tokens[0].token)
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

    it('should NOT update ToDo owned by a different user', (done) => {

        var hexID = dummyTodos[0]._id.toHexString();
        var body = { text: 'To Do 1 - BUT I HAVE BEEN UPDATED', completed: true };

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .send(body)
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when completed is set to False', (done) => {

        var hexID = dummyTodos[2]._id.toHexString();
        var body = { text: 'To Do 3 - BUT I HAVE BEEN UPDATED', completed: false };

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
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

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {

        request(app)
            .get('/users/me')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
                expect(res.body.email).toBe(dummyUsers[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {

        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });


});

describe('POST /users', () => {

    it('should create a valid user', (done) => {
        var email='example123@example.com';
        var password = 'abcd123!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return (done(err));
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                });
                done();
            });

    });

    it('should return validation messages if an invalid request', (done) => {

        var email='blubber';
        var password = 'a';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);

    });

    it('should not create a user if email is in use', (done) => {
        var email=dummyUsers[0].email;  // Already in place. 
        var password = 'abcd123!';
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});
 

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: dummyUsers[1].email,
                password: dummyUsers[1].password
            })
            .expect(200)
            .expect((res) => {
                console.log('status', res.status);
                expect(res.headers['x-auth']).toBeTruthy();
            })          
            .end((err,res) => {
                if (err) {
                    return done(err);
                }              
                User.findById(dummyUsers[1]._id).then((user) => {
                    expect(user.tokens[1].access).toBe('auth');
                    expect(user.tokens[1].token).toBe(res.headers['x-auth']);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return a failure if an invalid password is sent', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: dummyUsers[1].email,
                password: 'blubber'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy;
            })
            .end((err,res) => { 
                if (err) {
                    return done(err);
                }    

                User.findById(dummyUsers[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    
                    done();
                }).catch((e) => done(e));
            });
    });

});

describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {

        request(app)
            .delete('/users/me/token')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
                if (err) {
                    return done(err);
                }
                User.findById(dummyUsers[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    
                    done();
                }).catch((e) => done(e));
            });
    });

});
