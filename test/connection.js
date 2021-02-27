const mongoose = require('mongoose');

//connecting to the mongoDB
mongoose.connect('mongodb://localhost/interview', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once('open',()=>{
    console.log('connected to mongoDB');
}).on('error',error=>{
    console.log('Connection to DB error',error);
});