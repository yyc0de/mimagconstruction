// ================================================================
// MIMAG WEBSITE — INTERACTIONS
// ================================================================
// Most editable content lives in js/site-data.js.
// This file handles rendering, navigation, galleries and the form.
// ================================================================

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const header = $("#site-header");
const backTop = $("#backTop");
const menuToggle = $("#menuToggle");
const mobilePanel = $("#mobilePanel");
const projectGrid = $("#projectGrid");
const certificateGrid = $("#certificateGrid");
const certificateCount = $("#certificateCount");

// ---------------------------------------------------------------
// COMPANY INFORMATION — rendered from js/site-data.js
// ---------------------------------------------------------------
function applyCompanyData() {
  const emailLinks = $$('a[href^="mailto:"]');
  const phoneLinks = $$('a[href^="tel:"]');

  emailLinks.forEach(link => {
    link.href = `mailto:${COMPANY.email}`;
    link.textContent = COMPANY.email;
  });

  const phoneMap = {
    "+63 927 388 3486": "+639273883486",
    "+63 991 736 7724": "+639917367724"
  };
  phoneLinks.forEach((link, index) => {
    const phone = COMPANY.phones[index % COMPANY.phones.length];
    if (!phone) return;
    link.href = `tel:${phoneMap[phone] || phone.replace(/[^\d+]/g, "")}`;
    link.textContent = phone;
  });

  $$(".contact-details .detail-value").forEach(el => {
    if (el.tagName === "A" && el.href.startsWith("mailto:")) {
      el.textContent = COMPANY.email;
    }
  });
}

