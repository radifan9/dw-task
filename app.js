// 1. Import statements
import express from "express";
import { Pool } from "pg";
import morgan from "morgan";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";

// 2. Contants and Configuration
const TECHNOLOGIES = [
  // Add tech dynamically
  { name: "Node.js", icon: "node-js.svg", key: "nodejs" },
  { name: "React", icon: "react-js.svg", key: "reactjs" },
  { name: "Next.js", icon: "nextjs_icon_dark.svg", key: "nextjs" },
  { name: "TypeScript", icon: "typescript.svg", key: "typescript" },
  { name: "Tailwind", icon: "tailwindcss.svg", key: "tailwind" },
  { name: "Bootstrap", icon: "bootstrap.svg", key: "bootstrap" },
];

const CONFIG = {
  nodePort: 3000,
  database: {
    user: "postgres",
    password: "ms11drag00nsql",
    host: "localhost",
    port: 5432,
    database: "b61-personal-web",
  },
};

// 3. App Setup
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Pool(CONFIG.database);

// 4. Middleware Setup
app.set("view engine", "hbs");
app.set("views", "src/views");
app.use(morgan("dev"));
app.use("/assets", express.static("src/assets"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use(express.urlencoded({ extended: false }));
hbs.registerPartials(path.join(__dirname, "src/views/partials"));

// 5. Handlebars Helpers
// Equality comparison, return true if equal
hbs.registerHelper("eq", function (a, b) {
  return a === b;
});
// Lookup, return value at specified key from an object
hbs.registerHelper("lookup", function (obj, key) {
  return obj[key];
});

// 6. Utility Functions
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

// Transform snake_case to camelCase and parse tech_stack
function formatProject(projectsDB) {
  const formattedProjects = projectsDB.rows.map((project) => {
    const techStack = project.tech_stack;
    // Filter technologies based on techStack
    const technologies = TECHNOLOGIES.filter((tech) => techStack[tech.key]);

    return {
      id: project.id,
      name: project.name,
      durationLabel: project.duration_label,
      yearEnd: project.year_end,
      startDate: project.start_date,
      endDate: project.end_date,
      description: project.description,
      techStack,
      image: project.image_url,
      technologies,
    };
  });
  return formattedProjects;
}
// 7. Route Handlers
// index
const renderIndex = (req, res) => {
  res.render("index", {
    path: "/",
    title: "Personal Website",
    cssFiles: ["index.css", "footer.css"],
  });
};

// contact
const renderContact = (req, res) => {
  res.render("contact", {
    path: "/contact",
    title: "Contact Me",
    cssFiles: ["contact.css", "footer.css"],
  });
};

const handleSubmitContact = async (req, res) => {
  try {
    const { name, email, phoneNumber, subject, message } = req.body;

    // Input Validation
    if (!name || !email || !phoneNumber || !subject || !message) {
      return res.status(400).send("All fields are required");
    }

    // Parameterized values
    const query = {
      text: "INSERT INTO contact (name, email, phone_number, subject, message) VALUES ($1, $2, $3, $4, $5)",
      values: [name, email, phoneNumber, subject, message],
    };

    await db.query(query);
    console.log("Contact form submitted successfully");
    res.redirect("/contact");
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).send("Failed to submit form");
  }
};

// project
const renderProject = async (req, res) => {
  try {
    const projectsDB = await db.query("SELECT * FROM projects");
    const formattedProjects = formatProject(projectsDB);

    // Render view
    res.render("project", {
      projects: formattedProjects,
      technologies: TECHNOLOGIES, // Here we use TECHNOLOGIES for render all tech
      projectFilled: formattedProjects.length > 0,
      path: "/project",
      title: "My Project",
      cssFiles: ["project.css", "footer.css"],
    });
  } catch (error) {
    console.error("Error getting the projects from database: ", error);
    res.status(500).send("Error getting the projects");
  }
};

const handleSubmitProject = async (req, res) => {
  try {
    const { name, start, end, description } = req.body;
    const { diff, yearEnd, startDate, endDate } = getDateLabel(start, end);

    // Build techStack dynamically from TECHNOLOGIES,
    const techStack = TECHNOLOGIES.reduce(
      (stack, tech) => ({
        ...stack,
        // If checked = "" (empty string), if not checked = undefined
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

    const query = {
      text: "INSERT INTO projects (name, duration_label, year_end, start_date, end_date, description, tech_stack, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      values: [
        name,
        diff,
        yearEnd,
        startDate,
        endDate,
        description,
        JSON.stringify(techStack),
        "https://picsum.photos/400/300",
      ],
    };

    await db.query(query);
    console.log("Project submitted successfully");
    res.redirect("/project");
  } catch (error) {
    console.error("Error submitting project form:", error);
    res.status(200).send("Error submitting projects");
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      text: "DELETE FROM projects WHERE id = $1",
      values: [id],
    };

    await db.query(query);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// project-detail
const renderProjectDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projectsDB = await db.query("SELECT * FROM projects");
    const formattedProject = formatProject(projectsDB);

    const project = formattedProject.find((el) => el.id === id);
    if (project) {
      console.log(`project ${id} found!`);
    }

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
      cssFiles: ["project-detail"],
    });
  } catch (error) {
    console.error("Error getting the database:", error);
    res.status(500).send("Failed to get database");
  }
};

// 8. Routes
app.route("/").get(renderIndex);
app.route("/contact").get(renderContact).post(handleSubmitContact);
app.route("/project").get(renderProject).post(handleSubmitProject);
app.route("/project/:id").get(renderProjectDetail).delete(deleteProject);

// 9. Server Start
app.listen(CONFIG.nodePort, () => {
  console.log(`Server running on http://127.0.0.1:${CONFIG.nodePort}`);
});
