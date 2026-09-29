const screens = document.querySelectorAll(".prototype-screen");
const progressSteps = document.querySelectorAll(".progress-step");

const screenOrder = [
  "board",
  "attempt",
  "feedback",
  "retry",
  "bridge"
];

function showScreen(screenName) {
  const currentIndex = screenOrder.indexOf(screenName);

  screens.forEach((screen) => {
    const isCurrentScreen = screen.dataset.screen === screenName;
    screen.classList.toggle("active-screen", isCurrentScreen);
  });

  progressSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentIndex);
    step.classList.toggle("complete", index < currentIndex);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Buttons inside the prototype use data-next to move between screens.
document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showScreen(button.dataset.next);
  });
});

// The progress bar can also be used to move around the prototype.
progressSteps.forEach((step) => {
  step.addEventListener("click", () => {
    showScreen(step.dataset.stepTarget);
  });
});

document.getElementById("attempt-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const attemptText = document.getElementById("attempt-text").value.trim();
  const uncertaintyText = document.getElementById("uncertainty-text").value.trim();
  const anonymous = document.getElementById("anonymous-switch").checked;

  document.getElementById("attempt-summary-text").textContent =
    attemptText || "No response entered.";

  document.getElementById("retry-original-text").textContent =
    attemptText || "No response entered.";

  document.getElementById("uncertainty-summary-text").textContent =
    uncertaintyText || "No uncertainty entered.";

  const identityLabel = document.getElementById("identity-label");

  if (anonymous) {
    identityLabel.innerHTML =
      '<i class="bi bi-eye-slash"></i> Anonymous to classmates';
  } else {
    identityLabel.innerHTML =
      '<i class="bi bi-person-check"></i> Name visible to classmates';
  }

  showScreen("feedback");
});

document.getElementById("retry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showScreen("bridge");
  showToast("Your revised response has been submitted.");
});

document.getElementById("bring-to-class-btn").addEventListener("click", () => {
  showToast("Saved for class.");
});

function showToast(message) {
  const toastElement = document.getElementById("prototype-toast");
  const toastMessage = document.getElementById("toast-message");

  toastMessage.textContent = message;

  bootstrap.Toast.getOrCreateInstance(toastElement, {
    delay: 3000
  }).show();
}

showScreen("board");
