/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	


// Obligé de mettre cette fonction en dehors de la classe car sinon il y a un problème de callback

function loadMap()
{
	Microsoft.Maps.loadModule('Microsoft.Maps.Directions',   () => 
			{
				new Result();
			});
	
	

			
}