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
      { _id: "1", firstName: "John", lastName: "Doe", birthDate: "1990-01-01", phone: "123-456-7890", email: "john@example.com" },
    ];

    Patient.find = jest.fn().mockResolvedValue(mockPatients);

    const res = await request(app).get("/patients");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe("John");
  });

  it("GET /patients should return an empty array when no patients exist", async () => {
    Patient.find = jest.fn().mockResolvedValue([]);

    const res = await request(app).get("/patients");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(0);
  });

  it("GET /patients/:id should return a single patient", async () => {
    const mockPatient = { _id: "1", firstName: "John", lastName: "Doe", birthDate: "1990-01-01", phone: "123-456-7890", email: "john@example.com" };

    Patient.findById = jest.fn().mockResolvedValue(mockPatient);

    const res = await request(app).get("/patients/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toBe("John");
  });

  it("GET /patients/:id should return 404 when patient not found", async () => {
    Patient.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/patients/999");

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("Patient not found");
  });
});