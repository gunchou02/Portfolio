/**
 * Main application script
 * This script handles interactive elements like navigation, scroll effects,
 * carousels, and a WebGL background animation.
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element Selections ---
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  const splashScreen = document.getElementById("splash-screen");

  // --- Navigation Menu Toggle ---
  if (navToggle && mainNav) {
    const navLinks = mainNav.querySelectorAll("a");

    // Toggle the mobile menu open/closed when the burger icon is clicked.
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("is-active");
      mainNav.classList.toggle("is-open");
    });

    // Close the mobile menu when a navigation link is clicked.
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("is-active");
        mainNav.classList.remove("is-open");
      });
    });
  }

  // --- Scroll-based UI Changes ---
  // Change UI elements based on the visibility of the splash screen.
  if (splashScreen && navToggle && scrollToTopBtn) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When the splash screen is not visible, add 'scrolled' and 'visible' classes.
          if (!entry.isIntersecting) {
            navToggle.classList.add("scrolled");
            scrollToTopBtn.classList.add("visible");
          } else {
            navToggle.classList.remove("scrolled");
            scrollToTopBtn.classList.remove("visible");
          }
        });
      },
      // Trigger when the splash screen is 90% scrolled out of the viewport.
      { rootMargin: "-90% 0px 0px 0px" }
    );
    observer.observe(splashScreen);
  }

  /**
   * Creates a text scramble animation effect on a given element.
   * @param {HTMLElement} element The element whose text will be scrambled.
   */
  const scrambleText = (element) => {
    const originalText = element.textContent;
    const chars = "コクーンタワー"; // Characters to use for scrambling (Cocoon Tower)
    let frame = 0;
    let intervalId = null;

    const animate = () => {
      let revealedCount = Math.floor(frame / 4);
      let newText = "";
      for (let i = 0; i < originalText.length; i++) {
        if (i < revealedCount) {
          newText += originalText[i];
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.textContent = newText;

      // Stop the animation when the full text is revealed.
      if (revealedCount === originalText.length) {
        clearInterval(intervalId);
        element.textContent = originalText;
      }
      frame++;
    };
    intervalId = setInterval(animate, 40);
  };

  // --- Apply Scramble Effect to H1 ---
  // Targets the h1 tag specifically on the splash screen.
  const h1 = document.querySelector("#splash-screen h1");
  if (h1 && h1.textContent.trim() === "COCOON TOWER") {
    setTimeout(() => {
      scrambleText(h1);
    }, 500); // Delay the effect slightly for better impact.
  }

  // --- Reveal Content Sections on Scroll ---
  const contentSections = document.querySelectorAll(".content-section");
  if (contentSections.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Stop observing the element once it has been revealed.
            revealObserver.unobserve(entry.target);
          }
        });
      },
      // Trigger when the section is 15% from the bottom of the viewport.
      { rootMargin: "0px 0px -15% 0px" }
    );
    contentSections.forEach((section) => {
      revealObserver.observe(section);
    });
  }

  // --- Initialize Swiper Carousels ---
  new Swiper(".sky-lounge-swiper", {
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  new Swiper(".library-swiper", {
    loop: true,
    effect: "fade",
    autoplay: { delay: 3500, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  // --- Center-Align Scroll to Hash on Load ---
  // If the page URL has a hash, scroll to center the target element.
  if (window.location.hash) {
    // A short delay allows the browser's default hash-scrolling to settle.
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash);

      if (targetElement) {
        // Calculate the position to center the element in the viewport.
        const elementRect = targetElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.scrollY;
        const middle =
          absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

        // Smoothly scroll to the calculated position.
        window.scrollTo({
          top: middle,
          behavior: "smooth",
        });
      }
    }, 100); // 100ms delay.
  }
});

// --- WebGL Background Animation ---
const webglContainer = document.getElementById("webgl-container");
let particlesMesh;

if (webglContainer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  webglContainer.appendChild(renderer.domElement);

  // Function to create a radial gradient texture for particles.
  function createCircleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
  }

  // Create particle geometry and material.
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 8000;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 25; // Distribute particles randomly.
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    map: createCircleTexture(),
    color: 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // --- Mouse and Scroll Interaction ---
  const mouse = new THREE.Vector2();
  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  let scrollYRotation = 0;
  window.addEventListener("scroll", () => {
    // Link particle rotation to the page's scroll position.
    scrollYRotation = window.scrollY * 0.0008;
  });

  // --- Animation Loop ---
  const clock = new THREE.Clock();
  const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    if (particlesMesh) {
      // Animate particles based on time, mouse position, and scroll.
      particlesMesh.rotation.y =
        elapsedTime * 0.03 + mouse.x * 0.2 + scrollYRotation;
      particlesMesh.rotation.x = -mouse.y * 0.2;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();

  // --- Handle Window Resizing ---
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
