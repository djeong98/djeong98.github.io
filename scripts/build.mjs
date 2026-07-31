import { readFile, writeFile } from "node:fs/promises";

const pages = JSON.parse(
  await readFile(new URL("../content/wordpress-pages.json", import.meta.url), "utf8"),
);

const bySlug = Object.fromEntries(pages.map((page) => [page.slug, page.content.rendered]));
const year = new Date().getFullYear();

const navItems = [
  ["Home", "index.html", "home"],
  ["Research", "research.html", "research"],
  ["Profile", "resume.html", "resume"],
  ["Publications", "publications.html", "publications"],
  ["Teaching", "teaching.html", "teaching"],
  ["Documents", "documents.html", "documents"],
];

const icon = (name) => {
  const icons = {
    arrow: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5"/></svg>',
    mail: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M2.5 5.5h15v10h-15zM3 6l7 5 7-5"/></svg>',
    external: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M8 4H4v12h12v-4M10 10l6-6M11 4h5v5"/></svg>',
    file: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M5 2.5h6l4 4v11H5zM11 2.5v4h4M7.5 11h5M7.5 14h4"/></svg>',
  };
  return icons[name];
};

function clean(html) {
  return html
    .replaceAll('target="_blanck"', 'target="_blank"')
    .replaceAll("Febluary", "February")
    .replace(
      /href="https:\/\/arxiv\.org\/abs\/\d{4}\.xxxxx"([^>]*)>\[arXiv:(\d{4}\.\d+)\]/g,
      'href="https://arxiv.org/abs/$2"$1>[arXiv:$2]',
    )
    .replace(
      /<a href=""[^>]*>(.*?)<\/a>/g,
      '<span class="publication-status">$1</span>',
    )
    .replaceAll(
      "https://sites.psu.edu/djeong/files/2024/01/djeong_diss-3bd19ee4e3f77a6a.pdf",
      "assets/documents/donghui-jeong-dissertation.pdf",
    );
}

const manualPublications = [
  `[118] Tristan S. Weaver, David Radice, <strong>Donghui Jeong</strong>, and Victor Liu<br />
<em>Gravitational Wave Modeling of White-Dwarf–Compact-Object Binaries and Observational Outlook</em><br />
<span class="publication-status">2026, arXiv preprint</span> <a href="https://arxiv.org/abs/2607.24951" target="_blank" rel="noopener">[arXiv:2607.24951]</a>`,
  `[116] Jeongin Moon, Eiichiro Komatsu, Robin Ciardullo, Olivia Curtis, Dustin Davis, Daniel J. Farrow, Karl Gebhardt, Caryl Gronwall, Laura Herold, Gary J. Hill, <strong>Donghui Jeong</strong>, Chenxu Liu, Maja Lujan Niemeyer, Erin Mentuch Cooper, Shiro Mukae, Shun Saito, Ariel G. Sánchez, and Donald P. Schneider<br />
<em>HETDEX [O II] galaxies at z ≤ 0.48: Volume-limited samples and their power spectra</em><br />
<span class="publication-status">2026, arXiv preprint</span> <a href="https://arxiv.org/abs/2607.08453" target="_blank" rel="noopener">[arXiv:2607.08453]</a>`,
];

function header(active) {
  const nav = navItems
    .map(
      ([label, href, id]) =>
        `<a href="${href}"${active === id ? ' aria-current="page"' : ""}>${label}</a>`,
    )
    .join("\n");

  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html" aria-label="Donghui Jeong — home">
          <span class="brand-mark" aria-hidden="true">
            <span class="brand-orbit"></span><span class="brand-core"></span>
          </span>
          <span><strong>Donghui Jeong</strong><small>Cosmology · Astrophysics</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span></span><span></span><span></span><span class="sr-only">Open navigation</span>
        </button>
        <nav class="site-nav" id="site-nav" aria-label="Primary navigation">${nav}</nav>
      </div>
    </header>`;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <a class="footer-name" href="index.html">Donghui Jeong</a>
          <p>Professor of Astronomy &amp; Astrophysics<br>The Pennsylvania State University</p>
        </div>
        <div class="footer-contact">
          <a href="mailto:djeong@psu.edu">${icon("mail")} djeong@psu.edu</a>
          <a href="https://science.psu.edu/astro/people/duj13" target="_blank" rel="noopener">Penn State profile ${icon("external")}</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} Donghui Jeong</span>
        <span>Exploring the Universe, one scale at a time.</span>
      </div>
    </footer>`;
}

