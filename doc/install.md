# Install

## NPM

`npm install`

## Configurations

With Webstorm add configurations :

1. Migrate - To initialize the database
    - node src/db/migrate.js OR npm migrate
2. Run - To launch the API
    - node src/bin/www.js OR npm start
    
## Environments variables

Then add environment variables to those configurations :

```
LOGGER_LEVEL=debug
DB_USER=username
DB_PASSWORD=password
DB_DATABASE=database_name
DB_HOST=localhost
DB_PORT=3306
NODE_ENV=development
```