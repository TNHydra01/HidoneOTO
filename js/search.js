// Things people can search for. Add or remove entries freely.
const SEARCH_DATA = [
  // { name: '___', type: '___', url: '___.html' },
];

const header = document.querySelector('.site-header');
const btn = document.querySelector('.search-btn');

if (header && btn) {
  // Build the panel
  const panel = document.createElement('div');
  panel.className = 'search-panel';
  panel.innerHTML = `
    <label for="site-search">Search artists, instruments &amp; gear</label>
    <input id="site-search" type="search" placeholder="Try “Vaundy”" autocomplete="off">
    <ul class="search-results" aria-live="polite"></ul>`;
  header.appendChild(panel);

  const input = panel.querySelector('input');
  const results = panel.querySelector('.search-results');

  function render(query) {
    const q = query.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) return;

    const hits = SEARCH_DATA.filter((d) => d.name.toLowerCase().includes(q));
    if (!hits.length) {
      results.innerHTML = '<li class="search-empty">No results found.</li>';
      return;
    }
    hits.forEach((d) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = d.url;
      a.innerHTML = `<span></span><small>${d.type}</small>`;
      a.firstChild.textContent = d.name; // textContent keeps it safe
      li.appendChild(a);
      results.appendChild(li);
    });
  }

  function setOpen(open) {
    panel.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    if (open) input.focus();
    else { input.value = ''; render(''); }
  }

  btn.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  input.addEventListener('input', () => render(input.value));

  // Enter opens the first result
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') results.querySelector('a')?.click();
  });

  // Esc closes; clicking outside the header closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) setOpen(false);
  });
}