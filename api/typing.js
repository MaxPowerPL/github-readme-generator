export default function handler(req, res) {
  // 1. Pobieramy parametry
  const {
    lines = 'Hello World',
    color = '00FF41',
    duration = 4000, // Czas wyświetlania jednej linii (w ms)
    width = 600
  } = req.query;

  // 2. Parsujemy linie tekstu
  const decodedLines = decodeURIComponent(lines);
  const textLines = decodedLines.split(';').map(line => line.trim()).filter(line => line.length > 0);

  if (textLines.length === 0) textLines.push("Hello World");

  // 3. Obliczenia dla animacji
  const lineDuration = parseInt(duration);
  const totalDuration = textLines.length * lineDuration;

  // Obliczamy procenty klatek kluczowych (keyframes)
  // Każda linia ma swój "czas antenowy" równy 100% / liczba_linii
  const stepPercent = 100 / textLines.length;
  // Krótki czas na wejście/wyjście (fade), np. 5% całego cyklu, żeby było płynnie
  const fadePercent = Math.min(5, stepPercent / 4);

  // Generujemy elementy <text>
  const textElements = textLines.map((line, index) => {
    // Opóźnienie dla każdej kolejnej linii
    const delay = index * lineDuration;

    // x="50%" y="50%" -> ustawia punkt zaczepienia na środku
    // text-anchor="middle" -> centruje tekst w poziomie względem punktu zaczepienia
    // dominant-baseline="middle" -> centruje tekst w pionie
    return `
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        class="text"
        style="animation-delay: ${delay}ms"
      >
        ${line}
      </text>
    `;
  }).join('');

  // 4. Składamy SVG z dynamicznym CSS
  const svg = `
    <svg viewBox="0 0 ${width} 50" xmlns="http://www.w3.org/2000/svg">
      <style>
        .text {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          fill: #${color};
          font-weight: bold;
          white-space: pre;
          opacity: 0; /* Domyślnie ukryte */
          animation: fade ${totalDuration}ms linear infinite; /* Nieskończona pętla */
        }

        /* Definicja animacji widoczności */
        @keyframes fade {
          0% { opacity: 0; }
          ${fadePercent}% { opacity: 1; }  /* Pojawia się */
          ${stepPercent - fadePercent}% { opacity: 1; } /* Zostaje widoczne */
          ${stepPercent}% { opacity: 0; }  /* Znika przed wejściem następnego */
          100% { opacity: 0; }
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