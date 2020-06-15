module.exports = {    
   "type": "postgres",
   "host": process.env.DB_HOST,
   "port": process.env.DB_PORT,
   "username": process.env.DB_USERNAME,
   "password": process.env.DB_PASSWORD,
   "database": process.env.DB_DATABASE,
   "synchronize": true,
   "logging": false,
   "migrationsRun": true,
   "entities": [
      "dist/entity/**/*.js"
   ],
   "migrations": [
      "src/migration/**/*.js"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
   }
}