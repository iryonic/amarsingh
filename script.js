'use strict';

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
     }, 3000)
  }
};



const goTopBtn = document.getElementById("goTopBtn");

window.onscroll = function () {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
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


//notification 
const list = document.getElementById("notificationList");
    const items = Array.from(list.children);
    const scrollUp = document.getElementById("scrollUp");
    const scrollDown = document.getElementById("scrollDown");
    const monthFilter = document.getElementById("monthFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const searchInput = document.getElementById("searchInput");

    let scrollInterval;
    let topIndex = 0;

    function getFilteredItems() {
      const month = monthFilter.value;
      const category = categoryFilter.value.toLowerCase();
      const keyword = searchInput.value.toLowerCase();

      return items.filter(item => {
        const itemMonth = item.getAttribute("data-month");
        const itemCategory = item.getAttribute("data-category").toLowerCase();
        const text = item.innerText.toLowerCase();

        return (
          (month === "" || itemMonth === month) &&
          (category === "" || itemCategory === category) &&
          (keyword === "" || text.includes(keyword))
        );
      });
    }

    function renderList() {
      const filtered = getFilteredItems();
      list.innerHTML = "";
      filtered.forEach(item => list.appendChild(item.cloneNode(true)));
    }

    function autoScroll() {
      clearInterval(scrollInterval);
      scrollInterval = setInterval(() => {
        const total = list.children.length;
        if (topIndex < total - 1) topIndex++;
        else topIndex = 0;

        const topEl = list.children[topIndex];
        list.style.transition = "transform 0.6s ease-in-out";
        list.style.transform = `translateY(-${topEl.offsetTop}px)`;
      }, 2000);
    }

    function manualScroll(direction) {
      clearInterval(scrollInterval);
      const total = list.children.length;
      if (direction === "up" && topIndex > 0) topIndex--;
      if (direction === "down" && topIndex < total - 1) topIndex++;

      const topEl = list.children[topIndex];
      list.style.transition = "transform 0.5s ease-in-out";
      list.style.transform = `translateY(-${topEl.offsetTop}px)`;

      setTimeout(autoScroll, 2000);
    }

    scrollUp.addEventListener("click", () => manualScroll("up"));
    scrollDown.addEventListener("click", () => manualScroll("down"));

    [monthFilter, categoryFilter, searchInput].forEach(input =>
      input.addEventListener("input", () => {
        topIndex = 0;
        renderList();
      })
    );

    renderList();
    autoScroll();



    //Gallery Section

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const downloadBtn = document.getElementById('download');
    const closeModal = document.getElementById('closeModal');

    let scale = 1;
    const maxScale = 3;
    const minScale = 1;

    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.addEventListener('click', () => {
        modal.style.display = 'flex';
        modalImg.src = img.src;
        scale = 1;
        modalImg.style.transform = `scale(${scale})`;
      });
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    zoomInBtn.addEventListener('click', () => {
      if (scale < maxScale) {
        scale += 0.25;
        modalImg.style.transform = `scale(${scale})`;
      }
    });

    zoomOutBtn.addEventListener('click', () => {
      if (scale > minScale) {
        scale -= 0.25;
        modalImg.style.transform = `scale(${scale})`;
      }
    });

    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = modalImg.src;
      link.download = 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // Double tap zoom for touch
    let lastTap = 0;
    modalImg.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        scale = (scale === 1) ? 2 : 1;
        modalImg.style.transform = `scale(${scale})`;
        e.preventDefault();
      }
      lastTap = currentTime;
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
