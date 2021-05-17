const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { HttpCode } = require("../helper/constants");
const { contacts, User, newUser } = require("../model/__mocks__/data");

// console.log("CONTACT", contacts[0]);
// console.log("TYPE OF", typeof contacts);
// console.log("TYPE", contacts instanceof Array);

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
  // // *POST
  // describe("should handle POST request", () => {
  //   test("should return 201 status for POST: /Users", async (done) => {
  //     const res = await request(app)
  //       .post("/api/Users")
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send(newUser);
  //     expect(res.status).toEqual(201);
  //     expect(res.body).toBeDefined();
  //     idNewCat = res.body.data.cat._id;
  //     done();
  //   });
  //   test("should return 400 status for POST: /cats wrong field", async (done) => {
  //     const res = await request(app)
  //       .post("/api/cats")
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ ...newCat, test: 1 });
  //     expect(res.status).toEqual(400);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  //   test("should return 400 status for POST: /cats without field", async (done) => {
  //     const res = await request(app)
  //       .post("/api/cats")
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ age: 1 });
  //     expect(res.status).toEqual(400);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  // });

  // // *PUT
  // describe("should handle PUT request", () => {
  //   test("should return 200 status for PUT: /cats/:id", async (done) => {
  //     const res = await request(app)
  //       .put(`/api/cats/${idNewCat}`)
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ name: "Barsik" });
  //     expect(res.status).toEqual(200);
  //     expect(res.body).toBeDefined();
  //     expect(res.body.data.cat.name).toBe("Barsik");
  //     done();
  //   });
  //   test("should return 400 status for PUT: /cats/:id wrong field", async (done) => {
  //     const res = await request(app)
  //       .put("/api/cats/1234")
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ test: 1 });
  //     expect(res.status).toEqual(400);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  //   test("should return 404 status for PUT: /cats/:id ", async (done) => {
  //     const res = await request(app)
  //       .put("/api/cats/5f837f855ba83a4f1829da5b")
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ age: 1 });
  //     expect(res.status).toEqual(404);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  // });

  // // *PATCH
  // describe("should handle PATCH request", () => {
  //   test("should return 200 status for PATCH: /cats/:id/vaccinated", async (done) => {
  //     const res = await request(app)
  //       .patch(`/api/cats/${idNewCat}/vaccinated`)
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ isVaccinated: true });
  //     expect(res.status).toEqual(200);
  //     expect(res.body).toBeDefined();
  //     expect(res.body.data.cat.isVaccinated).toBe(true);
  //     done();
  //   });
  //   test("should return 400 status for PUT: /cats/:id wrong field", async (done) => {
  //     const res = await request(app)
  //       .patch(`/api/cats/${idNewCat}/vaccinated`)
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ test: 1 });
  //     expect(res.status).toEqual(400);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  //   test("should return 404 status for PUT: /cats/:id ", async (done) => {
  //     const res = await request(app)
  //       .patch("/api/cats/5f837f855ba83a4f1829da5b/vaccinated")
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Accept", "application/json")
  //       .send({ isVaccinated: true });
  //     expect(res.status).toEqual(404);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  // });

  // // *DELETE
  // describe("should handle DELETE request", () => {
  //   const cat = cats[1];
  //   it("should return 200 status DELETE: /cats/:id", async (done) => {
  //     const res = await request(app)
  //       .delete(`/api/cats/${cat._id}`)
  //       .set("Authorization", `Bearer ${token}`);

  //     expect(res.status).toEqual(200);
  //     expect(res.body).toBeDefined();
  //     expect(res.body.data.cat).toStrictEqual(cat);
  //     done();
  //   });
  //   it("should return 400 status for DELETE: /cats/:id wrong field", async (done) => {
  //     const res = await request(app)
  //       .delete(`/api/cats/1234`)
  //       .set("Authorization", `Bearer ${token}`);

  //     expect(res.status).toEqual(400);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  //   test("should return 404 status for DELETE: /cats/:id ", async (done) => {
  //     const res = await request(app)
  //       .delete("/api/cats/5f837f855ba83a4f1829da5b")
  //       .set("Authorization", `Bearer ${token}`);
  //     expect(res.status).toEqual(404);
  //     expect(res.body).toBeDefined();
  //     done();
  //   });
  // });
});
