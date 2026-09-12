const DISCIPLINE_ORDER = ["rendimiento", "funcional", "hyrox", "personalizado"];

function initHeaderScroll() {
  const header = document.getElementById("site-header");
  const hero = document.getElementById("hero");
  if (!header || !hero) return;

  let isPastHero = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      isPastHero = !entry.isIntersecting;
      header.classList.toggle("is-solid", isPastHero);
      if (!isPastHero) header.classList.remove("is-hidden");
    },
    { rootMargin: "-90% 0px 0px 0px" }
  );
  observer.observe(hero);

  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (isPastHero) {
        const scrollingDown = y > lastY + 4;
        const scrollingUp = y < lastY - 4;
        if (scrollingDown) header.classList.add("is-hidden");
        else if (scrollingUp) header.classList.remove("is-hidden");
      }
      lastY = y;
    },
    { passive: true }
  );
}

function initNavOverlay() {
  const toggle = document.getElementById("nav-toggle");
  const close = document.getElementById("nav-close");
  const overlay = document.getElementById("nav-overlay");
  if (!toggle || !overlay) return;

  const open = () => {
    overlay.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    overlay.removeAttribute("aria-hidden");
    const firstLink = overlay.querySelector("a");
    if (firstLink) firstLink.focus();
  };

  const closeOverlay = () => {
    overlay.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");
    toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = overlay.classList.contains("is-open");
    isOpen ? closeOverlay() : open();
  });

  close?.addEventListener("click", closeOverlay);

  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });

  overlay.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("click", () => {
      if (el === close) return;
      closeOverlay();
    });
  });
}

function initDisciplinesScrollSpy() {
  const ring = document.getElementById("compass-ring");
  const cards = document.querySelectorAll(".discipline-card");
  const nodes = document.querySelectorAll(".compass-node");
  if (!ring || !cards.length) return;

  const setActive = (discipline) => {
    const index = DISCIPLINE_ORDER.indexOf(discipline);
    if (index === -1) return;
    ring.style.setProperty("--angle", `${-90 * index}deg`);
    nodes.forEach((node) => {
      node.classList.toggle("is-active", node.dataset.discipline === discipline);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.dataset.discipline);
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  cards.forEach((card) => observer.observe(card));
  setActive(DISCIPLINE_ORDER[0]);
}

function initReasonsCarousel() {
  const viewport = document.getElementById("carousel-viewport");
  const track = document.getElementById("carousel-track");
  const prev = document.getElementById("carousel-prev");
  const next = document.getElementById("carousel-next");
  const dotsWrap = document.getElementById("carousel-dots");
  if (!viewport || !track) return;

  const cards = Array.from(track.children);
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
  const n = cards.length;
  const step = window.matchMedia("(min-width: 768px)").matches ? 340 : 210;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTOPLAY_MS = 3000;

  // Signed circular distance, so the last card sits left of the first and the loop never ends.
  const wrap = (d) => {
    const m = ((d % n) + n) % n;
    return m > n / 2 ? m - n : m;
  };

  const offsets = new Array(n).fill(null);
  let active = 0;
  let timer = null;
  let paused = false;

  const render = (moved) => {
    cards.forEach((card, i) => {
      const d = wrap(i - active);
      // A card that wraps around the loop jumps between the hidden edges; skip its transition so it doesn't sweep across.
      const teleport = offsets[i] !== null && d !== offsets[i] - moved;
      if (teleport) card.style.transition = "none";
      const abs = Math.abs(d);
      card.style.transform = `translateX(${d * step}px) scale(${1 - abs * 0.08})`;
      card.style.opacity = abs <= 2 ? "1" : "0";
      card.style.zIndex = String(10 - abs);
      if (teleport) {
        void card.offsetWidth;
        card.style.transition = "";
      }
      offsets[i] = d;
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
  };

  const goTo = (target) => {
    const moved = wrap(target - active);
    active = ((target % n) + n) % n;
    render(moved);
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    stop();
    if (reduceMotion || paused) return;
    timer = window.setInterval(() => goTo(active + 1), AUTOPLAY_MS);
  };

  const manual = (target) => {
    goTo(target);
    start();
  };

  prev?.addEventListener("click", () => manual(active - 1));
  next?.addEventListener("click", () => manual(active + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => manual(i)));

  const setPaused = (value) => {
    paused = value;
    start();
  };
  viewport.addEventListener("mouseenter", () => setPaused(true));
  viewport.addEventListener("mouseleave", () => setPaused(false));
  track.closest(".reasons-carousel").addEventListener("focusin", (e) => {
    if (e.target.matches(":focus-visible")) setPaused(true);
  });
  track.closest(".reasons-carousel").addEventListener("focusout", () => setPaused(false));

  render(0);
  start();
}

function initHeroTypewriter() {
  const headline = document.getElementById("hero-headline");
  if (!headline) return;

  const CHAR_MS = 60;
  const LINE_PAUSE_MS = 320;
  const START_MS = 350;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lines = Array.from(headline.querySelectorAll(".hero__line"));
  const fullText = lines.map((line) => line.textContent.trim()).join(" ");
  const chars = [];
  const lineEnds = new Set();

  // Every letter is laid out from the start (just hidden), so the text never reflows while typing.
  lines.forEach((line) => {
    const words = line.textContent.trim().split(" ");
    line.textContent = "";
    line.setAttribute("aria-hidden", "true");
    words.forEach((word, wordIndex) => {
      const wordEl = document.createElement("span");
      wordEl.className = "hero__word";
      for (const letter of word) {
        const charEl = document.createElement("span");
        charEl.className = reduceMotion ? "hero__char" : "hero__char is-pending";
        charEl.textContent = letter;
        wordEl.append(charEl);
        chars.push(charEl);
      }
      line.append(wordEl);
      if (wordIndex < words.length - 1) line.append(" ");
    });
    lineEnds.add(chars.length - 1);
  });

  const label = document.createElement("span");
  label.className = "sr-only";
  label.textContent = fullText;
  headline.append(label);
  headline.classList.add("is-ready");
  if (reduceMotion) return;

  let index = 0;
  const typeNext = () => {
    chars[index].classList.remove("is-pending");
    const delay = lineEnds.has(index) ? LINE_PAUSE_MS : CHAR_MS + (Math.random() * 30 - 15);
    index += 1;
    if (index < chars.length) window.setTimeout(typeNext, delay);
  };
  window.setTimeout(typeNext, START_MS);
}

function initResultadoEsfuerzoCrossfade() {
  const left = document.getElementById("loop-word-left");
  const right = document.getElementById("loop-word-right");
  if (!left || !right) return;

  window.setInterval(() => {
    left.classList.toggle("is-shown");
    right.classList.toggle("is-shown");
  }, 2600);
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroTypewriter();
  initHeaderScroll();
  initNavOverlay();
  initDisciplinesScrollSpy();
  initReasonsCarousel();
  initResultadoEsfuerzoCrossfade();
});
