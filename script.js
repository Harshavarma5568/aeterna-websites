
import * as THREE from 'three';

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// =====================================
// 1. CINEMATIC LOADING SCREEN
// =====================================

const loader = document.getElementById('loader');

document.body.classList.add('loading');

window.addEventListener('load', () => {
  setTimeout(() => {
    loader?.classList.add('done');
    document.body.classList.remove('loading');

    document.querySelectorAll('.hero .reveal').forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, reducedMotion ? 0 : 100 + index * 110);
    });
  }, reducedMotion ? 0 : 700);
});

// =====================================
// 2. MOBILE NAVIGATION
// =====================================

const menuToggle = document.getElementById('menuToggle');
const navigation = document.getElementById('navigation');

function closeNavigation() {
  navigation?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Toggle navigation');
}

menuToggle?.addEventListener('click', () => {
  const isOpen =
    menuToggle.getAttribute('aria-expanded') !== 'true';

  menuToggle.setAttribute('aria-expanded', String(isOpen));
  navigation?.classList.toggle('open', isOpen);
});

navigation?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNavigation);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeNavigation();
});

// =====================================
// 3. SCROLL REVEAL ANIMATIONS
// =====================================

const revealElements = document.querySelectorAll(
  '.reveal:not(.hero .reveal)'
);

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => {
    element.classList.add('visible');
  });
}

// =====================================
// 4. INTERACTIVE THREE.JS HERO
// =====================================

const canvas = document.getElementById('scene3d');

