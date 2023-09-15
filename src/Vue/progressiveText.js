/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	

function effetTexteProgressif(id) {
    const texteElement = document.getElementById(id);
    const texteComplet = texteElement.innerText;
    texteElement.innerText = ''; // Efface le texte initial pour l'effet progressif

    let index = 0;
    function afficherTexteProgressivement() {
      texteElement.innerText = texteComplet.slice(0, index);
      index++;
      if (index <= texteComplet.length) {
        setTimeout(afficherTexteProgressivement, 100); // Répéter toutes les 100 millisecondes (ajustable pour la vitesse d'écriture)
      }
    }

    // Démarre l'effet d'écriture
    afficherTexteProgressivement();
}

effetTexteProgressif('texte');
effetTexteProgressif('texte2');



document.getElementById('calculateButton').addEventListener('click', function() {
  // Ajouter la classe "fade-in-out" à la div "itinaryContainer" pour l'animation de fondu
  document.getElementById('itinaryContainer').classList.add('fade-in-out');
  
  // Ajouter la classe "slide-in" à la div "itinaryContainer" pour l'animation de glissement
  //document.getElementById('itinaryContainer').classList.add('slide-in');
});
