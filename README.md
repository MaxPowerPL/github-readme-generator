<div align="center">

  <img src="./public/favicon.png" alt="logo" width="100" height="auto" />
  <h1>🚀 GitHub README Generator</h1>
  
  <p>
    <strong>Stwórz profesjonalny profil GitHub w kilka sekund dzięki własnemu, stabilnemu API.</strong>
  </p>

  <p>
    <a href="https://github-readme-generator-xi.vercel.app/"><strong>🔴 Demo na żywo</strong></a>
    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-funkcje">✨ Funkcje</a>
    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-instalacja">⚙️ Instalacja</a>
  </p>

  <img src="https://img.shields.io/github/package-json/v/MaxPowerPL/github-readme-generator?style=flat-square&color=238636" alt="Wersja" />
  <img src="https://img.shields.io/badge/Maintained-Tak-blue?style=flat-square" alt="Utrzymywany" />
  <img src="https://img.shields.io/github/license/MaxPowerPL/github-readme-generator?style=flat-square" alt="Licencja" />

</div>

<br />

## 📖 O Projekcie

**GitHub README Generator** to potężne narzędzie stworzone, aby pomóc programistom w szybkim generowaniu estetycznych i profesjonalnych profili GitHub.

W przeciwieństwie do wielu innych generatorów, które polegają na niestabilnych zewnętrznych API (często zwracających błędy `503 Service Unavailable`), ten projekt wprowadza **autorskie API Backendowe** hostowane na Vercel. Komunikuje się ono bezpośrednio z GraphQL API GitHuba, pobierając dane w czasie rzeczywistym, co gwarantuje, że Twoje statystyki są zawsze dokładne i dostępne.

![Główny Interfejs](./assets/preview-main.png)

---

## ✨ Funkcje

### ⚡ Niezależne i Stabilne API
- **Koniec z uszkodzonymi obrazkami:** Zasilane przez Vercel Serverless Functions.
- **Integracja GraphQL:** Pobiera szczegółowe dane bezpośrednio z GitHuba.
- **Inteligentne Cache'owanie:** Implementuje `Cache-Control` (1h) dla optymalnej wydajności.

### 📊 Zaawansowane Statystyki
- **Dynamiczne Karty:** Wyświetla Gwiazdki, Commity, PR-y, Issues i Obserwujących.
- **System Rang:** Autorski algorytm oblicza Twoją rangę (od **C** do **S+**) na podstawie aktywności.
- **Daily Streak:** Śledzi Twoją passę kodowania (dni z rzędu) w czasie rzeczywistym.
- **Top Języki:** Wizualizuje najczęściej używane języki z dokładnym podziałem procentowym.

### 🎨 Design System i Motywy
- **Spójny Design:** Wszystkie karty SVG współdzielą tę samą logikę czcionek, odstępów i układu.
- **Wiele Motywów:** Wybierz jeden z popularnych schematów kolorystycznych:
  - `Default (Dark)`
  - `Dracula`
  - `Gruvbox`
  - `Tokyo Night`
  - `Radical`
  - `Merko`
  - `Light`

### 🌍 Wielojęzyczność (i18n)
- **Wsparcie Dwujęzyczne:** Pełne wsparcie dla języka **Polskiego** (🇵🇱) i **Angielskiego** (🇺🇸).
- **Automatyczne Tłumaczenie:** Generowane pliki SVG automatycznie dostosowują etykiety (np. "Repozytoria" vs "Repositories") w zależności od wybranego języka.
- **Pamięć Ustawień:** Zapamiętuje preferencje użytkownika dzięki LocalStorage.

### 🛠️ Doświadczenie Użytkownika (UX)
- **Podgląd na Żywo:** Widzisz zmiany w czasie rzeczywistym podczas pisania.
- **Wybór Umiejętności:** Skategoryzowane ikony dla Frontendu, Backendu, DevOps itp.
- **Efekt Pisania:** Generuje animowany baner SVG z efektem "Typing".
- **Obsługa Błędów:** Estetyczne powiadomienia (Toasty) o walidacji i statusie API.

---

## 📸 Zrzuty Ekranu

| Statystyki i Motywy | Wybór Języka |
|:---:|:---:|
| <img src="./assets/stats-preview.png" width="400"> | <img src="./assets/modal-preview.png" width="400"> |
| *Spójny Design SVG* | *Modal Wyboru Języka* |

---

## 🚀 Instalacja i Konfiguracja

Aby uruchomić ten projekt lokalnie, musisz skonfigurować zmienne środowiskowe dla API.

1.  **Sklonuj repozytorium**
    ```bash
    git clone https://github.com/MaxPowerPL/github-readme-generator.git
    cd github-readme-generator
    ```

2.  **Zainstaluj zależności**
    ```bash
    npm install
    ```

3.  **Skonfiguruj Zmienne Środowiskowe**
    Stwórz plik `.env` w głównym katalogu i dodaj swój Token GitHub (wymagany dla GraphQL API):
    ```env
    GITHUB_TOKEN=twoj_personal_access_token_tutaj
    ```
    *> Uwaga: Token wymaga uprawnień `public_repo` oraz `read:user`.*

4.  **Uruchom Serwer Deweloperski**
    Używając Vercel CLI (zalecane):
    ```bash
    vercel dev
    ```

---

## 🔌 Endpointy API

Możesz używać tych endpointów bezpośrednio w swoich plikach markdown:

| Endpoint | Opis | Parametry |
| :--- | :--- | :--- |
| `/api` | Główna Karta Statystyk | `?username=...&theme=...&lang=...` |
| `/api/streak` | Karta Current Streak | `?username=...&theme=...&lang=...` |
| `/api/top_language` | Karta Top Języki | `?username=...&theme=...&lang=...` |
| `/api/typing` | Animowany Tekst (SVG) | `?lines=Tekst1;Tekst2&color=...` |

---

## 🎨 Wspierane Motywy

<details>
<summary>Kliknij, aby zobaczyć listę</summary>

- **Default (Dark):** Klasyczna ciemna estetyka.
- **Dracula:** Popularny ciemny motyw z fioletowo-różowymi akcentami.
- **Gruvbox:** Retro kolorystyka w stylu groove.
- **Tokyo Night:** Czysty i nowoczesny motyw nocny.
- **Radical:** Cyberpunkowe, neonowe wibracje.
- **Merko:** Ciemny motyw o wysokim kontraście.
- **Light:** Czysty, jasny motyw.

</details>

---

## 🤝 Współpraca (Contributing)

Wkład społeczności open source sprawia, że jest to niesamowite miejsce do nauki, inspiracji i tworzenia. Każdy wkład jest **mile widziany**.

1. Zrób Fork projektu
2. Stwórz Branch dla swojej funkcji (`git checkout -b feature/NiesamowitaFunkcja`)
3. Zatwierdź zmiany (`git commit -m 'Dodano Niesamowitą Funkcję'`)
4. Wyślij zmiany na serwer (`git push origin feature/NiesamowitaFunkcja`)
5. Otwórz Pull Request

---

## 👤 Autor

**MaxPowerPL**

- GitHub: [@MaxPowerPL](https://github.com/MaxPowerPL)
- Strona WWW: [kielczewskidev.ct8.pl](https://kielczewskidev.ct8.pl)

---

<div align="center">
  <p>☕ Stworzone przez MaxPowerPL</p>
</div>
