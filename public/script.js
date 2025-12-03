/**
 * Funkcja wyświetlająca powiadomienie w prawym dolnym rogu
 * @param {string} message - Treść wiadomości
 * @param {string} type - Typ: 'error', 'warning', 'success', 'info'
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');

    // Tworzymy element powiadomienia
    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    // Dodajemy ikonkę w zależności od typu (opcjonalne, ale ładne)
    let icon = '';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⛔';
    if (type === 'warning') icon = '⚠️';
    if (type === 'info') icon = 'ℹ️';

    toast.innerText = `${icon} ${message}`;

    // Dodajemy do kontenera
    container.appendChild(toast);

    // Automatyczne usuwanie po 4 sekundach
    setTimeout(() => {
        removeToast(toast);
    }, 4000);

    // Możliwość zamknięcia po kliknięciu
    toast.onclick = () => removeToast(toast);
}

// Funkcja pomocnicza do ładnego usuwania powiadomienia
function removeToast(toast) {
    toast.style.animation = 'fadeOut 0.3s forwards';
    toast.addEventListener('animationend', () => {
        toast.remove();
    });
}

// --- Główna logika aplikacji ---

function generuj() {
    const username = document.getElementById('username').value.trim(); // .trim() usuwa spacje

    if(!username) {
        showNotification("Wpisz najpierw nick!", "error");
        return;
    }

    const apiUrl = `${window.location.origin}/api?username=${username}`;

    // 1. Ustawiamy podgląd
    const img = document.getElementById('preview-image');

    // Resetujemy src, żeby wymusić odświeżenie jeśli obrazek jest ten sam
    img.style.display = 'none';
    img.src = '';

    setTimeout(() => {
        img.src = apiUrl;
        img.style.display = 'block';

        // Obsługa błędu ładowania obrazka (np. zły nick)
        img.onerror = () => {
            showNotification("Nie znaleziono użytkownika lub błąd API.", "error");
            img.style.display = 'none';
        };

        // Sukces (gdy obrazek się załaduje)
        img.onload = () => {
            showNotification("Podgląd wygenerowany pomyślnie!", "success");
        };
    }, 50);

    // 2. Generujemy kod Markdown
    const markdown = `[![Statystyki ${username}](${apiUrl})](https://github.com/${username})`;
    document.getElementById('markdown-code').value = markdown;
}

function kopiuj() {
    const copyText = document.getElementById("markdown-code");

    if (!copyText.value) {
        showNotification("Najpierw wygeneruj kod!", "warning");
        return;
    }

    copyText.select();
    navigator.clipboard.writeText(copyText.value)
        .then(() => {
            showNotification("Skopiowano kod do schowka!", "success");
        })
        .catch(() => {
            showNotification("Błąd kopiowania.", "error");
        });
}