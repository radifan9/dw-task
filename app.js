import express from "express";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let visitors = [];

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));

// Register partials
hbs.registerPartials(path.join(__dirname, "src/views/partials"));

// Middleware
app.use(express.urlencoded({ extended: false }));
// app.use(express.json()));
// urlencoded vs json

// index
const renderIndex = (req, res) => {
  res.render("index", { title: "Home" });
};

// contact
const renderContact = (req, res) => {
  res.render("contact");
};

const handleSubmit = (req, res) => {
  const { name, email, phoneNumber, subject, yourMessage } = req.body;

  const visitor = {
    name,
    email,
    phoneNumber,
    subject,
    yourMessage,
  };

  //

  visitors.push(visitor);
  console.log("Berhasil submit");
  res.redirect("/contact");
};

// project
const renderProject = (req, res) => {
  res.render("project");
};

// Route handler
app.route("/").get(renderIndex);
app.route("/contact").get(renderContact).post(handleSubmit);
app.route("/project").get(renderProject);

app.listen(port, () => {
  console.log(`App listening on http://127.0.0.1:${port}`);
});
