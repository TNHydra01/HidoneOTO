// English text on the page → Japanese. Keys must match the English exactly.
const JA = {
  // ----- Header & footer -----
  'JAPANESE MUSIC': '日本の音楽',
  'BEYOND THE PLAYLIST': 'プレイリストのその先へ',
  'Discover': 'ディスカバー',
  'Artists': 'アーティスト',
  'Instruments': '楽器',
  'Gear': '機材',
  'Search artists, instruments & gear': 'アーティスト・楽器・機材を検索',
  'Try “Vaundy”': '「Vaundy」で検索',
  'JAPANESE MUSIC BEYOND THE PLAYLIST': '日本の音楽、プレイリストのその先へ',
  'EXPLORE': '探索',
  'ABOUT HIDONE OTO': 'HIDONE OTOについて',
  'FIND US': 'SNS・連絡先',
  'Our approach': '私たちの考え方',
  'Credits & sources': 'クレジット・出典',
  'Suggest a correction': '訂正を提案する',
  'Contact': 'お問い合わせ',
  '© 2026 HIDONE OTO / INDEPENDENT MUSIC DISCOVERY': '© 2026 HIDONE OTO / インディペンデント音楽ディスカバリー',
  'Known roles, gear and artists names belong to their respective owners': '役割・機材・アーティスト名は各権利者に帰属します',
  'Back to top ↑': 'トップへ戻る ↑',

  // ----- Home -----
  'THE SOUND & PEOPLE BEHIND IT': '音と、その背後にいる人々',
  'VOL. 1 / THE J-POP EDIT': 'Vol.1 / J-POP特集',
  'Meet the Artists. Hear the Craft.': 'アーティストに出会い、音のこだわりを聴く。',
  'A closer look at Japanese pop: the voices, the players, and instruments that make it so iconic.':
  '日本のポップスをもう一歩深く。声、演奏者、そしてその魅力を形づくる楽器たち。',
  'Discover the artists ↗': 'アーティストを探す ↗',
  'Explore Instruments ↗': '楽器を見る ↗',
  'SOUND STUDY': 'サウンドスタディ',
  'IN FOCUS / KEY, STRINGS & VOICE': '注目 / 鍵盤、弦楽器、歌声',
  'IN FOCUS / PASSIONATE & BLENDED': '注目 / パッションとブレンド',
  'IN FOCUS / POWERFUL & THEATRICAL': '注目 / パワフルとサーキット',
};

// Text with a changing part, like “Start with “Song” ↗”
const PATTERNS = [[/^Start with “(.+)” ↗$/, '「$1」から聴く ↗']];

const originals = new WeakMap();                 // text node → its English text
const clean = (s) => s.replace(/\s+/g, ' ').trim();

function toJapanese(english) {
  const key = clean(english);
  if (JA[key]) return JA[key];
  for (const [re, out] of PATTERNS) {
    if (re.test(key)) return key.replace(re, out);
  }
  return null; // no translation: leave as is
}

function textNodes() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.nodeValue.trim() && !['SCRIPT', 'STYLE'].includes(n.parentElement.tagName)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function setLanguage(lang) {
  document.documentElement.lang = lang;

  textNodes().forEach((node) => {
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    const english = originals.get(node);
    node.nodeValue = lang === 'ja' ? toJapanese(english) || english : english;
  });

  document.querySelectorAll('[placeholder]').forEach((el) => {
    if (!el.dataset.en) el.dataset.en = el.getAttribute('placeholder');
    el.setAttribute('placeholder', lang === 'ja' ? toJapanese(el.dataset.en) || el.dataset.en : el.dataset.en);
  });

  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.classList.toggle('on', b.dataset.lang === lang);
  });

  try { localStorage.setItem('lang', lang); } catch (e) {}
}

document.querySelectorAll('[data-lang]').forEach((b) => {
  b.addEventListener('click', () => setLanguage(b.dataset.lang));
});

let saved = 'en';
try { saved = localStorage.getItem('lang') || 'en'; } catch (e) {}
setLanguage(saved);