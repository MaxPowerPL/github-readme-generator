function generuj() {
    const username = document.getElementById('username').value;

    if(!username) {
        alert("Wpisz najpierw nick!");
        return;
    }

    // Ten adres "api/index" zadziała automatycznie po wrzuceniu na Vercel
    // Vercel przekieruje zapytanie do folderu /api
    const apiUrl = `${window.location.origin}/api?username=${username}`;

    // 1. Ustawiamy podgląd
    const img = document.getElementById('preview-image');
    img.src = apiUrl;
    img.style.display = 'block';

    // 2. Generujemy kod Markdown
    const markdown = `![Statystyki ${username}](${apiUrl})`;
    document.getElementById('markdown-code').value = markdown;
}

function kopiuj() {
    const copyText = document.getElementById("markdown-code");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    alert("Skopiowano do schowka!");
}