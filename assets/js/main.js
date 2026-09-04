/**
 * VITALIS LABS — Precision Medical Laboratory & Diagnostic Center
 * Master JavaScript Engine — Single Page Website Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbarScrollSpy();
  initStatsCounters();
  initBackToTop();
  initLiveTestFilter();
  initTestDetailsModal();
  initBookingWizard();
  initReportAccess();
  initContactForm();
  initQuickBookingButtons();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('vitalis-theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  applyTheme(storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('vitalis-theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcons = document.querySelectorAll('.theme-toggle-btn i');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill text-warning';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  });
}

/* ==========================================================================
   2. Sticky Navbar, Smooth Scroll Offset & ScrollSpy
   ========================================================================== */
function initNavbarScrollSpy() {
  const navbar = document.querySelector('.vitalis-navbar');
  const navLinks = document.querySelectorAll('.nav-link-vitalis');
  const sections = document.querySelectorAll('section[id], header[id]');

  // Navbar shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Custom Scrollspy active link highlighter
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Smooth scroll with navbar height offset on anchor clicks
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl && !this.hasAttribute('data-bs-toggle')) {
        e.preventDefault();
        const headerOffset = 75;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/* ==========================================================================
   3. Animated Statistics Counter
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = isFloat 
        ? (easeProgress * target).toFixed(1) 
        : Math.floor(easeProgress * target);

      el.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   4. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. Live Test Search & Category Filter
   ========================================================================== */
function initLiveTestFilter() {
  const searchInput = document.getElementById('testSearchInput');
  const categoryPills = document.querySelectorAll('.test-filter-pill');
  const testCards = document.querySelectorAll('.test-item-wrapper');
  const noResultsAlert = document.getElementById('noTestsFound');

  if (!testCards.length) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const filterTests = () => {
    let visibleCount = 0;

    testCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const testName = (card.querySelector('.test-name')?.textContent || '').toLowerCase();
      const testDesc = (card.querySelector('.test-desc')?.textContent || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = testName.includes(searchTerm) || testDesc.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsAlert) {
      noResultsAlert.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterTests();
    });
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter') || 'all';
      filterTests();
    });
  });
}

/* ==========================================================================
   6. Clinical Test Details Modal Dynamic Database & Loader
   ========================================================================== */
