
import * as THREE from "three";

document.documentElement.classList.add("js-ready");

/* ==========================================
   AETERNA — INTERACTIONS & 3D EXPERIENCE
========================================== */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

/* LOADER */

const preloader = $("#preloader");

function dismissLoader() {
  if (preloader) preloader.classList.add("loaded");
}

window.addEventListener("load", () => {
  window.setTimeout(dismissLoader, 450);
});

window.setTimeout(dismissLoader, 2200);

/* MOBILE NAVIGATION */

const menuToggle = $("#menuToggle");
const siteNav = $("#siteNav");
const navLinks = $$(".nav-link", siteNav || document);

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation"
  );

  siteNav?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

/* SCROLL REVEALS */

const revealElements = $$(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}

/* ACTIVE NAVIGATION */

const sections = $$("main section[id]");
const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("active", active);
    });
  },
  { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.2, 0.5] }
);

sections.forEach((section) => navObserver.observe(section));

/* BACK TO TOP */

const backToTop = $("#backToTop");

function updateScrollUI() {
  backToTop?.classList.toggle("visible", window.scrollY > 600);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* FOOTER YEAR */

const year = $("#year");
if (year) year.textContent = String(new Date().getFullYear());

/* ==========================================
   THREE.JS — CYAN / COBALT / AMBER SCULPTURE
========================================== */

function initHeroScene() {
  const canvas = $("#heroCanvas");
  if (!canvas) return;

  const host = canvas.parentElement;
  if (!host) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isMobile = window.matchMedia("(max-width: 760px)").matches;

  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance"
    });
  } catch (error) {
    console.warn("WebGL is unavailable; the CSS hero remains visible.", error);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 8.6);

  const sculpture = new THREE.Group();
  scene.add(sculpture);

  const cyanMaterial = new THREE.MeshStandardMaterial({
    color: 0x00e5c9,
    metalness: 0.7,
    roughness: 0.23,
    emissive: 0x003a34,
    emissiveIntensity: 1.1
  });

  const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x0066ff,
    metalness: 0.78,
    roughness: 0.22,
    emissive: 0x001a70,
    emissiveIntensity: 1.25
  });

  const orangeMaterial = new THREE.MeshStandardMaterial({
    color: 0xff9000,
    metalness: 0.65,
    roughness: 0.25,
    emissive: 0x4a1800,
    emissiveIntensity: 1.1
  });

  const silverMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8e2ed,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0x182b40,
    emissiveIntensity: 0.45
  });

  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x101d2b,
    metalness: 0.8,
    roughness: 0.27,
    wireframe: false
  });

  scene.add(new THREE.HemisphereLight(0x9acfff, 0x06101b, 2.2));

  const cyanLight = new THREE.PointLight(0x00e5c9, 42, 15);
  cyanLight.position.set(-3, 2, 3);
  scene.add(cyanLight);

  const blueLight = new THREE.PointLight(0x0066ff, 55, 16);
  blueLight.position.set(3, 1, 2);
  scene.add(blueLight);

  const orangeLight = new THREE.PointLight(0xff9000, 38, 14);
  orangeLight.position.set(0, -2, 3);
  scene.add(orangeLight);

  const topLight = new THREE.DirectionalLight(0xffffff, 3.5);
  topLight.position.set(2, 5, 6);
  scene.add(topLight);

  const rimLight = new THREE.DirectionalLight(0x0066ff, 2.5);
  rimLight.position.set(-4, 0, -3);
  scene.add(rimLight);

  /* A layered metallic diamond / abstract A form */

  const shapePoints = [
    new THREE.Vector2(0, 1.55),
    new THREE.Vector2(0.23, 0.7),
    new THREE.Vector2(1.15, -0.8),
    new THREE.Vector2(0.42, -0.65),
    new THREE.Vector2(0, -1.4),
    new THREE.Vector2(-0.42, -0.65),
    new THREE.Vector2(-1.15, -0.8),
    new THREE.Vector2(-0.23, 0.7)
  ];

  const emblemShape = new THREE.Shape();
  emblemShape.moveTo(shapePoints[0].x, shapePoints[0].y);
  shapePoints.slice(1).forEach((point) => {
    emblemShape.lineTo(point.x, point.y);
  });
  emblemShape.closePath();

  const emblemGeometry = new THREE.ExtrudeGeometry(emblemShape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 8
  });

  emblemGeometry.computeVertexNormals();

  const emblem = new THREE.Mesh(emblemGeometry, blueMaterial);
  emblem.position.z = 0.12;
  sculpture.add(emblem);

  /* Floating coloured rings */

  function addTorus(radius, tube, material, position, rotation, scale = 1) {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 16, 120),
      material
    );

    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.scale.setScalar(scale);
    sculpture.add(mesh);
    return mesh;
  }

  const ringA = addTorus(
    1.65, 0.025, cyanMaterial,
    [-0.02, 0, -0.24],
    [Math.PI / 2.5, 0.1, -0.4],
    1
  );

  const ringB = addTorus(
    1.95, 0.012, orangeMaterial,
    [0, 0, -0.48],
    [Math.PI / 2.25, 0.2, 0.2],
    1
  );

  const ringC = addTorus(
    1.34, 0.018, silverMaterial,
    [0, 0, -0.12],
    [Math.PI / 2.1, -0.2, 0.6],
    1
  );

  /* Side fins */

  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0.8);
  finShape.bezierCurveTo(0.7, 0.6, 0.8, 0.05, 1.25, -0.55);
  finShape.lineTo(0.15, -0.25);
  finShape.bezierCurveTo(-0.2, 0.1, -0.15, 0.45, 0, 0.8);

  const finGeometry = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.02
  });

  const leftFin = new THREE.Mesh(finGeometry, orangeMaterial);
  leftFin.position.set(-1.2, 0.2, 0.1);
  leftFin.rotation.z = 2.4;
  sculpture.add(leftFin);

  const rightFin = new THREE.Mesh(finGeometry, cyanMaterial);
  rightFin.position.set(0.95, 0.15, 0.1);
  rightFin.rotation.z = -0.6;
  rightFin.scale.set(-1, 1, 1);
  sculpture.add(rightFin);

  const lowerFin = new THREE.Mesh(finGeometry, orangeMaterial);
  lowerFin.position.set(0.85, -0.55, -0.15);
  lowerFin.rotation.z = -2.3;
  lowerFin.scale.set(0.7, 0.7, 0.7);
  sculpture.add(lowerFin);

  /* Small floating metallic particles */

  const particleCount = isMobile ? 250 : 500;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const index = i * 3;
    particlePositions[index] = (Math.random() - 0.5) * 7;
    particlePositions[index + 1] = (Math.random() - 0.5) * 5;
    particlePositions[index + 2] = (Math.random() - 0.5) * 4 - 1;

    const useOrange = Math.random() > 0.82;
    particleColors[index] = useOrange ? 1 : 0.05;
    particleColors[index + 1] = useOrange ? 0.5 : 0.8;
    particleColors[index + 2] = useOrange ? 0.02 : 1;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );
  particleGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(particleColors, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.018 : 0.024,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  /* Responsive framing */

  let width = 1;
  let height = 1;

  function resizeScene() {
    const rect = host.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 480 ? 9.4 : width < 760 ? 8.8 : 8.6;
    camera.updateProjectionMatrix();

    const mobileScale = width < 480 ? 0.78 : width < 760 ? 0.9 : 1;
    sculpture.scale.setScalar(mobileScale);
  }

  const resizeObserver = new ResizeObserver(resizeScene);
  resizeObserver.observe(host);
  resizeScene();

  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;

  host.addEventListener("pointermove", (event) => {
    const rect = host.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }, { passive: true });

  host.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });

  let frameId = 0;
  let lastFrame = 0;
  let isVisible = true;
  let pageVisible = !document.hidden;

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  });

  visibilityObserver.observe(host);

  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
  });

  const clock = new THREE.Clock();

  function animate(timestamp = 0) {
    frameId = requestAnimationFrame(animate);

    if (!pageVisible || !isVisible) return;

    if (!reducedMotion && timestamp - lastFrame < (isMobile ? 32 : 16)) return;
    lastFrame = timestamp;

    const elapsed = clock.getElapsedTime();

    targetX += (pointerY * 0.18 - targetX) * 0.035;
    targetY += (pointerX * 0.24 - targetY) * 0.035;

    sculpture.rotation.x = targetX + (reducedMotion ? 0 : Math.sin(elapsed * 0.3) * 0.04);
    sculpture.rotation.y = targetY + (reducedMotion ? 0 : Math.sin(elapsed * 0.22) * 0.12);

    if (!reducedMotion) {
      ringA.rotation.z += 0.0018;
      ringB.rotation.z -= 0.001;
      ringC.rotation.z += 0.0012;
      particles.rotation.y = elapsed * 0.018;
      particles.rotation.x = Math.sin(elapsed * 0.15) * 0.05;
      sculpture.position.y = Math.sin(elapsed * 0.65) * 0.06;

      cyanLight.intensity = 38 + Math.sin(elapsed * 1.1) * 4;
      orangeLight.intensity = 34 + Math.sin(elapsed * 0.8 + 1) * 4;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    renderer.dispose();
    emblemGeometry.dispose();
    finGeometry.dispose();
    particleGeometry.dispose();
    particleMaterial.dispose();
    cyanMaterial.dispose();
    blueMaterial.dispose();
    orangeMaterial.dispose();
    silverMaterial.dispose();
    darkMaterial.dispose();
  }, { once: true });
}

initHeroScene();

/* ==========================================
   CONTACT FORM
   Replace with your real email before launch.
========================================== */


const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    const originalButtonHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = "Sending enquiry...";
    formFeedback.textContent = "Sending your project details securely...";

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/info.aeternawebsites@gmail.com",
        {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json"
          }
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Submission failed.");
      }

      formFeedback.textContent =
        "Thank you! Your enquiry has been submitted successfully.";

      contactForm.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      formFeedback.textContent =
        "We couldn't send your enquiry. Please try again or email info.aeternawebsites@gmail.com.";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  });
}

/* Preloader safety fallback */
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = document.getElementById("preloader");

    if (preloader) {
      preloader.classList.add("loaded");
    }
  }, 1500);
});

