/* 
App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download.
*/

"use strict";

let projects = [];

function deleteCard(index) {
  console.log(`Delete card at index : ${index}`);

  // Hapus data array di index ke i, berupa 1 data
  // projects.splice(index, 1);

  // CARA BARU, pakai filter
  // Hanya akan mem-pass element yang tidak sama dengan index
  projects = projects.filter((project, i) => i !== index);

  // Render lagi setelah di delete
  renderCards();
}

function getDateDifference(startDate, endDate) {
  // Create instance using Date() constructor
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get difference in years
  const yearDiff = end.getFullYear() - start.getFullYear();

  const yearEnd = end.getFullYear();

  // Get difference in months
  const monthDiff = end.getMonth() - start.getMonth();

  // Get difference in days
  const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Jike lebih dari setahun return tahun, jika lebih dari 1 bulan return bulan, jika tidak tampilkan hari
  // if (yearDiff >= 1) {
  //   return `${yearDiff} tahun`;
  // } else if (monthDiff >= 1) {
  //   return `${monthDiff} bulan`;
  // } else {
  //   return `${dayDiff} hari`;
  // }

  // Jike lebih dari setahun return tahun, jika lebih dari 1 bulan return bulan, jika tidak tampilkan hari
  // Return 2 data (diff & yearEnd), dibungkus di 1 object
  if (yearDiff >= 1) {
    return { diff: `${yearDiff} tahun`, yearEnd };
  } else if (monthDiff >= 1) {
    return { diff: `${monthDiff} bulan`, yearEnd };
  } else {
    return { diff: `${dayDiff} hari`, yearEnd };
  }
}

function getData(e) {
  console.log("Tombol submit di klik");

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

  // Dapatkan labelDurasi (berupa string) dan yearEnd (untuk di tambah di akhir judul projek)
  const { diff: labelDurasi, yearEnd } = getDateDifference(startDate, endDate);

  // FORM-VALIDATION, jika ada form yang kosong, alert pengunjung dan jangan lanjutkan getData
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
  // Create new instance called reader
  const reader = new FileReader();

  reader.onload = function (event) {
    // event.target.result --> isi konten file
    const imgSrc = event.target.result;

    projects.push({
      projectName,
      labelDurasi,
      yearEnd,
      description,
      nodejs,
      reactjs,
      nextjs,
      typescript,
      img: { src: imgSrc },
    });

    // Clear all form fields, biar setelah submit form kosong
    // document.getElementById("project-name").value = "";
    // document.getElementById("description").value = "";

    // Render project cards
    renderCards();

    // Cek apakah sudah ada heading, agar terdapat heading "MY PROJECT"
    if (!document.getElementById("my-project-heading")) {
      // Jika belum ada "my-project-heading" bikin element <h2> dengan text id class berikut
      const heading = document.createElement("h2");
      heading.textContent = "My Project";
      heading.id = "my-project-heading";
      heading.className =
        "mt-5 text-uppercase fw-bold text-center h-my-project";

      const cardContainer = document.getElementById("cardContainer");

      // Masukkan "my-project-heading" sebelum "cardContainer"
      cardContainer.parentNode.insertBefore(heading, cardContainer);
    }
  };

  reader.readAsDataURL(file); // This triggers reader.onload when complete
}

// Tiap klik submit, render bagian bawah dari  awal, jadi bukan render kartu tertentu
function renderCards() {
  cardContainer.innerHTML = projects
    .map(
      (project, index) =>
        `
          <div class="col">
            <div class="card shadow single-card">
              <div class="container mt-2">
                <img
                  src="${project.img.src}"
                  class="card-img fixed-img"
                  alt="${project.projectName}"
                />
              </div>
              <div class="card-body my-2 pt-0 pb-0">
                <h5 class="card-title my-0 fw-bold custom-card-title">${
                  project.projectName
                } - ${project.yearEnd}</h5>
                <p class="card-text text-duration">durasi : ${
                  project.labelDurasi
                }</p>
                  <!-- Pakai overflow biar ukuran setiap card sama, meskipun ada text yang panjang -->
                  <div class="overflow-y-hidden" style="height: 54px">
                    <p class="card-text text-description">${
                      project.description
                    }</p>
                  </div>
                <div class="d-flex my-4">
                <!-- ternary operator, kalau nodejs true, tampilkan img, kalau tidak output string kosong "" -->
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
                    <button type="button" class="btn btn-dark py-0 w-100 fw-bold  custom-btn">edit</button>
                    <button type="button" class="btn btn-dark py-0 w-100 fw-bold custom-btn" onclick="deleteCard(${index})">delete</button>
                  </div>
              </div>  
            </div>
          </div>  
        `
    )
    .join("");
}
