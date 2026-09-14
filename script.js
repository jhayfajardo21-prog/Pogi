const toggleBtn = document.getElementById("toggleBtn");
const sidebar = document.getElementById("sidebar");
const container = document.querySelector(".container");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".content-panel");
const storageGrid = document.querySelector(".storage-grid");
const storageCount = document.querySelector(".storage-count");
const hiddenFilesKey = "mywebsite-hidden-files";
const expertiseButton = document.querySelector(".expertise-box");
const expertiseDescription = document.querySelector("#expertiseDescription");
const experienceButton = document.querySelector(".experience-box");
const experienceDescription = document.querySelector("#experienceDescription");
const serviceFlipCards = document.querySelectorAll(".service-flip");
const feedbackForm = document.querySelector("#feedbackForm");
const feedbackDisplay = document.querySelector("#feedbackDisplay");
const activeFeedback = document.querySelector("#activeFeedback");
const activeFeedbackAuthor = document.querySelector("#activeFeedbackAuthor");
const averageRating = document.querySelector("#averageRating");
const ratingStars = document.querySelector("#ratingStars");
const ratingCount = document.querySelector("#ratingCount");
const feedbackStorageKey = "mywebsite-feedback";
let selectedRating = 5;
let feedbackIndex = 0;

const defaultFeedback = [
  { name: "Happy client", message: "Reliable and organized support from start to finish.", rating: 5 }
];

const getFeedback = () => JSON.parse(localStorage.getItem(feedbackStorageKey) || "null") || defaultFeedback;

const renderFeedback = () => {
  if (!feedbackDisplay || !activeFeedback || !activeFeedbackAuthor) {
    return;
  }

  const feedback = getFeedback();
  const item = feedback[feedbackIndex % feedback.length];
  activeFeedback.textContent = item.message;
  activeFeedbackAuthor.textContent = `${item.name} - ${"★".repeat(item.rating)}`;
  feedbackDisplay.classList.remove("feedback-refresh");
  void feedbackDisplay.offsetWidth;
  feedbackDisplay.classList.add("feedback-refresh");

  const average = feedback.reduce((total, entry) => total + entry.rating, 0) / feedback.length;
  averageRating.textContent = average.toFixed(1);
  ratingStars.textContent = `${"★".repeat(Math.round(average))}${"☆".repeat(5 - Math.round(average))}`;
  ratingCount.textContent = `${feedback.length} ${feedback.length === 1 ? "review" : "reviews"}`;
};

if (feedbackForm) {
  feedbackForm.querySelectorAll(".star-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRating = Number(button.dataset.rating);
      feedbackForm.querySelectorAll(".star-button").forEach((star) => {
        const isSelected = Number(star.dataset.rating) === selectedRating;
        star.classList.toggle("selected", isSelected);
        star.setAttribute("aria-checked", String(isSelected));
      });
    });
  });

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#feedbackName").value.trim();
    const message = document.querySelector("#feedbackMessage").value.trim();
    const feedback = getFeedback();
    feedback.push({ name, message, rating: selectedRating });
    localStorage.setItem(feedbackStorageKey, JSON.stringify(feedback));
    feedbackIndex = feedback.length - 1;
    renderFeedback();
    feedbackForm.reset();
    selectedRating = 5;
    feedbackForm.querySelectorAll(".star-button").forEach((star) => {
      star.classList.toggle("selected", star.dataset.rating === "5");
      star.setAttribute("aria-checked", String(star.dataset.rating === "5"));
    });
  });

  renderFeedback();
  window.setInterval(() => {
    feedbackIndex += 1;
    renderFeedback();
  }, 3000);
}

const setupExpandableSection = (button, description) => {
  if (!button || !description) {
    return;
  }

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    description.hidden = isExpanded;
    description.classList.toggle("visible", !isExpanded);
  });
};

setupExpandableSection(expertiseButton, expertiseDescription);
setupExpandableSection(experienceButton, experienceDescription);

const flipServiceCard = (card) => {
  const isFlipped = card.classList.toggle("is-flipped");
  card.setAttribute("aria-pressed", String(isFlipped));
};

serviceFlipCards.forEach((card) => {
  card.addEventListener("click", () => flipServiceCard(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipServiceCard(card);
    }
  });
});

const resetServiceCards = () => {
  serviceFlipCards.forEach((card) => {
    card.classList.remove("is-flipped");
    card.setAttribute("aria-pressed", "false");
  });
};

if (serviceFlipCards.length) {
  resetServiceCards();
}

const updateStorageCount = () => {
  if (storageGrid && storageCount) {
    storageCount.textContent = `${storageGrid.querySelectorAll(".storage-card").length} files`;
  }
};

const hiddenFiles = JSON.parse(localStorage.getItem(hiddenFilesKey) || "[]");

if (storageGrid) {
  storageGrid.querySelectorAll(".storage-card").forEach((card) => {
    const fileName = card.dataset.file;

    if (hiddenFiles.includes(fileName)) {
      card.remove();
      return;
    }

    card.querySelector(".delete-file").addEventListener("click", () => {
      const shouldDelete = window.confirm(`Delete ${fileName} from your storage list?`);

      if (!shouldDelete) {
        return;
      }

      const updatedHiddenFiles = JSON.parse(localStorage.getItem(hiddenFilesKey) || "[]");
      localStorage.setItem(hiddenFilesKey, JSON.stringify([...updatedHiddenFiles, fileName]));
      card.remove();
      updateStorageCount();
    });
  });

  updateStorageCount();
}

const updateToggleState = () => {
  const isHidden = sidebar.classList.contains("hidden");
  toggleBtn.classList.toggle("open", !isHidden);
  toggleBtn.setAttribute("aria-label", isHidden ? "Open sidebar" : "Close sidebar");
  toggleBtn.setAttribute("aria-expanded", String(!isHidden));
};

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const selectedPanel = item.dataset.panel;

    if (selectedPanel === "Services") {
      resetServiceCards();
    }

    navItems.forEach((navItem) => navItem.classList.remove("active"));
    item.classList.add("active");

    panels.forEach((panel) => {
      const isVisible = panel.dataset.panel === selectedPanel;
      panel.classList.toggle("active", isVisible);
    });

    sidebar.classList.add("hidden");
    container.classList.add("sidebar-hidden");
    updateToggleState();
  });
});

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  container.classList.toggle("sidebar-hidden");
  updateToggleState();
});

updateToggleState();