const testDetailsDatabase = {
  cbc: {
    title: 'Complete Blood Count (CBC) with 5-Part Differential',
    category: 'Hematology Assay #HEM-101',
    price: '$28.00',
    overview: 'A Complete Blood Count (CBC) is a fundamental diagnostic test measuring red cells, white cells, and platelets to detect anemia, infection, inflammation, and bleeding disorders.',
    parameters: [
      { name: 'Hemoglobin (Hb)', role: 'Oxygen transport protein', range: '13.5 – 17.5 g/dL (M) / 12.0 – 15.5 g/dL (F)' },
      { name: 'Total Leukocyte (WBC)', role: 'Immune infection defense', range: '4,000 – 11,000 / µL' },
      { name: 'Neutrophils', role: 'Bacterial infection responders', range: '40% – 70%' },
      { name: 'Lymphocytes', role: 'Viral defense and antibody production', range: '20% – 40%' },
      { name: 'Platelet Count', role: 'Clotting & endothelial repair', range: '150,000 – 450,000 / µL' },
      { name: 'Packed Cell Volume (PCV)', role: 'RBC volumetric percentage', range: '36.0% – 50.0%' }
    ],
    preparation: 'No strict fasting is required for a standalone CBC. Stay well hydrated with plain water before your blood draw to facilitate smooth sample collection.',
    tat: '6 Hours Turnaround Time (EDTA Whole Blood)'
  },
  lipid: {
    title: 'Lipid Profile Extended with Cardiovascular Risk Indices',
    category: 'Cardiac Biomarkers #CAR-204',
    price: '$38.00',
    overview: 'Comprehensive lipid quantification measuring total cholesterol, HDL, LDL, VLDL, and triglycerides to assess atherosclerosis, heart disease, and stroke risk.',
    parameters: [
      { name: 'Total Cholesterol', role: 'Total circulating sterol lipids', range: '< 200 mg/dL (Optimal)' },
      { name: 'HDL Cholesterol', role: 'High-density protective cholesterol', range: '> 40 mg/dL (M) / > 50 mg/dL (F)' },
      { name: 'LDL Cholesterol', role: 'Low-density atherogenic cholesterol', range: '< 100 mg/dL (Optimal)' },
      { name: 'Triglycerides', role: 'Circulating blood fat stores', range: '< 150 mg/dL' },
      { name: 'Chol / HDL Ratio', role: 'Coronary artery risk marker', range: '< 4.5' }
    ],
    preparation: '10 to 12 hours of strict fasting is required. Only plain water is permitted. Avoid heavy or high-fat dinners the night before.',
    tat: '8 Hours Turnaround Time (Serum Blood)'
  },
  thyroid: {
    title: 'Complete Thyroid Profile (Total T3, Total T4, Ultrasensitive TSH)',
    category: 'Hormone & Endocrine #END-302',
    price: '$45.00',
    overview: 'Evaluates endocrine thyroid gland activity to diagnose hypothyroidism (sluggish metabolism), hyperthyroidism, Hashimoto disease, and unexplained weight fluctuation.',
    parameters: [
      { name: 'TSH (Thyroid Stimulating)', role: 'Pituitary thyroid regulator', range: '0.45 – 4.50 µIU/mL' },
      { name: 'Total T3 (Triiodothyronine)', role: 'Active metabolic regulator', range: '0.80 – 2.00 ng/mL' },
      { name: 'Total T4 (Thyroxine)', role: 'Primary precursor hormone', range: '5.1 – 12.0 µg/dL' }
    ],
    preparation: 'Morning sample collection is recommended before taking daily thyroid replacement medication (unless instructed otherwise by your physician).',
    tat: '12 Hours Turnaround Time (CLIA Chemiluminescence)'
  },
  hba1c: {
    title: 'Glycated Hemoglobin (HbA1c) & Estimated Average Glucose',
    category: 'Biochemistry #BIO-401',
    price: '$32.00',
    overview: 'Gold-standard biomarker measuring the percentage of glucose-bound hemoglobin to provide a reliable 3-month average blood sugar baseline without daily fluctuation.',
    parameters: [
      { name: 'HbA1c', role: '3-Month glycemic average', range: '< 5.7% (Normal), 5.7–6.4% (Prediabetes), ≥ 6.5% (Diabetes)' },
      { name: 'eAG (Avg Glucose)', role: 'Correlated average glucose', range: '< 117 mg/dL' }
    ],
    preparation: 'No fasting required. Can be collected at any time of day regardless of recent food intake.',
    tat: '6 Hours Turnaround Time (HPLC Method)'
  },
  vitamind: {
    title: 'Vitamin D (25-Hydroxy Total D2/D3)',
    category: 'Vitamins & Nutrition #VIT-501',
    price: '$48.00',
    overview: 'Quantifies circulating 25-OH Vitamin D essential for calcium absorption, bone mineralization, neuromuscular function, and immune system resilience.',
    parameters: [
      { name: '25-OH Vitamin D Total', role: 'Circulating Vitamin D storage', range: '30.0 – 100.0 ng/mL (Sufficient)' }
    ],
    preparation: 'No fasting required. Routine blood draw.',
    tat: '12 Hours Turnaround Time (CMIA Technology)'
  },
  vitb12: {
    title: 'Vitamin B12 Assay (Cyanocobalamin)',
    category: 'Vitamins & Nutrition #VIT-502',
    price: '$42.00',
    overview: 'Critical diagnostic marker for neural sheath integrity, cognitive vitality, and megaloblastic anemia diagnosis.',
    parameters: [
      { name: 'Serum Vitamin B12', role: 'Neuro-hematological cofactor', range: '211 – 911 pg/mL' }
    ],
    preparation: 'Overnight fasting is preferred for optimal analytical accuracy.',
    tat: '12 Hours Turnaround Time (ECLIA Immunoassay)'
  },
  lft: {
    title: 'Comprehensive Liver Function Panel (LFT)',
    category: 'Biochemistry #BIO-405',
    price: '$36.00',
    overview: 'Assesses hepatic cellular integrity, bile flow, protein synthesis, and metabolic detoxification pathways.',
    parameters: [
      { name: 'Total Bilirubin', role: 'Heme degradation pigment', range: '0.2 – 1.2 mg/dL' },
      { name: 'SGPT / ALT', role: 'Liver enzyme biomarker', range: '7 – 56 U/L' },
      { name: 'SGOT / AST', role: 'Hepatic and muscular enzyme', range: '10 – 40 U/L' },
      { name: 'Alkaline Phosphatase (ALP)', role: 'Biliary tree & bone enzyme', range: '44 – 147 U/L' },
      { name: 'Serum Albumin', role: 'Hepatic protein synthesis', range: '3.5 – 5.0 g/dL' }
    ],
    preparation: '8-hour fasting is required before sample collection.',
    tat: '8 Hours Turnaround Time (Automated Clinical Chemistry)'
  },
  kft: {
    title: 'Renal Function & Kidney Health Panel (KFT / RFT)',
    category: 'Biochemistry #BIO-408',
    price: '$34.00',
    overview: 'Measures glomerular filtration efficacy, nitrogenous waste clearance, and electrolyte balance to safeguard renal health.',
    parameters: [
      { name: 'Serum Creatinine', role: 'Muscle breakdown byproduct', range: '0.7 – 1.3 mg/dL (M) / 0.5 – 1.1 mg/dL (F)' },
      { name: 'Blood Urea Nitrogen (BUN)', role: 'Nitrogenous waste clearance', range: '7 – 20 mg/dL' },
      { name: 'eGFR Filtration Rate', role: 'Glomerular filtration rate', range: '> 90 mL/min/1.73m² (Normal)' },
      { name: 'Serum Uric Acid', role: 'Purine metabolite / Gout marker', range: '3.5 – 7.2 mg/dL' }
    ],
    preparation: 'Stay well-hydrated with plain water. Avoid strenuous workouts immediately before the blood draw.',
    tat: '8 Hours Turnaround Time (Enzymatic Spectrophotometry)'
  },
  hscrp: {
    title: 'High-Sensitivity C-Reactive Protein (hs-CRP)',
    category: 'Cardiac Biomarkers #CAR-208',
    price: '$30.00',
    overview: 'Measures trace microvascular inflammation to assess independent cardiovascular and arterial plaque rupture risks.',
    parameters: [
      { name: 'hs-CRP', role: 'Vascular inflammation marker', range: '< 1.0 mg/L (Low Risk), 1.0–3.0 mg/L (Average Risk)' }
    ],
    preparation: 'Patient must be free of acute infections or fevers during the test period.',
    tat: '8 Hours Turnaround Time (Immunoturbidimetry)'
  },
  pcr: {
    title: 'Multiplex Respiratory Viral RT-PCR Panel',
    category: 'Molecular & PCR #MOL-601',
    price: '$95.00',
    overview: 'Simultaneous quantitative real-time PCR detection for Influenza A/B, Respiratory Syncytial Virus (RSV), and SARS-CoV-2 viral RNA.',
    parameters: [
      { name: 'Target Viral RNA CT', role: 'Cycle threshold quantification', range: 'Negative / Non-Reactive' }
    ],
    preparation: 'Collected via gentle sterile nasopharyngeal swab. No prep required.',
    tat: '12-18 Hours Turnaround Time (Real-Time PCR Workstation)'
  },
  ige: {
    title: 'Total Serum IgE (Atopic Allergy Screen)',
    category: 'Immunology #IMM-701',
    price: '$35.00',
    overview: 'Evaluates circulating immunoglobulin E antibodies associated with atopic asthma, allergic rhinitis, eczema, and hypersensitivity.',
    parameters: [
      { name: 'Total IgE', role: 'Allergic immunoglobulin', range: '< 100 IU/mL (Normal Adult)' }
    ],
    preparation: 'Avoid antihistamine medications 24 hours prior to blood draw if advised by doctor.',
    tat: '12 Hours Turnaround Time (FEIA Immunoassay)'
  },
  ferritin: {
    title: 'Serum Ferritin & Iron Metabolism Profile',
    category: 'Hematology #HEM-105',
    price: '$40.00',
    overview: 'Quantifies body iron reserves and storage proteins to identify latent iron deficiency prior to red blood cell drop or hemochromatosis.',
    parameters: [
      { name: 'Serum Ferritin', role: 'Intracellular iron storage', range: '24 – 336 ng/mL (M) / 11 – 307 ng/mL (F)' },
      { name: 'Serum Iron', role: 'Circulating iron', range: '60 – 170 µg/dL' },
      { name: 'TIBC (Total Binding)', role: 'Transferrin binding capacity', range: '240 – 450 µg/dL' }
    ],
    preparation: 'Morning fasting blood draw is recommended due to diurnal variation in iron levels.',
    tat: '8 Hours Turnaround Time (Chemiluminescence)'
  }
};

