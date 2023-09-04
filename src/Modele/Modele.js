/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/


 	

class Modele
{	
	constructor ( ctrl )
	{
		this.ctrl		   = ctrl;
		this.tabRoute      =   [];
		this.totalDistance =    0;
	}

	get getTabRoute()     { return this.tabRoute		  ;}
	get getTotalDistance(){ return this.totalDistance	  ;}
	incrTotalDistance(km) {        this.totalDistance+=km ;}
	
	selectedSuggestion( resultVille,resultLatitude,resultLongitude )
	{
		
		var indR = this.tabRoute.length ;		//Indice route

		
		if   (  indR === 0 ) { this.tabRoute.push(Route.lowArgs(resultVille, resultLatitude, resultLongitude)); }
		else 
		{
			
				if ( this.tabRoute[indR-1].getEstComplete === false )
				{
					this.tabRoute[indR-1].setVilleA     = resultVille    ; 
					this.tabRoute[indR-1].setLatitudeA  = resultLatitude ;
					this.tabRoute[indR-1].setLongitudeA = resultLongitude;
					this.tabRoute[indR-1].setComplete   = true			 ;
				}
				else
				{
					var villeD	 = this.tabRoute[indR-1].getVilleA;
					var latD	 = this.tabRoute[indR-1].getLatA  ;
					var longD	 = this.tabRoute[indR-1].getLongA ; 

					this.tabRoute.push( new Route(villeD, latD, longD, resultVille, resultLatitude, resultLongitude, true ));
				}
		}
			
		this.ctrl.getVue.ajouterPushpin( resultVille, resultLatitude, resultLongitude );
			
		
		
		if( this.tabRoute[0].getEstComplete     === true  )
		  { 
			this.ctrl.getVue.setStateBtnCalculate 									 = true ;
			document.getElementById("searchBox" + (this.tabRoute.length+1)).disabled = true ;
		  }
		  else
		  { document.getElementById("searchBox" + this.tabRoute.length).disabled 	 = true ;}
		
	}

	sendData()

	{
		console.log("Taratataa"+this.tabRoute.toString()) ;
		localStorage.setItem("tabRoute", JSON.stringify(this.tabRoute));
		


	}


}