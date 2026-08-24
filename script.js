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
  });
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!reduceMotion.matches) {
  document.documentElement.classList.add("motion-ready");

  const revealTargets = document.querySelectorAll(
    ".hero-meta, .hero-grid > *, .ticker, .section-head, .filter-bar, .project-card, .many-more, .about > *, .capabilities > *, .contact .wrap > *, .footer > *",
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
