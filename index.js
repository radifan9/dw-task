// const express = require("require");
import express from "express";

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  const phoneNumber = "08511231234";
  res.render("contact", { phoneNumber });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
