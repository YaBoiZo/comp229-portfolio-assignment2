import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "assignment-two-evidence-secret";
process.env.DOTENV_CONFIG_QUIET = "true";

const group = process.argv[2] ?? "all";
const allowedGroups = new Set(["auth-users", "contacts-projects", "qualifications", "all"]);

if (!allowedGroups.has(group)) {
  console.error("Use: node scripts/api-evidence.mjs [auth-users|contacts-projects|qualifications|all]");
  process.exit(1);
}

const mongoServer = await MongoMemoryServer.create();
await mongoose.connect(mongoServer.getUri(), { dbName: "Portfolio" });
const { createApp } = await import("../server/app.js");
const app = createApp();

let passed = 0;

function result(method, path, response, expected = 200) {
  if (response.status !== expected) {
    throw new Error(`${method} ${path}: expected ${expected}, received ${response.status}`);
  }
  passed += 1;
  console.log(`PASS  ${String(response.status).padEnd(3)}  ${method.padEnd(6)} ${path}`);
  return response;
}

async function createSession() {
  const email = `zohaib.${Date.now()}@example.com`;
  const created = await request(app)
    .post("/api/users")
    .send({ name: "Zohaib Syed", email, password: "Portfolio123!" });
  result("POST", "/api/users", created, 201);

  const signedIn = await request(app)
    .post("/api/auth/signin")
    .send({ email, password: "Portfolio123!" });
  result("POST", "/api/auth/signin", signedIn);
  return { token: signedIn.body.token, userId: created.body._id };
}

async function authUsersEvidence() {
  console.log("COMP229 ASSIGNMENT 2 - AUTHENTICATION AND USER ROUTES");
  console.log("------------------------------------------------------");
  const { token, userId } = await createSession();

  result("GET", "/api/auth/profile", await request(app).get("/api/auth/profile").set("Authorization", `Bearer ${token}`));
  result("GET", "/api/users", await request(app).get("/api/users").set("Authorization", `Bearer ${token}`));
  result("GET", "/api/users/:id", await request(app).get(`/api/users/${userId}`).set("Authorization", `Bearer ${token}`));
  result("PUT", "/api/users/:id", await request(app).put(`/api/users/${userId}`).set("Authorization", `Bearer ${token}`).send({ name: "Zohaib Syed" }));
  result("GET", "/api/users (no JWT)", await request(app).get("/api/users"), 401);
  result("POST", "/api/auth/signout", await request(app).post("/api/auth/signout"));
  result("DELETE", "/api/users/:id", await request(app).delete(`/api/users/${userId}`).set("Authorization", `Bearer ${token}`));
}

async function resourceCrud(resource, payload, token) {
  const base = `/api/${resource}`;
  const created = result("POST", base, await request(app).post(base).set("Authorization", `Bearer ${token}`).send(payload), 201);
  const id = created.body._id;
  result("GET", base, await request(app).get(base).set("Authorization", `Bearer ${token}`));
  result("GET", `${base}/:id`, await request(app).get(`${base}/${id}`).set("Authorization", `Bearer ${token}`));
  result("PUT", `${base}/:id`, await request(app).put(`${base}/${id}`).set("Authorization", `Bearer ${token}`).send({ description: `${payload.description ?? resource} updated` }));
  result("DELETE", `${base}/:id`, await request(app).delete(`${base}/${id}`).set("Authorization", `Bearer ${token}`));
  await request(app).post(base).set("Authorization", `Bearer ${token}`).send(payload);
  result("DELETE", base, await request(app).delete(base).set("Authorization", `Bearer ${token}`));
}

async function contactsAndProjectsEvidence() {
  console.log("COMP229 ASSIGNMENT 2 - CONTACT AND PROJECT CRUD");
  console.log("-------------------------------------------------");
  const { token } = await createSession();

  const contactBase = "/api/contacts";
  const contact = result("POST", contactBase, await request(app).post(contactBase).send({ firstname: "Jane", lastname: "Visitor", email: "jane@example.com" }), 201);
  result("GET", contactBase, await request(app).get(contactBase).set("Authorization", `Bearer ${token}`));
  result("GET", `${contactBase}/:id`, await request(app).get(`${contactBase}/${contact.body._id}`).set("Authorization", `Bearer ${token}`));
  result("PUT", `${contactBase}/:id`, await request(app).put(`${contactBase}/${contact.body._id}`).set("Authorization", `Bearer ${token}`).send({ firstname: "Janet" }));
  result("DELETE", `${contactBase}/:id`, await request(app).delete(`${contactBase}/${contact.body._id}`).set("Authorization", `Bearer ${token}`));
  await request(app).post(contactBase).send({ firstname: "Alan", lastname: "Turing", email: "alan@example.com" });
  result("DELETE", contactBase, await request(app).delete(contactBase).set("Authorization", `Bearer ${token}`));

  await resourceCrud("projects", {
    title: "Sales Lead Generation",
    firstname: "Zohaib",
    lastname: "Syed",
    email: "zsyed26@my.centennialcollege.ca",
    completion: "2026-10-01",
    description: "Lead generation workflow",
  }, token);
}

async function qualificationsEvidence() {
  console.log("COMP229 ASSIGNMENT 2 - QUALIFICATION CRUD");
  console.log("------------------------------------------");
  const { token } = await createSession();
  await resourceCrud("qualifications", {
    title: "Software Engineering Technology",
    firstname: "Zohaib",
    lastname: "Syed",
    email: "zsyed26@my.centennialcollege.ca",
    completion: "2028-04-30",
    description: "Advanced diploma studies at Centennial College",
  }, token);
}

try {
  if (group === "auth-users" || group === "all") await authUsersEvidence();
  if (group === "contacts-projects" || group === "all") await contactsAndProjectsEvidence();
  if (group === "qualifications" || group === "all") await qualificationsEvidence();
  console.log("------------------------------------------------------");
  console.log(`RESULT: ${passed} API checks passed; 0 failed.`);
} finally {
  await mongoose.disconnect();
  await mongoServer.stop();
}
