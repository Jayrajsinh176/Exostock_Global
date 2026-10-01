import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    try {
      const companyCollection = mongoose.connection.db.collection("companies");
      const indexes = await companyCollection.listIndexes().toArray();
      if (indexes.some((index) => index.name === "companyId_1")) {
        await companyCollection.dropIndex("companyId_1");
        console.log("Removed obsolete companyId index");
      }
    } catch (error) {
      if (error.code !== 26) throw error;
    }
    console.log("MongoDb Connected Successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
