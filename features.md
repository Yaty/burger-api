# Features

1. CRUD routes for Menu/Product/Order/User/Promotion
    1. find : get all instances
    2. findById : get an instance by id
    3. create : create an instance
    4. patch : update properties of an instance
    5. update : update an instance
    6. delete : delete an instance
    7. exists : check if an instance exists
    8. count : count the number of instance
2. Access Control with roles for routes
    1. admin
    2. everyone
    3. owner
3. Rate Limiting : 500 requests for 15 minutes per IP
4. Logging
    1. Rotating logs
    2. Logs in console + in files
    3. Logging requests + internal logging
5. Secure API
    1. Helmet : various HTTP headers
    2. Authentication : token based
6. Route validation : easily customizable with Joi
7. Error handling
8. Easily extensible
    1. Create the table in the migrate file
    2. Create the model with the relations
    3. Add a controller which use the crud generic controller, overwrite functions if necessary
    4. Add an express router which use the crud generic router
9. Environment variables used for configuring the API
10. Unit tests with Mocha and Chai to test the CRUD generic controller
11. Integration tests with Mocha, Chai and Supertest to test each route