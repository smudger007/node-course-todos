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


const jwt = require('jsonwebtoken');

var data = {
    id: 4
}; 

var token = jwt.sign(data, 'secret123!');
console.log('Token: ', token);

var decoded = jwt.verify(token, 'secret123!');
console.log('Decode: ', decoded);