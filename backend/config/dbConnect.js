const mongoose=require('mongoose');

const connectDB= async ()=>{
    try{
        const connect=await mongoose.connect("mongodb://127.0.0.1:27017/Friendlly_DB",{
             useNewUrlParser: true,
             useUnifiedTopology: true 
        });

        console.log(`MongoDB Connected Successfully ${connect.connection.host}`.cyan.underline);
    }
    catch(e){
        console.log(`Error : ${e.message}`.red.bold);
        process.exit(1);
    }
};

module.exports= connectDB;