const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { router } = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api", router);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://${HOST}:${PORT}`);
});