const alertsList = document.getElementById("alertsList");
let alertIdCounter = 0;

// Function to create a new alert and record current date & time
function createAlert(title, message) {
    alertIdCounter++;
    const alertItem = document.createElement("div");
    alertItem.className = "alert-item";
    alertItem.setAttribute("data-id", alertIdCounter);

    const currentDate = new Date();
    const timestamp = currentDate.toLocaleString(); // Format to locale string

    alertItem.innerHTML = `
        <div class="alert-header">
            <h3>${title}</h3>
            <span class="timestamp">${timestamp}</span> <!-- Timestamp -->
        </div>
        <p>${message}</p>
        
        <!-- Editable fields -->
        <input type="text" class="edit-title" value="${title}">
        <textarea class="edit-message">${message}</textarea>
        
        <div class="alert-buttons">
            <button onclick="toggleEditMode(${alertIdCounter})">Edit</button>
            <button onclick="saveAlert(${alertIdCounter})" style="display: none;">Save</button>
            <button onclick="deleteAlert(${alertIdCounter})">Delete</button>
        </div>
    `;

    alertsList.appendChild(alertItem);
}

// function for "Send Alert" button
document.getElementById("sendAlert").addEventListener("click", () => {
    const alertTitle = document.getElementById("alertTitle").value;
    const alertMessage = document.getElementById("alertMessage").value;

    if (alertTitle && alertMessage) {
        createAlert(alertTitle, alertMessage);
        document.getElementById("alertTitle").value = "";
        document.getElementById("alertMessage").value = "";
    } else {
        alert("Please fill in both the title and message.");
    }
});

// function for editing alert
function toggleEditMode(id) {
    const alertItem = document.querySelector(`.alert-item[data-id="${id}"]`);
    const editButton = alertItem.querySelector("button:first-child");
    const saveButton = alertItem.querySelector("button:nth-child(2)");

    if (!alertItem.classList.contains("editing")) {
        // Enter edit mode
        alertItem.classList.add("editing");
        editButton.style.display = "none";
        saveButton.style.display = "inline";
    } else {
        // Exit edit mode
        alertItem.classList.remove("editing");
        editButton.style.display = "inline";
        saveButton.style.display = "none";
    }
}

// function to save modified alert
function saveAlert(id) {
    const alertItem = document.querySelector(`.alert-item[data-id="${id}"]`);
    const newTitle = alertItem.querySelector(".edit-title").value;
    const newMessage = alertItem.querySelector(".edit-message").value;

    alertItem.querySelector("h3").textContent = newTitle;
    alertItem.querySelector("p").textContent = newMessage;

    toggleEditMode(id);
}

// function to delete alert
function deleteAlert(id) {
    const alertItem = document.querySelector(`.alert-item[data-id="${id}"]`);
    alertsList.removeChild(alertItem);
}
