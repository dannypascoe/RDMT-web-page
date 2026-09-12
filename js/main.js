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

  const REVEAL_ZONE_PX = 80;
  let lastY = window.scrollY;
  let pointerAtTop = false;
  let shownByPointer = false;

  const show = () => header.classList.remove("is-hidden");
  const hide = () => {
    if (!isPastHero || pointerAtTop || header.contains(document.activeElement)) return;
    header.classList.add("is-hidden");
  };

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (isPastHero) {
        if (y > lastY + 4) hide();
        else if (y < lastY - 4) {
          shownByPointer = false;
          show();
        }
      }
      lastY = y;
    },
    { passive: true }
  );

  // Reveal while the mouse sits in the strip where the header lives, whether or not the page is scrolling.
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      const atTop = e.clientY <= REVEAL_ZONE_PX;
      if (atTop === pointerAtTop) return;
      pointerAtTop = atTop;
      if (atTop) {
        shownByPointer = header.classList.contains("is-hidden");
        show();
      } else if (shownByPointer) {
        shownByPointer = false;
        hide();
      }
    },
    { passive: true }
  );

  header.addEventListener("focusin", show);
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

function initGalleryLightbox() {
  const dialog = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const backdrop = dialog?.querySelector(".lightbox__backdrop");
  const closeBtn = dialog?.querySelector(".lightbox__close");
  const triggers = document.querySelectorAll(".gallery__item");
  if (!dialog || !img || !backdrop || !closeBtn || !triggers.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const OPEN_MS = 450;
  const CLOSE_MS = 320;
  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  let trigger = null;
  let busy = false;

  // Transform that puts the enlarged image back over the thumbnail it came from.
  const thumbTransform = () => {
    const t = trigger.getBoundingClientRect();
    const f = img.getBoundingClientRect();
    const dx = t.left + t.width / 2 - (f.left + f.width / 2);
    const dy = t.top + t.height / 2 - (f.top + f.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${t.width / f.width})`;
  };

  const open = async (button) => {
    if (busy) return;
    busy = true;
    trigger = button;
    const thumb = button.querySelector("img");
    img.src = thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    img.style.opacity = "0";
    document.documentElement.classList.add("has-lightbox");
    dialog.showModal();
    await img.decode().catch(() => {});
    if (reduceMotion) {
      img.style.opacity = "";
    } else {
      backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: OPEN_MS, easing: EASE });
      closeBtn.animate([{ opacity: 0 }, { opacity: 1 }], { duration: OPEN_MS, easing: EASE });
      const zoom = img.animate(
        [
          { transform: thumbTransform(), opacity: 0.6 },
          { transform: "none", opacity: 1 },
        ],
        { duration: OPEN_MS, easing: EASE }
      );
      img.style.opacity = "";
      await zoom.finished;
    }
    busy = false;
  };

  const close = async () => {
    if (busy || !dialog.open) return;
    busy = true;
    if (!reduceMotion) {
      backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS, easing: EASE, fill: "forwards" });
      closeBtn.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS * 0.6, easing: EASE, fill: "forwards" });
      await img.animate(
        [
          { transform: "none", opacity: 1 },
          { transform: thumbTransform(), opacity: 0 },
        ],
        { duration: CLOSE_MS, easing: EASE, fill: "forwards" }
      ).finished;
    }
    dialog.close();
    [...img.getAnimations(), ...backdrop.getAnimations(), ...closeBtn.getAnimations()].forEach((a) => a.cancel());
    document.documentElement.classList.remove("has-lightbox");
    trigger?.focus({ preventScroll: true });
    busy = false;
  };

  triggers.forEach((button) => button.addEventListener("click", () => open(button)));
  dialog.addEventListener("click", close);
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
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
  initGalleryLightbox();
  initResultadoEsfuerzoCrossfade();
});
