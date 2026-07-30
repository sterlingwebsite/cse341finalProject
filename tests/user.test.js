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
});
