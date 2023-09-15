/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	


function displayItinary()
{
  var doc = document.getElementsByClassName('itinaryContainer')[0]; // Notez que nous utilisons [0] pour accéder au premier élément avec la classe 'itinaryContainer'
  
	doc.style.visibility = 'visible';
	document.getElementById('footer').style.display = 'block';
	document.location.href = '#itinaryContainer';
	document.getElementById('footer').style.visibility = 'visible';
	doc.style.height = '100vh';
}

document.addEventListener('DOMContentLoaded', function() {
  var doc = document.getElementsByClassName('itinaryContainer')[0];
  doc.style.height = '100vh';
  doc.style.visibility = 'visible';
});

