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
function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, interactionPlugin, iCalendarPlugin],
    initialView: "dayGridMonth",
    locale: itLocale,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth",
    },
    height: "auto",

    // Enable date range selection
    selectable: true,
    selectMirror: true,
    selectOverlap: false, // Prevent selecting over booked dates
    unselectAuto: true,

    // Prevent selecting dates in the past
    validRange: {
      start: new Date().toISOString().split("T")[0],
    },

    // Event sources - iCal feeds from Booking.com and Airbnb
    eventSources: [
      {
        // Airbnb iCal feed
        url: "/.netlify/functions/fetch-ical?source=airbnb",
        format: "ics",
        color: "#FF5A5F",
        textColor: "white",
      },
      {
        // Booking.com iCal feed
        url: "/.netlify/functions/fetch-ical?source=booking",
        format: "ics",
        color: "#003580",
        textColor: "white",
      },
    ],

    // Customize event rendering
    eventDidMount: function (info) {
      // Mark booked dates
      info.el.title = info.event.title || "Occupato";
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
        alert(
          "Le date selezionate contengono giorni già occupati. Scegli un altro periodo.",
        );
        calendar.unselect();
        return;
      }

      // Calculate minimum stay (2 nights)
      const daysDiff =
        (selectionInfo.end - selectionInfo.start) / (1000 * 60 * 60 * 24);
      if (daysDiff < 2) {
        alert(
          "Il soggiorno minimo è di 2 notti. Seleziona un periodo più lungo.",
        );
        calendar.unselect();
        return;
      }

      // Fill in the form fields
      if (checkInInput && checkOutInput) {
        checkInInput.value = selectionInfo.startStr;
        checkOutInput.value = selectionInfo.endStr;

        // Scroll to form
        checkInInput.scrollIntoView({ behavior: "smooth", block: "nearest" });
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

    // Set minimum stay (optional)
    const daysDiff =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    if (daysDiff < 2) {
      e.preventDefault();
      alert("Il soggiorno minimo è di 2 notti");
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
