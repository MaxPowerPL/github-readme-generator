import axios from 'axios';

export default async function handler(req, res) {
  const { username, theme = 'default' } = req.query;

  if (!username) return res.status(400).send('Brak username');

  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return res.status(500).send('Brak tokena GitHub');

    // 1. Pobieramy repozytoria użytkownika (maksymalnie 100 ostatnich, niesforkowanych)
    // Używamy GraphQL, bo jest o wiele szybsze i pozwala pobrać języki w jednym zapytaniu
    const query = `
      query($user: String!) {
        user(login: $user) {
          repositories(first: 60, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              name
              languages(first: 10) {
                edges {
                  size
                  node {
                    color
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query, variables: { user: username } },
      { headers: { Authorization: `bearer ${token}` } }
    );

    if (response.data.errors) throw new Error('GitHub API Error');

    const repos = response.data.data.user.repositories.nodes;

    // 2. Sumowanie bajtów dla języków
    const stats = {};
    let totalBytes = 0;

    repos.forEach(repo => {
      repo.languages.edges.forEach(lang => {
        const { name, color } = lang.node;
        const size = lang.size;

        if (!stats[name]) {
          stats[name] = { color, size: 0 };
        }
        stats[name].size += size;
        totalBytes += size;
      });
    });

    // 3. Przetwarzanie i sortowanie
    // Zamieniamy obiekt na tablicę, sortujemy malejąco i bierzemy TOP 5
    let languages = Object.entries(stats)
      .map(([name, data]) => ({
        name,
        color: data.color || '#ccc',
        size: data.size,
        percent: ((data.size / totalBytes) * 100).toFixed(1)
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 6); // Top 6 języków

    // 4. Motywy kolorystyczne (spójne z resztą)
    const themes = {
        default: { bg: '#1a1b27', text: '#ffffff', title: '#00f2ff' },
        gruvbox: { bg: '#282828', text: '#ebdbb2', title: '#fabd2f' },
        dracula: { bg: '#282a36', text: '#f8f8f2', title: '#bd93f9' },
        light:   { bg: '#ffffff', text: '#24292e', title: '#0366d6' }
    };
    const t = themes[theme] || themes['default'];

    // 5. Generowanie SVG
    // Obliczamy szerokość paska dla każdego języka
    let progressX = 0;
    const progressBarWidth = 350; // Szerokość całkowita paska w SVG

    const svg = `
      <svg width="400" height="180" viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
        <style>
          .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.title}; }
          .lang-name { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.text}; }
          .lang-percent { font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${t.text}; opacity: 0.6; }
        </style>

        <rect width="400" height="180" rx="10" fill="${t.bg}" stroke="${t.title}" stroke-width="2"/>

        <text x="25" y="35" class="header">Most Used Languages</text>

        <g transform="translate(25, 55)">
          <mask id="bar-mask">
            <rect x="0" y="0" width="${progressBarWidth}" height="10" rx="5" fill="white" />
          </mask>
          ${languages.map(lang => {
             const width = (lang.size / totalBytes) * progressBarWidth;
             const rect = `<rect x="${progressX}" y="0" width="${width}" height="10" fill="${lang.color}" mask="url(#bar-mask)"/>`;
             progressX += width;
             return rect;
          }).join('')}
        </g>

        <g transform="translate(25, 85)">
          ${languages.map((lang, index) => {
            // Układ w 2 kolumnach (0-2 w lewej, 3-5 w prawej)
            const col = index < 3 ? 0 : 170;
            const row = (index % 3) * 25;
            return `
              <g transform="translate(${col}, ${row})">
                <circle cx="5" cy="5" r="5" fill="${lang.color}" />
                <text x="15" y="9" class="lang-name">${lang.name}</text>
                <text x="120" y="9" class="lang-percent" text-anchor="end">${lang.percent}%</text>
              </g>
            `;
          }).join('')}
        </g>
      </svg>
    `;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache na 1h
    res.status(200).send(svg);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating top languages');
  }
}