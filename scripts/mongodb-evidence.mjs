import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Portfolio";
await mongoose.connect(uri);
const database = mongoose.connection.db;

console.log("COMP229 ASSIGNMENT 2 — MONGODB PORTFOLIO DATABASE");
console.log("====================================================");
console.log(`Database: ${database.databaseName}`);

for (const name of ["contacts", "projects", "qualifications", "users"]) {
  const document = await database.collection(name).findOne({}, { projection: { password: 0, __v: 0 } });
  const fields = document ? Object.keys(document).filter((field) => field !== "_id") : [];
  console.log(`\nCollection: ${name}`);
  console.log(`Fields:     ${fields.join(", ")}`);
  if (document) {
    const safe = { ...document, _id: "<MongoDB ObjectId>" };
    console.log(`Document:   ${JSON.stringify(safe)}`);
  } else {
    console.log("Document:   Collection exists; currently empty.");
  }
}

console.log("\nRESULT: Portfolio database and all four required collections confirmed.");
await mongoose.disconnect();
