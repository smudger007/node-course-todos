const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (err,client) => {

    if (err) {
        console.log('ERROR connecting go the DB');
    } else {
        console.log('Connected to DB');
        
        var db = client.db('TodoApp');

        // Delete Many

        // db.collection('Todos').deleteMany({text: 'Cut the grass'}).then((result) => {
        //     console.log(result);
        // });
        
        // Delete One
        // db.collection('Todos').deleteOne({text: 'Cut the grass'}).then((result) => {
        //     console.log(result);
        // });

        // find one and delete
        db.collection('Todos').findOneAndDelete({text: 'Cut the grass'}).then((result) => {
            console.log(JSON.stringify(result.value, undefined, 2));
        });

        // client.close();
        
    }
});