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

  imageContainer.style.opacity = opacity;
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

    this.contents = [
      {
        title: "Решения по Прекращению Утечек",
        description:
          "ALASH OIL GAZ SERVICES предлагает комплексные решения по обнаружению и прекращению утечек в нефтегазовых системах. Наши технологии позволяют эффективно предотвращать повреждения, минимизировать риски для окружающей среды и обеспечивать безопасность персонала.",
        image: "/public/about-1.jpg",
      },
      {
        title: "Услуги по Реабилитации с Использованием Композитных материалов",
        description:
          "ALASH OIL GAZ SERVICES предлагает инновационные услуги по реабилитации и усилению различных конструкций с использованием композитных материалов. Наш подход позволяет значительно повысить долговечность и надежность объектов нефтегазовой инфраструктуры.",
        image: "/public/about-2.jpg",
      },
      {
        title: "Холодная сварка и Полимерные решения",
        description:
          "ALASH OIL GAZ SERVICES предлагает современные технологии холодной сварки и полимерных решений для ремонта и восстановления оборудования в нефтегазовой отрасли, на производстве и в промышленной инфраструктуре. Наши решения обеспечивают быструю ликвидацию неисправностей без необходимости остановки объектов.",
        image: "/public/about-3.jpg",
      },
      {
        title: "Услуги по Проектированию и Инжинирингу",
        description:
          "ALASH OIL GAZ SERVICES предоставляет комплексные услуги по проектированию и инжинирингу, охватывающие все аспекты нефтегазовой отрасли. Наша команда высококвалифицированных специалистов готова разработать инновационные решения для самых сложных технических задач.",
        image: "/public/about-4.jpg",
      },
      {
        title:
          "Высокоточное изготовление и механическая обработка для промышленности",
        description:
          "Наша компания предлагает передовые услуги по изготовлению и механической обработке оборудования для термической обработки и работы под давлением, полностью соответствующие стандартам ASME и SANS. Мы специализируемся на создании высококачественных компонентов, способных выдерживать экстремальные условия эксплуатации.",
        image: "/public/about-5.jpg",
      },
      {
        title: "Зажимы Quickseal: Инновационное решение для устранения утечек",
        description:
          "Инновационные зажимы для оперативного устранения утечек в трубопроводах без остановки производства.",
        image: "/public/about-6.jpg",
      },
      {
        title: "Зажим Spitze HP: Система аварийного онлайн-ремонта утечек ",
        description:
          "Диапазон рабочих температур: от -46°C до 315°C. Максимальное рабочее давление: до 200 бар; максимальное прикладное давление: 150 бар. Подходит для отверстий диаметром до 25 мм и трубопроводов диаметром до 56 дюймов. Возможность применения под водой.",
        image: "/public/about-7.jpg",
      },
      {
        title: "Решения для обертывания",
        description:
          "Устойчивость к коррозии: Защищает от внешней и химической коррозии. Укрепление конструкции: Увеличивает толщину стенок труб и заменяет дефектные металлические участки. Химическая устойчивость: Защита от воздействия химических веществ, что увеличивает долговечность.",
        image: "/public/about-8.jpg",
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
    this.servicesContainer.classList.remove("active");

    setTimeout(() => {
      this.servicesContainer.innerHTML = `
        <div class="services-content">
          <div>
            <h3>${content.title}</h3>
            <p>${content.description}</p>
          </div>
          <a href="/service.html">
            <button>
              <i class="material-icons arrow">east</i>
              Узнать больше
            </button>
          </a>
        </div>
        <div class="services-img">
          <img src="${content.image}" alt="">
        </div>
      `;

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
