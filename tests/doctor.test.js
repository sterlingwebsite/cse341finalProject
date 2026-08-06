// tests/doctor.test.js
const request = require("supertest");
const express = require("express");
const doctorRoutes = require("../routes/doctors");
const Doctor = require("../models/Doctor");

process.env.NODE_ENV = "test";

const app = express();
app.use(express.json());
app.use("/doctors", doctorRoutes);

jest.mock("../models/Doctor");

describe("Doctors API - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /doctors should return all doctors", async () => {
    const mockDoctors = [
      {
        _id: "60d5ec854f1a253a4c8b4589",
        firstName: "Jane",
        lastName: "Smith",
        specialty: "Pediatrics",
        phone: "987-654-3210",
        email: "jane.smith@clinic.com",
      },
    ];

    Doctor.find = jest.fn().mockResolvedValue(mockDoctors);

    const res = await request(app).get("/doctors");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe("Jane");
    expect(res.body[0].specialty).toBe("Pediatrics");
  });

  it("GET /doctors/:id should return a specific doctor by id", async () => {
    const mockDoctor = {
      _id: "60d5ec854f1a253a4c8b4589",
      firstName: "Jane",
      lastName: "Smith",
      specialty: "Pediatrics",
      phone: "987-654-3210",
      email: "jane.smith@clinic.com",
    };

    Doctor.findById = jest.fn().mockResolvedValue(mockDoctor);

    const res = await request(app).get("/doctors/60d5ec854f1a253a4c8b4589");

    expect(res.statusCode).toEqual(200);
    expect(res.body.lastName).toBe("Smith");
    expect(res.body._id).toBe("60d5ec854f1a253a4c8b4589");
  });

  it("GET /doctors/:id should return 404 if doctor not found", async () => {
    Doctor.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/doctors/60d5ec854f1a253a4c8b45aa");

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("Doctor not found");
  });
});
