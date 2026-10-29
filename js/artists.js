(() => {
  const PER_PAGE = 8;                      // 4 columns x 2 rows

  const cards   = [...document.querySelectorAll('.card')];
  const buttons = [...document.querySelectorAll('.filters button')];
  const prevBtn = document.querySelector('.page-btn.prev');
  const nextBtn = document.querySelector('.page-btn.next');
  const counter = document.querySelector('.page-count');

  let filter = 'all';
  let page = 0;

  // Split on commas and spaces, so "solo, duo" becomes ["solo", "duo"]
  const split = (s) => s.split(/[\s,]+/).filter(Boolean);

  // A card matches if any label on the button is also a label on the card
  const matches = (card) => {
    if (filter === 'all') return true;
    const have = split(card.dataset.type);
    return split(filter).some((f) => have.includes(f));
  };

  function renderCards(animate) {
    const list  = cards.filter(matches);
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    page = Math.min(page, pages - 1);

    const visible = list.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

    // Show only this page's cards
    cards.forEach((c) => { c.hidden = !visible.includes(c); });

    // Replay the rise animation for the cards now on screen
    if (animate) {
      visible.forEach((c, i) => {
        c.style.setProperty('--delay', `${i * 0.06}s`);
        c.classList.remove('in');
      });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        visible.forEach((c) => c.classList.add('in'));
      }));
    }

    if (prevBtn) prevBtn.disabled = page === 0;
    if (nextBtn) nextBtn.disabled = page >= pages - 1;
    if (counter) counter.textContent = pages > 1 ? `${page + 1} / ${pages}` : '';
  }

  buttons.forEach((b) => b.addEventListener('click', () => {
    filter = b.dataset.f;
    page = 0;
    buttons.forEach((x) => x.classList.toggle('on', x === b));
    renderCards(true);
  }));

  prevBtn?.addEventListener('click', () => { page -= 1; renderCards(true); });
  nextBtn?.addEventListener('click', () => { page += 1; renderCards(true); });

  renderCards(false); // first load: reveal.js handles the entrance animation
})();   