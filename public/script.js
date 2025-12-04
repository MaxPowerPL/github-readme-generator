// Funkcja zbiorcza - aktualizuje podgląd i liczniki
function updateUI() {
    updatePreview();
    updateCounters();
}

// Funkcja aktualizująca liczniki w nagłówkach kategorii
function updateCounters() {
    const categories = document.querySelectorAll('.skills-category');

    categories.forEach(category => {
        const checkboxes = category.querySelectorAll('input[type="checkbox"]');
        const checkedCount = category.querySelectorAll('input[type="checkbox"]:checked').length;
        const totalCount = checkboxes.length;

        // Znajdź badge licznika w tej kategorii
        const counterBadge = category.querySelector('.counter-badge');
        if (counterBadge) {
            counterBadge.textContent = `${checkedCount}/${totalCount}`;

            // Opcjonalnie: zmień kolor jak coś jest zaznaczone
            if (checkedCount > 0) {
                counterBadge.style.color = '#58a6ff';
                counterBadge.style.borderColor = '#58a6ff';
            } else {
                counterBadge.style.color = '#8b949e';
                counterBadge.style.borderColor = '#30363d';
            }
        }

        // Aktualizacja tekstu przycisku (Zaznacz / Odznacz)
        const btn = category.querySelector('.select-all-btn');
        if (btn) {
            if (checkedCount === totalCount) {
                btn.textContent = "Odznacz wszystkie";
            } else {
                btn.textContent = "Zaznacz wszystkie";
            }
        }
    });
}

// Zmodyfikowana funkcja toggleCategory
function toggleCategory(btn) {
    // Przycisk jest teraz w .skills-category-header, więc musimy wyjść wyżej do .skills-category
    const categoryDiv = btn.closest('.skills-category');
    const checkboxes = categoryDiv.querySelectorAll('.skills-grid input[type="checkbox"]');

    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });

    updateUI(); // Odświeżamy wszystko
}

// Funkcja obsługująca powiadomienia (Toasty)
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    let icon = '';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⛔';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        toast.addEventListener('animationend', () => toast.remove());
    }, 4000);

    toast.onclick = () => toast.remove();
}

// Funkcja do zaznaczania/odznaczania całej kategorii
function toggleCategory(btn) {
    const categoryDiv = btn.parentElement.nextElementSibling; // div.skills-grid
    const checkboxes = categoryDiv.querySelectorAll('input[type="checkbox"]');

    // Sprawdzamy czy wszystkie są zaznaczone, żeby wiedzieć czy zaznaczać czy odznaczać
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });

    updateUI(); // Odświeżamy podgląd
}

