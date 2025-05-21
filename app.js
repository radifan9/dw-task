import express from "express";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

// Data
let visitors = [];
let projects = [];

// Add 1 projects for ez dev
projects.push({
  name: "DumbWays Web App",
  durationLabel: "7 month",
  yearEnd: 2025,
  startDate: "29 Apr 2025",
  endDate: "20 Nov 2025",
  description:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto iste illo facilis itaque dolore saepe molestias tenetur, nihil repellat ipsum! Hic harum expedita illum doloremque quasi dolore vero incidunt amet ex, velit dolorum nobis porro iste quibusdam architecto rem repellat, perspiciatis repellendus non excepturi omnis? Delectus ex quos fugiat consequuntur? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero nulla porro earum dolorem amet, expedita consequatur voluptatem aperiam atque mollitia sequi sed id laboriosam officia ullam. Quas obcaecati maxime temporibus eaque unde eius laboriosam aperiam perspiciatis, modi nisi pariatur ex nobis distinctio consectetur sunt ipsa corrupti nulla quidem. Ipsam, eum.",
  techStack: { nodejs: false, reactjs: false, nextjs: true, typescript: true },
  image: "https://picsum.photos/400/300",
});

// Express setup
app.set("view engine", "hbs");
app.set("views", "src/views");

// Static files & middleware
app.use("/assets", express.static("src/assets"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials(path.join(__dirname, "src/views/partials"));
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});

// Utility function
function getDateLabel(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedStart = dateFormatter.format(start);
  const formattedEnd = dateFormatter.format(end);

  console.log(start);
  console.log(end);

  const yearDiff = end.getFullYear() - start.getFullYear();
  const yearEnd = end.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Return 2 data (diff & yearEnd), wrap in 1 object
  // if (yearDiff >= 1) {
  //   return { diff: `${yearDiff} tahun`, yearEnd };
  // } else if (monthDiff >= 1) {
  //   return { diff: `${monthDiff} bulan`, yearEnd };
  // } else {
  //   return { diff: `${dayDiff} hari`, yearEnd };
  // }
  return {
    diff:
      yearDiff >= 1
        ? `${yearDiff} year`
        : monthDiff >= 1
        ? `${monthDiff} month`
        : `${dayDiff} day`,
    yearEnd,
    startDate: formattedStart,
    endDate: formattedEnd,
  };
}

// --- Route Handlers
// index
const renderIndex = (req, res) => {
  res.render("index", { path: "/" });
};

// contact
const renderContact = (req, res) => {
  res.render("contact", { path: "/contact" });
};

const handleSubmitContact = (req, res) => {
  const { name, email, phoneNumber, subject, yourMessage: message } = req.body;

  const visitor = {
    name,
    email,
    phoneNumber,
    subject,
    message,
  };

  visitors.push(visitor);
  console.log("Berhasil submit");
  res.redirect("/contact");
};

// project
const renderProject = (req, res) => {
  res.render("project", {
    projects,
    path: "/project",
  });
};

const handleSubmitProject = (req, res) => {
  const { name, start, end, description, nodejs, reactjs, nextjs, typescript } =
    req.body;

  const { diff, yearEnd, startDate, endDate } = getDateLabel(start, end);

  const project = {
    name,
    durationLabel: diff,
    yearEnd,
    startDate,
    endDate,
    description,
    techStack: {
      nodejs: nodejs === "" ? true : false,
      reactjs: reactjs === "" ? true : false,
      nextjs: nextjs === "" ? true : false,
      typescript: typescript === "" ? true : false,
    },
    image: "https://picsum.photos/300/300",
  };

  projects.push(project);
  console.log(projects);
  res.redirect("/project");
};

// project detail
const renderProjectDetail = (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find((_, index) => index === id);

  if (!project) {
    return res.send("Project not found!");
  }

  // Changed to match the project list path
  res.render("project-detail", {
    project,
    path: "/project",
  });
};

// Routes
app.route("/").get(renderIndex);
app.route("/contact").get(renderContact).post(handleSubmitContact);
app.route("/project").get(renderProject).post(handleSubmitProject);
app.route("/project/:id").get(renderProjectDetail);

// Server
app.listen(port, () => {
  console.log(`App listening on http://127.0.0.1:${port}`);
});
