const mongoose = require("mongoose");

let mongoServer;

const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (process.env.USE_MEMORY_DB === "true") {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    console.log("Жадтағы MongoDB іске қосылды (mongodb-memory-server)");
  }

  if (!mongoUri) {
    throw new Error("MONGO_URI орнатылмаған немесе USE_MEMORY_DB=true қажет");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB қосылды");
};

module.exports = connectDB;
module.exports.stopMemoryMongo = async () => {
  if (mongoServer) await mongoServer.stop();
};
