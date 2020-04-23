# Sample User Authentication JWT 

This project is based in Spring Security (Java). 
I use the Roles to access routes inside a application.
Exists three basic entity.

- User (username, password and another attributes)
- Role (Access Role)
- Request Map (url and http Method [POST, GET, PUT, DELETE] )

Existing too, two many to many tables, are this :

- User Role (What are the Roles is associed to User)
- Roles Request Maps (What are the Roles can access this url)

The magic happen on ./src/config/securityFilter.js and ./src/services/requestsMapsSercice.validateAccess

To be more clear and direct, if the logged in user has a role that can access the url, he can perform the action, otherwise, the return is response code 400 .. 403

Technologies

- Node
- Knex
- Celebrate
- SQLite
- Jwt
- Jest 

Usage

- By command line change to app folder (cd /home/user/app_folder)
- Inside app folder running this commands
    - npm install
    - npx knex migrate:latest
    - npm knex seed:run
    - npm start
    
    If you want run tests
    - npm test
    
 PS: Sorry, i am a java developer i am newbie in node :sweat_smile: