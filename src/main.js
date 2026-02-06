import "./style.css";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import iCalendarPlugin from "@fullcalendar/icalendar";
import itLocale from "@fullcalendar/core/locales/it";

// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Initialize Swiper carousel (only on homepage)
const heroSwiper = document.querySelector(".heroSwiper");
if (heroSwiper) {
  new Swiper(".heroSwiper", {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

// Initialize gallery Swiper (only on homepage)
const gallerySwiper = document.querySelector(".gallerySwiper");
if (gallerySwiper) {
  new Swiper(".gallerySwiper", {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
}

// Calendar Modal functionality
const calendarModal = document.getElementById("calendarModal");
const openCalendarButtons = document.querySelectorAll(
  "#openCalendar, #openCalendarMobile, #heroBooking, #ctaBooking, #contactBooking",
);
const closeCalendarButton = document.getElementById("closeCalendar");

// Open calendar modal
openCalendarButtons.forEach((button) => {
  if (button) {
    button.addEventListener("click", () => {
      calendarModal.classList.remove("hidden");
      if (!window.calendarInitialized) {
        initCalendar();
      }
    });
  }
});

// Close calendar modal
if (closeCalendarButton) {
  closeCalendarButton.addEventListener("click", () => {
    calendarModal.classList.add("hidden");
  });
}

// Close modal when clicking outside
if (calendarModal) {
  calendarModal.addEventListener("click", (e) => {
    if (e.target === calendarModal) {
      calendarModal.classList.add("hidden");
    }
  });
}

// Initialize FullCalendar with iCal sync
let firstSelectedDate = null;
const PRICE_PER_NIGHT = 150;
const MIN_NIGHTS = 3;
const WEEKLY_DISCOUNT = 0.18; // 18%
const MONTHLY_DISCOUNT = 0.3; // 30%

function calculatePrice(nights) {
  let basePrice = nights * PRICE_PER_NIGHT;
  let discount = 0;

  if (nights >= 30) {
    discount = basePrice * MONTHLY_DISCOUNT;
  } else if (nights >= 7) {
    discount = basePrice * WEEKLY_DISCOUNT;
  }

  return {
    basePrice,
    discount,
    total: basePrice - discount,
    nights,
  };
}

function updatePriceSummary(startDate, endDate) {
  const summaryEl = document.getElementById("priceSummary");
  if (!summaryEl || !startDate || !endDate) return;

  const nights = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  const pricing = calculatePrice(nights);

  const formatter = new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  summaryEl.innerHTML = `
    <div class="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
      <h4 class="font-bold text-lg text-primary-900 mb-3">Riepilogo Prenotazione</h4>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-700">Check-in:</span>
          <span class="font-semibold">${formatter.format(startDate)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-700">Check-out:</span>
          <span class="font-semibold">${formatter.format(endDate)}</span>
        </div>
        <div class="flex justify-between border-t pt-2">
          <span class="text-gray-700">€${PRICE_PER_NIGHT} × ${nights} ${nights === 1 ? "notte" : "notti"}</span>
          <span>€${pricing.basePrice.toFixed(2)}</span>
        </div>
        ${
          pricing.discount > 0
            ? `
          <div class="flex justify-between text-secondary-600">
            <span>Sconto ${nights >= 30 ? "mensile (30%)" : "settimanale (18%)"}</span>
            <span>-€${pricing.discount.toFixed(2)}</span>
          </div>
        `
            : ""
        }
        <div class="flex justify-between border-t pt-2 font-bold text-lg text-primary-700">
          <span>Totale</span>
          <span>€${pricing.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin, iCalendarPlugin],
    initialView: "dayGridMonth",
    locale: itLocale,
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "", // Remove "Mese" button
    },
    height: "auto",

    // Enable date range selection
    selectable: true,
    selectMirror: true,
    selectOverlap: false,
    unselectAuto: false,

    // Prevent selecting dates in the past
    validRange: {
      start: new Date().toISOString().split("T")[0],
    },

    // Event sources - iCal feed from Airbnb
    eventSources: [
      {
        url: "/.netlify/functions/fetch-ical?source=booking",
        format: "ics",
        color: "#9ca3af",
        textColor: "white",
      },
    ],

    // Customize event rendering - show "Non disponibile"
    eventDidMount: function (info) {
      info.el.innerHTML =
        '<div class="fc-event-main" style="font-size: 0.7rem; text-align: center;">Non disponibile</div>';
      info.el.title = "Non disponibile";
    },

    // Handle date range selection
    select: function (selectionInfo) {
      const checkInInput = document.getElementById("checkIn");
      const checkOutInput = document.getElementById("checkOut");

      // Check if selection overlaps with any events (booked dates)
      const events = calendar.getEvents();
      const hasOverlap = events.some((event) => {
        return (
          selectionInfo.start < event.end && selectionInfo.end > event.start
        );
      });

      if (hasOverlap) {
        // Silently prevent selection by unselecting - no alert
        calendar.unselect();
        firstSelectedDate = null;
        return;
      }

      // FullCalendar uses exclusive end dates, so subtract 1 day for the actual checkout date
      const actualCheckOut = new Date(
        selectionInfo.end.getTime() - 24 * 60 * 60 * 1000,
      );

      // Calculate actual nights (check-out minus check-in)
      const actualNights =
        (actualCheckOut - selectionInfo.start) / (1000 * 60 * 60 * 24);

      // Check minimum stay (3 nights) - but skip check if this is just the first click (waiting for second click)
      // We know it's the first click if actualNights is 1 and firstSelectedDate is set
      const isFirstClickOnly = actualNights === 1 && firstSelectedDate !== null;

      if (actualNights < MIN_NIGHTS && !isFirstClickOnly) {
        // Silently prevent - don't show alert for single click
        if (actualNights >= 1) {
          alert(
            `Il soggiorno minimo è di ${MIN_NIGHTS} notti. Seleziona un periodo più lungo.`,
          );
        }
        calendar.unselect();
        return;
      }

      // If this is just the first click, keep the highlight but don't fill the form yet
      if (isFirstClickOnly) {
        return; // Keep the selection highlighted, wait for second click
      }

      // Fill in the form fields

      // Format dates in local timezone (not UTC) to avoid timezone offset issues
      const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const checkInStr = formatDateLocal(selectionInfo.start);
      const checkOutStr = formatDateLocal(actualCheckOut);

      if (checkInInput && checkOutInput) {
        checkInInput.value = checkInStr;
        checkOutInput.value = checkOutStr;

        // Update price summary with actual dates
        updatePriceSummary(selectionInfo.start, actualCheckOut);

        // Scroll to form
        checkInInput.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    // Handle single date click for two-click selection
    dateClick: function (dateClickInfo) {
      // Check if this date is booked
      const events = calendar.getEvents();
      const isBooked = events.some((event) => {
        return (
          dateClickInfo.date >= event.start && dateClickInfo.date < event.end
        );
      });

      if (isBooked) {
        return; // Can't select booked dates
      }

      if (!firstSelectedDate) {
        // First click - store the start date and keep it highlighted
        firstSelectedDate = dateClickInfo.date;
        // Select just this single date to keep it highlighted
        calendar.select(
          firstSelectedDate,
          new Date(firstSelectedDate.getTime() + 24 * 60 * 60 * 1000),
        );
      } else {
        // Second click - create range from first to second
        const secondDate = dateClickInfo.date;

        if (secondDate > firstSelectedDate) {
          // Valid range - select from first to second (add 1 day to second for exclusive end)
          const endDate = new Date(secondDate.getTime() + 24 * 60 * 60 * 1000);
          calendar.unselect();
          calendar.select(firstSelectedDate, endDate);
        } else {
          // Second click is before first - restart selection
          calendar.unselect();
          firstSelectedDate = secondDate;
          calendar.select(
            firstSelectedDate,
            new Date(firstSelectedDate.getTime() + 24 * 60 * 60 * 1000),
          );
          return;
        }

        // Reset for next selection
        firstSelectedDate = null;
      }
    },

    // Visual feedback when hovering
    selectAllow: function (selectInfo) {
      // Prevent selecting if it overlaps with booked dates
      const events = calendar.getEvents();
      return !events.some((event) => {
        return selectInfo.start < event.end && selectInfo.end > event.start;
      });
    },
  });

  calendar.render();
  window.calendarInitialized = true;
  window.fullCalendar = calendar; // Store for later use
}

// Form validation for booking form
const bookingForm = document.querySelector('form[name="booking"]');
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;

    if (new Date(checkIn) >= new Date(checkOut)) {
      e.preventDefault();
      alert(
        "La data di check-out deve essere successiva alla data di check-in",
      );
      return false;
    }

    // Set minimum stay to 3 nights
    const daysDiff =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    if (daysDiff < MIN_NIGHTS) {
      e.preventDefault();
      alert(`Il soggiorno minimo è di ${MIN_NIGHTS} notti`);
      return false;
    }

    // Show success message after form submission
    // In production, Netlify handles this. In dev, we simulate it.
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      e.preventDefault();
      showSuccessMessage(
        "Richiesta di prenotazione inviata con successo! (Modalità sviluppo - in produzione verrà inviata via email)",
      );
      bookingForm.reset();
      setTimeout(() => {
        calendarModal?.classList.add("hidden");
      }, 2000);
    }
  });
}

// Contact form success handling
const contactForm = document.querySelector('form[name="contact"]');
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    // Show success message in dev mode
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      e.preventDefault();
      showSuccessMessage(
        "Messaggio inviato con successo! (Modalità sviluppo - in produzione verrà inviata via email)",
      );
      contactForm.reset();
    }
  });
}

// Success message function
function showSuccessMessage(message) {
  const successDiv = document.createElement("div");
  successDiv.className =
    "fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-down";
  successDiv.innerHTML = `
    <div class="flex items-center space-x-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(successDiv);

  setTimeout(() => {
    successDiv.style.opacity = "0";
    successDiv.style.transition = "opacity 0.5s";
    setTimeout(() => successDiv.remove(), 500);
  }, 4000);
}

// Form success handling (Netlify Forms redirects by default, but we can add custom handling)
if (window.location.search.includes("success=booking")) {
  showSuccessMessage(
    "Grazie per la tua richiesta di prenotazione! Ti risponderemo al più presto.",
  );
}

if (window.location.search.includes("success=contact")) {
  showSuccessMessage(
    "Grazie per averci contattato! Ti risponderemo al più presto.",
  );
}

// Gallery lightbox functionality
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");
const prevLightbox = document.getElementById("prevLightbox");
const nextLightbox = document.getElementById("nextLightbox");

if (lightbox && lightboxImage) {
  const galleryImages = document.querySelectorAll('[data-gallery="gallery"]');
  let currentImageIndex = 0;

  // Open lightbox on image click
  galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentImageIndex = index;
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightbox.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  });

  // Close lightbox
  const closeLightboxFn = () => {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "auto";
  };

  closeLightbox?.addEventListener("click", closeLightboxFn);

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightboxFn();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
      closeLightboxFn();
    }
  });

  // Navigate to previous image
  prevLightbox?.addEventListener("click", () => {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
  });

  // Navigate to next image
  nextLightbox?.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
  });

  // Arrow key navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("hidden")) {
      if (e.key === "ArrowLeft") {
        prevLightbox?.click();
      } else if (e.key === "ArrowRight") {
        nextLightbox?.click();
      }
    }
  });
}