// Funkcja aktualizująca podgląd na żywo
function updatePreview() {
    const name = document.getElementById('headerName').value || 'Twoje Imię';
    const subtitle = document.getElementById('subtitle').value || 'Deweloper';
    const username = document.getElementById('username').value || 'TwojNick';
    const typingText = document.getElementById('typingText').value || 'Witaj świecie';
    const theme = document.getElementById('themeSelect').value;

    const showStats = document.getElementById('showStats').checked;
    const showTrophies = document.getElementById('showTrophies').checked;
    const showStreak = document.getElementById('showStreak').checked;

    const previewDiv = document.getElementById('readme-preview');

    let html = '';

    // 1. Header
    html += `<img id="header" src="https://capsule-render.vercel.app/api?type=waving&height=200&color=gradient&customColorList=6,11,20,29&text=${encodeURIComponent(name)}&fontSize=48&fontColor=fff&animation=twinkling&fontAlignY=35&desc=${encodeURIComponent(subtitle)}&descSize=18&descAlignY=55&textBg=false" />`;

    // 2. Typing SVG
    html += `<div id="typing-section">
                <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=4000&color=00FF41&center=true&vCenter=true&width=600&lines=${encodeURIComponent(typingText)}">
            </div>`;

    // 3. Stats Section
    html += `<div id="stats-section">`;
    if (showTrophies) {
        html += `<img id="trophy"src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}&no-frame=true&margin-w=4"> <br>`;
    }

    if (showStats) {
        const myApiUrl = `${window.location.origin}/api?username=${username}&theme=${theme}`;
        // Używamy flexboxa dla statystyk, żeby były obok siebie jeśli jest miejsce
        html += `<div id="stats">`;
        html += `<img src="${myApiUrl}">`;

        if (showStreak) {
            html += `<img src="https://streak-stats.demolab.com/?user=${username}&theme=${theme}&hide_border=true">`;
        }
        html += `</div>`;
    }
    html += `</div>`;

    // 4. Skills Section (Z Podziałem na kategorie)
    const categories = document.querySelectorAll('.skills-category');
    let hasSkills = false;

    html += `<div id="skills">`;
    categories.forEach(category => {
        // Pobieramy nazwę kategorii z nagłówka h4 (usuwamy tekst przycisku)
        const titleRaw = category.querySelector('h4').childNodes[0].textContent.trim();
        const checkedBoxes = category.querySelectorAll('input:checked');

        if (checkedBoxes.length > 0) {
            hasSkills = true;
            // Dodajemy nagłówek kategorii
                html += `<blockquote><h3>${titleRaw}</h3></blockquote>`;

                // Kontener na ikony (Grid/Flex)
                html += `<div id="icons-content">`;

                checkedBoxes.forEach(cb => {
                    // Budujemy URL ikony
                    const iconName = cb.value;
                    let variant = "original";
                    if(iconName == "django") {
                        variant = "plain";
                    }

                    const imgSrc = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-${variant}.svg`;

                    html += `<img src="${imgSrc}" alt="${iconName}">`;
                });
                html += `</div>`;
            }
    });
    html += `</div>`;

    // 5. Socials
    const linkedin = document.getElementById('linkedin').value;
    const youtube = document.getElementById('youtube').value;
    const website = document.getElementById('website').value;

    if(linkedin || youtube || website) {
        html += `<div id="contact-section">`
            html += `<h3 id="headers-urls">🔗 Połącz się ze mną</h3>`;
                html += `<div id="content-urls">`;
                if(linkedin) html += `<a href="${linkedin}" target="_blank" style="margin: 0 5px;"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a>`;
                if(youtube) html += `<a href="${youtube}" target="_blank" style="margin: 0 5px;"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white"></a>`;
                if(website) html += `<a href="${website}" target="_blank" style="margin: 0 5px;"><img src="https://img.shields.io/badge/Website-333333?style=for-the-badge&logo=About.me&logoColor=white"></a>`;
                html += `</div>`;
        html += `</div>`;
    }

    previewDiv.innerHTML = html;
}

function generujKod() {
    const username = document.getElementById('username').value;
    if(!username) {
        showNotification("Wpisz najpierw swój nick GitHub!", "error");
        return;
    }

    // Aktualizujemy zmienne z formularza
    const name = document.getElementById('headerName').value || 'Imie';
    const subtitle = document.getElementById('subtitle').value || 'Dev';
    const typingText = document.getElementById('typingText').value;
    const theme = document.getElementById('themeSelect').value;
    const showStats = document.getElementById('showStats').checked;
    const showTrophies = document.getElementById('showTrophies').checked;
    const showStreak = document.getElementById('showStreak').checked;

    let markdown = ``;

    // 1. Header
    markdown += `<div align="center">\n`;
    markdown += `  <img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=gradient&text=${encodeURIComponent(name)}&desc=${encodeURIComponent(subtitle)}&fontColor=fff" width="100%" />\n`;
    markdown += `</div>\n\n`;

    // 2. Typing
    if(typingText) {
        markdown += `<div align="center">\n`;
        markdown += `  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=4000&color=00FF41&center=true&vCenter=true&width=600&lines=${encodeURIComponent(typingText)}" />\n`;
        markdown += `</div>\n\n`;
    }

    // 3. Stats
    markdown += `### 📊 GitHub Stats\n\n`;
    markdown += `<div align="center">\n`;

    if (showTrophies) {
        markdown += `  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}&no-frame=true&margin-w=4" /> <br/>\n`;
    }

    if (showStats) {
        // Ważne: Flexbox w Markdown nie działa, używamy <p> lub tabeli, albo po prostu obrazków obok siebie
        // GitHub domyślnie układa obrazki obok siebie jeśli nie ma nowej linii
        markdown += `  <p>\n`;
        markdown += `    <img src="${window.location.origin}/api?username=${username}&theme=${theme}" height="180" />\n`;
        if (showStreak) {
            markdown += `    <img src="https://streak-stats.demolab.com/?user=${username}&theme=${theme}&hide_border=true" height="180" />\n`;
        }
        markdown += `  </p>\n`;
    }
    markdown += `</div>\n\n`;

    // 4. Skills (Iteracja po kategoriach)
    const categories = document.querySelectorAll('.skills-category');
    let hasAnySkill = false;

    categories.forEach(category => {
        const titleRaw = category.querySelector('h4').childNodes[0].textContent.trim();
        const checkedBoxes = category.querySelectorAll('input:checked');

        if (checkedBoxes.length > 0) {
            hasAnySkill = true;
            markdown += `> ### ${titleRaw}\n`;
            // Używamy paragrafu align="left" aby ikony były obok siebie
            markdown += `<p align="left">\n`;

            checkedBoxes.forEach(cb => {
                const iconName = cb.value;
                const iconClass = cb.nextElementSibling.className;
                let variant = 'original';
                if (iconClass.includes('plain')) variant = 'plain';

                const imgSrc = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconName}/${iconName}-${variant}.svg`;

                // Dodajemy sztywne height="40" i odstęp
                markdown += `  <img src="${imgSrc}" alt="${iconName}" height="40" style="margin: 0 10px 10px 0;" />\n`;
            });

            markdown += `</p>\n\n`;
        }
    });

    // 5. Socials
    const linkedin = document.getElementById('linkedin').value;
    const youtube = document.getElementById('youtube').value;
    const website = document.getElementById('website').value;

    if(linkedin || youtube || website) {
        markdown += `### 🔗 Connect with Me\n`;
        markdown += `<p align="center">\n`;
        if(linkedin) markdown += `  <a href="${linkedin}" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>\n`;
        if(youtube) markdown += `  <a href="${youtube}" target="_blank"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" /></a>\n`;
        if(website) markdown += `  <a href="${website}" target="_blank"><img src="https://img.shields.io/badge/Website-333333?style=for-the-badge&logo=About.me&logoColor=white" /></a>\n`;
        markdown += `</p>\n`;
    }

    // Wyświetlenie kodu
    document.querySelector('.code-output').style.display = 'block';
    document.getElementById('finalCode').value = markdown;

    showNotification("Kod wygenerowany pomyślnie!", "success");
    document.querySelector('.code-output').scrollIntoView({ behavior: 'smooth' });
}

function kopiuj() {
    const copyText = document.getElementById("finalCode");

    if (!copyText.value) {
        showNotification("Najpierw wygeneruj kod!", "warning");
        return;
    }

    copyText.select();
    navigator.clipboard.writeText(copyText.value)
        .then(() => {
            showNotification("Skopiowano do schowka!", "success");
        })
        .catch(() => {
            showNotification("Błąd kopiowania.", "error");
        });
}

// Inicjalizacja podglądu przy starcie
window.onload = updateUI;