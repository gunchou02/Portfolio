// --- Page load effect ---
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// --- Run scripts after DOM is loaded ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Initialize tsParticles ---
  tsParticles.load("star-background", {
    fullScreen: {
      enable: false,
    },
    particles: {
      number: {
        value: 250,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#FFFFFF", "#a2d2ff", "#f0f8ff", "#cceeff"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.2, max: 1 },
        animation: {
          enable: true,
          speed: 1.5,
          sync: false,
        },
      },
      size: {
        value: { min: 0.8, max: 3.5 },
        random: true,
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.8,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 100,
        color: "#ffffff",
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: { min: 0.1, max: 0.8 },
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
          parallax: {
            enable: true,
            force: 60,
            smooth: 10,
          },
        },
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 1,
          },
        },
        push: {
          quantity: 4,
        },
      },
    },
    background: {
      color: "rgb(23, 24, 58)",
    },
    detectRetina: true,
  });

  // --- Core features: menu, scroll animations, etc. ---
  const menuToggle = document.getElementById("menu-toggle");
  const menuOverlay = document.getElementById("menu-overlay");

  if (menuToggle && menuOverlay) {
    const navLinks = menuOverlay.querySelectorAll(".overlay-nav a");

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
  }

  // --- Intersection Observer for animations ---
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

  // --- Scroll to Top Button ---
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  if (scrollToTopBtn) {
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
  }

  // --- Modal General Logic ---
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

  // --- News Modal Logic ---
  const newsModal = document.getElementById("news-modal");
  if (newsModal) {
    // Selects all cards on the page (works for index.html, news.html)
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        const data = card.dataset;
        newsModal.querySelector(".modal-category").textContent = data.category;
        newsModal.querySelector(".modal-title").textContent = data.title;
        newsModal.querySelector(".modal-date").textContent = data.date;
        newsModal.querySelector(".news-modal-img").src = data.imgSrc;
        newsModal.querySelector(".modal-main-text").innerHTML =
          data.text.replace(/\n/g, "<br>"); // Supports line breaks
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

  // --- ★★★ ADDED/FIXED: Music Modal Logic ★★★ ---
  const musicModal = document.getElementById("music-modal");
  if (musicModal) {
    // Selects all music items on the page (works for index.html, discography.html)
    document.querySelectorAll(".music-item").forEach((item) => {
      item.addEventListener("click", () => {
        const data = item.dataset;

        const albumArt = musicModal.querySelector(".modal-album-art img");
        albumArt.src = data.imgSrc;
        albumArt.alt = `${data.title} album cover`;

        musicModal.querySelector(".modal-title").textContent = data.title;
        musicModal.querySelector(".modal-date").textContent = data.date;

        const releaseTypeEl = musicModal.querySelector(".modal-release-type");
        if (data.type === "album") {
          releaseTypeEl.textContent = "Album";
        } else {
          releaseTypeEl.textContent = "Digital Single";
        }

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

  // --- Discography Slider (Only runs on the main page) ---
  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer) {
    const musicGrid = sliderContainer.querySelector(".music-grid");
    const prevBtn = sliderContainer.querySelector(".prev-btn");
    const nextBtn = sliderContainer.querySelector(".next-btn");

    const scrollSlider = (direction) => {
      const scrollAmount = musicGrid.clientWidth * 0.8 * direction;
      musicGrid.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    nextBtn.addEventListener("click", () => scrollSlider(1));
    prevBtn.addEventListener("click", () => scrollSlider(-1));
  }
});
