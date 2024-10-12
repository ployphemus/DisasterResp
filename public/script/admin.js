// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const form = document.forms["form1"];
  const addButton = form.querySelector('button[name="insert"]');
  const updateButton = form.querySelector('button[name="update"]');
  const resetButton = form.querySelector('button[name="reset"]');
  const editLinks = document.querySelectorAll("#edit-user");

  // Function to reset the form to its initial state
  function resetForm() {
    form.action = "/users/createNewUser";
    //form.reset();
    addButton.disabled = false;
    updateButton.disabled = true;
  }

  // Add click event listeners to all edit links
  editLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const row = this.closest("tr");
      const userId = row.querySelector("td:first-child").textContent;

      // Update form action
      form.action = `/users/update/${userId}`;

      // Populate form fields
      form.id.value = userId;
      form.First_Name.value = row.querySelector("td:nth-child(2)").textContent;
      form.Last_Name.value = row.querySelector("td:nth-child(3)").textContent;
      form.Email.value = row.querySelector("td:nth-child(4)").textContent;

      // Toggle button states
      addButton.disabled = true;
      updateButton.disabled = false;
    });
  });

  // Reset form after successful update
  /*   form.addEventListener("submit", function (e) {
    if (form.action.includes("/users/update/")) {
      e.preventDefault();
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      })
        .then((response) => {
          if (response.ok) {
            alert("User updated successfully!");
            resetForm();
            location.reload(); // Reload the page to reflect changes
          } else {
            alert("Error updating user. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        });
    }
  }); */

  updateButton.addEventListener("click", function (e) {
    e.preventDefault();
    fetch(form.action, {
      method: "PUT",
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          alert("User updated successfully!");
          resetForm();
          location.reload(); // Reload the page to reflect changes
        } else {
          alert("Error updating user. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });

  resetButton.addEventListener("click", resetForm);
});
