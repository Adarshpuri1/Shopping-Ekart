import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongoose connect successfully");

    }catch(error){
        console.log("Mongodb err",error.message);
        process.exit(1);
    }
}

export default connectDB;