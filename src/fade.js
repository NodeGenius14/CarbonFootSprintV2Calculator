/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	

setTimeout(function() 
{
    var header = document.getElementById('header');
    header.style.opacity = 1;
    header.style.visibility = 'visible';
}, 1000); 

$(document).ready(function() {
    // Écouteur d'événement sur le clic du lien
    $('#calculateButton').on('click', function(event) {
      event.preventDefault(); // Empêcher le comportement par défaut du lien
  
      // Récupérer la div ciblée à partir de l'ancre href
      const targetDiv = $(this.hash);
  
      // Appliquer un effet pour la rendre visible
      targetDiv.removeClass('hidden'); // ou targetDiv.css('visibility', 'visible');
  
      // Faire défiler la page vers la div ciblée (si vous le souhaitez)
      $('html, body').animate({
        scrollTop: targetDiv.offset().top
      }, 1000); // Durée de l'animation en millisecondes (ajustez selon vos besoins)
    });
  });
  