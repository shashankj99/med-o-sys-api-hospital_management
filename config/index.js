require('dotenv').config();

module.exports = {
    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL,
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_DIALECT: process.env.DB_DIALECT
}
