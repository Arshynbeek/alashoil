class Carousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.items = this.carousel.querySelectorAll(".item");
    this.heroes = this.carousel.querySelectorAll(".hero");
    this.carouselItems = document.querySelectorAll(".carousel-item");
    this.pauseButton = document.getElementById("pause");
    this.playButton = document.getElementById("play");
    this.controlButton = document.getElementById("control-button");
    this.currentIndex = 0;
    this.isAnimating = false;
    this.interval = null;
    this.isPaused = false;
    this.progressInterval = null;
    this.progress = 0;

    this.init();
    this.setupControls();
    this.setupPaginationClicks();
  }

  init() {
    this.items.forEach((item, index) => {
      if (index === 0) {
        item.classList.add("active");
        this.heroes[index].classList.add("active");
        this.updateRandomZoomPosition(item);
        this.startProgress(0);
      } else {
        this.updateRandomZoomPosition(item);
      }
    });

    this.startCarousel();
  }

  setupControls() {
    this.controlButton.addEventListener("click", () => {
      if (this.isPaused) {
        this.resumeCarousel();
      } else {
        this.pauseCarousel();
      }
    });
  }

  updateRandomZoomPosition(item) {
    const randomX = Math.floor(Math.random() * 21 - 10);
    const randomY = Math.floor(Math.random() * 21 - 10);
    item.style.setProperty("--random-x", `${randomX}px`);
    item.style.setProperty("--random-y", `${randomY}px`);
  }

  startProgress(index) {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    this.carouselItems.forEach((item) => {
      item.style.background = "transparent";
    });

    this.progress = 0;
    const currentItem = this.carouselItems[index];
    currentItem.style.background = "#FFFFFF";

    if (!this.isPaused) {
      this.progressInterval = setInterval(() => {
        this.progress += 0.4;
        currentItem.style.background = `linear-gradient(to right, #FFFFFF ${this.progress}%, transparent ${this.progress}%)`;

        if (this.progress >= 100) {
          clearInterval(this.progressInterval);
        }
      }, 20);
    }
  }

  async transition() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const currentItem = this.items[this.currentIndex];
    const currentHero = this.heroes[this.currentIndex];
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    const nextItem = this.items[nextIndex];
    const nextHero = this.heroes[nextIndex];

    nextItem.style.animation = "none";
    nextItem.offsetHeight;
    nextItem.style.animation = "";

    nextItem.classList.add("next");
    this.updateRandomZoomPosition(nextItem);

    currentHero.classList.add("slide-out");
    nextHero.classList.add("slide-in");

    await new Promise((resolve) => setTimeout(resolve, 50));

    nextHero.classList.remove("slide-in");
    nextHero.classList.add("active");

    currentItem.style.opacity = "0";
    currentItem.classList.remove("active");

    nextItem.classList.add("active");
    nextItem.classList.remove("next");
    nextItem.style.opacity = "1";

    await new Promise((resolve) => setTimeout(resolve, 800));

    currentHero.classList.remove("active", "slide-out");

    nextItem.style.animation = "zoomEffect 5s ease-in-out forwards";

    this.currentIndex = nextIndex;
    this.isAnimating = false;

    this.startProgress(nextIndex);
  }

  startCarousel() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.startProgress(this.currentIndex);

    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.transition();
      }
    }, 5000);
  }

  stopCarousel() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  pauseCarousel() {
    this.stopCarousel();
    this.isPaused = true;
    this.pauseButton.style.display = "none";
    this.playButton.style.display = "block";

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  resumeCarousel() {
    this.isPaused = false;
    this.pauseButton.style.display = "block";
    this.playButton.style.display = "none";

    this.startProgress(this.currentIndex);
    this.startCarousel();
  }

  setupPaginationClicks() {
    this.carouselItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (index !== this.currentIndex) {
          this.goToSlide(index);
        }
      });
    });
  }

  async goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.isAnimating = true;

    const currentItem = this.items[this.currentIndex];
    const currentHero = this.heroes[this.currentIndex];
    const nextItem = this.items[index];
    const nextHero = this.heroes[index];

    nextItem.style.animation = "none";
    nextItem.offsetHeight;
    nextItem.style.animation = "";

    nextItem.classList.add("next");
    this.updateRandomZoomPosition(nextItem);

    currentHero.classList.add("slide-out");
    nextHero.classList.add("slide-in");

    await new Promise((resolve) => setTimeout(resolve, 50));

    nextHero.classList.remove("slide-in");
    nextHero.classList.add("active");

    currentItem.style.opacity = "0";
    currentItem.classList.remove("active");

    nextItem.classList.add("active");
    nextItem.classList.remove("next");
    nextItem.style.opacity = "1";

    await new Promise((resolve) => setTimeout(resolve, 800));

    currentHero.classList.remove("active", "slide-out");

    nextItem.style.animation = "zoomEffect 5s ease-in-out forwards";

    this.currentIndex = index;
    this.isAnimating = false;

    this.startProgress(index);
  }
}

const carousel = new Carousel(document.querySelector(".carousel"));

document.addEventListener("scroll", () => {
  document.querySelector(".text-container h6:nth-child(1)").style.left =
    window.scrollY - 600 + "px";
  document.querySelector(".text-container h6:nth-child(2)").style.right =
    window.scrollY - 600 + "px";
  document.querySelector(".text-container h6:nth-child(3)").style.left =
    window.scrollY - 600 + "px";

  const aboutSection = document.querySelector("#about-us");
  const imageContainer = document.querySelector(".image-container");

  const aboutSectionRect = aboutSection.getBoundingClientRect();
  const scrollProgress =
    (aboutSectionRect.bottom - window.innerHeight * 0.2) /
    aboutSectionRect.height;

  const opacity = Math.max(0, Math.min(1, scrollProgress));

  imageContainer.style.opacity = opacity - 0.3;
});