// ---------------------------------------------------------------
// PROJECT RENDERING
// ---------------------------------------------------------------
function renderProjects(filter = "all") {
  projectGrid.innerHTML = "";

  projects.forEach((project, index) => {
    if (filter !== "all" && project.category !== filter) return;

    const card = document.createElement("article");
    card.className = "project reveal visible";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View ${project.title} project gallery`);
    card.dataset.index = String(index);

    const firstImage = project.images?.[0] || "";
    card.innerHTML = `
      <div class="project-media">
        <img src="${escapeAttr(firstImage)}" alt="${escapeAttr(project.title)} project imagery" loading="lazy">
      </div>
      <div class="project-body">
        <div class="project-location">${escapeHtml(project.location || "")}</div>
        <h3>${escapeHtml(project.title || "Untitled Project")}</h3>
        <div class="project-cost">${escapeHtml(project.cost || "")}</div>
      </div>
      <div class="project-link" aria-hidden="true">↗</div>
    `;

    card.addEventListener("click", () => openProject(index, card));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(index, card);
      }
    });

    projectGrid.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

// ---------------------------------------------------------------
// CERTIFICATE RENDERING
// ---------------------------------------------------------------
function renderCertificates() {
  if (!certificateGrid) return;

  certificateGrid.innerHTML = "";
  if (certificateCount) {
    const count = certifications.length;
    certificateCount.textContent = `${count} ${count === 1 ? "document" : "documents"}`;
  }
  certifications.forEach((certificate, index) => {
    const figure = document.createElement("figure");
    figure.className = "certificate-card reveal visible";
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `View ${certificate.title}`);
    figure.dataset.index = String(index);
    figure.innerHTML = `
      <img src="${escapeAttr(certificate.image)}" alt="${escapeAttr(certificate.title)}" loading="lazy">
      <figcaption>${escapeHtml(certificate.title)}</figcaption>
    `;
    figure.addEventListener("click", () => openCertificate(index, figure));
    figure.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCertificate(index, figure);
      }
    });
    certificateGrid.appendChild(figure);
  });
}

// ---------------------------------------------------------------
// SHARED PROJECT / CERTIFICATE LIGHTBOX
// ---------------------------------------------------------------
const modal = $("#projectModal");
const modalCard = $(".modal-card", modal);
const modalImage = $("#modalImage");
const modalTitle = $("#modalTitle");
const modalLocation = $("#modalLocation");
const modalCost = $("#modalCost");
const modalScope = $("#modalScope");
const modalSource = $("#modalSource");
const modalCostWrap = $("#modalCostWrap");
const modalClose = $("#modalClose");
const galleryThumbs = $("#galleryThumbs");
const galleryPrev = $("#galleryPrev");
const galleryNext = $("#galleryNext");
const galleryCount = $("#galleryCount");

let viewerItems = [];
let viewerIndex = 0;
let viewerType = "project";
let lastFocused = null;

function openProject(index, sourceElement) {
  const project = projects[index];
  if (!project || !project.images?.length) return;

  viewerType = "project";
  viewerItems = project.images;
  viewerIndex = 0;
  lastFocused = sourceElement;

  modal.classList.remove("modal-certificate");
  modalTitle.textContent = project.title || "Project";
  modalLocation.textContent = project.location || "";
  modalScope.textContent = project.description || "";
  modalSource.textContent = "MIMAG Company Profile";
  modalCostWrap.hidden = !project.cost;
  if (project.cost) $("#modalCost").textContent = project.cost;

  renderViewer();
  openModal();
}

function openCertificate(index, sourceElement) {
  const certificate = certifications[index];
  if (!certificate) return;

  viewerType = "certificate";
  viewerItems = certifications.map(item => item.image);
  viewerIndex = index;
  lastFocused = sourceElement;

  modal.classList.add("modal-certificate");
  modalTitle.textContent = certificate.title;
  modalLocation.textContent = "Registration / Accreditation";
  modalScope.textContent = "Actual certificate or registration image reproduced from the latest supplied MIMAG Company Profile PDF.";
  modalSource.textContent = "MIMAG Company Profile · Sept. 16, 2026";
  modalCostWrap.hidden = true;

  renderViewer();
  openModal();
}

function renderViewer() {
  const item = viewerItems[viewerIndex];
  if (!item) return;

  modalImage.src = item;
  modalImage.alt = viewerType === "certificate"
    ? certifications[viewerIndex]?.title || "Certificate"
    : `${projects.find(p => p.images.includes(item))?.title || "Project"} project image`;

  galleryCount.textContent = `${viewerIndex + 1} / ${viewerItems.length}`;
  galleryPrev.hidden = viewerItems.length <= 1;
  galleryNext.hidden = viewerItems.length <= 1;

  galleryThumbs.innerHTML = "";
  viewerItems.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `gallery-thumb${index === viewerIndex ? " active" : ""}`;
    button.setAttribute("aria-label", `View image ${index + 1}`);
    button.innerHTML = `<img src="${escapeAttr(image)}" alt="" loading="lazy">`;
    button.addEventListener("click", () => {
      viewerIndex = index;
      renderViewer();
    });
    galleryThumbs.appendChild(button);
  });

  requestAnimationFrame(() => {
    const active = $(".gallery-thumb.active", galleryThumbs);
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });
}

function changeViewer(delta) {
  if (viewerItems.length <= 1) return;
  viewerIndex = (viewerIndex + delta + viewerItems.length) % viewerItems.length;
  if (viewerType === "certificate") {
    const certificate = certifications[viewerIndex];
    modalTitle.textContent = certificate.title;
  }
  renderViewer();
}

function openModal() {
  modal.classList.add("open");
  document.body.classList.add("menu-open");
  modal.setAttribute("aria-hidden", "false");
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove("open");
  document.body.classList.remove("menu-open");
  modal.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus();
}

modalClose.addEventListener("click", closeModal);
galleryPrev.addEventListener("click", () => changeViewer(-1));
galleryNext.addEventListener("click", () => changeViewer(1));

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
  if (!modal.classList.contains("open")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") changeViewer(-1);
  if (event.key === "ArrowRight") changeViewer(1);
});

modalImage.addEventListener("error", () => {
  modalImage.alt = "Image could not be loaded.";
  modalImage.style.visibility = "hidden";
});

modalImage.addEventListener("load", () => {
  modalImage.style.visibility = "visible";
});

// ---------------------------------------------------------------
// NAVIGATION
// ---------------------------------------------------------------
function closeMobileMenu() {
  mobilePanel.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const open = mobilePanel.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
});

$$(".mobile-panel a").forEach(link => link.addEventListener("click", closeMobileMenu));

function updateActiveNavigation() {
  const sections = $$("main section[id]");
  const y = window.scrollY + 130;

  sections.forEach(section => {
    const active = y >= section.offsetTop && y < section.offsetTop + section.offsetHeight;
    $$(`a[href="#${section.id}"]`).forEach(link => link.classList.toggle("active", active));
  });
}

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
  backTop.classList.toggle("show", window.scrollY > 600);
  updateActiveNavigation();
}, { passive: true });

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------------------------------------------------------------
// PROJECT FILTERS
// ---------------------------------------------------------------
$$(".filter").forEach(button => {
  button.addEventListener("click", () => {
    $$(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter || "all");
  });
});

// ---------------------------------------------------------------
// REVEAL ANIMATION
// ---------------------------------------------------------------
const observer = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

if (observer) {
  $$(".reveal").forEach(element => observer.observe(element));
} else {
  $$(".reveal").forEach(element => element.classList.add("visible"));
}

// ---------------------------------------------------------------
// CONTACT FORM
// ---------------------------------------------------------------
const form = $("#contactForm");
const status = $("#formStatus");

function showStatus(message, type) {
  status.textContent = message;
  status.className = `form-status show ${type}`;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value) {
  return /^[0-9+().\-\s]{7,40}$/.test(value);
}

form?.addEventListener("submit", async event => {
  event.preventDefault();
  status.className = "form-status";

  const data = Object.fromEntries(new FormData(form).entries());

  // Basic anti-spam check: bots that fill the hidden field are rejected.
  if (data.website) {
    showStatus("Your inquiry could not be submitted.", "error");
    return;
  }

  if (!data.name?.trim() || !data.email?.trim() || !data.phone?.trim() ||
      !data.service || !data.location?.trim() || !data.message?.trim()) {
    showStatus("Please complete all required fields.", "error");
    return;
  }

  if (!validEmail(data.email.trim())) {
    showStatus("Please enter a valid email address.", "error");
    return;
  }

  if (!validPhone(data.phone.trim())) {
    showStatus("Please enter a valid phone number.", "error");
    return;
  }

  if (data.message.trim().length < 15) {
    showStatus("Please provide a little more detail about the project.", "error");
    return;
  }

  form.classList.add("loading");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Unable to send your inquiry.");

    showStatus("Thank you. Your inquiry has been submitted successfully.", "success");
    form.reset();
  } catch (error) {
    showStatus(error.message || "We could not submit your inquiry. Please email MIMAG directly instead.", "error");
  } finally {
    form.classList.remove("loading");
  }
});

// ---------------------------------------------------------------
// INITIALIZE
// ---------------------------------------------------------------
applyCompanyData();
renderProjects();
renderCertificates();
$("#year").textContent = new Date().getFullYear();
updateActiveNavigation();
