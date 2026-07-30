require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();
const os = require("os");

const isProduction = os.platform() === "linux";

const doc = {
  info: {
    title: "Clinic Management API",
    description: `API Authentication Hub. 
    
[👉 Click here to Login with GitHub](http://localhost:3000/auth/github) | [Logout](http://localhost:3000/auth/logout)`,
  },

  host: isProduction
    ? "cse341finalproject-mn1w.onrender.com"
    : "localhost:3000",
  schemes: isProduction ? ["https"] : ["http"],

  securityDefinitions: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "connect.sid",
      description:
        "1. Click the Login link above. 2. Authenticate. 3. Return here and your cookie is automatically attached!",
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
