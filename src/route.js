class Route {
	constructor(villeD, villeA, latD, longD, latA, longA) {
		this.villeD = villeD;
		this.villeA = villeA;
		this.latD = latD;
		this.longD = longD;
		this.latA = latA;
		this.longA = longA;
		
		this.distance = this.calculateDistance(latD, longD, latA, longA);
	}

	get VilleD() 
	{
		return this.villeD;
	}
	get VilleA()
	{
		return this.villeA;
	}
	get LongD()
	{
		return this.longD;
	}
	get LatD()
	{
		return this.latD;
	}
	get LongA()
	{
		return this.longA;
	}
	get LatA()
	{
		return this.latA;
	}
	get Distance()
	{
		return this.distance;
	}
	
	 degToRad(degrees) 
	{
		return degrees * (Math.PI / 180);
	}	
	// Method
	

	  calculateDistance(lat1, lon1, lat2, lon2) {
		const earthRadius = 6371; // Rayon de la Terre en kilomètres
	
		// Conversion d aq	es degrés en radians
		const lat1Rad = this.LatD * (Math.PI / 180);
		const lon1Rad = this.longD * (Math.PI / 180);
		const lat2Rad = this.latA * (Math.PI / 180);
		const lon2Rad = this.longA * (Math.PI / 180);
	
		// Calcul des différences de latitude et de longitude
		const latDiff = lat2Rad - lat1Rad;
		const lonDiff = lon2Rad - lon1Rad;
	
		// Calcul de la distance en utilisant la formule de Haversine
		const a = Math.sin(latDiff / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = earthRadius * c;
	
		return distance;
	}
	
	 
	
	
	
}	
  