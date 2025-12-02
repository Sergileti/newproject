
let imagesChargees = 0;
let enCoursDeChargement = false;
let elementDeplace = null;


document.addEventListener('DOMContentLoaded', function() {
    console.log('Page chargee - Initialisation');
    initialiserTheme();
    chargerPremieresImages();
    configurerScrollInfini();
});


function initialiserTheme() {
    console.log('Initialisation du theme');
    let boutonTheme = document.getElementById('themeToggle');
    let themeSauvegarde = localStorage.getItem('theme');
    
    if (themeSauvegarde === 'dark') {
        document.body.classList.add('dark-theme');
        boutonTheme.textContent = 'Mode Clair';
        console.log('Theme sombre active');
    } else {
        console.log('Theme clair active');
    }
    
    boutonTheme.addEventListener('click', function() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            boutonTheme.textContent = 'Mode Sombre';
            localStorage.setItem('theme', 'light');
            console.log('Changement vers theme clair');
        } else {
            document.body.classList.add('dark-theme');
            boutonTheme.textContent = 'Mode Clair';
            localStorage.setItem('theme', 'dark');
            console.log('Changement vers theme sombre');
        }
    });
}


function chargerPremieresImages() {
    console.log('Chargement des premieres images');
    chargerImages(10);
}


function configurerScrollInfini() {
    console.log('Configuration du scroll infini');
    window.addEventListener('scroll', function() {
        if (estPresDuBas() && !enCoursDeChargement) {
            console.log('Detection bas de page - Chargement declenche');
            chargerImages(10);
        }
    });
}


function estPresDuBas() {
    let hauteurTotale = document.documentElement.scrollHeight;
    let positionVisible = window.innerHeight;
    let positionScroll = window.scrollY;
    
    return (positionScroll + positionVisible) >= (hauteurTotale - 200);
}


function chargerImages(nombre) {
    if (enCoursDeChargement) {
        console.log('Chargement deja en cours - Ignore');
        return;
    }
    
    enCoursDeChargement = true;
    let conteneur = document.getElementById('galerie-container');
    let indicateur = document.getElementById('chargement-indicateur');
    
    console.log('Debut du chargement de ' + nombre + ' images');
    
    
    indicateur.classList.remove('cache');
    console.log('Indicateur de chargement affiche');

    setTimeout(function() {
        console.log('Ajout de ' + nombre + ' images dans la galerie');
        
        for (let i = 0; i < nombre; i++) {
            creerImage(conteneur, imagesChargees + i + 1);
        }
        
        imagesChargees += nombre;
        
        console.log(nombre + ' images chargees - Total: ' + imagesChargees);
        
        
        indicateur.classList.add('cache');
        enCoursDeChargement = false;
        console.log('Indicateur de chargement cache');
        
    }, 800);
}


function creerImage(conteneur, index) {
    let image = document.createElement('img');
    image.alt = 'Image ' + index + ' de la galerie';
    image.classList.add('image-galerie');
    
    
    image.setAttribute('draggable', 'true');
    
    
    conteneur.appendChild(image);
    
    console.log('Début du chargement fetch pour image ' + index);
    
   
    fetch('https://picsum.photos/400/300?random=' + index)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP: ' + response.status);
            }
            return response.blob();
        })
        .then(blob => {
            // Créer l'image avec le blob
            image.src = URL.createObjectURL(blob);
            console.log('Image ' + index + ' chargée avec succès');
            
            // Configurer les evenements de drag & drop APRÈS le chargement
            configurerDragAndDrop(image);
            
            // Libérer la mémoire quand l'image est chargée
            image.onload = function() {
                URL.revokeObjectURL(image.src);
            };
        })
        .catch(error => {
            console.error('Erreur de chargement image ' + index + ':', error);
            image.alt = 'Erreur de chargement - ' + image.alt;
            image.classList.add('erreur-chargement');
        });
    
    return image;
}

// Configurer le drag & drop pour une image
function configurerDragAndDrop(element) {
    console.log('Configuration drag & drop pour: ' + element.alt);
    
    // Evenement quand on commence a drag
    element.addEventListener('dragstart', function(e) {
        elementDeplace = this;
        this.classList.add('en-deplacement');
        e.dataTransfer.setData('text/plain', this.alt);
        console.log('DRAG START: ' + this.alt);
    });
    
    // Evenement quand on finit de drag
    element.addEventListener('dragend', function() {
        this.classList.remove('en-deplacement');
        console.log('DRAG END: ' + this.alt);
        
        // Retirer les styles de toutes les zones de drop
        let toutesImages = document.querySelectorAll('.image-galerie');
        toutesImages.forEach(function(img) {
            img.classList.remove('zone-drop', 'survol-drop');
        });
    });
    
    // Evenement quand on survole un element pendant le drag
    element.addEventListener('dragover', function(e) {
        e.preventDefault(); // Permettre le drop
        this.classList.add('survol-drop');
        console.log('DRAG OVER: ' + this.alt);
    });
    
    // Evenement quand on quitte un element pendant le drag
    element.addEventListener('dragleave', function() {
        this.classList.remove('survol-drop');
        console.log('DRAG LEAVE: ' + this.alt);
    });
    
    // Evenement quand on depose l'element
    element.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('survol-drop');
        console.log('DROP: Depot sur ' + this.alt);
        
        if (elementDeplace !== this) {
            let conteneur = document.getElementById('galerie-container');
            let tousElements = Array.from(conteneur.children);
            let indexCible = tousElements.indexOf(this);
            let indexSource = tousElements.indexOf(elementDeplace);
            
            console.log('Reorganisation: ' + elementDeplace.alt + ' (index ' + indexSource + ') vers ' + this.alt + ' (index ' + indexCible + ')');
            
            // Reorganiser les elements
            if (indexSource < indexCible) {
                conteneur.insertBefore(elementDeplace, tousElements[indexCible + 1]);
            } else {
                conteneur.insertBefore(elementDeplace, this);
            }
            
            console.log('Galerie reorganisee avec succes');
        }
        
        elementDeplace = null;
    });
}

// Empecher le comportement par defaut du navigateur
document.addEventListener('dragover', function(e) {
    e.preventDefault();
});

document.addEventListener('drop', function(e) {
    e.preventDefault();
});

console.log('Script galerie.js charge avec succes');