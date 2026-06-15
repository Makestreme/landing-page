const formspreeEndpoint = "https://formspree.io/f/xaqzvqjn"; 

const fallbackStats = {
  youtube: {
    subscribers: 1300,
    totalViews: 100000,
    averageViews: 10000,
    uploadFrequency: "1 video every 1–2 months",
  },
  instructables: {
    totalViews: 272360,
    averageViews: 5000
  }
};

const statsOrder = [
  {
    label: "YouTube subs",
    key: "subscribers",
    source: ["youtube", "subscribers"],
    note: "Not Live"
  },
  {
    label: "YouTube views",
    key: "totalViews",
    source: ["youtube", "totalViews"],
    note: "Channel reach"
  },
  {
    label: "Avg views/project",
    key: "averageViews",
    source: ["youtube", "averageViews"],
    note: "Youtube & blog articles"
  },
  {
    label: "Instructables views",
    key: "totalViews",
    source: ["instructables", "totalViews"],
    note: "Maker platform reach"
  }
];

const projects = [
  {
    title: "Gus 2.0",
    summary: "A DIY desktop robot engineered to dynamically react to ambient environmental conditions.",
    views: "42K views",
    platform: "YouTube",
    image: "assets/gus2.jpg",
    link: "https://www.youtube.com/watch?v=7ENqXEEsdDk"
  },
  {
    title: "AI TARS from Interstellar",
    summary: "A kinetic mini TARS model designed to display real-time weather data with humor.",
    views: "16K views",
    platform: "YouTube",
    image: "assets/tars.jpg",
    link: "https://www.youtube.com/watch?v=rHpdiPKCmu4" 
  },
  {
    title: "Piano Doorbell",
    summary: "A fully functional doorbell prototype styled and mapped to operate as a miniature piano.",
    views: "12K views",
    platform: "YouTube",
    image: "assets/piano.jpg",
    link: "https://www.youtube.com/watch?v=Bk9v_OFMDGc"
  }
];

const sponsors = [
  {
    name: "Seeed Studio",
    logo: "assets/seeed.png",
    type: "YouTube collaborations",
    link: "https://www.youtube.com/watch?v=RsGSLHwGIJE"
  },
  {
    name: "Justway",
    logo: "assets/justway.png",
    type: "Sponsored videos",
    link: "https://www.youtube.com/watch?v=rHpdiPKCmu4"
  },
  {
    name: "JLCMC",
    logo: "assets/jlcmc.png",
    type: "Promotional collaboration",
    link: "https://www.youtube.com/watch?v=Bk9v_OFMDGc"
  },
  {
    name: "NextPCB",
    logo: "assets/nextpcb.png",
    type: "Sponsored video",
    link: "https://www.youtube.com/watch?v=2Uw320aVgYI&t=3s&pp=0gcJCUELAYcqIYzv"
  },
  {
    name: "Arylic",
    logo: "assets/arylic.png",
    type: "Instructables collaboration",
    link: "https://www.instructables.com/Portable-Bluetooth-Wifi-Speaker/"
  }
];

const services = [
  "Product reviews",
  "Sponsored tutorials",
  "DIY builds",
  "Electronics projects",
  "Educational content",
  "Custom prototyping"
];

function compact(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

async function loadStats() {
  try {
    const response = await fetch("stats.json", { cache: "no-store" });
    if (!response.ok) throw new Error("stats.json unavailable");
    return await response.json();
  } catch {
    return { ...fallbackStats, updatedAt: null };
  }
}

function renderStats(stats) {
  const grid = document.getElementById("stats-grid");
  const profileStats = document.getElementById("profile-stats");

  const rows = statsOrder.map((item) => {
    const section = stats?.[item.source[0]] || {};
    const raw = section[item.source[1]] ?? fallbackStats[item.source[0]][item.source[1]];
    return {
      label: item.label,
      value: compact(raw),
      note: item.note
    };
  });

  grid.innerHTML = rows.map((row) => `
    <article class="stat-card">
      <span class="label">${row.label}</span>
      <span class="value">${row.value}</span>
      <span class="note">${row.note}</span>
    </article>
  `).join("");

  // This section now dynamically pulls upload frequency, age, and gender from the JSON
  profileStats.innerHTML = `
    <span class="mini-stat">YouTube: ${compact(stats?.youtube?.subscribers ?? fallbackStats.youtube.subscribers)} subs</span>
    <span class="mini-stat">Upload: ${stats?.youtube?.uploadFrequency ?? fallbackStats.youtube.uploadFrequency}</span>
  `;
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  grid.innerHTML = projects.map((project) => `
    <article class="project-card">
      <div class="project-media">
        <img src="${project.image}" alt="${project.title} thumbnail" loading="lazy" />
      </div>
      <div class="project-body">
        <div class="badges"><span class="badge">${project.platform}</span></div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="project-meta">
          <span><b>${project.views}</b></span>
        </div>
        ${project.link ? `<a class="card-link" href="${project.link}" target="_blank" rel="noopener">Open</a>` : ""}
      </div>
    </article>
  `).join("");
}

function renderSponsors() {
  const grid = document.getElementById("sponsors-grid");
  grid.innerHTML = sponsors.map((sponsor) => `
    <article class="sponsor-card">
      <img class="sponsor-logo" src="${sponsor.logo}" alt="${sponsor.name} logo" loading="lazy" />
      <div>
        <h3>${sponsor.name}</h3>
        <p>${sponsor.type}</p>
      </div>
      <a class="card-link" href="${sponsor.link}" target="_blank" rel="noopener">Example work</a>
    </article>
  `).join("");
}

function renderServices() {
  const list = document.getElementById("services-list");
  list.innerHTML = services.map((service) => `<li>${service}</li>`).join("");
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const subject = (formData.get("subject") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    // Sends securely if Formspree is setup
    if (formspreeEndpoint.trim()) {
      try {
        const response = await fetch(formspreeEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData
        });
        if (response.ok) {
          form.reset();
          alert("Message sent successfully. I will get back to you soon!");
          return;
        }
      } catch {
        // Formspree failed, fall through to mailto
      }
    }

    // Mailto fallback if Formspree is not connected or fails
    const mailto = new URL("mailto:makestreme@gmail.com");
    mailto.searchParams.set("subject", subject || "Partnership Inquiry");
    mailto.searchParams.set("body", [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message
    ].join("\n"));
    window.location.href = mailto.toString();
  });
}

function setCopyrightYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

async function init() {
  const stats = await loadStats();
  renderStats(stats);
  renderProjects();
  renderSponsors();
  renderServices();
  setupContactForm();
  setCopyrightYear(); 
}

init();
