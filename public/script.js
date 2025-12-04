/* public/script.js */

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

    updatePreview(); // Odświeżamy podgląd
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
    html += `<img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=gradient&customColorList=6,11,20,29&text=${encodeURIComponent(name)}&fontSize=48&fontColor=fff&animation=twinkling&fontAlignY=35&desc=${encodeURIComponent(subtitle)}&descSize=18&descAlignY=55&textBg=false" style="width: 100%">`;

    // 2. Typing SVG
    html += `<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&duration=4000&color=00FF41&center=true&vCenter=true&width=600&lines=${encodeURIComponent(typingText)}" style="display:block; margin: 20px auto;">`;

    // 3. Stats Section
    if (showTrophies) {
        html += `<img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}&no-frame=true&margin-w=4" style="display:block; margin: 10px auto;">`;
    }

    if (showStats) {
        const myApiUrl = `${window.location.origin}/api?username=${username}&theme=${theme}`;
        html += `<img src="${myApiUrl}" style="display:block; margin: 10px auto; width: 80%;">`;

        if (showStreak) {
            html += `<img src="https://streak-stats.demolab.com/?user=${username}&theme=${theme}&hide_border=true" style="display:block; margin: 10px auto; width: 80%;">`;
        }
    }

    // 4. Skills Section (Grupowanie)
    // Pobieramy zaznaczone checkboxy
    const checkboxes = document.querySelectorAll('.skills-grid input:checked');
    if (checkboxes.length > 0) {
        html += `<h3 style="text-align:center; margin-top:20px;">🛠️ Skills</h3><div style="text-align:center;">`;
        checkboxes.forEach(cb => {
            html += `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${cb.value}/${cb.value}-original.svg" width="40" height="40" style="margin:5px;">`;
        });
        html += `</div>`;
    }

    // 5. Socials
    const linkedin = document.getElementById('linkedin').value;
    const youtube = document.getElementById('youtube').value;
    const website = document.getElementById('website').value;

    if(linkedin || youtube || website) {
        html += `<h3 style="text-align:center; margin-top:20px;">🔗 Connect with Me</h3><div style="text-align:center;">`;
        if(linkedin) html += `<a href="${linkedin}"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" style="margin:5px;"></a>`;
        if(youtube) html += `<a href="${youtube}"><img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" style="margin:5px;"></a>`;
        if(website) html += `<a href="${website}"><img src="https://img.shields.io/badge/Website-333333?style=for-the-badge&logo=About.me&logoColor=white" style="margin:5px;"></a>`;
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

    // Wywołujemy aktualizację, żeby mieć pewność, że HTML jest świeży
    updatePreview();

    const previewDiv = document.getElementById('readme-preview');
    const images = previewDiv.querySelectorAll('img');
    const links = previewDiv.querySelectorAll('a'); // Pobieramy linki do socials

    let markdown = ``;

    // Konwersja obrazków na Markdown
    images.forEach(img => {
        // Pomijamy obrazki wewnątrz linków (one są obsłużone niżej)
        if(img.parentElement.tagName === 'A') return;

        markdown += `<p align="center"><img src="${img.src}" alt="img" width="${img.style.width || ''}" /></p>\n\n`;
    });

    // Konwersja Socials (Linki z obrazkami)
    if(links.length > 0) {
        markdown += `\n<p align="center">`;
        links.forEach(link => {
            const img = link.querySelector('img');
            markdown += ` <a href="${link.href}" target="_blank"><img src="${img.src}" alt="social" /></a> `;
        });
        markdown += `</p>\n`;
    }

    document.querySelector('.code-output').style.display = 'block';
    document.getElementById('finalCode').value = markdown;

    showNotification("Kod wygenerowany pomyślnie!", "success");

    // Scroll do wyniku
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
window.onload = updatePreview;