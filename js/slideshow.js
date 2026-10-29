const slides = [...document.querySelectorAll('.slide')];
const dotsBox = document.querySelector('.slide-dots');
const frame = document.querySelector('.hero-img');

if (slides.length > 1 && dotsBox) {
  const DELAY = 5000; // ms each slide stays on screen
  let current = 0;
  let timer;

  // Build one dot per slide
  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Show slide ${i + 1}`);
    b.addEventListener('click', () => { show(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === current));
    dots.forEach((d, n) => d.classList.toggle('on', n === current));
  }

  function start() { timer = setInterval(() => show(current + 1), DELAY); }
  function stop()  { clearInterval(timer); }
  function restart() { stop(); start(); }

  show(0);

  // Skip autoplay for people who prefer reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    start();
    frame.addEventListener('mouseenter', stop); // pause on hover
    frame.addEventListener('mouseleave', start);
    frame.addEventListener('focusin', stop); // pause when a dot is focused
    frame.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () =>
      document.hidden ? stop() : start() // pause in background tabs
    );
  }
}