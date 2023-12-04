document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Basic validation according to brief
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  if (name.length < 5) {
    showError("Name must be at least 5 characters long.");
    return;
  }

  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.");
    return;
  }

  if (subject.length < 15) {
    showError("Subject must be at least 15 characters long.");
    return;
  }

  if (message.length < 25) {
    showError("Message must be at least 25 characters long.");
    return;
  }

  // If all validations pass, proceed with form submission.
  showSuccess("form submitted, thank you 🤖");
});

function showError(message) {
  const alertElement = document.getElementById("alertMessage");
  alertElement.textContent = message;
  alertElement.style.display = "block";
  alertElement.style.color = "red";
}

function showSuccess(message) {
  const alertElement = document.getElementById("alertMessage");
  alertElement.textContent = message;
  alertElement.style.display = "block";
  alertElement.style.color = "green";
}

function isValidEmail(email) {
  // Basic email validation using a regular expression
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
