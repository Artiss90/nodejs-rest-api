const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const boolParser = require("express-query-boolean");

const contactsRouter = require("./routes/contacts");
const usersRouter = require("./routes/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(429).json({
      status: "error",
      code: 429,
      message: "Too Many Requests",
    });
  },
});

app.use(helmet());
app.get("env") !== "test" && app.use(logger(formatsLogger));
app.use(express.static("public"));
app.use(limiter);
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json({ limit: 100000 }));
app.use(boolParser());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    status: status === 500 ? "fail" : "error",
    code: status,
    message: err.message,
  });
});

module.exports = app;
