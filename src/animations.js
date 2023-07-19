// Récupérer l'élément de l'image
var image = document.getElementById("ecoAnimation");

// Variables de position et de direction
var position = 0;
var direction = 1;

// Fonction d'animation
function animate() {
  // Modifier la position de l'image
  position += direction;

  // Inverser la direction et appliquer un effet de rebond
  if (position >= 100 || position <= 0) {
    direction *= -1;
  }

  // Appliquer la transformation de translation sur l'axe Y
  image.style.transform = "translateY(" + position + "px)";

  // Appeler la fonction animate de nouveau pour créer une boucle d'animation fluide
  requestAnimationFrame(animate);
}

// Démarrer l'animation
animate();
