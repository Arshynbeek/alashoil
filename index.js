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

        const titles = entry.target.querySelectorAll(".about-content h6");
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

const aboutSection = document.querySelector(".about-content");
if (aboutSection) {
  observer.observe(aboutSection);
}

const titleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll(".word");
        words.forEach((word) => word.classList.add("animate"));
        titleObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5,
    rootMargin: "0px",
  }
);

const aboutTitle = document.querySelector(".about-title");
if (aboutTitle) {
  titleObserver.observe(aboutTitle);
}

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observerr = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".image-container img").forEach((img) => {
  observerr.observe(img);
});

window.addEventListener("scroll", () => {
  const aboutSection = document.querySelector('#about');
  const aboutTitle = document.querySelector('.about-title');
  const imageContainer = document.querySelector('.image-container');
  
  if (aboutSection && aboutTitle && imageContainer) {
    const aboutRect = aboutSection.getBoundingClientRect();
    const scrollProgress = -aboutRect.top / (aboutRect.height - window.innerHeight);
    
    if (scrollProgress >= 0 && scrollProgress <= 1) {
      imageContainer.style.transform = `translateY(${-scrollProgress * 20}vh)`;
      aboutTitle.style.opacity = Math.min(scrollProgress * 2, 1);
    }
  }
});

const quoteObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const quote = entry.target;
      
      const words = quote.textContent.split(' ');
      quote.textContent = '';
      words.forEach((word) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        quote.appendChild(span);
      });
      
      const wordSpans = quote.querySelectorAll('span');
      const delay = 8000 / wordSpans.length;

      wordSpans.forEach((span, index) => {
        setTimeout(() => {
          span.classList.add('read');
        }, delay * index);
      });

      quoteObserver.unobserve(quote);
    }
  });
}, {
  threshold: 0.5
});

const quoteText = document.querySelector('#quote h3');
if (quoteText) {
  quoteObserver.observe(quoteText);
}

const solutionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      const content = entry.target.querySelector('.solution-content');
      if (content) {
        const elements = content.querySelectorAll('h2, p, li');
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
            }, 100);
          }, index * 200);
        });
      }

      solutionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3,
  rootMargin: "0px"
});

const solutionSection = document.querySelector('#solution');
if (solutionSection) {
  solutionObserver.observe(solutionSection);
}


const polymerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      const content = entry.target.querySelector('.polymer-content');
      if (content) {
        const elements = content.querySelectorAll('h2, p, li');
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
            }, 100);
          }, index * 200);
        });
      }

      polymerObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3,
  rootMargin: "0px"
});

const polymerSection = document.querySelector('#polymer');
if (polymerSection) {
  polymerObserver.observe(polymerSection);
}