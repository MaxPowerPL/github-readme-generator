const translations = {
    pl: {
        // --- MODAL ---
        modalTitle: "🌍 Select Language / Wybierz Język",
        langEn: "English",
        langEnDesc: "Continue in English",
        langPl: "Polski",
        langPlDesc: "Kontynuuj po polsku",
        // --- STRONA ---
        webTitle: "Generator README GitHub",
        mainTitle: "🚀 Generator README",
        createdBy: "Stworzony przez MaxPowerPL",
        basicInfo: "👤 Podstawowe Informacje",
        labelName: "Nagłówek (Imię):",
        placeholderName: "Dominik",
        labelNick: "Nazwa użytkownika Github:",
        placeholderNick: "MaxPowerPL",
        labelDesc: "Opis (Podtytuł):",
        placeholderDesc: "Frontend Developer",
        labelTyping: "Tekst baneru (efekt pisania):",
        placeholderTyping: "Koduje w C++; Lubię kawę;",
        statsTheme: "📊 Statystyki i Motyw",
        labelTheme: "Wybierz motyw karty statystyk:",
        checkStats: "Pokaż Statystyki",
        checkTrophies: "Pokaż Trofea",
        checkStreak: "Pokaż Streak",
        checkTopLang: "Pokaż Top Języki",
        skillsTools: "🛠️ Umiejętności i Narzędzia",
        skillsDesc: "Zaznacz technologie, które znasz:",
        catLangs: "Języki Programowania",
        catBackend: "Backend i Bazy Danych",
        catMobile: "Mobilne i Game Dev",
        catTools: "Narzędzia i DevOps",
        btnSelectAll: "Zaznacz wszystkie",
        btnDeselectAll: "Odznacz wszystkie",
        connectTitle: "🔗 Połącz się ze mną",
        connectSubtitleWeb: "Strona WWW / Portfolio:",
        placeholderWeb: "https://twojastrona.pl",
        btnGenerate: "Generuj Kod Markdown",
        previewTitle: "👁️ Podgląd na żywo",
        previewPlaceholder: "Wypełnij formularz, aby zobaczyć podgląd...",
        codeTitle: "📜 Kod Markdown (Gotowy do skopiowania)",
        btnCopy: "Kopiuj do schowka",
        // --- KOMUNIKATY ---
        msgEnterNick: "Wpisz najpierw swój nick GitHub!",
        msgEnterNickStats: "Wpisz najpierw swój nick GitHub, aby zobaczyć statystyki!",
        msgGenerated: "Kod wygenerowany pomyślnie!",
        msgGeneratedWarning: "Najpierw wygeneruj kod!",
        msgCopied: "Skopiowano do schowka!",
        msgError: "Błąd kopiowania.",
        apiError: " (Przerwa techniczna API)",
        btnRetryTitle: "Spróbuj ponownie",
        headerName: "Twoje Imię",
        headerSubtitle: "Deweloper",
        typingText: "Witaj świecie",
    },
    en: {
        // --- MODAL ---
        modalTitle: "🌍 Select Language / Wybierz Język",
        langEn: "English",
        langEnDesc: "Continue in English",
        langPl: "Polski",
        langPlDesc: "Kontynuuj po polsku",
        // --- STRONA ---
        webTitle: "GitHub README Generator",
        mainTitle: "🚀 README Generator",
        createdBy: "Created by MaxPowerPL",
        basicInfo: "👤 Basic Information",
        labelName: "Header (Name):",
        placeholderName: "John Doe",
        labelNick: "GitHub Username:",
        placeholderNick: "MaxPowerPL",
        labelDesc: "Description (Subtitle):",
        placeholderDesc: "Frontend Developer",
        labelTyping: "Banner Text (Typing effect):",
        placeholderTyping: "Coding in C++; Coffee lover;",
        statsTheme: "📊 Stats & Theme",
        labelTheme: "Select Stats Card Theme:",
        checkStats: "Show Stats",
        checkTrophies: "Show Trophies",
        checkStreak: "Show Streak",
        checkTopLang: "Show Top Languages",
        skillsTools: "🛠️ Skills & Tools",
        skillsDesc: "Select technologies you know:",
        catLangs: "Programming Languages",
        catBackend: "Backend & Databases",
        catMobile: "Mobile & Game Dev",
        catTools: "Tools & DevOps",
        btnSelectAll: "Select All",
        btnDeselectAll: "Deselect All",
        connectTitle: "🔗 Connect with Me",
        connectSubtitleWeb: "Website / Portfolio:",
        placeholderWeb: "https://yourpage.com",
        btnGenerate: "Generate Markdown Code",
        previewTitle: "👁️ Live Preview",
        previewPlaceholder: "Fill the form to see the preview...",
        codeTitle: "📜 Markdown Code (Ready to copy)",
        btnCopy: "Copy to Clipboard",
        // --- KOMUNIKATY ---
        msgEnterNick: "Enter your GitHub username first!",
        msgEnterNickStats: "Enter your GitHub username first to see stats!",
        msgGenerated: "Code generated successfully!",
        msgGeneratedWarning: "Generate the code first!",
        msgCopied: "Copied to clipboard!",
        msgError: "Copy error.",
        apiError: " (API Maintenance)",
        btnRetryTitle: "Try again",
        headerName: "Your Name",
        headerSubtitle: "Developer",
        typingText: "Hello World",
    }
};

let currentLang = 'pl'; // Domyślny język

// Funkcja sprawdzająca język przy wejściu (wywoływana w script.js)
function initLanguage() {
    const savedLang = localStorage.getItem('selectedLang');
    const modal = document.getElementById('language-modal');

    if (savedLang) {
        setLanguage(savedLang, false);
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll'); // Upewniamy się, że scroll działa
        }
    } else {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('no-scroll'); // BLOKUJEMY SCROLL
        }
    }
}

// Funkcja ustawiająca język
function setLanguage(lang, saveToStorage = true) {
    currentLang = lang;
    if (saveToStorage) {
        localStorage.setItem('selectedLang', lang);
        const modal = document.getElementById('language-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll'); // ODBLOKOWUJEMY SCROLL
        }
    }

    const t = translations[lang];

    // Tłumaczenie treści elementów (data-i18n)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerText = t[key];
        }
    });

    // Tłumaczenie placeholderów (data-i18n-placeholder)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });

    // Wymuszamy odświeżenie UI (np. przyciski zaznaczania),
    // jeśli funkcja updateUI jest dostępna (zdefiniowana w script.js)
    if (typeof updateUI === 'function') {
        updateUI();
    }
}

// Pomocnik do pobierania tekstu w JS
function getTrans(key) {
    return translations[currentLang][key] || key;
}