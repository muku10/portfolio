/* ========================================
   PREMIUM ANIMATION SYSTEM
   ======================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");

/* ===== PAGE LOADER ===== */
const loader = document.querySelector(".page-loader");
if (loader && !reduceMotion.matches) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("is-done");
      document.body.classList.add("is-loaded");
      // Trigger split text after loader
      setTimeout(() => {
        document.querySelectorAll(".split-text").forEach((el) => {
          el.classList.add("is-animated");
        });
      }, 200);
    }, 2000);
  });
} else if (loader) {
  loader.style.display = "none";
}

/* ===== SPLIT TEXT ===== */
if (!reduceMotion.matches) {
  document.querySelectorAll(".split-text").forEach((el) => {
    if (!el.classList.contains("is-animated")) {
      // Already handled by loader for hero, but ensure others animate on scroll
    }
  });
}

/* ===== SCROLL REVEAL SYSTEM ===== */
if (!reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Trigger split text inside
          entry.target.querySelectorAll(".split-text").forEach((st) => {
            st.classList.add("is-animated");
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8%" },
  );

  document
    .querySelectorAll(
      ".reveal-fade, .reveal-para, .reveal-stat, .reveal-text, .stagger-children, .parallax-img",
    )
    .forEach((el) => revealObserver.observe(el));

  // Stagger children observer
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -5%" },
  );
  document.querySelectorAll(".stagger-children").forEach((el) => staggerObserver.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
if (!reduceMotion.matches) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const startTime = performance.now();

        const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutExpo(progress);
          const current = Math.round(eased * target);
          el.textContent = current;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  document.querySelectorAll("[data-target]").forEach((el) => counterObserver.observe(el));
}

/* ===== MAGNETIC ELEMENTS ===== */
if (finePointer.matches && !reduceMotion.matches) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
}

/* ===== SMOOTH PARALLAX ON SCROLL ===== */
if (!reduceMotion.matches && finePointer.matches) {
  const parallaxElements = document.querySelectorAll(".parallax-img");
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      parallaxElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const progress = (rect.top / window.innerHeight) * -30;
        const img = el.querySelector("img");
        if (img) {
          img.style.transform = `translateY(${progress}px) scale(1.05)`;
        }
      });
      ticking = false;
    });
  }, { passive: true });
}

/* ===== CUSTOM CURSOR ===== */
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
    ringX += (pointerX - ringX) * 0.14;
    ringY += (pointerY - ringY) * 0.14;
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

  document.addEventListener("mousedown", () => {
    document.body.classList.add("cursor-pressed");
  });
  document.addEventListener("mouseup", () => {
    document.body.classList.remove("cursor-pressed");
  });

  document.querySelectorAll("a, button, .filter, .shot").forEach((element) => {
    element.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    element.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });

  drawCursor();
}

/* ===== HEADER SCROLL EFFECT ===== */
const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  let lastScroll = 0;
  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        siteHeader.classList.add("is-scrolled");
      } else {
        siteHeader.classList.remove("is-scrolled");
      }
      lastScroll = currentScroll;
    },
    { passive: true },
  );
}

/* ===== MOBILE MENU ===== */
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
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
}

/* ===== FILTER SYSTEM ===== */
document.querySelectorAll(".filter").forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
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

/* ===== RADIAL GALLERY ===== */
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
  const scrollable = radialGallery.offsetHeight - Math.max(window.innerHeight, 1);
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

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
