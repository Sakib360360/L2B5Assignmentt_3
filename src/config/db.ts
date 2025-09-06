import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI as string;
  if (!uri) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  }
};

export default connectDB;