function initTestDetailsModal() {
  const modalEl = document.getElementById('clinicalTestModal');
  if (!modalEl) return;

  const bsModal = new bootstrap.Modal(modalEl);
  const modalTitle = document.getElementById('modalTestTitle');
  const modalCategory = document.getElementById('modalTestCategory');
  const modalPrice = document.getElementById('modalTestPrice');
  const modalBody = document.getElementById('modalTestBody');
  const modalBookBtn = document.getElementById('modalBookNowBtn');

  document.querySelectorAll('.open-test-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const testKey = btn.getAttribute('data-test');
      const data = testDetailsDatabase[testKey] || testDetailsDatabase['cbc'];

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalPrice.textContent = data.price;

      const paramsRows = data.parameters.map(p => `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.role}</td>
          <td><span class="badge bg-secondary-subtle text-secondary">${p.range}</span></td>
        </tr>
      `).join('');

      modalBody.innerHTML = `
        <div class="mb-4">
          <h6 class="fw-bold text-main mb-2"><i class="bi bi-info-circle text-secondary me-2"></i>Clinical Overview</h6>
          <p class="text-muted small mb-0">${data.overview}</p>
        </div>

        <div class="mb-4">
          <h6 class="fw-bold text-main mb-2"><i class="bi bi-table text-secondary me-2"></i>Measured Parameters & Reference Ranges</h6>
          <div class="table-responsive">
            <table class="table table-vitalis small mb-0">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Biological Role</th>
                  <th>Reference Range</th>
                </tr>
              </thead>
              <tbody>
                ${paramsRows}
              </tbody>
            </table>
          </div>
        </div>

        <div class="p-3 rounded-3 bg-subtle border mb-3">
          <h6 class="fw-bold text-main mb-1"><i class="bi bi-clock-history text-secondary me-2"></i>Sample Preparation & TAT</h6>
          <p class="text-muted small mb-1"><strong>Preparation:</strong> ${data.preparation}</p>
          <p class="text-muted small mb-0"><strong>Turnaround Time:</strong> ${data.tat}</p>
        </div>
      `;

      if (modalBookBtn) {
        modalBookBtn.onclick = () => {
          selectTestAndScrollToBooking(data.title, parseFloat(data.price.replace('$', '')));
        };
      }

      bsModal.show();
    });
  });
}

