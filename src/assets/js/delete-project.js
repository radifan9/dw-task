function confirmDelete(event) {
  event.preventDefault();

  if (confirm("Are you sure you want to delete this project?")) {
    const form = event.target;
    const projectId = form.querySelector('input[name="projectId"]').value;

    fetch(`/project/${projectId}`, {
      method: "DELETE",
    })
      .then((response) => {
        // Handles success HTTP connection, success or even app error
        if (response.ok) {
          // Remove the card from DOM
          const card = form.closest(".card-custom");
          card.remove();
          window.location.href = "/project";
        } else {
          alert("Failed to delete project");
        }
      })
      .catch((error) => {
        // Catches network errors
        console.error("Error:", error);
        alert("Error deleting project");
      });
  }

  return false;
}
