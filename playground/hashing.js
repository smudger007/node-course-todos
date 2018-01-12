// const {SHA256} = require('crypto-js');

// var message = 'this is a test message - unhashed';
// var hash = SHA256(message).toString();

// console.log('Message: ', message);
// console.log('Hash: ', hash);

// var data = {
//     id: 4
// }; 

// var token = {
//     data, 
//     hash: SHA256(JSON.stringify(data) + 'secretsalt').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'secretsalt').toString();

// (resultHash === token.hash) ? console.log('Everything was OK - TRUST') : console.log('Something Changed - NO TRUST');

// console.log('Tok hash', token.hash);
// console.log('Res Hash', resultHash);

// -----------------------------------------------
// jwt examples
// const jwt = require('jsonwebtoken');

// var data = {
//     id: 4
// }; 

// var token = jwt.sign(data, 'secret123!');
// console.log('Token: ', token);

// var decoded = jwt.verify(token, 'secret123!');
// console.log('Decode: ', decoded);

// ---------------------------------------------------
// bcrypt examples

const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (error,hash) => {
//         console.log(hash);
//     });
// });

var hash = '$2a$10$t9fq84PTIQLwlwIaT5FD5eJtpLC/lVsoCgfSiq6kPbiJ50OAmFkJG';   // this is what came back from above.

bcrypt.compare(password, hash, (err, res) => {
    console.log(res);  // should be true or false.
});