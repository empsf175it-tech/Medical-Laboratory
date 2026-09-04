# 🔬 Vitalis Labs — Medical Diagnostic & Pathology Center (Single Page Website)

> **Precision Diagnostics. Clearer Answers. Better Health.**  
> Vitalis Labs is a modern, responsive **Single Page Application (SPA) / Single Page Website** for a premier clinical pathology and medical diagnostic center featuring 500+ diagnostic tests, preventive health packages, interactive online test booking, home sample collection requests, clinical test modals, and instant patient report lookup.

---

## 🌟 Key Single-Page Features

- **🧭 Exact Same 5-Item Navigation (`#home`, `#about`, `#tests-services`, `#health-packages`, `#contact`)**:
  - Main header navigation links smoothly scroll to each dedicated section on the single page with custom navbar offset and automatic scrollspy tracking.
- **🧪 Comprehensive Test Directory (`#tests-services`)**:
  - Browse 500+ clinical pathology, biochemistry, hematology, immunology, and molecular diagnostic tests.
  - Live search, category filtering (Hematology, Biochemistry, Hormone, Vitamins, Cardiac, Immunology, Molecular).
  - Interactive "View Details" modal rendering clinical parameters, reference ranges, and sample preparation guidelines.
- **📦 Preventive Health Packages & Comparison Matrix (`#health-packages`)**:
  - 6 Curated health checkup packages (Essential, Complete Wellness, Executive Men's, Women's Care, Senior Vitality, Diabetes Management).
  - Side-by-side Inclusions Comparison Matrix Table.
- **📅 5-Step Interactive Test Booking Engine (`#book-a-test`)**:
  - Multi-step booking wizard for scheduling lab visits or at-home sample collection with live price calculation and confirmation modal.
- **📊 Digital Patient Report Portal (`#reportAccessSection`)**:
  - Secure report retrieval by entering Patient ID and Report ID with simulated electronic PDF report modal.
- **🏢 Diagnostic Centers & Contact Hub (`#contact`)**:
  - Interactive direct message form with real-time feedback, 4 diagnostic center locations, and contact channels.
- **🌓 Light & Dark Theme Support**:
  - Smooth theme switching with persistent local storage state and customized CSS variables.

---

## 📁 Single-Page Architecture Structure

```text
Medical Laboratory/
├── 📄 index.html              # Unified Single Page (Hero, About, Tests, Packages, Booking, Report Portal, Contact, Modals)
├── 📄 about.html              # Auto-redirect to index.html#about
├── 📄 tests-services.html     # Auto-redirect to index.html#tests-services
├── 📄 test-details.html       # Auto-redirect to index.html#tests-services
├── 📄 health-packages.html    # Auto-redirect to index.html#health-packages
├── 📄 book-a-test.html        # Auto-redirect to index.html#book-a-test
├── 📄 contact.html            # Auto-redirect to index.html#contact
├── 📄 privacy-policy.html     # Auto-redirect to index.html#home
├── 📄 terms.html              # Auto-redirect to index.html#home
├── 📄 404.html                # Custom branded 404 error page
├── 📄 sitemap.xml             # XML sitemap
├── 📄 robots.txt              # Web crawler access instructions
├── 📄 README.md               # Project documentation
│
└── 📁 assets/
    ├── 📁 css/
    │   └── 📄 style.css       # Design system, CSS variables, dark/light themes, scroll margins, responsive layout
    ├── 📁 js/
    │   └── 📄 main.js         # Single page master engine (scrollspy, test search & modals, booking wizard, report lookup)
    └── 📁 images/             # Custom imagery and visual assets
```

---

## 🛠️ Technology Stack

- **HTML5**: Semantic single-page layout (ARIA compliant, Bootstrap 5 scrollspy).
- **CSS3 / Vanilla CSS**: Design system with CSS custom properties (variables), Flexbox, CSS Grid, and smooth scroll offsets.
- **Bootstrap 5.3**: Grid layout, modals, offcanvas mobile navigation.
- **Bootstrap Icons**: Lightweight vector iconography.
- **Vanilla JavaScript (ES6+)**: Interactive search, category filters, booking engine, report modal, theme toggle, and hash navigation.
