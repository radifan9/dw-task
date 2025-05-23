import express from "express";
import { Pool } from "pg";
import morgan from "morgan";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
// import { title } from "process";

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const db = new Pool({
  user: "postgres",
  password: "ms11drag00nsql",
  host: "localhost",
  port: 5432,
  database: "b61-personal-web",
});

// Data & Constants
let visitors = [];
let projects = [];
let projectFilled;
const TECHNOLOGIES = [
  // Add tech dynamically
  { name: "Node.js", icon: "node-js.svg", key: "nodejs" },
  { name: "React", icon: "react-js.svg", key: "reactjs" },
  { name: "Next.js", icon: "nextjs_icon_dark.svg", key: "nextjs" },
  { name: "TypeScript", icon: "typescript.svg", key: "typescript" },
  { name: "Tailwind", icon: "tailwindcss.svg", key: "tailwind" },
  { name: "Bootstrap", icon: "bootstrap.svg", key: "bootstrap" },
];

// Add 2 project for ez development process
projects.push({
  name: "DumbWays Web App",
  durationLabel: "7 month",
  yearEnd: 2025,
  startDate: "29 Apr 2025",
  endDate: "20 Nov 2025",
  description:
    "App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download.",
  techStack: { nodejs: true, reactjs: true, nextjs: true, typescript: true },
  image: "/assets/images/gameboy.webp",
});

projects.push({
  name: "AirBNB",
  durationLabel: "1 year",
  yearEnd: 2026,
  startDate: "29 Apr 2025",
  endDate: "29 Apr 2026",
  description:
    "Airbnb adalah sebuah platform online yang memungkinkan orang untuk menyewakan atau memesan tempat menginap—mulai dari kamar di rumah pribadi, apartemen, vila, hingga penginapan unik seperti rumah pohon atau kapal.",
  techStack: { nodejs: true, reactjs: true, typescript: true, tailwind: true },
  image: "/assets/images/airbnb.png",
});

// Boolean indicator, true = if there is a project
projectFilled = projects.length > 0;

// Express setup
app.set("view engine", "hbs");
app.set("views", "src/views");

// Static files, middleware, helper
app.use(morgan("dev"));
app.use("/assets", express.static("src/assets"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials(path.join(__dirname, "src/views/partials"));
// Equality comparison, return true if equal
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});
// Lookup, return value at specified key from an object
hbs.registerHelper("lookup", function (obj, key) {
  return obj[key];
});

// Utility Function
function getDateLabel(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Target output: 29 Apr 2025
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

// --- Route Handlers ---
// index
const renderIndex = (req, res) => {
  res.render("index", {
    path: "/",
    title: "Personal Website",
    cssFile: "index",
  });
};

// contact
const renderContact = (req, res) => {
  res.render("contact", {
    path: "/contact",
    title: "Contact Me",
    cssFile: "contact",
  });
};

const handleSubmitContact = async (req, res) => {
  try {
    const { name, email, phoneNumber, subject, message } = req.body;
    const query = {
      text: "INSERT INTO contact (name, email, phone_number, subject, message) VALUES ($1, $2, $3, $4, $5)",
      values: [name, email, phoneNumber, subject, message],
    };

    await db.query(query);
    console.log("Contact form submitted successfully");
    res.redirect("/contact");
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).send("Error submitting form");
  }
};

// project
const renderProject = (req, res) => {
  // Map projects to include technologies array
  const projectsWithTech = projects.map((project) => {
    const technologies = TECHNOLOGIES.filter(
      (tech) => project.techStack[tech.key]
    );
    return { ...project, technologies };
  });

  res.render("project", {
    projects: projectsWithTech,
    technologies: TECHNOLOGIES,
    projectFilled,
    path: "/project",
    title: "My Project",
    cssFile: "project",
  });
};

const handleSubmitProject = async (req, res) => {
  try {
    const { name, start, end, description } = req.body;
    const { diff, yearEnd, startDate, endDate } = getDateLabel(start, end);

    // Build techStack dynamically from TECHNOLOGIES
    const techStack = TECHNOLOGIES.reduce(
      (stack, tech) => ({
        ...stack,
        [tech.key]: req.body[tech.key] === "",
      }),
      {}
    );

    const project = {
      name,
      durationLabel: diff,
      yearEnd,
      startDate,
      endDate,
      description,
      techStack,
      image: "https://picsum.photos/400/300",
    };

    // projects.push(project);

    const query = {
      text: "INSERT INTO projects (name, duration_label, year_end, start_date, end_date, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      values: [
        name,
        diff,
        yearEnd,
        startDate,
        endDate,
        description,
        "https://picsum.photos/400/300",
      ],
    };

    await db.query(query);
    console.log("Project submitted successfully");

    projectFilled = projects.length > 0;
    console.log(projects);
    res.redirect("/project");
  } catch (error) {
    console.error("Error submitting project form:", error);
    res.status(200).send("Error submitting projects");
  }
};

// project-detail
const renderProjectDetail = (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find((_, index) => index === id);

  // Redirect if project not found
  if (!project) {
    return res.redirect("/project");
  }

  // Use this object to store tech name, icon name
  const technologies = TECHNOLOGIES.filter(
    // Pass(lolos filter) if project with key correspond to value 'true'
    (tech) => project.techStack[tech.key]
  );

  res.render("project-detail", {
    project: { ...project, technologies },
    path: "/project",
    title: `${project.name} | Project Detail`,
    cssFile: "project-detail",
  });
};

// Routes
app.route("/").get(renderIndex);
app.route("/contact").get(renderContact).post(handleSubmitContact);
app.route("/project").get(renderProject).post(handleSubmitProject);
app.route("/project/:id").get(renderProjectDetail);

// Server
app.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`);
});
