const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.end("you are blessed that you are able to SEE this");
});

app.get("/liveness_check", (req, res) => {
  res.end("Yes");
});
app.get("/readiness_check", (req, res) => {
  res.end("Yes");
});

app.listen(PORT, () => {
  console.log(`Mock Service listening on Port ${PORT}`);
});