/* ==========================================================================
   7. Quick Test & Package Booking Action Connector
   ========================================================================== */
function initQuickBookingButtons() {
  // Book Test buttons on test cards
  document.querySelectorAll('.book-test-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const testName = btn.getAttribute('data-test-name') || 'Complete Blood Count (CBC)';
      const price = parseFloat(btn.getAttribute('data-test-price') || 28);
      selectTestAndScrollToBooking(testName, price);
    });
  });

  // Book Package buttons on health packages
  document.querySelectorAll('.book-package-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkgName = btn.getAttribute('data-package-name') || 'Complete Wellness Panel';
      const price = parseFloat(btn.getAttribute('data-package-price') || 129);
      selectPackageAndScrollToBooking(pkgName, price);
    });
  });

  // Schedule Home Collection buttons
  document.querySelectorAll('.select-home-collection-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectHomeCollectionAndScroll();
    });
  });
}

function selectTestAndScrollToBooking(testName, price) {
  // Check matching checkbox in wizard step 3
  const checkboxes = document.querySelectorAll('.test-select-checkbox');
  checkboxes.forEach(cb => {
    if (cb.value.toLowerCase().includes(testName.toLowerCase()) || testName.toLowerCase().includes(cb.value.toLowerCase())) {
      cb.checked = true;
    }
  });

  // Trigger change event to update price calculation
  if (checkboxes.length) {
    checkboxes[0].dispatchEvent(new Event('change'));
  }

  showToast(`Selected "${testName}" in Booking Wizard.`, 'info');
}

