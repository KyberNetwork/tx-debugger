const env = process.env.REACT_APP_ENV ? process.env.REACT_APP_ENV : 'development';
const envConfig = require(`./envs/${env}`);
module.exports = envConfig;
