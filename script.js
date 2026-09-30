const screens = document.querySelectorAll(".prototype-screen");
const progressSteps = document.querySelectorAll(".progress-step");

const screenOrder = [
  "board",
  "attempt",
  "feedback",
  "retry",
  "bridge"
];

let furthestStepReached = 0;

function showScreen(screenName) {
  const currentIndex = screenOrder.indexOf(screenName);

  if (currentIndex === -1) {
    return;
  }

  screens.forEach((screen) => {
    const isCurrentScreen = screen.dataset.screen === screenName;
    screen.classList.toggle("active-screen", isCurrentScreen);
  });

  progressSteps.forEach((step, index) => {
    step.classList.toggle("active", index === currentIndex);
    step.classList.toggle("complete", index < currentIndex);

    const isAvailable = index <= furthestStepReached;
    step.disabled = !isAvailable;
    step.setAttribute("aria-disabled", String(!isAvailable));
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function unlockStep(screenName) {
  const index = screenOrder.indexOf(screenName);

  if (index > furthestStepReached) {
    furthestStepReached = index;
  }
}

// Buttons inside the prototype move the student through the intended flow.
document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    const nextScreen = button.dataset.next;
    unlockStep(nextScreen);
    showScreen(nextScreen);
  });
});

// Students can only use the progress bar to return to stages already reached.
progressSteps.forEach((step, index) => {
  step.addEventListener("click", () => {
    if (index <= furthestStepReached) {
      showScreen(step.dataset.stepTarget);
    }
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

  unlockStep("feedback");
  showScreen("feedback");
});

document.getElementById("retry-form").addEventListener("submit", (event) => {
  event.preventDefault();

  unlockStep("bridge");
  showScreen("bridge");

  showToast("Your revised response has been submitted.");
});

document.getElementById("bring-to-class-btn").addEventListener("click", () => {
  showToast(
    "Saved. You can use this revised response if the topic comes up in class."
  );
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