function selectPackageAndScrollToBooking(pkgName, price) {
  // Switch service type to Health Package in Step 2
  const packageOption = document.querySelector('.service-type-option[data-service="Health Package"]');
  if (packageOption) {
    packageOption.click();
  }

  // Check matching package checkbox
  const checkboxes = document.querySelectorAll('.test-select-checkbox');
  checkboxes.forEach(cb => {
    if (cb.value.toLowerCase().includes(pkgName.toLowerCase())) {
      cb.checked = true;
    }
  });

  if (checkboxes.length) {
    checkboxes[0].dispatchEvent(new Event('change'));
  }

  showToast(`Selected package "${pkgName}" in Booking Wizard.`, 'info');
}

function selectHomeCollectionAndScroll() {
  const homeOption = document.querySelector('.service-type-option[data-service="Home Sample Collection"]');
  if (homeOption) {
    homeOption.click();
  }
  const colHomeRadio = document.getElementById('colHome');
  if (colHomeRadio) {
    colHomeRadio.checked = true;
  }
  showToast('Switched to Home Sample Collection mode.', 'info');
}

/* ==========================================================================
   8. Multi-Step Test Booking Wizard Engine
   ========================================================================== */
function initBookingWizard() {
  const wizardContainer = document.getElementById('bookingWizard');
  if (!wizardContainer) return;

  let currentStep = 1;
  const totalSteps = 5;

  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const stepPanes = document.querySelectorAll('.wizard-step-pane');
  const btnNext = document.getElementById('wizardNextBtn');
  const btnPrev = document.getElementById('wizardPrevBtn');

  // Booking Data Store
  const bookingData = {
    patient: {
      fullName: '',
      phone: '',
      email: '',
      age: '',
      gender: '',
      address: ''
    },
    serviceType: 'Individual Test',
    selectedItems: [
      { name: 'Complete Blood Count (CBC)', price: 28.00 }
    ],
    appointment: {
      date: '',
      timeSlot: '06:30 AM - 07:30 AM',
      collectionMethod: 'Lab Center Visit',
      centerLocation: 'Central Diagnostic Hub — Downtown (742 Diagnostic Blvd)'
    },
    totalCost: 28.00
  };

  // Pre-check default test
  const defaultCb = document.getElementById('testCheck1');
  if (defaultCb) {
    defaultCb.checked = true;
  }

  const updateWizardUI = () => {
    // Step indicators
    stepNodes.forEach((node, idx) => {
      const stepNum = idx + 1;
      node.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        node.classList.add('active');
      } else if (stepNum < currentStep) {
        node.classList.add('completed');
      }
    });

    // Step panes
    stepPanes.forEach((pane, idx) => {
      pane.style.display = (idx + 1 === currentStep) ? 'block' : 'none';
    });

    // Prev / Next button state
    if (btnPrev) {
      btnPrev.style.visibility = (currentStep === 1) ? 'hidden' : 'visible';
    }

    if (btnNext) {
      if (currentStep === totalSteps) {
        btnNext.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Confirm & Book Appointment';
        btnNext.classList.remove('btn-vitalis-primary');
        btnNext.classList.add('btn-vitalis-secondary');
      } else {
        btnNext.innerHTML = 'Continue to Next Step <i class="bi bi-arrow-right ms-1"></i>';
        btnNext.classList.remove('btn-vitalis-secondary');
        btnNext.classList.add('btn-vitalis-primary');
      }
    }

    if (currentStep === 5) {
      populateReviewSummary(bookingData);
    }
  };

  // Step 2: Service Type Selection
  const serviceOptions = document.querySelectorAll('.service-type-option');
  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      bookingData.serviceType = opt.getAttribute('data-service') || 'Individual Test';
      
      const homeAddressBox = document.getElementById('homeCollectionAddressBox');
      const isHome = bookingData.serviceType.includes('Home');
      if (homeAddressBox) {
        homeAddressBox.style.display = isHome ? 'block' : 'none';
      }

      const colHomeRadio = document.getElementById('colHome');
      const colLabRadio = document.getElementById('colLab');
      if (isHome && colHomeRadio) {
        colHomeRadio.checked = true;
      } else if (!isHome && colLabRadio) {
        colLabRadio.checked = true;
      }
    });
  });

  // Step 3: Test Checkbox selection & Live Price Calculation
  const testCheckboxes = document.querySelectorAll('.test-select-checkbox');
  const updatePriceCalculation = () => {
    const checked = document.querySelectorAll('.test-select-checkbox:checked');
    bookingData.selectedItems = Array.from(checked).map(c => ({
      name: c.value,
      price: parseFloat(c.getAttribute('data-price') || 0)
    }));

    const total = bookingData.selectedItems.reduce((acc, curr) => acc + curr.price, 0);
    bookingData.totalCost = total;

    const priceDisplay = document.getElementById('wizardCalculatedPrice');
    if (priceDisplay) {
      priceDisplay.textContent = `$${total.toFixed(2)}`;
    }
  };

  testCheckboxes.forEach(cb => {
    cb.addEventListener('change', updatePriceCalculation);
  });
  updatePriceCalculation();

  // Step 4: Time slot buttons
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingData.appointment.timeSlot = btn.getAttribute('data-slot') || btn.textContent.trim();
    });
  });

  // Validate step
  const validateStep = (step) => {
    if (step === 1) {
      const name = document.getElementById('patientFullName');
      const phone = document.getElementById('patientPhone');
      const email = document.getElementById('patientEmail');
      const age = document.getElementById('patientAge');
      const gender = document.getElementById('patientGender');

      if (!name.value.trim() || !phone.value.trim() || !email.value.trim() || !age.value || !gender.value) {
        showToast('Please fill in all required patient details.', 'warning');
        return false;
      }

      bookingData.patient = {
        fullName: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        age: age.value,
        gender: gender.value,
        address: document.getElementById('patientAddress')?.value.trim() || 'N/A'
      };
      return true;
    }

    if (step === 3) {
      if (bookingData.selectedItems.length === 0) {
        showToast('Please select at least one test or package.', 'warning');
        return false;
      }
      return true;
    }

    if (step === 4) {
      const dateInput = document.getElementById('appointmentDate');
      if (!dateInput.value) {
        // Default to tomorrow if empty
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
      bookingData.appointment.date = dateInput.value;
      const collectionRadio = document.querySelector('input[name="collectionType"]:checked');
      if (collectionRadio) {
        bookingData.appointment.collectionMethod = collectionRadio.value;
      }
      const centerSelect = document.getElementById('centerLocationSelect');
      if (centerSelect) {
        bookingData.appointment.centerLocation = centerSelect.value;
      }
      return true;
    }

    return true;
  };

  // Next / Submit Handler
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;

      if (currentStep < totalSteps) {
        currentStep++;
        updateWizardUI();
        const wizardTop = wizardContainer.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: wizardTop, behavior: 'smooth' });
      } else {
        // Confirmation Execution
        showBookingSuccessModal(bookingData);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateWizardUI();
        const wizardTop = wizardContainer.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: wizardTop, behavior: 'smooth' });
      }
    });
  }

  // Step Node Direct Navigation
  stepNodes.forEach((node, idx) => {
    node.addEventListener('click', () => {
      const targetStep = idx + 1;
      if (targetStep <= currentStep) {
        currentStep = targetStep;
        updateWizardUI();
      }
    });
  });

  updateWizardUI();
}

