const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.body.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.focus();
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const publicationSearch = document.querySelector("#publication-search");
const publicationYear = document.querySelector("#publication-year");
const publicationItems = [...document.querySelectorAll(".publication")];
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty-state");

function filterPublications() {
  const query = publicationSearch?.value.trim().toLocaleLowerCase() ?? "";
  const selectedYear = publicationYear?.value ?? "";
  let count = 0;

  publicationItems.forEach((publication) => {
    const matchesQuery = !query || publication.textContent.toLocaleLowerCase().includes(query);
    const matchesYear = !selectedYear || publication.dataset.year === selectedYear;
    const visible = matchesQuery && matchesYear;
    publication.hidden = !visible;
    count += Number(visible);
  });

  if (visibleCount) visibleCount.textContent = String(count);
  if (emptyState) emptyState.hidden = count !== 0;
}

publicationSearch?.addEventListener("input", filterPublications);
publicationYear?.addEventListener("change", filterPublications);
