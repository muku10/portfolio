const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "Close" : "Menu";
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  });
});

document.querySelectorAll(".filter").forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    filterButton.classList.add("active");
    const selectedFilter = filterButton.dataset.filter;

    document.querySelectorAll(".project-card").forEach((project) => {
      const shouldShow =
        selectedFilter === "all" || project.dataset.category === selectedFilter;
      project.classList.toggle("is-hidden", !shouldShow);
    });

    updateRadialGallery();
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const radialGallery = document.querySelector(".project-grid");
const radialCards = radialGallery
  ? Array.from(radialGallery.querySelectorAll(".project-card"))
  : [];
const radialMotion = window.matchMedia("(min-width: 900px)");

const updateRadialGallery = () => {
  if (!radialGallery) return;

  if (reduceMotion.matches || !radialMotion.matches) {
    radialGallery.style.removeProperty("--visible-count");
    radialGallery.style.removeProperty("--gallery-progress");
    radialCards.forEach((card) => {
      card.classList.remove("is-active");
      card.style.removeProperty("--radial-x");
      card.style.removeProperty("--radial-y");
      card.style.removeProperty("--radial-rotate");
      card.style.removeProperty("--radial-scale");
      card.style.removeProperty("--radial-opacity");
      card.style.removeProperty("--radial-z");
    });
    return;
  }

  const visibleCards = radialCards.filter(
    (card) => !card.classList.contains("is-hidden"),
  );
  const cardCount = visibleCards.length;

  radialCards.forEach((card) => card.classList.remove("is-active"));

  if (!cardCount) return;

  const galleryRect = radialGallery.getBoundingClientRect();
  const scrollable =
    radialGallery.offsetHeight - Math.max(window.innerHeight, 1);
  const rawProgress =
    scrollable > 0 ? Math.min(Math.max(-galleryRect.top / scrollable, 0), 1) : 0;
  const radius = Math.min(window.innerWidth * 0.28, 430);
  const arc = 220;
  const startAngle = -170;
  const rotation = rawProgress * (arc + 70);
  let activeCard = visibleCards[0];
  let activeDistance = Infinity;

  radialGallery.style.setProperty("--gallery-progress", rawProgress.toFixed(3));
  radialGallery.style.setProperty("--visible-count", String(cardCount));

  visibleCards.forEach((card, index) => {
    const spread = cardCount === 1 ? 0 : (index / (cardCount - 1)) * arc;
    const angle = startAngle + spread - rotation;
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius * 0.42;
    const focusDistance = Math.abs(angle + 90);
    const normalizedFocus = Math.max(0, 1 - focusDistance / 95);
    const scale = 0.72 + normalizedFocus * 0.28;
    const opacity = 0.28 + normalizedFocus * 0.72;
    const zIndex = Math.round(normalizedFocus * 100);

    card.style.setProperty("--radial-x", `${x.toFixed(2)}px`);
    card.style.setProperty("--radial-y", `${y.toFixed(2)}px`);
    card.style.setProperty("--radial-rotate", `${((angle + 90) * 0.08).toFixed(2)}deg`);
    card.style.setProperty("--radial-scale", scale.toFixed(3));
    card.style.setProperty("--radial-opacity", opacity.toFixed(3));
    card.style.setProperty("--radial-z", String(zIndex));

    if (focusDistance < activeDistance) {
      activeDistance = focusDistance;
      activeCard = card;
    }
  });

  activeCard.classList.add("is-active");
};

if (!reduceMotion.matches) {
  document.documentElement.classList.add("motion-ready");

  const revealTargets = document.querySelectorAll(
    ".hero-meta, .hero-statement > *, .hero-stats, .clients, .section-head, .filter-bar, .project-card, .many-more, .about > *, .capabilities > *, .experience > *, .contact .wrap > *",
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-item");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}

if (radialGallery && !reduceMotion.matches) {
  document.documentElement.classList.add("radial-gallery-ready");
  radialCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      radialCards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });
  updateRadialGallery();
  window.addEventListener("scroll", updateRadialGallery, { passive: true });
  window.addEventListener("resize", updateRadialGallery);
  radialMotion.addEventListener("change", updateRadialGallery);
}

const finePointer = window.matchMedia("(pointer: fine)");

if (finePointer.matches && !reduceMotion.matches) {
  const cursorDot = document.createElement("span");
  const cursorRing = document.createElement("span");
  cursorDot.className = "cursor-dot";
  cursorRing.className = "cursor-ring";
  cursorDot.setAttribute("aria-hidden", "true");
  cursorRing.setAttribute("aria-hidden", "true");
  document.body.append(cursorDot, cursorRing);
  document.documentElement.classList.add("custom-cursor");

  let pointerX = -40;
  let pointerY = -40;
  let ringX = -40;
  let ringY = -40;

  const drawCursor = () => {
    ringX += (pointerX - ringX) * 0.16;
    ringY += (pointerY - ringY) * 0.16;
    cursorDot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(drawCursor);
  };

  window.addEventListener("mousemove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    document.body.classList.add("cursor-active");
  });

  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active");
  });

  document.querySelectorAll("a, button").forEach((element) => {
    element.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    element.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });

  drawCursor();
}
