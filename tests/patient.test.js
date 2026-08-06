const request = require("supertest");
const express = require("express");
const patientRoutes = require("../routes/patients");
const Patient = require("../models/Patient");

process.env.NODE_ENV = "test";

const app = express();
app.use(express.json());
app.use("/patients", patientRoutes);

jest.mock("../models/Patient");

describe("Patients API - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /patients should return all patients", async () => {
    const mockPatients = [
      {
        _id: "60d5ec854f1a253a4c8b4567",
        firstName: "John",
        lastName: "Doe",
        birthDate: "1990-01-01T00:00:00.000Z",
        phone: "123-456-7890",
        email: "john@example.com",
        gender: "Male",
        emergencyContact: "Jane Doe - 555-0199",
      },
    ];

    Patient.find = jest.fn().mockResolvedValue(mockPatients);

    const res = await request(app).get("/patients");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe("John");
    expect(res.body[0].email).toBe("john@example.com");
  });

  it("GET /patients/:id should return a specific patient by id", async () => {
    const mockPatient = {
      _id: "60d5ec854f1a253a4c8b4567",
      firstName: "John",
      lastName: "Doe",
      birthDate: "1990-01-01T00:00:00.000Z",
      phone: "123-456-7890",
      email: "john@example.com",
      gender: "Male",
      emergencyContact: "Jane Doe - 555-0199",
    };

    Patient.findById = jest.fn().mockResolvedValue(mockPatient);

    const res = await request(app).get("/patients/60d5ec854f1a253a4c8b4567");

    expect(res.statusCode).toEqual(200);
    expect(res.body.lastName).toBe("Doe");
    expect(res.body._id).toBe("60d5ec854f1a253a4c8b4567");
  });

  it("GET /patients/:id should return 404 if patient not found", async () => {
    Patient.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/patients/60d5ec854f1a253a4c8b45bb");

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("Patient not found");
  });
});
