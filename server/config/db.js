// import mongoose from "mongoose";
// //function to connect to the database
// const connectDB = async () => {
//  mongoose.connection.on('connected',()=> console.log("database connected", mongoose.connection.name));
//  await mongoose.connect(`${process.env.MONGODB_URI}`);
// };

// export default connectDB;



import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected:", mongoose.connection.name);
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1); // stop server if DB connection fails
  }
};

export default connectDB;




