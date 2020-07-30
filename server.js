const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');



// CONNECTING TO DATABASE
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false

}).then(con => {
    //console.log(con.connections);
    console.log('Connection Succesfull');
}).catch(err => console.log(err));

 // SERVER
if(process.env.HEROKU_UPDATE === 'NO'){
   
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`App is running on port ${port}`);
    });

}else{

    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Heroku app is running!"); 
     });

}


process.on('unhandledRejection', err => {
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });    
});


process.on('uncaughtException', err => {
    console.log(err.name, err.message);

    server.close(() => {
        process.exit(1);
    });    
});