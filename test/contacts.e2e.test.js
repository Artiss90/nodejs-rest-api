const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
// const { HttpCode } = require("../helper/constants");
const { User } = require("../model/__mocks__/data");
const { contacts } = require("../model/__mocks__/data");
console.log("🚀 ~ file: contacts.e2e.test.js ~ line 7 ~ contacts", contacts);

require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const issueToken = (payload, secret) => jwt.sign(payload, secret);
const token = issueToken({ id: User.id }, JWT_SECRET_KEY);
User.token = token;

jest.mock("../model/contacts");
jest.mock("../model/users");

describe("Testing the route api/contacts", () => {
  let idNewContact = null;
  describe("should handle GET request", () => {
    test("should return 200 status for GET: /contacts", async (done) => {
      const res = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
      done();
    });
    // test("should return 200 status for GET: /contacts/:id", async (done) => {
    //   const contact = contacts[0];
    //   const res = await request(app)
    //     .get(`/api/contacts/${contact._id}`)
    //     .set("Authorization", `Bearer ${token}`);
    //   expect(res.status).toEqual(200);
    //   expect(res.body).toBeDefined();
    //   expect(res.body.data.contact._id).toBe(contact._id);
    //   done();
    // });
    // test("should return 404 status for GET: /contacts/:id", async (done) => {
    //   const res = await request(app)
    //     .get(`/api/contacts/5f837f855ba83a4f1829da5b`)
    //     .set("Authorization", `Bearer ${token}`);
    //   expect(res.status).toEqual(404);
    //   expect(res.body).toBeDefined();
    //   done();
    // });
    // test("should return 400 status for GET: /contacts/:id", async (done) => {
    //   const res = await request(app)
    //     .get(`/api/contacts/5f837f855ba83a4f1825b`)
    //     .set("Authorization", `Bearer ${token}`);
    //   expect(res.status).toEqual(400);
    //   expect(res.body).toBeDefined();
    //   done();
    // });
  });
});