if (canvas) {
  try {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      38, 1, 0.1, 100
    );

    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 1.7)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Lighting
    scene.add(new THREE.AmbientLight(0xc9c4ff, 1.2));

    const limeLight = new THREE.PointLight(
      0xd7ff7a, 32, 20
    );
    limeLight.position.set(3, 3, 5);
    scene.add(limeLight);

    const violetLight = new THREE.PointLight(
      0x7862ff, 38, 20
    );
    violetLight.position.set(-3, -1, 2);
    scene.add(violetLight);

    const warmLight = new THREE.PointLight(
      0xff704d, 15, 16
    );
    warmLight.position.set(1, -3, -2);
    scene.add(warmLight);

    // Main sculpture
    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const limeMetal = new THREE.MeshPhysicalMaterial({
      color: 0xd7ff7a,
      metalness: 0.78,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.15
    });

    const violetMetal = new THREE.MeshPhysicalMaterial({
      color: 0xa99aff,
      metalness: 0.72,
      roughness: 0.22,
      clearcoat: 1
    });

    const darkMetal = new THREE.MeshPhysicalMaterial({
      color: 0x302c3b,
      metalness: 0.9,
      roughness: 0.24,
      clearcoat: 0.8
    });

    // Large metallic ring
    const ringOne = new THREE.Mesh(
      new THREE.TorusGeometry(1.45, 0.21, 32, 160),
      limeMetal
    );

    ringOne.rotation.set(0.62, 0.35, -0.48);
    sculpture.add(ringOne);

    // Interlocking violet ring
    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(1.08, 0.13, 28, 144),
      violetMetal
    );

    ringTwo.rotation.set(-0.8, 0.2, 0.65);
    sculpture.add(ringTwo);

    // Inner dark metallic ring
    const ringThree = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.075, 24, 120),
      darkMetal
    );

    ringThree.rotation.set(1.2, -0.4, -0.2);
    sculpture.add(ringThree);

    // Central crystal
    const crystal = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.43, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0xf0ebff,
        metalness: 0.55,
        roughness: 0.13,
        transmission: 0.08,
        thickness: 1.2,
        clearcoat: 1
      })
    );

    sculpture.add(crystal);

    // Fine orbit rings
    const orbitOne = new THREE.Mesh(
      new THREE.TorusGeometry(2.05, 0.006, 8, 180),
      new THREE.MeshBasicMaterial({
        color: 0x9680ff,
        transparent: true,
        opacity: 0.48
      })
    );

    orbitOne.rotation.set(1.15, 0.25, 0.2);
    sculpture.add(orbitOne);

    const orbitTwo = new THREE.Mesh(
      new THREE.TorusGeometry(2.3, 0.004, 8, 180),
      new THREE.MeshBasicMaterial({
        color: 0xd7ff7a,
        transparent: true,
        opacity: 0.32
      })
    );

    orbitTwo.rotation.set(0.25, 1.05, -0.3);
    sculpture.add(orbitTwo);

    // Floating particles
    const particlePositions = [];

    for (let i = 0; i < 220; i++) {
      const radius = 2.2 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(particlePositions, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xcac3ff,
        size: 0.018,
        transparent: true,
        opacity: 0.7
      })
    );

    scene.add(particles);

    // Pointer interaction
    const visual = canvas.parentElement;

    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;

    visual.addEventListener('pointermove', event => {
      const bounds = visual.getBoundingClientRect();

      targetX =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.55;

      targetY =
        ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.4;
    }, { passive: true });

    visual.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
    }, { passive: true });

    // Responsive renderer
    function resizeScene() {
      const width = Math.max(1, visual.clientWidth);
      const height = Math.max(1, visual.clientHeight);

      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.position.z = width < 500 ? 9.5 : 8.8;

      camera.updateProjectionMatrix();
    }

    const resizeObserver = new ResizeObserver(resizeScene);
    resizeObserver.observe(visual);
    resizeScene();

    // Animation loop
    const clock = new THREE.Clock();
    let animationFrame = null;
    let isVisible = true;

    function animate() {
      if (!isVisible || document.hidden) return;

      animationFrame = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;

      if (!reducedMotion) {
        sculpture.rotation.y = time * 0.12 + pointerX;
        sculpture.rotation.x =
          Math.sin(time * 0.22) * 0.1 + pointerY;

        ringOne.rotation.z =
          -0.48 + Math.sin(time * 0.28) * 0.08;

        ringTwo.rotation.y = 0.2 + time * 0.08;
        orbitOne.rotation.z = 0.2 + time * 0.035;
        particles.rotation.y = time * 0.018;

        crystal.scale.setScalar(
          1 + Math.sin(time * 1.1) * 0.035
        );
      }

      renderer.render(scene, camera);
    }

    function startAnimation() {
      if (isVisible && !document.hidden && animationFrame === null) {
        animate();
      }
    }

    function stopAnimation() {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });

    startAnimation();

  } catch (error) {
    console.error('3D scene unavailable:', error);
    // The rest of the website remains usable if WebGL fails.
  }
}

// =====================================
// 5. WORKING ENQUIRY FORM
// =====================================

// IMPORTANT: Replace this with your real business email.
const STUDIO_EMAIL = 'YOUR_EMAIL@example.com';

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm?.addEventListener('submit', event => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  if (
    STUDIO_EMAIL === 'YOUR_EMAIL@example.com' ||
    !STUDIO_EMAIL.includes('@')
  ) {
    formStatus.textContent =
      'Please configure your business email in script.js before submitting.';
    return;
  }

  const data = new FormData(contactForm);

  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const service = String(data.get('service') || '').trim();
  const details = String(data.get('details') || '').trim();

  const subject = `Aeterna project enquiry — ${name}`;

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Service: ${service}`,
    '',
    'Project details:',
    details || 'Not provided'
  ].join('\n');

  const mailto =
    `mailto:${STUDIO_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  formStatus.textContent =
    'Opening your email application with your enquiry prepared.';

  window.location.href = mailto;
});

// =====================================
// 6. FOOTER YEAR
// =====================================

document.getElementById('year').textContent =
  new Date().getFullYear();

// =====================================
// 7. PROJECT CARD TILT
// =====================================

if (
  !reducedMotion &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches
) {
  document.querySelectorAll('.project-image').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();

      const x =
        (event.clientX - bounds.left) / bounds.width - 0.5;

      const y =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateX(${-y * 2}deg) rotateY(${x * 2}deg)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
