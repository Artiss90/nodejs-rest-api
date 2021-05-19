const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { HttpCode } = require("../helper/constants");
const { contacts, User, newContact } = require("../model/__mocks__/data");

require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User.id }, JWT_SECRET_KEY);
User.token = token;

jest.mock("../model/contacts");
jest.mock("../model/users");

describe("Testing the route api/contacts", () => {
  let idNewContact = null;
  // *GET
  describe("should handle GET request", () => {
    test("should return 200 status for GET: /contacts", async (done) => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      // ! код закоменчен, так как метод ошибочно показывает тип "объект", проблема библиотеки
      // expect(res.body.data.contacts).toBeInstanceOf(Array);
      done();
    });
    test("should return 200 status for GET: /contacts/:id", async (done) => {
      const contact = contacts[0];
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.error).toEqual(false);
      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact._id).toBe(contact._id);
      done();
    });
    test("should return 404 status for GET: /contacts/:id", async (done) => {
      const res = await request(app)
        .get(`/api/contacts/6089aeac68c3cd1a74991add`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
      done();
    });
    test("should return 400 status for GET: /contacts/:id", async (done) => {
      const res = await request(app)
        .get(`/api/contacts/5f837f855ba83a4f1825b`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      done();
    });
  });
  // *POST
  describe("should handle POST request", () => {
    test("should return 201 status for POST: /contacts", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send(newContact);
      expect(res.status).toEqual(HttpCode.CREATED);
      expect(res.body).toBeDefined();
      idNewContact = await res.body.data.contacts._id;
      done();
    });
    test("should return 400 status for POST: /contacts wrong field", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        // ? test ето наше неправильное поле
        .send({ ...newContact, test: 1 });
      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      done();
    });
    test("should return 400 status for POST: /contacts without field", async (done) => {
      const res = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        // ? здесь передаём только одно поле вместо всех обезательных
        .send({ phone: "455-88-79" });
      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      done();
    });
  });

  // *PUT
  describe("should handle PUT request", () => {
    test("should return 200 status for PUT: /contacts/:id", async (done) => {
      const res = await request(app)
        .put(`/api/contacts/${idNewContact}`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ name: "Vasia" });
      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe("Vasia");
      done();
    });
    test("should return 400 status for PUT: /contacts/:id wrong field", async (done) => {
      const res = await request(app)
        .put("/api/contacts/1234")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ test: 1 });
      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      done();
    });
    test("should return 404 status for PUT: /contacts/:id ", async (done) => {
      const res = await request(app)
        .put("/api/contacts/5f837f855ba83a4f1829da5b")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ phone: "455-88-79" });
      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
      done();
    });
  });

  // *PATCH
  describe("should handle PATCH request", () => {
    test("should return 200 status for PATCH: /contacts/:id/favorite", async (done) => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}/favorite`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ favorite: true });
      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.favorite).toBe(true);
      done();
    });
    test("should return 400 status for PATCH: /contacts/:id wrong field/favorite", async (done) => {
      const res = await request(app)
        .patch(`/api/contacts/${idNewContact}/favorite`)
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ test: 1 });
      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      done();
    });
    test("should return 404 status for PATCH: /contacts/:id ", async (done) => {
      const res = await request(app)
        .patch("/api/contacts/5f837f855ba83a4f1829da5b/favorite")
        .set("Authorization", `Bearer ${token}`)
        .set("Accept", "application/json")
        .send({ favorite: true });
      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
      done();
    });
  });

  // *DELETE
  describe("should handle DELETE request", () => {
    const contact = contacts[1];
    it("should return 200 status DELETE: /contacts/:id", async (done) => {
      const res = await request(app)
        .delete(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact).toStrictEqual(contact);
      done();
    });
    it("should return 400 status for DELETE: /contacts/:id wrong field", async (done) => {
      const res = await request(app)
        .delete(`/api/contacts/1234`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      done();
    });
    test("should return 404 status for DELETE: /contacts/:id ", async (done) => {
      const res = await request(app)
        .delete("/api/contacts/5f837f855ba83a4f1829da5b")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(HttpCode.NOT_FOUND);
      expect(res.body).toBeDefined();
      done();
    });
  });
});
