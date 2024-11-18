require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'naiyo24',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'naiyo24',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres'
  }
};
