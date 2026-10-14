import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "assignment-two-test-secret";

let app;
let mongoServer;
let token;
let userId;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), { dbName: "Portfolio" });
  ({ createApp: app } = await import("../server/app.js"));
  app = app();
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Portfolio API", () => {
  test("reports its health", async () => {
    const response = await request(app).get("/api/health").expect(200);
    assert.deepEqual(response.body, { status: "ok", service: "portfolio-api" });
  });

  test("creates a user without exposing the password", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "Zohaib Syed", email: "zsyed26@my.centennialcollege.ca", password: "Portfolio123!" })
      .expect(201);

    userId = response.body._id;
    assert.equal(response.body.name, "Zohaib Syed");
    assert.equal(response.body.password, undefined);
    assert.ok(response.body.created);
    assert.ok(response.body.updated);
  });

  test("rejects a protected request without a JWT", async () => {
    const response = await request(app).get("/api/users").expect(401);
    assert.match(response.body.error, /Authentication/);
  });

  test("signs in and returns a usable JWT", async () => {
    const response = await request(app)
      .post("/api/auth/signin")
      .send({ email: "zsyed26@my.centennialcollege.ca", password: "Portfolio123!" })
      .expect(200);

    token = response.body.token;
    assert.ok(token);
    assert.equal(response.body.user.password, undefined);

    const profile = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    assert.equal(profile.body._id, userId);
  });

  test("performs full contact CRUD and delete-all", async () => {
    const created = await request(app)
      .post("/api/contacts")
      .send({ firstname: "Ada", lastname: "Lovelace", email: "ada@example.com" })
      .expect(201);
    const id = created.body._id;

    await request(app).get(`/api/contacts/${id}`).set("Authorization", `Bearer ${token}`).expect(200);
    const updated = await request(app)
      .put(`/api/contacts/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ firstname: "Augusta" })
      .expect(200);
    assert.equal(updated.body.firstname, "Augusta");

    await request(app).delete(`/api/contacts/${id}`).set("Authorization", `Bearer ${token}`).expect(200);
    await request(app)
      .post("/api/contacts")
      .send({ firstname: "Grace", lastname: "Hopper", email: "grace@example.com" })
      .expect(201);
    const removed = await request(app)
      .delete("/api/contacts")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    assert.match(removed.body.message, /1 contact record/);
  });

  test("performs full project CRUD and delete-all", async () => {
    const payload = {
      title: "Custom AI Chatbot",
      firstname: "Zohaib",
      lastname: "Syed",
      email: "zsyed26@my.centennialcollege.ca",
      completion: "2026-10-01",
      description: "A website assistant that answers customer questions.",
    };
    const created = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(201);
    const id = created.body._id;

    const listed = await request(app).get("/api/projects").expect(200);
    assert.equal(listed.body.length, 1);
    await request(app).get(`/api/projects/${id}`).expect(200);
    const updated = await request(app)
      .put(`/api/projects/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "An updated AI assistant description." })
      .expect(200);
    assert.match(updated.body.description, /updated/);

    await request(app).delete(`/api/projects/${id}`).set("Authorization", `Bearer ${token}`).expect(200);
    await request(app).post("/api/projects").set("Authorization", `Bearer ${token}`).send(payload).expect(201);
    await request(app).delete("/api/projects").set("Authorization", `Bearer ${token}`).expect(200);
  });

  test("performs full qualification CRUD and delete-all", async () => {
    const payload = {
      title: "Software Engineering Technology",
      firstname: "Zohaib",
      lastname: "Syed",
      email: "zsyed26@my.centennialcollege.ca",
      completion: "2028-04-30",
      description: "Advanced diploma studies at Centennial College.",
    };
    const created = await request(app)
      .post("/api/qualifications")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(201);
    const id = created.body._id;

    await request(app).get("/api/qualifications").expect(200);
    await request(app).get(`/api/qualifications/${id}`).expect(200);
    await request(app)
      .put(`/api/qualifications/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Software Engineering Technology (Advanced Diploma)" })
      .expect(200);
    await request(app).delete(`/api/qualifications/${id}`).set("Authorization", `Bearer ${token}`).expect(200);
    await request(app).post("/api/qualifications").set("Authorization", `Bearer ${token}`).send(payload).expect(201);
    await request(app).delete("/api/qualifications").set("Authorization", `Bearer ${token}`).expect(200);
  });

  test("reads, updates, lists, and deletes users through protected routes", async () => {
    const read = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    assert.equal(read.body.password, undefined);

    const updated = await request(app)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Zohaib (Zo) Syed" })
      .expect(200);
    assert.equal(updated.body.name, "Zohaib (Zo) Syed");

    const listed = await request(app).get("/api/users").set("Authorization", `Bearer ${token}`).expect(200);
    assert.equal(listed.body.length, 1);
    assert.equal(listed.body[0].password, undefined);

    await request(app).delete(`/api/users/${userId}`).set("Authorization", `Bearer ${token}`).expect(200);
  });
});
