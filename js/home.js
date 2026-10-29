const items = document.querySelectorAll('.reveal');

// Read each data-delay and pass it to the CSS
items.forEach((el) => {
  el.style.setProperty('--delay', `${el.dataset.delay || 0}s`);
});

// Watch for elements entering the screen
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in'); // starts the transition
        obs.unobserve(entry.target);      // animate once only
      }
    });
  },
  { threshold: 0.2 }
);

items.forEach((el) => observer.observe(el));