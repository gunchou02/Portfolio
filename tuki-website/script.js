// --- Page load effect ---
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// --- Run scripts after DOM is loaded ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Core features: menu, scroll animations, modals, etc. ---
  const menuToggle = document.getElementById("menu-toggle");
  const menuOverlay = document.getElementById("menu-overlay");
  const navLinks = document.querySelectorAll(".overlay-nav a");

  menuToggle.addEventListener("click", () => {
    const isActive = menuToggle.classList.toggle("active");
    menuOverlay.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isActive);
    document.body.classList.toggle("modal-open");
  });

  navLinks.forEach((link) => {
    if (!link.closest(".social-links-container")) {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            menuToggle.classList.remove("active");
            menuOverlay.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("modal-open");
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".hidden").forEach((el) => observer.observe(el));

  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });
  scrollToTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const allModals = document.querySelectorAll(".modal-overlay");
  function closeModal() {
    document.body.classList.remove("modal-open");
    allModals.forEach((modal) => modal.classList.remove("is-open"));
  }
  allModals.forEach((modal) => {
    modal
      .querySelector(".modal-close-btn")
      ?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const newsModal = document.getElementById("news-modal");
  if (newsModal) {
    document.querySelectorAll("#news .card").forEach((card) => {
      card.addEventListener("click", () => {
        const data = card.dataset;
        newsModal.querySelector(".modal-category").textContent = data.category;
        newsModal.querySelector(".modal-title").textContent = data.title;
        newsModal.querySelector(".modal-date").textContent = data.date;
        newsModal.querySelector(".news-modal-img").src = data.imgSrc;
        newsModal.querySelector(".modal-main-text").textContent = data.text;
        const link = newsModal.querySelector(".news-modal-link");
        if (data.linkUrl && data.linkUrl.trim() !== "#") {
          link.href = data.linkUrl;
          link.style.display = "inline-block";
        } else {
          link.style.display = "none";
        }
        document.body.classList.add("modal-open");
        newsModal.classList.add("is-open");
      });
    });
  }

  const musicModal = document.getElementById("music-modal");
  // Flag to check for scrolling/swiping
  let isScrolling = false;

  if (musicModal) {
    document.querySelectorAll("#discography .music-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        // Prevent modal opening during scroll
        if (isScrolling) {
          e.preventDefault();
          return;
        }
        const data = item.dataset;
        musicModal.querySelector(".modal-album-art img").src = data.imgSrc;
        musicModal.querySelector(
          ".modal-album-art img"
        ).alt = `${data.title} album cover`;
        musicModal.querySelector(".modal-title").textContent = data.title;
        musicModal.querySelector(".modal-date").textContent = data.date;

        const releaseTypeEl = musicModal.querySelector(".modal-release-type");
        releaseTypeEl.textContent =
          data.type === "album" ? "Album" : "Digital Single";

        const streamBtn = musicModal.querySelector(".modal-streaming-btn");
        if (data.streamUrl && data.streamUrl.trim() !== "#") {
          streamBtn.href = data.streamUrl;
          streamBtn.style.display = "inline-block";
        } else {
          streamBtn.style.display = "none";
        }

        document.body.classList.add("modal-open");
        musicModal.classList.add("is-open");
      });
    });
  }

  // --- Discography Slider (Native Scroll) ---
  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer) {
    const musicGrid = sliderContainer.querySelector(".music-grid");
    const prevBtn = sliderContainer.querySelector(".prev-btn");
    const nextBtn = sliderContainer.querySelector(".next-btn");

    // Smooth scroll on button click
    const scrollSlider = (direction) => {
      // Scroll by 80% of the visible width
      const scrollAmount = musicGrid.clientWidth * 0.8 * direction;
      musicGrid.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    };

    nextBtn.addEventListener("click", () => scrollSlider(1));
    prevBtn.addEventListener("click", () => scrollSlider(-1));

    // Scroll with arrow keys
    sliderContainer.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollSlider(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollSlider(-1);
      }
    });

    // Set isScrolling during scroll to prevent misclicks
    let scrollTimer = -1;
    musicGrid.addEventListener("scroll", () => {
      isScrolling = true;
      if (scrollTimer != -1) {
        clearTimeout(scrollTimer);
      }
      // Consider scroll ended after 150ms of inactivity
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150);
    });
  }
});

/* Add the following to the end of your script.js */
document.addEventListener("DOMContentLoaded", () => {
  const starBackground = document.getElementById("star-background");

  // Number of stars to generate (adjust for density)
  const STAR_COUNT = 200;

  // Creates the star background
  const createStars = () => {
    starBackground.innerHTML = "";

    const colors = ["white", "lightblue"]; // Star color array
    const STAR_COUNT = 200;

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      // Random star size (1-3px)
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Assign a random color
      const color = colors[(Math.random() * colors.length) | 0];
      star.style.backgroundColor = color;

      // Random position within the viewport
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;

      // Randomize animation duration and delay for a twinkling effect
      star.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2s to 5s
      star.style.animationDelay = `${Math.random() * 5}s`; // 0s to 5s

      starBackground.appendChild(star);
    }
  };

  // Generate stars on initial load
  createStars();

  // Regenerate stars on resize for a responsive layout
  window.addEventListener("resize", createStars);
});

/* Replace the existing createStars function in script.js with this one */
const createStars = () => {
  const starBackground = document.getElementById("star-background");
  const STAR_COUNT = 200;

  // Clear out any existing stars
  starBackground.innerHTML = "";

  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    // Define color classes in an array
    // Weighted to favor white stars over blue
    const colorClasses = ["white", "white", "blue"];

    // Randomly pick and apply a color class
    const randomColorClass =
      colorClasses[Math.floor(Math.random() * colorClasses.length)];
    star.classList.add(randomColorClass);

    // Random star size (1-3px)
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Random position within the viewport
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;

    // Randomize animation duration and delay for a twinkling effect
    star.style.animationDuration = `${Math.random() * 3 + 2}s`; // 2s to 5s
    star.style.animationDelay = `${Math.random() * 5}s`; // 0s to 5s

    starBackground.appendChild(star);
  }
};
