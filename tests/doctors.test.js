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
      { _id: "1", firstName: "Jane", lastName: "Smith", specialty: "Pediatrics", phone: "987-654-3210", email: "jane.smith@clinic.com" },
    ];

    Doctor.find = jest.fn().mockResolvedValue(mockDoctors);

    const res = await request(app).get("/doctors");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].firstName).toBe("Jane");
  });

  it("GET /doctors should return an empty array when no doctors exist", async () => {
    Doctor.find = jest.fn().mockResolvedValue([]);

    const res = await request(app).get("/doctors");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(0);
  });

  it("GET /doctors/:id should return a single doctor", async () => {
    const mockDoctor = { _id: "1", firstName: "Jane", lastName: "Smith", specialty: "Pediatrics", phone: "987-654-3210", email: "jane.smith@clinic.com" };

    Doctor.findById = jest.fn().mockResolvedValue(mockDoctor);

    const res = await request(app).get("/doctors/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body.firstName).toBe("Jane");
  });

  it("GET /doctors/:id should return 404 when doctor not found", async () => {
    Doctor.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/doctors/999");

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("Doctor not found");
  });
});