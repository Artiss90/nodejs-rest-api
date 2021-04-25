const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uriDB = process.env.URI_DB;

const db = MongoClient.connect(uriDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 5,
});

process.on("SIGINT", async () => {
  const client = await db;
  client.close();
  console.log("Connection to DB closed and app termination");
  process.exit(1);
});

module.exports = db;
