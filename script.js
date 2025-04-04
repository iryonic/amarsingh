

//loader

const loads = document.querySelector("#loads");

document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
     document.querySelector("body").style.visibility = "hidden";
     document.getElementById("loads").style.visibility = "visible";
  } else {
     setTimeout(() => {
        document.getElementById("loads").style.display ="none";
        document.querySelector("body").style.visibility = "visible";
     }, 2000)
  }
};



const dropdownBtn = document.querySelectorAll(".dropdown-btn");
const dropdown = document.querySelectorAll(".dropdown");
const hamburgerBtn = document.getElementById("hamburger");
const navMenu = document.querySelector(".menu");
const links = document.querySelectorAll(".dropdown a");

function setAriaExpandedFalse() {
  dropdownBtn.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
}

function closeDropdownMenu() {
  dropdown.forEach((drop) => {
    drop.classList.remove("active");
    drop.addEventListener("click", (e) => e.stopPropagation());
  });
}

function toggleHamburger() {
  navMenu.classList.toggle("show");
  document.body.classList.toggle("shift");
}


let navbar = document.getElementById('nav-menu').classList
let active_class = "navbar_scrolled"

/**
 * Слушаем событие прокрутки
 */
window.addEventListener('scroll', e => {
  if(pageYOffset > 500) navbar.add(active_class)
  else navbar.remove(active_class)
})
 



dropdownBtn.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const dropdownIndex = e.currentTarget.dataset.dropdown;
    const dropdownElement = document.getElementById(dropdownIndex);

    dropdownElement.classList.toggle("active");
    dropdown.forEach((drop) => {
      if (drop.id !== btn.dataset["dropdown"]) {
        drop.classList.remove("active");
      }
    });
    e.stopPropagation();
    btn.setAttribute(
      "aria-expanded",
      btn.getAttribute("aria-expanded") === "false" ? "true" : "false"
    );
  });
});

// close dropdown menu when the dropdown links are clicked
links.forEach((link) =>
  link.addEventListener("click", () => {
    closeDropdownMenu();
    setAriaExpandedFalse();
    toggleHamburger();
  })
);

// close dropdown menu when you click on the document body
document.documentElement.addEventListener("click", () => {
  closeDropdownMenu();
  setAriaExpandedFalse();
});

// close dropdown when the escape key is pressed
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDropdownMenu();
    setAriaExpandedFalse();
  }
});

// toggle hamburger menu
hamburgerBtn.addEventListener("click", toggleHamburger);


// SWIPER 
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  loop: true,

  autoplay: {
    delay: 4000,
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

//new swiper
new Swiper('.card-wrapper', {
  loop: true,
  spaceBetween: 30,
  // Pagination bullets
  pagination: {
      el: '.swiper-pagination2',
      clickable: true,
      dynamicBullets: true
  },
  // Navigation arrows
  navigation: {
      nextEl: '.swiper-button-next2',
      prevEl: '.swiper-button-prev2',
  },
  // Responsive breakpoints
  breakpoints: {
      0: {
          slidesPerView: 1
      },
      768: {
          slidesPerView: 2
      },
      1024: {
          slidesPerView: 3
      }
  }
});


//notification 
const notifications = [
  {
    date: "2025-04-04",
    title: "Mid-Term Exam Dates Announced",
    desc: "Exams will begin on April 10. Check timetable in the academic portal."
  },
  {
    date: "2025-04-02",
    title: "AI & ML Course Launched",
    desc: "New elective available for 5th semester students. Apply before April 8."
  },
  {
    date: "2025-04-01",
    title: "Library Timings Extended",
    desc: "Library open till 8 PM from Mon–Sat to help with exam prep."
  },
  {
    date: "2025-03-28",
    title: "Placement Drive: Infosys",
    desc: "Infosys placement drive on April 5. Register by March 30."
  },
  {
    date: "2025-03-15",
    title: "Seminar on Cybersecurity",
    desc: "Guest lecture on April 2 by industry expert. Limited seats!"
  }
];

const container = document.getElementById("notifications-list");
const toggleBtn = document.getElementById("toggle-btn");
const filter = document.getElementById("month-filter");

let showAll = false;

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function renderNotifications(filtered = notifications) {
  container.innerHTML = "";
  let toShow = showAll ? filtered : filtered.slice(0, 3);
  toShow.forEach(notif => {
    const el = document.createElement("div");
    el.className = "notification";
    el.innerHTML = `
      <div class="date">${formatDate(notif.date)}</div>
      <div class="title">${notif.title}</div>
      <div class="desc">${notif.desc}</div>
    `;
    container.appendChild(el);
  });
  animateOnScroll();
  toggleBtn.style.display = filtered.length <= 3 ? "none" : "block";
  toggleBtn.innerText = showAll ? "Show Less" : "Show More";
}

toggleBtn.addEventListener("click", () => {
  showAll = !showAll;
  applyFilter();
});

filter.addEventListener("change", applyFilter);

function applyFilter() {
  const val = filter.value;
  const filtered = val === "all"
    ? notifications
    : notifications.filter(n => n.date.startsWith(val));
  renderNotifications(filtered);
}

function animateOnScroll() {
  const observers = document.querySelectorAll(".notification");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  observers.forEach(el => observer.observe(el));
}

// Initial render
applyFilter();