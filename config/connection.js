const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // If DATABASE_URL is available (on Heroku), use it.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
  });
} else {
  // If not on Heroku, use your local database configuration.
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306,
    }
  );
}

module.exports = sequelize;

