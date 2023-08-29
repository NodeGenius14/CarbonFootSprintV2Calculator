/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	

class Controleur 
{
	constructor( map )
	{
		this.modele = new Modele( this     )
		this.vue    = new Vue   ( this,map )
	}
	get getModele() { return this.modele ;}
	get getVue()    { return this.vue    ;}



}

