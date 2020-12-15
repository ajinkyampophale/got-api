Game of Thrones Battle API

This app includes various find queries with mongodb.

Requirements:

  1. Node js
  2. MongoDB
  3. Postman (Optional to test)

Steps To Run:

  1. Clone the project and install the dependencies (change directory (cd) to the folder where you have cloned the project and run "npm install" command).

  2. Specify environment variables:
  a. MONGODB_URI (Mongodb connection string. Default is 'mongodb://localhost:27017/got').
  b. PORT (Default is 5000).
  (eg: MONGODB_URI='mongodb://localhost:27017/got' PORT=5003 node index.js)
    
    Or you can change the default options in index.js file.
   
  3. Start mongodb server and run "npm run dev" or "node index.js" command.
  
  4. That's it now you will have the application running on specified port you can test using postman.


Build With:

  1. Node.js
  2. Express.js
  3. Mongodb
  4. Mongoose