function animateNumber(element, target) {
  let current = 0;
  const duration = 2000;
  const steps = 50;
  const increment = target / steps;
  const stepTime = duration / steps;

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }
    element.textContent = Math.floor(current);
  }, stepTime);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll(".number");
        numbers.forEach((number) => {
          const target = parseInt(number.dataset.target);
          animateNumber(number, target);
        });

        const titles = entry.target.querySelectorAll(".info h5");
        titles.forEach((title, index) => {
          setTimeout(() => {
            title.classList.add("animate");
          }, index * 200);
        });

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5,
    rootMargin: "0px",
  }
);

const aboutSection = document.querySelector(".info");
if (aboutSection) {
  observer.observe(aboutSection);
}

const quoteObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const quote = entry.target;

        const words = quote.textContent.split(" ");
        quote.textContent = "";
        words.forEach((word) => {
          const span = document.createElement("span");
          span.textContent = word + " ";
          quote.appendChild(span);
        });

        const wordSpans = quote.querySelectorAll("span");
        const delay = 8000 / wordSpans.length;

        wordSpans.forEach((span, index) => {
          setTimeout(() => {
            span.classList.add("read");
          }, delay * index);
        });

        quoteObserver.unobserve(quote);
      }
    });
  },
  {
    threshold: 0.5,
  }
);

const quoteText = document.querySelector(".quote h3");
if (quoteText) {
  quoteObserver.observe(quoteText);
}

class ServicesTab {
  constructor() {
    this.tabContainer = document.querySelector(".services-tab");
    this.tabs = this.tabContainer.querySelectorAll("span");
    this.servicesContainer = document.querySelector(".services-container");

    this.currentIndex = 0;

    this.contents = [
      {
        titleKey: "service-6",
        descriptionKey: "service-description-6",
        image: "/public/service-6.jpg",
      },
      {
        titleKey: "service-1",
        descriptionKey: "service-description-1",
        image: "/public/service-1.webp",
      },
      {
        titleKey: "service-2",
        descriptionKey: "service-description-2",
        image: "/public/service-3.webp",
      },
      {
        titleKey: "service-3",
        descriptionKey: "service-description-3",
        image: "/public/service-4.webp",
      },
      {
        titleKey: "service-4",
        descriptionKey: "service-description-4",
        image: "/public/service-2.png",
      },
      {
        titleKey: "service-5",
        descriptionKey: "service-description-5",
        image: "/public/service-5.webp",
      },
    ];

    this.init();
  }

  init() {
    this.tabs[0].classList.add("active");
    this.updateContent(0);

    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        this.setActiveTab(index);
        this.updateContent(index);
        this.scrollTabToCenter(tab);
      });
    });
  }

  setActiveTab(index) {
    this.tabs.forEach((tab) => tab.classList.remove("active"));
    this.tabs[index].classList.add("active");
  }

  scrollTabToCenter(tab) {
    const tabRect = tab.getBoundingClientRect();
    const containerRect = this.tabContainer.getBoundingClientRect();

    const scrollLeft =
      tab.offsetLeft - containerRect.width / 2 + tabRect.width / 2;

    this.tabContainer.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }

  updateContent(index) {
    const content = this.contents[index];
    this.currentIndex = index;
    this.servicesContainer.classList.remove("active");

    setTimeout(() => {
      this.servicesContainer.innerHTML = `
        <div class="services-content">
          <div>
            <h3 data-i18n="${content.titleKey}"></h3>
            <p data-i18n="${content.descriptionKey}"></p>
          </div>
          <a href="/service.html">
            <button class='learn-more'>
              <i class="material-icons arrow">east</i>
              <span data-i18n="learn-more"></span>
            </button>
          </a>
        </div>
        <div class="services-img">
          <img src="${content.image}" alt="">
        </div>
      `;

      const currentLang = localStorage.getItem("language") || "ru";
      const elements = this.servicesContainer.querySelectorAll("[data-i18n]");
      elements.forEach((element) => {
        const key = element.getAttribute("data-i18n");
        element.textContent = translations[currentLang][key];
      });

      this.servicesContainer.classList.add("active");
    }, 300);
  }
}

const servicesTab = new ServicesTab();

const menuButton = document.querySelector(".menu-button");
const menuBackground = document.querySelector(".menu-background");
const closeButton = document.querySelector(".close");
const menu = document.querySelector(".menu");

menuBackground.style.display = "none";

function openMenu() {
  menuBackground.style.display = "block";
  menuBackground.offsetHeight;
  menuBackground.classList.add("active");
  menu.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menuBackground.classList.remove("active");
  menu.classList.remove("active");

  setTimeout(() => {
    menuBackground.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

menuButton.addEventListener("click", openMenu);
closeButton.addEventListener("click", closeMenu);

menuBackground.addEventListener("click", (event) => {
  if (event.target === menuBackground) {
    closeMenu();
  }
});

const menuLinks = menu.querySelectorAll("a");
menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const languageButtons = document.querySelectorAll(".lang");
let currentLang = localStorage.getItem("language") || "ru";

document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);
  highlightCurrentLanguage();
});

languageButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const lang = e.target.id;
    setLanguage(lang);
    highlightCurrentLanguage();
    window.location.reload();
  });
});

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("language", lang);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = translations[lang][key];
  });
}

function highlightCurrentLanguage() {
  languageButtons.forEach((button) => {
    if (button.id === currentLang) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}
