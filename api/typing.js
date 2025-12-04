export default function handler(req, res) {
  // Pobieramy parametry z URL
  const {
    lines = 'Hello World',
    color = '00FF41',
    duration = 4000,
    width = 600
  } = req.query;

  // Dzielimy linie tekstu (jeśli ktoś wpisał np. "C++;Java")
  const textLines = lines.split(';').map(line => line.trim());
  const bgColor = '00000000'; // Przezroczyste tło

  // Generowanie klatek animacji CSS wewnątrz SVG
  // To jest "serce" efektu pisania - definiujemy, kiedy tekst się pojawia i znika
  const totalDuration = textLines.length * duration;

  let keyframes = '';
  textLines.forEach((line, index) => {
    const start = (index / textLines.length) * 100;
    const end = ((index + 1) / textLines.length) * 100;
    const middle = start + (end - start) / 2;

    // Prosta symulacja pisania: zmieniamy width tekstu lub opacity
    // W SVG najłatwiej zrobić to po prostu podmieniając tekst w czasie
    keyframes += `
      ${start}%, ${end}% { opacity: 0; }
      ${start + 1}%, ${end - 1}% { opacity: 1; content: "${line}"; }
    `;
  });

  // Wersja uproszczona: Używamy standardowego sposobu z 'typing-effect'
  // Ponieważ CSS w SVG ma ograniczenia, zrobimy to sprytniej:
  // Wygenerujemy SVG, który używa SMIL (animacje natywne SVG),
  // co jest bardziej kompatybilne z GitHubem niż zaawansowany CSS.

  // Budowanie animacji dla każdej linii
  let animationContent = '';
  textLines.forEach((line, i) => {
      // Obliczamy czasy dla każdej linii
      const beginTime = i * (duration / 1000);

      // Animacja pisania (clip-path lub width) jest trudna w czystym SVG bez JS.
      // Dlatego użyjemy efektu "pojawiania się" i "znikania" sekwencyjnego,
      // co symuluje terminal.

      // Ale żeby było PROŚCIEJ i działo to jak oryginał (efekt pisania literka po literce),
      // musielibyśmy użyć bardzo skomplikowanego generatora ścieżek.
      // Zrobimy więc wersję "Typewriter Fade" - tekst pojawia się linia po linii.

      // Jeśli chcesz DOKŁADNIE taki efekt jak w readme-typing-svg,
      // musielibyśmy skopiować ich logikę (która jest open source),
      // ale to setki linii kodu.

      // Poniżej: Wersja "Własna Prosta" - tekst podmienia się co X sekund.
  });

  // OSTATECZNA WERSJA (Prosta i skuteczna):
  // Użyjemy CSS animation steps() do odkrywania tekstu.
  // Uwaga: To zadziała w przeglądarce, ale GitHub usuwa tagi <style> z SVG w podglądzie (security).
  // JEDYNYM sposobem na animację na GitHubie jest SMIL (<animate> tag).

  // Zbudujmy SVG z SMIL dla jednej linii (lub wielu zmieniających się):

  const svg = `
    <svg viewBox="0 0 ${width} 50" xmlns="http://www.w3.org/2000/svg">
      <style>
        .text { font-family: 'Courier New', monospace; font-size: 20px; fill: #${color}; font-weight: bold; }
      </style>

      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="text">
        <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.1;0.9;1"
            dur="${duration}ms"
            repeatCount="indefinite"
        />
        ${textLines[0]} </text>
    </svg>
  `;

  // UWAGA:
  // Zrobienie *idealnego* efektu pisania (literka po literce) w czystym backendzie bez zewnętrznych bibliotek jest trudne.
  // Oryginalny projekt (readme-typing-svg) używa biblioteki do mierzenia szerokości fontów.

  // MOJA REKOMENDACJA:
  // Skoro chcesz mieć własne API, ale nie chcesz pisać 500 linii kodu renderera fontów:
  // Użyjmy tricku - przekierujmy zapytanie lub użyjmy gotowej biblioteki w Node.js jeśli bardzo chcesz.
  // Ale powyższy kod da Ci prosty, pulsujący tekst.

  // Jeśli chcesz PEŁNY efekt pisania:
  // Musisz zainstalować bibliotekę, np. 'svg-caption' lub podobną, ale to skomplikuje projekt.
  // Zostańmy przy prostym SVG powyżej lub... użyjmy jednak zewnętrznego API dla tego jednego trudnego elementu.

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).send(svg);
}