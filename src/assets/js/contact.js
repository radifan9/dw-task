"use strict";

// Aku hilangin di hbs onclick="getData(event)"

function getData(e) {
  // Prevent reload
  e.preventDefault();

  // const name = document.getElementById("name").value;
  // const email = document.getElementById("email").value;
  // const phoneNumber = document.getElementById("phone-number").value;
  // const subject = document.getElementById("subject").value;
  // const message = document.getElementById("your-message").value;

  // console.log(name, email, phoneNumber, subject, message);

  // // If there's empty form, alert visitor
  // if (!name || !email || !phoneNumber || !subject || !message) {
  //   alert(
  //     "Please complete all fields before submitting: \n\n" +
  //       (!name ? "- Name is required\n" : "") +
  //       (!email ? "- Email is required\n" : "") +
  //       (!phoneNumber ? "- Phone number is required\n" : "") +
  //       (!subject ? "- Subject is required\n" : "") +
  //       (!message ? "- Message is required\n" : "")
  //   );
  //   return;
  // }

  // // Give a respond to alert
  // alert(
  //   `Thank you ${name}!\n\n` +
  //     `We have received your message:\n` +
  //     `Email: ${email}\n` +
  //     `Phone: ${phoneNumber}\n` +
  //     `Subject: ${subject}\n` +
  //     `Message: ${message}\n\n` +
  //     `We will contact you soon.`
  // );

  // // Clear all form fields
  // document.getElementById("name").value = "";
  // document.getElementById("email").value = "";
  // document.getElementById("phone-number").value = "";
  // document.getElementById("subject").value = "";
  // document.getElementById("your-message").value = "";
}
