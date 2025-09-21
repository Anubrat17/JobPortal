import mongoose from "mongoose";
//function to connect to the database
const connectDB = async () => {
 mongoose.connection.on('connected',()=> console.log("database connected", mongoose.connection.name));
 await mongoose.connect(`${process.env.MONGODB_URI}`);
};

export default connectDB;








