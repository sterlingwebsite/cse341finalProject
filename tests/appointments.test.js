const request = require("supertest");
const express = require("express");
const appointmentRoutes = require("../routes/appointments");
const Appointment = require("../models/Appointment");

process.env.NODE_ENV = "test";

const app = express();
app.use(express.json());
app.use("/appointments", appointmentRoutes);

jest.mock("../models/Appointment");

describe("Appointments API - Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /appointments should return all appointments", async () => {
    const mockAppointments = [
      { _id: "1", patientId: "60d5ec854f1a253a4c8b4567", doctorId: "60d5ec854f1a253a4c8b4589", appointmentDate: "2026-10-15T14:30:00.000Z", reason: "Annual physical examination", status: "Scheduled" },
    ];

    Appointment.find = jest.fn().mockResolvedValue(mockAppointments);

    const res = await request(app).get("/appointments");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].status).toBe("Scheduled");
  });

  it("GET /appointments should return an empty array when no appointments exist", async () => {
    Appointment.find = jest.fn().mockResolvedValue([]);

    const res = await request(app).get("/appointments");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(0);
  });

  it("GET /appointments/:id should return a single appointment", async () => {
    const mockAppointment = { _id: "1", patientId: "60d5ec854f1a253a4c8b4567", doctorId: "60d5ec854f1a253a4c8b4589", appointmentDate: "2026-10-15T14:30:00.000Z", reason: "Annual physical examination", status: "Scheduled" };

    Appointment.findById = jest.fn().mockResolvedValue(mockAppointment);

    const res = await request(app).get("/appointments/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("Scheduled");
  });

  it("GET /appointments/:id should return 404 when appointment not found", async () => {
    Appointment.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/appointments/999");

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("Appointment not found");
  });
});