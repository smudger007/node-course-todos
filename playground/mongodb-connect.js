const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (err,client) => {

    if (err) {
        console.log('ERROR connecting go the DB');
    } else {
        console.log('Connected to DB');
        
        var db = client.db('TodoApp');

        // db.collection('Todos').insertOne({
        //     text: 'Something to do', 
        //     completed: false
        // }, (err,result) => {
        //     if (err) {
        //         console.log('Unable to write record in Todos Collection...');
        //     } else {
        //         console.log(JSON.stringify(result.ops, undefined, 2));
        //     }
        // });

        db.collection('Users').insertOne({
            name: 'Mark Smudger Smith', 
            age: 46, 
            location: 'Hazel Grove'
        }, (err,result) => {
            if (err) {
                console.log('Unable to write record in Users Collection...');
            } else {
                console.log(JSON.stringify(result.ops, undefined, 2));
                console.log(`timestamp = ${result.ops[0]._id.getTimestamp()}`);
            }
        });

        client.close();
        
    }
});