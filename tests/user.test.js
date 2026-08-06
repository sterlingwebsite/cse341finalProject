// tests/user.test.js
const request = require("supertest");
const express = require("express");
const userRoutes = require("../routes/users");
const User = require("../models/User");

process.env.NODE_ENV = "test";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);

jest.mock("../models/User");

describe("Users API - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /users should return all users", async () => {
    const mockUsers = [
      { _id: "1", name: "Sterling", email: "sterling@test.com", role: "admin" },
    ];

    User.find = jest.fn().mockResolvedValue(mockUsers);

    const res = await request(app).get("/users");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Sterling");
  });

  it("GET /users/:id should return a specific user by id", async () => {
    const mockUser = {
      _id: "1",
      name: "Sterling",
      email: "sterling@test.com",
      role: "admin",
    };

    User.findById = jest.fn().mockResolvedValue(mockUser);

    const res = await request(app).get("/users/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("Sterling");
    expect(res.body._id).toBe("1");
  });

  it("GET /users/:id should return 404 if user does not exist", async () => {
    User.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/users/999");

    expect(res.statusCode).toEqual(404);
  });
});
