"use strict";

const projects = [];

function getDateDifference(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get difference in years
  const yearDiff = end.getFullYear() - start.getFullYear();

  // Get difference in months
  const monthDiff = end.getMonth() - start.getMonth();

  // Get difference in days
  const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (yearDiff >= 1) {
    return `${yearDiff} tahun`;
  } else if (monthDiff >= 1) {
    return `${monthDiff} bulan`;
  } else {
    return `${dayDiff} hari`;
  }
}

function getData(e) {
  // Prevent reload
  e.preventDefault();

  // Get value, checked, image from DOM
  const projectName = document.getElementById("project-name").value;
  const startDate = Date.parse(document.getElementById("start-date").value);
  const endDate = Date.parse(document.getElementById("end-date").value);
  const nodejs = document.getElementById("nodejs").checked;
  const reactjs = document.getElementById("reactjs").checked;
  const nextjs = document.getElementById("nextjs").checked;
  const typescript = document.getElementById("typescript").checked;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("project-image");
  const file = imageInput.files[0];

  // Get duration of the project
  const labelDurasi = getDateDifference(startDate, endDate);

  // If there's empty form, alert visitor
  if (!projectName || !description || !file) {
    alert(
      "Please complete all fields before submitting:\n\n" +
        (!projectName ? "- Project Name is required\n" : "") +
        (!description ? "- Description is required\n" : "") +
        (!file ? "- Image file is required\n" : "")
    );
    return;
  }

  // Use FileReader to read image as data URL
  const reader = new FileReader();
  reader.onload = function (event) {
    const imgSrc = event.target.result;

    projects.push({
      projectName,
      labelDurasi,
      description,
      nodejs,
      reactjs,
      nextjs,
      typescript,
      img: { src: imgSrc },
    });

    // Clear all form fields
    document.getElementById("project-name").value = "";

    // Render project cards
    renderCards();

    // Check if the heading already exists
    if (!document.getElementById("my-project-heading")) {
      const heading = document.createElement("h2");
      heading.textContent = "My Project";
      heading.id = "my-project-heading";
      heading.className =
        "mt-5 text-uppercase fw-bold text-center h-my-project"; // Bootstrap margin-top

      const cardContainer = document.getElementById("cardContainer");

      // Insert the heading before the cardContainer
      cardContainer.parentNode.insertBefore(heading, cardContainer);
    }
  };

  reader.readAsDataURL(file); // This triggers reader.onload when complete
}

function renderCards() {
  cardContainer.innerHTML = projects
    .map(
      (project) =>
        `
          <div class="col">
            <div class="card shadow">
              <div class="container mt-2">
                <img
                  src="${project.img.src}"
                  class="card-img-top fixed-img"
                  alt="${project.projectName}"
                />
              </div>
              <div class="card-body my-2 pt-0">
                <h5 class="card-title my-0 fs-6">${project.projectName}</h5>
                <p class="card-text text-duration">durasi: ${
                  project.labelDurasi
                }</p>
                <p class="card-text text-description">${project.description}</p>
                <div class="d-flex my-4">
                ${
                  project.nodejs
                    ? `<img class="mx-2" width="20px" src="./assets/icons/node-js.svg" />`
                    : ""
                }
                ${
                  project.reactjs
                    ? `<img class="mx-2" width="20px" src="./assets/icons/react-js.svg" />`
                    : ""
                }
                ${
                  project.nextjs
                    ? `<img class="mx-2" width="20px" src="./assets/icons/next-js.svg" />`
                    : ""
                }
                ${
                  project.typescript
                    ? `<img class="mx-2" width="20px" src="./assets/icons/typescript.svg" />`
                    : ""
                }
                </div>
                  <div class="d-flex justify-content-between gap-2">
                    <button type="button" class="btn btn-dark py-0 w-100">edit</button>
                    <button type="button" class="btn btn-dark py-0 w-100">delete</button>
                  </div>
              </div>  
            </div>
          </div>  
        `
    )
    .join("");
}
