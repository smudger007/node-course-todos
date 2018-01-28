var env = process.env.NODE_ENV || 'development';

console.log('Env is ', env);

// Read in the config from a file, which will not be included in the git Repo, therefore no one can see our private details on DEV/TEST. 
// Note: On PROD these environment variables will be stored in the hosting environment, eg. Heroku.

if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env]
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
