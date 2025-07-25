// Thousand separator helpers
function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function cleanNumber(str) {
  return str.replace(/,/g, '');
}
function addThousandSeparator(e) {
  const input = e.target;
  let caretPos = input.selectionStart;
  const originalLength = input.value.length;

  let clean = cleanNumber(input.value);
  if (isNaN(clean)) {
    clean = clean.replace(/[^\d]/g, '');
  }
  if (clean === '') {
    input.value = '';
    return;
  }

  input.value = formatNumber(clean);
  const newLength = input.value.length;
  caretPos += newLength - originalLength;
  input.setSelectionRange(caretPos, caretPos);
}

['property-price', 'rental-income', 'service-charge'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', addThousandSeparator);
});

// Rental increase input toggle
document.getElementById("rental-increase").addEventListener("input", function () {
  const showYears = this.value !== "" && !isNaN(parseFloat(this.value));
  document.getElementById("years-container").style.display = showYears ? "block" : "none";
});

// Menu navigation with GA4 tracking
const links = document.querySelectorAll("nav ul li a");
const sections = document.querySelectorAll(".section");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("data-section");

    // Section geçişi
    sections.forEach(sec => sec.classList.remove("activeSection"));
    document.getElementById(target).classList.add("activeSection");

    // GA4 event gönderimi
    if (window.gtag) {
      const menuName = link.innerText.trim(); // "Contact", "Portfolio" gibi
      gtag('event', 'menu_click', {
        'event_category': 'navigation',
        'event_label': menuName
      });

      gtag('config', 'G-KG5TNRLDP8', {
        'page_path': '/' + target,
        'page_title': menuName
      });
    }
  });
});

// ROI Calculator
document.getElementById("roi-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const price = parseFloat(cleanNumber(document.getElementById("property-price").value));
  const rent = parseFloat(cleanNumber(document.getElementById("rental-income").value));
  const charge = parseFloat(cleanNumber(document.getElementById("service-charge").value));
  const vacancyRate = parseFloat(document.getElementById("vacancy-rate").value || 0);
  const rentalIncrease = parseFloat(document.getElementById("rental-increase").value || 0);
  const projectionYears = parseInt(document.getElementById("projection-years").value || 0);

  if (isNaN(price) || isNaN(rent) || isNaN(charge) || price === 0) {
    alert("Please enter valid numbers for property price, rental income, and service charge.");
    return;
  }

  const netAnnualIncome = rent * (1 - (vacancyRate / 100)) - charge;
  const roi = (netAnnualIncome / price) * 100;

  let resultsHtml = `<p><strong>Net Annual Income:</strong> AED ${formatNumber(netAnnualIncome.toFixed(0))}</p>`;
  resultsHtml += `<p><strong>ROI:</strong> ${roi.toFixed(2)}%</p>`;

  if (rentalIncrease && projectionYears) {
    resultsHtml += `<h3>Projected Rental Income for Next ${projectionYears} Years:</h3>`;
    let currentIncome = rent;
    const year = new Date().getFullYear();
    resultsHtml += '<ul>';
    for (let i = 1; i <= projectionYears; i++) {
      currentIncome *= (1 + rentalIncrease / 100);
      let netIncome = currentIncome * (1 - (vacancyRate / 100)) - charge;
      resultsHtml += `<li>${year + i}: AED ${formatNumber(netIncome.toFixed(0))}</li>`;
    }
    resultsHtml += '</ul>';
  }

  document.getElementById("roi-results").innerHTML = resultsHtml;

  // GA4 event
  if (window.gtag) {
    gtag('event', 'roi_calculate', {
      'event_category': 'form',
      'value': roi.toFixed(2),
      'currency': 'AED'
    });
  }
});

// Video Slider
document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.video-slide');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  window.nextSlide = function () {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  window.prevSlide = function () {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);
});

// Average Sale Price Fetch (DLD API)
async function fetchAvgPrice() {
  const today = new Date().toISOString().split('T')[0];
  const url = `https://api.dubaipulse.gov.ae/data/dld-transactions/v1?FromDate=${today}&ToDate=${today}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const tx = json.data || [];
    const avg = tx.reduce((sum, r) => sum + r.Amount, 0) / tx.length;
    document.getElementById('avgPrice').textContent = isNaN(avg)
      ? 'No transactions today'
      : `Today's avg sale price: AED ${avg.toFixed(0)}`;
  } catch (e) {
    document.getElementById('avgPrice').textContent = 'Error loading data';
    console.error(e);
  }
}

fetchAvgPrice();





document.addEventListener('DOMContentLoaded', () => {
  const doorSound = document.getElementById('doorSound');
  const clickSound = document.getElementById('clickSound');

  // İlk kullanıcı etkileşiminde sesleri "hazırla"
  let audioUnlocked = false;
  function unlockAudio() {
    if (!audioUnlocked) {
      doorSound.play().then(() => {
        doorSound.pause();
        doorSound.currentTime = 0;
      }).catch(() => {});
      
      clickSound.play().then(() => {
        clickSound.pause();
        clickSound.currentTime = 0;
      }).catch(() => {});

      audioUnlocked = true;
    }
  }
  document.body.addEventListener("click", unlockAudio, { once: true });

  // Scroll başında sadece 1 kez çalsın
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (audioUnlocked) {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    doorSound.currentTime = 0;
    doorSound.play().catch((e) => console.log("Scroll sound blocked:", e));

    // 300ms sonra tekrar scroll için hazır olur
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
    }, 300);
  }
});
  // Bütün buton ve linklerde tıklama sesi
  const clickableElements = document.querySelectorAll('button, a');

  clickableElements.forEach(el => {
    el.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.play().catch((e) => console.log("Click sound blocked:", e));
    });
  });
});

