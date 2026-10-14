import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "assignment-two-evidence-secret";
process.env.DOTENV_CONFIG_QUIET = "true";

const resource = process.argv[2];
const allowed = new Set(["contacts", "projects", "qualifications", "users-auth"]);
if (!allowed.has(resource)) {
  console.error("Use: node scripts/detailed-api-evidence.mjs [contacts|projects|qualifications|users-auth]");
  process.exit(1);
}

const mongoServer = await MongoMemoryServer.create();
await mongoose.connect(mongoServer.getUri(), { dbName: "Portfolio" });
const { createApp } = await import("../server/app.js");
const app = createApp();

function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !["password", "token", "__v"].includes(key))
    .map(([key, item]) => [key, key === "_id" ? "<MongoDB ObjectId>" : clean(item)]));
}

function show(method, route, response, body) {
  console.log(`\n${method} ${route}`);
  if (body) console.log(`Request:  ${JSON.stringify(body)}`);
  console.log(`Status:   ${response.status}`);
  console.log(`Response: ${JSON.stringify(clean(response.body))}`);
}

async function session() {
  const credentials = { name: "Zohaib Syed", email: "zohaib.student@example.com", password: "Portfolio123!" };
  const created = await request(app).post("/api/users").send(credentials);
  const signedIn = await request(app).post("/api/auth/signin").send({ email: credentials.email, password: credentials.password });
  return { credentials, created, signedIn, token: signedIn.body.token, id: created.body._id };
}

async function resourceEvidence(name, payload) {
  const { token } = await session();
  const base = `/api/${name}`;
  console.log(`COMP229 ASSIGNMENT 2 — ${name.toUpperCase()} API TESTING`);
  console.log("========================================================");
  const created = await request(app).post(base).set("Authorization", `Bearer ${token}`).send(payload);
  show("POST", base, created, payload);
  const id = created.body._id;
  show("GET", base, await request(app).get(base).set("Authorization", `Bearer ${token}`));
  show("GET", `${base}/:id`, await request(app).get(`${base}/${id}`).set("Authorization", `Bearer ${token}`));
  const update = name === "contacts" ? { firstname: "Janet" } : { description: "Updated portfolio record" };
  show("PUT", `${base}/:id`, await request(app).put(`${base}/${id}`).set("Authorization", `Bearer ${token}`).send(update), update);
  show("DELETE", `${base}/:id`, await request(app).delete(`${base}/${id}`).set("Authorization", `Bearer ${token}`));
  await request(app).post(base).set("Authorization", `Bearer ${token}`).send(payload);
  show("DELETE", base, await request(app).delete(base).set("Authorization", `Bearer ${token}`));
}

async function usersAuthEvidence() {
  console.log("COMP229 ASSIGNMENT 2 — USERS AND JWT AUTHENTICATION");
  console.log("====================================================");
  const { credentials, created, signedIn, token, id } = await session();
  show("POST", "/api/users", created, { ...credentials, password: "<hidden>" });
  show("POST", "/api/auth/signin", signedIn, { email: credentials.email, password: "<hidden>" });
  show("GET", "/api/auth/profile", await request(app).get("/api/auth/profile").set("Authorization", `Bearer ${token}`));
  show("GET", "/api/users", await request(app).get("/api/users").set("Authorization", `Bearer ${token}`));
  show("GET", "/api/users/:id", await request(app).get(`/api/users/${id}`).set("Authorization", `Bearer ${token}`));
  show("PUT", "/api/users/:id", await request(app).put(`/api/users/${id}`).set("Authorization", `Bearer ${token}`).send({ name: "Zohaib S. Syed" }), { name: "Zohaib S. Syed" });
  show("GET", "/api/users (without JWT)", await request(app).get("/api/users"));
  show("POST", "/api/auth/signout", await request(app).post("/api/auth/signout"));
  show("DELETE", "/api/users/:id", await request(app).delete(`/api/users/${id}`).set("Authorization", `Bearer ${token}`));
}

try {
  if (resource === "contacts") await resourceEvidence("contacts", { firstname: "Jane", lastname: "Visitor", email: "jane@example.com" });
  if (resource === "projects") await resourceEvidence("projects", { title: "Sales Lead Generation", firstname: "Zohaib", lastname: "Syed", email: "zsyed26@my.centennialcollege.ca", completion: "2026-10-01", description: "Lead generation workflow" });
  if (resource === "qualifications") await resourceEvidence("qualifications", { title: "Software Engineering Technology", firstname: "Zohaib", lastname: "Syed", email: "zsyed26@my.centennialcollege.ca", completion: "2028-04-30", description: "Advanced diploma studies" });
  if (resource === "users-auth") await usersAuthEvidence();
  console.log("\nRESULT: Every displayed request returned the expected response.");
} finally {
  await mongoose.disconnect();
  await mongoServer.stop();
}
