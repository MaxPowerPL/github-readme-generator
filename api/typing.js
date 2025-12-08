export default function handler(req, res) {
  // 1. Pobieramy parametry
  const {
    lines = 'Hello World',
    color = '00FF41',
    duration = 4000, // Czas wyświetlania jednej linii (w ms)
    width = 600
  } = req.query;

  // 2. Parsujemy linie tekstu
  // Dekodujemy URI component, żeby obsłużyć polskie znaki i spacje
  const decodedLines = decodeURIComponent(lines);
  const textLines = decodedLines.split(';').map(line => line.trim()).filter(line => line.length > 0);

  if (textLines.length === 0) textLines.push("Hello World");

  // 3. Konfiguracja animacji
  const lineDuration = parseInt(duration); // Czas trwania jednej linii
  const totalDuration = textLines.length * lineDuration; // Cała pętla

  // Generujemy elementy <text> dla każdej linii
  // Każda linia będzie miała animację opacity, która włącza ją w odpowiednim momencie
  const textElements = textLines.map((line, index) => {
    const delay = index * lineDuration;

    // Obliczamy procentowe wartości czasu dla keyTimes
    // Animacja: 0% -> pojawia się, 10% -> widoczny, 90% -> widoczny, 100% -> znika
    // Ale w kontekście całej pętli (totalDuration)

    // Używamy prostszego podejścia: Każdy tekst jest domyślnie ukryty (opacity="0")
    // I ma animację, która go pokazuje na chwilę.

    return `
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="text" opacity="0">
        ${line}
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.05;0.95;1"
          dur="${lineDuration}ms"
          begin="${delay}ms;${delay + totalDuration}ms;${delay + (totalDuration*2)}ms;${delay + (totalDuration*3)}ms"
        />
      </text>
    `;
    // Uwaga: 'begin' z wieloma wartościami to prosty sposób na zapętlenie bez skomplikowanej matematyki keyTimes dla całego cyklu.
    // Dodałem powtórzenia na zapas (dla długiego oglądania).
    // Lepszym rozwiązaniem jest animation sequence w CSS, ale SMIL jest pewniejszy na GitHubie.
  }).join('');

  // 4. Składamy SVG
  const svg = `
    <svg viewBox="0 0 ${width} 50" xmlns="http://www.w3.org/2000/svg">
      <style>
        .text {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          fill: #${color};
          font-weight: bold;
          white-space: pre;
        }
      </style>

      ${textElements}

    </svg>
  `;

  // 5. Wysyłamy odpowiedź
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).send(svg);
}