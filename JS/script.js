

//loader

const loadOut = document.querySelector("#loads");
const paginhide =document.querySelector(".swiper-pagination");

document.onreadystatechange = function () {
  if (document.readyState !== "complete") {
     document.querySelector("body").style.visibility = "hidden";
     loadOut.style.display = "flex";
     document.body.style.overflowY = "hidden";
     paginhide.style.display="none";

  } else {
     setTimeout(() => {
        loadOut.style.display ="none";
        document.querySelector("body").style.visibility = "visible";
        document.body.style.overflowY = "scroll";
        paginhide.style.display="inherit";
     
     }, 1000)
  }
};



// footer year
const currentYear = document.getElementById("currentYear");
currentYear.textContent = new Date().getFullYear();



// GO TO TOP

const goTopBtn = document.getElementById("goTopBtn");

window.onscroll = function () {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    goTopBtn.classList.add("show");
  } else {
    goTopBtn.classList.remove("show");
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}



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





   


    // ACCORDIAN SEC

    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const openItem = document.querySelector('.accordion-item.active');

        if (openItem && openItem !== item) {
          openItem.classList.remove('active');
        }

        item.classList.toggle('active');
      });
    });


  // faculty dewpartment
    // Faculty Card Animation
        const facultyCards = document.querySelectorAll('.faculty-card');
        
        facultyCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.transitionDelay = `${index * 0.1}s`;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500);
        });












