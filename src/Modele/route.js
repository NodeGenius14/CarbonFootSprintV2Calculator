/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	

class Route {
	constructor(villeD, latD, longD, villeA, latA, longA,estComplete)
	{
		
		this.villeD 	 = villeD	   ;
		this.latD  		 = latD		   ;
		this.longD  	 = longD	   ;
		this.villeA		 = villeA	   ;
		this.latA  		 = latA		   ;
		this.longA       = longA	   ;
		this.estComplete = estComplete ;
		this.travelMode  = null		   ;
	}
		static lowArgs( villeD,latD,longD ) { return new Route(villeD,latD,longD,null,null,null,false )} //Me sert pour avoir plusieurs consteucteurs
	

	get getVilleD	  () 			 { return 	   this.villeD 		    ;}
	get getVilleA	  () 			 { return 	   this.villeA 	  		;}
	get getLongD	  ()			 { return 	    this.longD	  		;}
	get getLatD		  ()			 { return    	 this.latD 	  		;}
	get getLongA	  ()			 { return 	    this.longA 	  		;}
	get getLatA       ()		     { return        this.latA 	  		;}
	get getDistance   ()			 { return    this.distance 	  		;}
	get getEstComplete()		     { return this.estComplete          ;}

	set setDistance   (  distance  ) { this.distance    = distance      ;}
	set setVilleA     (   villeA   ) { this.villeA	    = villeA 	    ;}
	set setLatitudeA  (  latitudeA ) { this.latA	    = latitudeA  	;}
	set setLongitudeA ( longitudeA ) { this.longA 	    = longitudeA 	;}
	set setTravelMode ( travelMode ) { this.travelMode  = travelMode 	;}
	set setComplete   ( value      ) { this.estComplete = value		    ;}
	degToRad(degrees) 			     { return degrees * (Math.PI / 180) ;}

	// Method
	

	calculateDistance() {
		const earthRadius = 6371; // Rayon de la Terre en kilomètres

		const lat1Rad = this.latD  * ( Math.PI / 180 );
		const lon1Rad = this.longD * ( Math.PI / 180 );
		const lat2Rad = this.latA  * ( Math.PI / 180 );
		const lon2Rad = this.longA * ( Math.PI / 180 );

		const latDiff = lat2Rad - lat1Rad;
		const lonDiff = lon2Rad - lon1Rad;

		const a = Math.sin(latDiff / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;

		this.distance = Math.round(distance);
	}

	toString() 
	{
		let str = "";
		str += "Ville de départ : " + this.villeD   + " ("  + this.latD + " , " + this.longD 		+ ")"; 
		str += "Ville d'arrivée : " + this.villeA   + " ("  + this.latA + " , " + this.longA  		+ ")"
		str += "Distance        : " + this.distance + " km" + " estComplete "   + this.estComplete;
		return str;
	}
	
	
	
}	
  