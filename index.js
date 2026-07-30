const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("./config/passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "temporary-local-secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const swaggerOptions = {
  swaggerOptions: {
    withCredentials: true,
  },
};

app.use(
  "/api-docs",
  (req, res, next) => {
    // #swagger.ignore = true
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

app.use("/patients", require("./routes/patients"));
app.use("/doctors", require("./routes/doctors"));
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(
        `Server running on port ${PORT}\nAPI Docs: http://localhost:${PORT}/api-docs`,
      ),
    );
  })
  .catch((err) => console.error("Database connection failed:", err));
