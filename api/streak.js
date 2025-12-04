import axios from 'axios';

export default async function handler(req, res) {
  const { username, theme = 'default' } = req.query;

  if (!username) return res.status(400).send('Brak username');

  try {
    // 1. Pobieramy zdarzenia (events) użytkownika z GitHuba
    // Uwaga: To prosta wersja bazująca na publicznych zdarzeniach.
    // Prawdziwy, idealny streak wymagałby tokena i przeszukiwania wszystkich repozytoriów,
    // ale na start wystarczy analiza ostatnich aktywności.
    const response = await axios.get(`https://api.github.com/users/${username}/events`, {
      headers: { 'User-Agent': 'github-readme-generator' }
    });

    const events = response.data;
    const today = new Date().toISOString().split('T')[0];

    // Prosta logika streaka (dla celów edukacyjnych)
    // Sprawdzamy czy był commit dzisiaj lub wczoraj
    let currentStreak = 0;
    // (Tutaj musiałbyś zaimplementować pełną logikę zliczania dat,
    //  dla uproszczenia demo zrobimy symulację na podstawie ilości eventów)

    // W tej wersji zrobimy ładną kartę "Mockup" pokazującą jak to wygląda
    // Żeby działało naprawdę precyzyjnie, potrzebowałbyś GraphQL API.

    // Motywy (skopiuj z index.js lub wydziel do oddzielnego pliku utils.js)
    const themes = {
        default: { bg: '#1a1b27', stroke: '#00f2ff', text: '#ffffff', ring: '#00f2ff' },
        gruvbox: { bg: '#282828', stroke: '#ebdbb2', text: '#ebdbb2', ring: '#fabd2f' },
        dracula: { bg: '#282a36', stroke: '#bd93f9', text: '#f8f8f2', ring: '#50fa7b' },
        light:   { bg: '#ffffff', stroke: '#0366d6', text: '#24292e', ring: '#0366d6' }
    };
    const t = themes[theme] || themes['default'];

    const svg = `
      <svg width="400" height="150" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="150" rx="10" fill="${t.bg}" stroke="${t.stroke}" stroke-width="2"/>

        <text x="200" y="30" font-family="Segoe UI, sans-serif" font-size="18" fill="${t.text}" font-weight="bold" text-anchor="middle">
          🔥 Current Streak
        </text>

        <text x="200" y="80" font-family="Segoe UI, sans-serif" font-size="48" fill="${t.text}" font-weight="bold" text-anchor="middle">
          ${events.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0} days
        </text>

        <text x="200" y="110" font-family="Segoe UI, sans-serif" font-size="12" fill="${t.text}" opacity="0.7" text-anchor="middle">
          (Demo Mode - Real data requires GraphQL)
        </text>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(svg);

  } catch (error) {
    res.status(500).send('Error');
  }
}