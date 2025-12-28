const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
  console.log("connected successfully ");
})
  .catch((err) => {
    console.log(err);
  })

async function main() {
  await mongoose.connect(Mongo_Url);
}
const initDB = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj, owner: '694928701b9f2ed4f8b989af'
  }));
  await listing.insertMany(initData.data);
  console.log("data was initialised");
}
initDB();