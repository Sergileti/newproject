
document.addEventListener('DOMContentLoaded', function() {
    
    
    themeBouton = document.getElementById('themeToggle');
    
    
    themeBouton.addEventListener('click', function() {
        
        
        if (document.body.classList.contains('dark-theme')) {
            
            document.body.classList.remove('dark-theme');
            themeBouton.textContent = 'Mode Sombre';
            localStorage.setItem('theme', 'light');
        } else {
            
            document.body.classList.add('dark-theme');
            themeBouton.textContent = 'Mode Clair';
            localStorage.setItem('theme', 'dark');
        }
    });
});

sauvegarderTheme = localStorage.getItem('theme');
    
    
    if (sauvegarderTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeBouton.textContent = 'Mode Clair';
    } else {
        themeBouton.textContent = 'Mode Sombre';
    }

// Pour sauvegarder une note sur la page actuelle
function saveNote() {
    const note = document.getElementById('note-area').value;
    const pageId = window.location.pathname; // Identifiant unique de la page
    
    localStorage.setItem(`note_${pageId}`, note);
}

// Pour charger la note au chargement de la page
function loadNote() {
    const pageId = window.location.pathname;
    const savedNote = localStorage.getItem(`note_${pageId}`);
    
    if (savedNote) {
        document.getElementById('note-area').value = savedNote;
    }
}    