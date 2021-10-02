# Interview-Tracker Website
This project was a web app wherein one has to register or login to access. After logging in you can add or contribute topics and questions as per your choice for others, which then further be verified and uploaded by admins and practice them to improve your cp skills. 

# Dependencies used
   * [Mongoose](https://mongoosejs.com/docs/)
   * [EJS](https://ejs.co/)
   * [Express](http://expressjs.com/)
   * [Admin-bro](https://adminbro.com/section-modules.html/)
 
## Usage

Inorder to run the website locally on your computer , follow the steps given below:

* Clone this Github repo.
* Open the terminal and change the directory to the downloaded folder, then run the command 

```sh
 npm install
```
* The above command will install all the required packages and dependencies required for the project


* Add your mongodb URI in the app.js

`module.exports = {
    MongoURI : 'mongodb+srv://<user>:password@cluster08451.am7f4.mongodb.net/<name of database>?retryWrites=true&w=majority'
}`

* The final step is to run the following command
```sh
 nodemon app
 
```
 
 `Visit http://localhost:3000`
