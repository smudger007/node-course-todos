const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err,client) => {

    if (err) {
        console.log('ERROR connecting go the DB');
    } else {
        console.log('Connected to DB');
        
        var db = client.db('TodoApp');

    //    db.collection('Todos').findOneAndUpdate({
    //        _id: new ObjectID('5a3d0e56fb22bc48b413d176')
    //    }, {
    //        $set: {
    //            completed: true
    //        }
    //    }, {
    //        returnOriginal: false
    //    }).then((result) => {
    //        console.log(result);
    //    });

    // 5a3d0f87e0cd03358071ddea

    db.collection('Users').findOneAndUpdate(
        {_id: new ObjectID('5a3d0f87e0cd03358071ddea') }, 
        { $set: {name: "Pep"}, $inc: { age: 10 }},
        { returnOriginal: false }).then((result) => {
        console.log(result);
    });


        // client.close();
        
    }
});