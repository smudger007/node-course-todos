const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017', (err,client) => {

    if (err) {
        console.log('ERROR connecting go the DB');
    } else {
        console.log('Connected to DB');
        
        var db = client.db('TodoApp');
   
        //  This is different to class details...!!!!

        // db.collection('Todos').find({completed:false}).toArray().then((docs) => {
        //     console.log('Records');
        //     console.log(JSON.stringify(docs, undefined, 2));            
        // }, (err) => {
        //     console.log('DB Error Fetching records', err);
        // });

        // db.collection('Todos').find().count().then((count) => {
        //     console.log(`Count: ${count}`);
                        
        // }, (err) => {
        //     console.log('DB Error Fetching records', err);
        // });

        db.collection('Users').find({name:'Mark'}).toArray().then((docs) => {
            console.log('Records');
            console.log(JSON.stringify(docs, undefined, 2));            
        }, (err) => {
            console.log('DB Error Fetching records', err);
        });


        // client.close();
        
    }
});