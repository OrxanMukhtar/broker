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

// Menu navigation
const links = document.querySelectorAll("nav ul li a");
const sections = document.querySelectorAll(".section");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("data-section");

    sections.forEach(sec => sec.classList.remove("activeSection"));
    document.getElementById(target).classList.add("activeSection");

    if (window.gtag) {
      gtag('event', 'menu_click', {
        'event_category': 'navigation',
        'event_label': target
      });

      gtag('config', 'G-KG5TNRLDP8', {
        'page_path': '/' + target,
        'page_title': target.charAt(0).toUpperCase() + target.slice(1)
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

  if (window.gtag) {
    gtag('event', 'roi_calculate', {
      'event_category': 'form',
      'value': roi.toFixed(2),
      'currency': 'AED'
    });
  }
});

// Video Slider
// let currentSlide = 0;
// const slides = document.querySelectorAll('.video-slide');

// function showSlide(index) {
//   slides.forEach((slide, i) => {
//     slide.classList.toggle('active', i === index);
//     const iframe = slide.querySelector('iframe');
//     iframe.src = iframe.src;
//   });
// }

// function nextSlide() {
//   currentSlide = (currentSlide + 1) % slides.length;
//   showSlide(currentSlide);
// }

// function prevSlide() {
//   currentSlide = (currentSlide - 1 + slides.length) % slides.length;
//   showSlide(currentSlide);
// }

// showSlide(currentSlide);



document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.video-slide');

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      // Videoyu yeniden yüklemek sorun çıkarabilir, kaldırdım
    });
  }

  window.nextSlide = function() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  window.prevSlide = function() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);
});