function layout({ title, description, active, body, bodyClass = "" }) {
  const pageTitle =
    title === "Donghui Jeong"
      ? "Donghui Jeong — Astrophysicist & Cosmologist"
      : `${title} — Donghui Jeong`;
  const escapedTitle = pageTitle.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const escapedDescription = description.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#102c3b">
  <meta name="description" content="${escapedDescription}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDescription}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="assets/images/donghui-jeong.jpg">
  <title>${escapedTitle}</title>
  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/style.css">
  <script src="assets/js/main.js" defer></script>
</head>
<body class="${bodyClass}">
  ${header(active)}
  ${body}
  ${footer()}
</body>
</html>
`;
}

function extractPublications() {
  const html = clean(bySlug.publications);
  const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
  const firstEssay = paragraphs.findIndex((p) => /semi-Public article/i.test(p));
  const importedItems = paragraphs
    .slice(1, firstEssay)
    .filter((p) => /^\s*\[\d+\]/.test(p));
  const orderedItems = [
    manualPublications[0],
    importedItems[0],
    manualPublications[1],
    ...importedItems.slice(1),
  ];
  const journalItems = orderedItems.map((item, index) =>
    item.replace(/^\s*\[\d+\]/, `[${orderedItems.length - index}]`),
  );
  const essays = paragraphs.slice(firstEssay);

  return { journalItems, essays };
}

const { journalItems, essays } = extractPublications();

const researchAreas = [
  {
    id: "large-scale-structure",
    number: "01",
    kicker: "Theory & precision",
    title: "Large-scale structure & galaxy clustering",
    summary: [
      "The distribution of galaxies carries information about gravity, cosmic expansion, and the initial conditions of the Universe—but extracting it requires precise control of nonlinear evolution, galaxy bias, and redshift-space distortions.",
      "I develop perturbative descriptions and statistical observables for galaxy clustering, with an emphasis on connecting analytic theory to simulations and survey measurements. This work ranges from baryon-acoustic-oscillation modeling to the power spectrum, bispectrum, and modern descriptions of biased tracers.",
    ],
    papers: [
      ["Foundational", "2006", "Perturbation Theory Reloaded", "astro-ph/0604075"],
      ["Review", "2018", "Large-scale Galaxy Bias", "1611.09787"],
      ["Redshift space", "2018", "The Galaxy Power Spectrum and Bispectrum in Redshift Space", "1806.04015"],
    ],
  },
  {
    id: "relativistic-observables",
    number: "02",
    kicker: "Gravity on cosmic scales",
    title: "Relativistic observables & cosmic fossils",
    summary: [
      "Cosmological surveys observe photons on the past light cone, not density fields on a preferred time slice. I work on formulating galaxy clustering and other large-scale observables in a fully relativistic and operational way, including the effects of clocks, rulers, projection, and local tides.",
      "A related theme is the search for fossil signatures: correlations imprinted by primordial long-wavelength scalar or tensor perturbations. These observables offer ways to test inflation, additional fields, and gravity on scales inaccessible to conventional correlation functions.",
    ],
    papers: [
      ["Relativistic clustering", "2012", "Large-scale Clustering of Galaxies in General Relativity", "1107.5427"],
      ["Primordial fossils", "2012", "Clustering Fossils from the Early Universe", "1203.0302"],
      ["Operational observables", "2012", "Cosmic Rulers", "1204.3625"],
      ["Recent", "2025", "Large-Scale-Structure Observables in General Relativity Validated at Second Order", "2506.11260"],
    ],
  },
  {
    id: "early-universe",
    number: "03",
    kicker: "Origins",
    title: "The early Universe & fundamental physics",
    summary: [
      "The largest structures in the Universe began as microscopic fluctuations. Their statistics can reveal the mechanism of inflation and physics at energies far beyond terrestrial experiments. I study primordial non-Gaussianity, inflationary relics, and the evolution of perturbations from the earliest epochs to observable structure.",
      "I am also interested in the cosmic microwave background beyond its temperature anisotropies—including spectral distortions and polarization—as a probe of small-scale primordial power, gravitational waves, and possible Planck-scale modifications of early-Universe dynamics.",
    ],
    papers: [
      ["Primordial statistics", "2009", "Primordial Non-Gaussianity, Scale-Dependent Bias, and the Bispectrum of Galaxies", "0904.0497"],
      ["Spectral distortions", "2014", "Silk Damping at a Redshift of a Billion", "1403.3697"],
      ["Quantum gravity", "2020", "Alleviating the Tension in the CMB Using Planck-Scale Physics", "2001.11689"],
    ],
  },
  {
    id: "cosmic-surveys",
    number: "04",
    kicker: "Theory meets data",
    title: "Cosmic surveys & HETDEX",
    summary: [
      "Large spectroscopic surveys turn cosmological theory into a measurement. I am a member of the Hobby-Eberly Telescope Dark Energy Experiment (HETDEX), an untargeted integral-field survey designed to map the three-dimensional distribution of high-redshift Lyman-alpha emitters and measure cosmic expansion at an early epoch.",
      "My work with survey data includes clustering estimators, contamination and selection effects, intensity mapping, source catalogs, and cosmological interpretation. The same framework now extends to the exceptionally dense low-redshift [O II] sample contained in the first HETDEX public data release.",
    ],
    papers: [
      ["Survey", "2021", "The HETDEX Survey: Design, Reductions, and Detections", "2110.04298"],
      ["Public data", "2026", "HETDEX Public Data Release 1", "2606.04208"],
      ["Clustering", "2026", "HETDEX [O II] Galaxies at z ≤ 0.48", "2607.08453"],
    ],
  },
  {
    id: "dark-universe",
    number: "05",
    kicker: "New messengers",
    title: "Dark matter & gravitational waves",
    summary: [
      "Gravitational waves provide a new way to test the dark sector. I study compact objects with masses or internal physics that differ from ordinary stellar remnants, asking how their formation, dynamics, and waveforms can reveal—or constrain—new forms of matter.",
      "This program includes sub-solar-mass black holes, dissipative atomic dark matter, dark molecular chemistry, and white-dwarf–compact-object binaries. It connects microscopic models to astrophysical populations and to present and future detectors across terrestrial, space-based, and decihertz frequency bands.",
    ],
    papers: [
      ["Compact dark objects", "2018", "Gravitational Waves from Binary Mergers of Sub-Solar Mass Dark Black Holes", "1802.08206"],
      ["Dissipative dark matter", "2022", "A Lower Bound on the Mass of Compact Objects from Dissipative Dark Matter", "2209.00064"],
      ["Recent", "2026", "Gravitational Wave Modeling of White-Dwarf–Compact-Object Binaries", "2607.24951"],
    ],
  },
  {
    id: "computational-cosmology",
    number: "06",
    kicker: "Tools & inference",
    title: "Computational & data-driven cosmology",
    summary: [
      "Modern cosmology requires calculations that are both accurate and fast enough to confront large data sets. I develop numerical and semi-analytic tools for projected correlation functions, perturbative fields, mock catalogs, and higher-order statistics.",
      "More recently, I have explored machine-learning approaches that reconstruct the cosmic web and hidden large-scale flows from incomplete observations. The goal is not to replace physical modeling, but to combine simulations, algorithms, and interpretable structure to recover information that conventional estimators leave unused.",
    ],
    papers: [
      ["Fast algorithms", "2018", "The 2-FAST Algorithm", "1709.02401"],
      ["Grid methods", "2018", "GridSPT", "1807.04215"],
      ["Machine learning", "2025", "Revealing Hidden Cosmic Flows through the Zone of Avoidance", "2511.03919"],
    ],
  },
];

function researchPaper([tag, paperYear, title, arxiv]) {
  return `<a class="research-paper" href="https://arxiv.org/abs/${arxiv}" target="_blank" rel="noopener">
    <span class="research-paper-tag">${tag}</span>
    <span class="research-paper-title">${title}</span>
    <span class="research-paper-year">${paperYear} ${icon("external")}</span>
  </a>`;
}

function publicationCard(item, featured = false) {
  const number = item.match(/^\s*\[(\d+)\]/)?.[1] ?? "";
  const itemYear = item.match(/\b(19|20)\d{2}\b/)?.[0] ?? "";
  const cleaned = item.replace(/^\s*\[\d+\]\s*/, "");
  const title = cleaned.match(/<em>([\s\S]*?)<\/em>/)?.[1] ?? "Publication";
  const beforeTitle = cleaned.split("<br />")[0];
  const afterTitle = cleaned.split(/<\/em><br \/>/)[1] ?? "";

  if (featured) {
    return `<article class="featured-paper">
      <span class="paper-number">#${number}</span>
      <div>
        <h3>${title}</h3>
        <p class="paper-authors">${beforeTitle}</p>
        <div class="paper-meta">${afterTitle}</div>
      </div>
    </article>`;
  }

  return `<article class="publication" data-year="${itemYear}" data-number="${number}">
    <span class="publication-number">${number}</span>
    <div class="publication-copy">${cleaned}</div>
  </article>`;
}

const home = layout({
  title: "Donghui Jeong",
  description:
    "Donghui Jeong is a cosmologist and astrophysicist studying the origin and evolution of the Universe.",
  active: "home",
  bodyClass: "home-page",
  body: `
  <main id="main">
    <section class="hero">
      <div class="hero-stars" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-copy reveal">
          <p class="eyebrow"><span></span> Astrophysicist &amp; Cosmologist</p>
          <h1>Studying the <br class="mobile-only"><em>origin</em><br>and <br class="mobile-only">evolution of<br>our Universe.</h1>
          <p class="hero-intro">I explore how the cosmos began, how structure formed, and what the largest maps of the sky can tell us about fundamental physics.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="research.html">Explore my research ${icon("arrow")}</a>
            <a class="button button-text" href="mailto:djeong@psu.edu">${icon("mail")} Get in touch</a>
          </div>
        </div>
        <div class="hero-visual reveal">
          <div class="portrait-frame">
            <img src="assets/images/donghui-jeong.jpg" width="1920" height="1280" alt="Donghui Jeong speaking at a blackboard" fetchpriority="high">
            <span class="portrait-label">Cosmology, from theory to data</span>
          </div>
          <div class="cosmic-marker marker-one" aria-hidden="true"><span>z</span> &gt; 1</div>
          <div class="cosmic-marker marker-two" aria-hidden="true">13.8 Gyr</div>
        </div>
      </div>
      <a class="scroll-cue" href="#about"><span>Scroll to explore</span><i></i></a>
    </section>

    <section class="intro-section section" id="about">
      <div class="section-label"><span>01</span> About</div>
      <div class="intro-grid">
        <h2 class="display-heading reveal">Finding fundamental physics in the <em>structure of the cosmos.</em></h2>
        <div class="intro-copy reveal">
          <p>I am a professor and Associate Head for the Undergraduate Program in the Department of Astronomy and Astrophysics at Penn State. I also direct the Center for Theoretical and Observational Cosmology at the Institute for Gravitation &amp; the Cosmos.</p>
          <p>My work connects theoretical cosmology with real observations—from the cosmic microwave background to galaxy surveys and gravitational-wave sources.</p>
          <a class="inline-link" href="resume.html">More about my path ${icon("arrow")}</a>
        </div>
      </div>
      <div class="role-strip reveal">
        <div><strong>Professor</strong><span>Astronomy &amp; Astrophysics, Penn State</span></div>
        <div><strong>Director</strong><span>Center for Theoretical &amp; Observational Cosmology</span></div>
        <div><strong>Professor · Part-time</strong><span>Korea Institute for Advanced Study</span></div>
      </div>
    </section>

    <section class="research-section section">
      <div class="section-label light"><span>02</span> Research</div>
      <div class="research-heading">
        <h2 class="display-heading reveal">Questions written<br>across the sky.</h2>
        <p class="reveal">I develop theoretical tools and statistical observables to extract the physics hidden in large-scale astronomical data.</p>
      </div>
      <div class="research-grid">
        <a class="research-card reveal" href="research.html#early-universe">
          <span class="card-index">A</span>
          <div class="orbit-icon" aria-hidden="true"><i></i></div>
          <h3>Cosmic Origins</h3>
          <p>Inflation, primordial non-Gaussianity, and the earliest physical processes that seeded cosmic structure.</p>
          <span class="topic-tag">Early Universe</span>
        </a>
        <a class="research-card reveal" href="research.html#large-scale-structure">
          <span class="card-index">B</span>
          <div class="wave-icon" aria-hidden="true"><i></i><i></i><i></i></div>
          <h3>Large-scale Structure</h3>
          <p>Galaxy clustering, perturbation theory, and new observables for understanding gravity on cosmic scales.</p>
          <span class="topic-tag">Theory + Data</span>
        </a>
        <a class="research-card reveal" href="research.html#cosmic-surveys">
          <span class="card-index">C</span>
          <div class="survey-icon" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          <h3>Cosmic Surveys</h3>
          <p>Mapping high-redshift galaxies with HETDEX to probe dark energy, galaxy evolution, and the expanding Universe.</p>
          <span class="topic-tag">HETDEX</span>
        </a>
      </div>
    </section>

    <section class="classes-section section">
      <div class="section-label"><span>03</span> Recent classes</div>
      <div class="classes-heading">
        <h2 class="display-heading reveal">Ideas are best<br><em>explored together.</em></h2>
        <a class="inline-link reveal" href="teaching.html">View teaching history ${icon("arrow")}</a>
      </div>
      <div class="class-grid reveal">
        <a class="class-card class-card-featured" href="https://djeong98.github.io/sitp2026-lss-gr/" target="_blank" rel="noopener">
          <span class="class-term">SITP · Summer 2026</span>
          <h3>Large-Scale Structure Observables in General Relativity</h3>
          <p>Galaxy clustering, cosmic rulers, and local tides.</p>
          <span class="class-link">Read the student notes ${icon("external")}</span>
        </a>
        <a class="class-card" href="https://sites.psu.edu/cosmology/" target="_blank" rel="noopener">
          <span class="class-term">Fall 2026 · ASTRO 545</span>
          <h3>Cosmology</h3>
          <p>Physical foundations and the evolution of the Universe.</p>
          <span class="class-link">Course site ${icon("external")}</span>
        </a>
        <a class="class-card" href="https://sites.psu.edu/darkuniverse" target="_blank" rel="noopener">
          <span class="class-term">Spring 2026 · ASTRO 497</span>
          <h3>Astrophysics of the Dark Universe</h3>
          <p>Dark matter, dark energy, and their astronomical evidence.</p>
          <span class="class-link">Course site ${icon("external")}</span>
        </a>
      </div>
    </section>

    <section class="papers-section section">
      <div class="section-label"><span>04</span> Recent work</div>
      <div class="papers-heading">
        <h2 class="display-heading reveal">Latest publications</h2>
        <a class="inline-link reveal" href="publications.html">View all ${journalItems.length} papers ${icon("arrow")}</a>
      </div>
      <div class="featured-papers reveal">
        ${journalItems.slice(0, 4).map((item) => publicationCard(item, true)).join("\n")}
      </div>
    </section>

    <section class="contact-banner section">
      <div class="contact-orbit" aria-hidden="true"></div>
      <p class="eyebrow light"><span></span> Collaboration &amp; conversation</p>
      <h2>Let’s talk about<br>the Universe.</h2>
      <p>Questions, research ideas, and student conversations are always welcome.</p>
      <a class="button button-light" href="mailto:djeong@psu.edu">djeong@psu.edu ${icon("arrow")}</a>
    </section>
  </main>`,
});

const research = layout({
  title: "Research",
  description: "Research areas of cosmologist Donghui Jeong, from large-scale structure and relativistic observables to HETDEX, dark matter, and gravitational waves.",
  active: "research",
  bodyClass: "research-page",
  body: `
  <main id="main">
    <section class="page-hero research-hero">
      <div class="page-hero-inner">
        <p class="eyebrow light"><span></span> Research</p>
        <h1>Reading fundamental physics<br><em>in the structure of the cosmos.</em></h1>
        <p>My work moves between theory, computation, and observation to understand how the Universe began, how it evolved, and what its largest structures can reveal.</p>
      </div>
    </section>

    <section class="research-overview section">
      <div class="research-lede">
        <div class="section-label"><span>Overview</span></div>
        <div>
          <h2 class="display-heading reveal">A connected program<br>for questioning the Universe.</h2>
          <p class="reveal">These areas are not isolated subjects. They form a research program in which fundamental theory defines observable quantities, computational tools turn them into predictions, and surveys test those predictions against the sky.</p>
        </div>
      </div>
      <nav class="research-index reveal" aria-label="Research areas">
        ${researchAreas
          .map(
            (area) => `<a href="#${area.id}"><span>${area.number}</span>${area.title}${icon("arrow")}</a>`,
          )
          .join("\n")}
      </nav>
    </section>

    <div class="research-areas">
      ${researchAreas
        .map(
          (area) => `<section class="research-area section" id="${area.id}">
        <header class="research-area-header reveal">
          <span class="research-area-number">${area.number}</span>
          <p class="area-kicker">${area.kicker}</p>
          <h2>${area.title}</h2>
        </header>
        <div class="research-area-body reveal">
          <div class="research-area-summary">
            ${area.summary.map((paragraph) => `<p>${paragraph}</p>`).join("\n")}
          </div>
          <div class="representative-papers">
            <h3>Representative papers</h3>
            ${area.papers.map(researchPaper).join("\n")}
          </div>
        </div>
      </section>`,
        )
        .join("\n")}
    </div>

    <section class="research-archive-cta section">
      <div>
        <p class="eyebrow light"><span></span> Complete archive</p>
        <h2>Explore all ${journalItems.length} publications.</h2>
      </div>
      <a class="button button-light" href="publications.html">View publications ${icon("arrow")}</a>
    </section>
  </main>`,
});

function resumeContent() {
  const paragraphs = [
    ...clean(bySlug["resume-2"]).matchAll(/<p>([\s\S]*?)<\/p>/g),
  ].map((match) => match[1].trim());

  return paragraphs
    .map((paragraph) => {
      const heading = paragraph.match(/^<strong>(.*?)<\/strong>$/);
      if (heading) return `<h2 class="resume-section-title">${heading[1]}</h2>`;

      const lines = paragraph
        .split(/<br\s*\/?>\s*/)
        .map((line) => line.trim())
        .filter(Boolean);
      const title = lines.shift() ?? "";
      const firstDetail = lines[0]?.replace(/<[^>]+>/g, "") ?? "";
      const hasDate = /^(January|February|March|April|May|June|July|August|September|October|November|December)\b/.test(
        firstDetail,
      );
      const date = hasDate ? lines.shift().replace(/<\/?span[^>]*>/g, "") : "";
      const detail = lines
        .join("<br>")
        .replace(/<\/?span[^>]*>/g, "");

      return `<article class="timeline-item"><div class="timeline-dot"></div><h3>${title}</h3>${date ? `<p class="timeline-date">${date}</p>` : ""}${detail ? `<div class="timeline-detail">${detail}</div>` : ""}</article>`;
    })
    .join("\n");
}

const resume = layout({
  title: "Profile",
  description: "Employment, education, and honors of astrophysicist Donghui Jeong.",
  active: "resume",
  body: `
  <main id="main">
    <section class="page-hero">
      <div class="page-hero-inner">
        <p class="eyebrow light"><span></span> Profile</p>
        <h1>A path through<br><em>cosmology.</em></h1>
        <p>Research, teaching, and academic leadership across theory and observation.</p>
      </div>
    </section>
    <section class="page-content section resume-layout">
      <aside class="profile-aside reveal">
        <img src="assets/images/donghui-jeong.jpg" alt="Donghui Jeong at KIAS" width="1920" height="1280">
        <div class="profile-card">
          <p class="micro-label">Current appointments</p>
          <strong>Penn State</strong>
          <span>Professor of Astronomy &amp; Astrophysics</span>
          <strong>CTOC</strong>
          <span>Director</span>
          <strong>KIAS</strong>
          <span>Professor of Physics · Part-time</span>
        </div>
        <a class="button button-primary full-width" href="mailto:djeong@psu.edu">${icon("mail")} Contact me</a>
      </aside>
      <div class="resume-timeline reveal">${resumeContent()}</div>
    </section>
  </main>`,
});

const publications = layout({
  title: "Publications",
  description: `A complete list of ${journalItems.length} refereed publications by Donghui Jeong.`,
  active: "publications",
  bodyClass: "publications-page",
  body: `
  <main id="main">
    <section class="page-hero publications-hero">
      <div class="page-hero-inner">
        <p class="eyebrow light"><span></span> Research archive</p>
        <h1>Exploring the cosmos<br><em>through theory and data.</em></h1>
        <p>Refereed journal articles spanning cosmology, large-scale structure, galaxy surveys, dark matter, and gravitational waves.</p>
      </div>
    </section>
    <section class="publications-content section">
      <div class="publication-tools">
        <label class="search-box">
          <span class="sr-only">Search publications</span>
          <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5"></circle><path d="m13 13 4 4"></path></svg>
          <input id="publication-search" type="search" placeholder="Search title, author, journal, or year…" autocomplete="off">
        </label>
        <label class="year-filter">
          <span class="sr-only">Filter by year</span>
          <select id="publication-year">
            <option value="">All years</option>
            ${[...new Set(journalItems.map((item) => item.match(/\b(19|20)\d{2}\b/)?.[0]).filter(Boolean))]
              .map((itemYear) => `<option value="${itemYear}">${itemYear}</option>`)
              .join("")}
          </select>
        </label>
        <p class="result-count" aria-live="polite"><strong id="visible-count">${journalItems.length}</strong> papers</p>
      </div>
      <div class="publication-list" id="publication-list">
        ${journalItems.map((item) => publicationCard(item)).join("\n")}
      </div>
      <p class="empty-state" id="empty-state" hidden>No publications match that search.</p>
      <section class="essays">
        <h2>Articles for broader audiences</h2>
        ${essays.map((item, index) => (index === 0 || /^Public article$/i.test(item) ? `<h3>${item}</h3>` : `<div class="essay-item">${item}</div>`)).join("\n")}
      </section>
    </section>
  </main>`,
});

const teaching = layout({
  title: "Teaching",
  description: "Courses taught by Donghui Jeong at Penn State.",
  active: "teaching",
  body: `
  <main id="main">
    <section class="page-hero teaching-hero">
      <div class="page-hero-inner">
        <p class="eyebrow light"><span></span> Teaching</p>
        <h1>Learning to read<br><em>the Universe.</em></h1>
        <p>Courses in cosmology, extragalactic astronomy, gravitational-wave sources, and the dark Universe.</p>
      </div>
    </section>
    <section class="page-content section">
      <div class="teaching-intro">
        <div class="section-label"><span>Courses</span></div>
        <h2 class="display-heading reveal">From black holes<br>to cosmic structure.</h2>
      </div>
      <a class="course-feature reveal" href="https://djeong98.github.io/sitp2026-lss-gr/" target="_blank" rel="noopener">
        <span class="class-term">Featured notes · SITP 2026</span>
        <div>
          <h3>Large-Scale Structure Observables in General Relativity</h3>
          <p>Expanded student notes on galaxy clustering, cosmic rulers, and local tides.</p>
        </div>
        <span class="course-feature-link">Read the notes ${icon("external")}</span>
      </a>
      <div class="course-list reveal">
        ${clean(bySlug.classes)
          .replace(/<div class="top_box">[\s\S]*?<\/div>/, "")
          .replace('<div class="top_shade_box">', "")
          .replace(/<\/div>\s*$/, "")}
      </div>
    </section>
  </main>`,
});

const documents = layout({
  title: "Documents",
  description: "Academic documents by Donghui Jeong, including his doctoral dissertation.",
  active: "documents",
  body: `
  <main id="main">
    <section class="page-hero documents-hero">
      <div class="page-hero-inner">
        <p class="eyebrow light"><span></span> Documents</p>
        <h1>Ideas, developed<br><em>in full.</em></h1>
        <p>Long-form academic work and supporting documents.</p>
      </div>
    </section>
    <section class="page-content section document-grid">
      <article class="document-card reveal">
        <div class="document-icon">${icon("file")}</div>
        <p class="micro-label">Ph.D. Dissertation · 2010</p>
        <h2>Cosmology with high-redshift galaxy surveys</h2>
        <p>A corrected version of the dissertation submitted to The University of Texas at Austin. Please let me know if you find any remaining mistakes or typos.</p>
        <a class="button button-primary" href="assets/documents/donghui-jeong-dissertation.pdf">Read the dissertation ${icon("arrow")}</a>
        <span class="file-meta">PDF · 8.3 MB</span>
      </article>
      <aside class="document-note reveal">
        <span class="giant-symbol" aria-hidden="true">∫</span>
        <p>“The eternal mystery of the world is its comprehensibility.”</p>
        <span>— Albert Einstein, Physics and Reality (1936)</span>
      </aside>
    </section>
  </main>`,
});

await Promise.all([
  writeFile(new URL("../index.html", import.meta.url), home),
  writeFile(new URL("../research.html", import.meta.url), research),
  writeFile(new URL("../resume.html", import.meta.url), resume),
  writeFile(new URL("../publications.html", import.meta.url), publications),
  writeFile(new URL("../teaching.html", import.meta.url), teaching),
  writeFile(new URL("../documents.html", import.meta.url), documents),
]);

console.log(`Built 6 pages with ${journalItems.length} publications.`);