function populateReviewSummary(data) {
  const summaryContainer = document.getElementById('bookingReviewSummary');
  if (!summaryContainer) return;

  const itemsHtml = data.selectedItems.map(item => `
    <div class="d-flex justify-content-between py-1 border-bottom">
      <span><i class="bi bi-clipboard2-pulse text-secondary me-2"></i>${item.name || item}</span>
      <span class="fw-bold">${item.price ? '$' + item.price.toFixed(2) : 'Included'}</span>
    </div>
  `).join('');

  summaryContainer.innerHTML = `
    <div class="row g-4">
      <div class="col-md-6">
        <div class="p-3 rounded bg-subtle">
          <h6 class="fw-bold mb-3 text-main"><i class="bi bi-person-circle text-primary me-2"></i>Patient Information</h6>
          <p class="mb-1 text-muted small"><strong>Name:</strong> <span class="text-main">${data.patient.fullName}</span></p>
          <p class="mb-1 text-muted small"><strong>Contact:</strong> <span class="text-main">${data.patient.phone} | ${data.patient.email}</span></p>
          <p class="mb-1 text-muted small"><strong>Demographics:</strong> <span class="text-main">${data.patient.age} Yrs (${data.patient.gender})</span></p>
          <p class="mb-0 text-muted small"><strong>Address:</strong> <span class="text-main">${data.patient.address || 'N/A'}</span></p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-3 rounded bg-subtle">
          <h6 class="fw-bold mb-3 text-main"><i class="bi bi-calendar2-check text-primary me-2"></i>Schedule & Collection</h6>
          <p class="mb-1 text-muted small"><strong>Date:</strong> <span class="text-main">${data.appointment.date || 'Tomorrow'}</span></p>
          <p class="mb-1 text-muted small"><strong>Time Window:</strong> <span class="text-main">${data.appointment.timeSlot}</span></p>
          <p class="mb-1 text-muted small"><strong>Collection:</strong> <span class="text-main">${data.appointment.collectionMethod}</span></p>
          <p class="mb-0 text-muted small"><strong>Facility:</strong> <span class="text-main">${data.appointment.centerLocation}</span></p>
        </div>
      </div>
      <div class="col-12">
        <div class="p-3 rounded border bg-surface">
          <h6 class="fw-bold mb-3 text-main"><i class="bi bi-bag-check text-primary me-2"></i>Selected Diagnostic Tests</h6>
          ${itemsHtml || '<p class="text-muted small">No specific test selected.</p>'}
          <div class="d-flex justify-content-between pt-3 mt-2 border-top">
            <span class="h5 mb-0 fw-bold text-main">Estimated Total:</span>
            <span class="h4 mb-0 fw-bold text-secondary">$${data.totalCost ? data.totalCost.toFixed(2) : '28.00'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showBookingSuccessModal(data) {
  const refId = 'VL-' + Math.floor(100000 + Math.random() * 900000);
  const modalHtml = `
    <div class="modal fade" id="bookingConfirmedModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-secondary text-white border-0 py-3">
            <h5 class="modal-title fw-bold"><i class="bi bi-check2-circle me-2"></i>Booking Confirmed</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center p-4">
            <div class="author-avatar mx-auto mb-3" style="width: 70px; height: 70px; font-size: 2rem; background: var(--secondary-light);">
              <i class="bi bi-shield-check text-secondary"></i>
            </div>
            <h4 class="fw-bold mb-1">Appointment Scheduled!</h4>
            <p class="text-muted mb-3 small">Your diagnostic booking has been successfully registered in the Vitalis Labs system.</p>
            
            <div class="p-3 rounded bg-subtle mb-3 text-start small">
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Booking Reference:</span>
                <span class="fw-bold text-primary">${refId}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Patient:</span>
                <span class="fw-bold">${data.patient.fullName}</span>
              </div>
              <div class="d-flex justify-content-between mb-1">
                <span class="text-muted">Date & Time:</span>
                <span class="fw-bold">${data.appointment.date || 'Tomorrow'} (${data.appointment.timeSlot})</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Collection Mode:</span>
                <span class="fw-bold text-secondary">${data.appointment.collectionMethod}</span>
              </div>
            </div>

            <div class="alert alert-info py-2 small mb-3 text-start">
              <i class="bi bi-info-circle-fill me-1"></i> A confirmation SMS & fasting guidelines have been dispatched to <strong>${data.patient.phone}</strong>.
            </div>

            <button type="button" class="btn btn-vitalis btn-vitalis-primary w-100" data-bs-dismiss="modal">
              Done & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('bookingConfirmedModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modalEl = document.getElementById('bookingConfirmedModal');
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

/* ==========================================================================
   9. Report Access Lookup (Simulated Diagnostic Report Modal)
   ========================================================================== */
function initReportAccess() {
  const reportForm = document.getElementById('reportAccessForm');
  if (!reportForm) return;

  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const patientId = document.getElementById('reportPatientId').value.trim();
    const reportId = document.getElementById('reportAccessId').value.trim();

    if (!patientId || !reportId) {
      showToast('Please enter both Patient ID and Report ID.', 'warning');
      return;
    }

    showSimulatedReportModal(patientId, reportId);
  });
}

