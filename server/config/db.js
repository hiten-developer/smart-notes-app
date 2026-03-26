const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB is Connected...");
        
    }
    catch(err){
        console.log("OOps Some Err Occured..." + err.message);
        process.exit(1)
    }
}

module.exports = {connectDB}