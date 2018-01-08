const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Create some dummy ToDos to load up the DB with.

const dummyTodos = [{text: 'To Do 1'}, {text: 'To Do 2'}, {text: 'To Do 3'}];

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


