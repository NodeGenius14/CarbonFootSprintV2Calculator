class Result
{
	constructor()
	{

		this.tabRoute = JSON.parse(localStorage.getItem("tabRoute"));
		this.nbSteps  = this.tabRoute.length;
		this.i 		  = 0;
		this.totalCO  = 0;
		this.divTitle = document.getElementById("title");
		this.setTitle();

		this.CO = 
		{
			//diesel total vehicule*co2 + petrole total vehicule* co2  / total vehicule
			"car"   : ((145.1 * 20299787 + 162.0 * 14654485)/(20299787 + 14654485)),
			"bus"	  : 101.7,
			"plane" : 90,
			"train" : 25.85


		}
		
		

		this.tabRoute.forEach(route => 
			{
			this.step(route.villeD, route.latD, route.longD, route.villeA, route.latA, route.longA, route.travelMode, route.distance)
			});
		
		
	};
	step(villeD, latD, longD, villeA, latA, longA, travelMode, distance)
	{

		const article	      = document.createElement('article');
		const divDetail       = document.createElement('div')	 ;
		let   totalDistance   = distance * this.CO[travelMode]   ;
		this.totalCO		 += totalDistance;
			  this.i++;
		
		if (totalDistance > 1000)
		{
			totalDistance = totalDistance /     1000;
			totalDistance = totalDistance.toFixed(2);
			totalDistance = totalDistance +    " kg";
		}
		else
		{
			totalDistance = totalDistance.toFixed(2);
			totalDistance = totalDistance + " g";
		}

		console.log("TravelMode" + travelMode)
		//console.log("this.CO[travelMode]" + this.CO.car);

		divDetail.className = "detail";
		divDetail.innerHTML += "<p>" + villeD + " - " + villeA + "</p>";
		divDetail.innerHTML += "<img src=/"+travelMode+".png>";
		divDetail.innerHTML += "<p>" + Math.round(distance) + " kilometers</p>"; 
		divDetail.innerHTML += "<p>Co2 Average per Kilometer " + Math.round(this.CO[travelMode]) + "g	</p>";
		divDetail.innerHTML += "<p>Co2 Total " + totalDistance +	"</p>";

		
		
		article.appendChild(divDetail);

		const divMap = document.createElement('div');
		divMap.className = "map";
		divMap.id = "map" + this.i;
		article.appendChild(divMap);

		document.body.appendChild(article);
		
		

		const map = new Microsoft.Maps.Map('#map' + this.i,
		{
			center: new Microsoft.Maps.Location(48.86666, 2.333333),
			zoom: 5,
			disableStreetside: true,
			disableBirdseye: true,
			IsHitTestVisible : false,

		});
		  
		console.log("ok");
		const locVilleD = new Microsoft.Maps.Location( latD,  longD);
		const locVilleA = new Microsoft.Maps.Location( latA,  longA);

		const pinD = new Microsoft.Maps.Pushpin(locVilleD, {color: 'purple', text: 'A'});
		const pinA = new Microsoft.Maps.Pushpin(locVilleA, {color: 'purple', text: 'B'});

		map.entities.push(pinD);
		map.entities.push(pinA);

		if (travelMode == "car" || travelMode == "bus")
		{
			let directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

			const startStep = new Microsoft.Maps.Directions.Waypoint({ location: locVilleD });
			const endStep   = new Microsoft.Maps.Directions.Waypoint({ location: locVilleA });
				
			directionsManager.addWaypoint( startStep );
			directionsManager.addWaypoint(   endStep );
			directionsManager.calculateDirections   ();
		}
		else
		{
			const line = new Microsoft.Maps.Polyline([locVilleD, locVilleA], {strokeColor: 'red', strokeThickness: 3, strokeDashArray: [4, 4]});
			map.entities.push(line);
		}
		var locs = [locVilleD, locVilleA];
		var rect = Microsoft.Maps.LocationRect.fromLocations(locs);

		map.setView({ bounds: rect, padding: 80 });
		

		console.log("ok");

	}

	setTitle()
	{
		this.divTitle.innerHTML +="<h1> Your Travel From "+this.tabRoute[0].villeD + " to " + this.tabRoute[this.nbSteps-1].villeA +"</h1>";
		
		
		if (this.nbSteps == 1)
		{
			this.divTitle.innerHTML += "<p>Detailled By <strong>"+ this.nbSteps+" </strong>step.</p>"
		}
		else
		{
		this.divTitle.innerHTML += "<p>Detailled By <strong>"+ this.nbSteps+" </strong>steps.</p>"
		}
	}
}