function showSimulatedReportModal(patientId, reportId) {
  const modalHtml = `
    <div class="modal fade" id="reportResultModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-primary text-white border-0 py-3">
            <div>
              <h5 class="modal-title fw-bold"><i class="bi bi-file-earmark-medical me-2"></i>Vitalis Diagnostic Report</h5>
              <small class="text-light">Verified Clinical Electronic Pathology Document</small>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom flex-wrap gap-2">
              <div>
                <span class="badge badge-vitalis mb-1">Status: Final & Approved</span>
                <h6 class="fw-bold mb-0">Comprehensive Metabolic & CBC Panel</h6>
              </div>
              <div class="text-end">
                <span class="small text-muted d-block">Report Ref: <strong>${reportId}</strong></span>
                <span class="small text-muted">Patient ID: <strong>${patientId}</strong></span>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-vitalis mb-3 small">
                <thead>
                  <tr>
                    <th>Test Parameter</th>
                    <th>Result Value</th>
                    <th>Reference Range</th>
                    <th>Clinical Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Hemoglobin (Hb)</strong></td>
                    <td>14.8 g/dL</td>
                    <td>13.5 - 17.5 g/dL</td>
                    <td><span class="badge bg-success-subtle text-success">Normal</span></td>
                  </tr>
                  <tr>
                    <td><strong>Fasting Blood Glucose</strong></td>
                    <td>94 mg/dL</td>
                    <td>70 - 99 mg/dL</td>
                    <td><span class="badge bg-success-subtle text-success">Normal</span></td>
                  </tr>
                  <tr>
                    <td><strong>Total Cholesterol</strong></td>
                    <td>182 mg/dL</td>
                    <td>< 200 mg/dL</td>
                    <td><span class="badge bg-success-subtle text-success">Optimal</span></td>
                  </tr>
                  <tr>
                    <td><strong>Serum Creatinine</strong></td>
                    <td>0.92 mg/dL</td>
                    <td>0.7 - 1.3 mg/dL</td>
                    <td><span class="badge bg-success-subtle text-success">Normal</span></td>
                  </tr>
                  <tr>
                    <td><strong>Vitamin D3 (25-OH)</strong></td>
                    <td>38.4 ng/mL</td>
                    <td>30.0 - 100.0 ng/mL</td>
                    <td><span class="badge bg-success-subtle text-success">Sufficient</span></td>
                  </tr>
                  <tr>
                    <td><strong>Thyroid TSH</strong></td>
                    <td>2.15 µIU/mL</td>
                    <td>0.45 - 4.50 µIU/mL</td>
                    <td><span class="badge bg-success-subtle text-success">Normal</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2 border-top">
              <span class="small text-muted"><i class="bi bi-shield-lock-fill text-secondary me-1"></i> Dual Signed by Dr. Arthur Vance, MD</span>
              <button type="button" class="btn btn-vitalis btn-vitalis-secondary btn-vitalis-sm" onclick="showToast('Official PDF report downloaded.', 'success')">
                <i class="bi bi-download me-1"></i> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('reportResultModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modalEl = document.getElementById('reportResultModal');
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

/* ==========================================================================
   10. Contact Form Live Handler
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('vitalisContactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all mandatory fields.', 'warning');
      return;
    }

    showToast('Thank you! Your message has been dispatched to our laboratory team.', 'success');
    contactForm.reset();
  });
}

/* ==========================================================================
   11. Lightweight Toast Notification Utility
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.vitalis-toast');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'vitalis-toast';
    document.body.appendChild(toastContainer);
  }

  let icon = 'bi-info-circle-fill text-primary';
  if (type === 'success') icon = 'bi-check-circle-fill text-success';
  if (type === 'warning') icon = 'bi-exclamation-triangle-fill text-warning';
  if (type === 'danger') icon = 'bi-x-circle-fill text-danger';

  toastContainer.innerHTML = `
    <i class="bi ${icon} fs-4"></i>
    <div class="small fw-semibold text-main">${message}</div>
  `;

  toastContainer.classList.add('show');

  setTimeout(() => {
    toastContainer.classList.remove('show');
  }, 4000);
}
