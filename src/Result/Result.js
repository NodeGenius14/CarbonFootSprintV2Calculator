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
			"car"   : ((145.1 * 20299787 + 162.0 * 14654485)/(20299787 + 14654485))*0.001,
			"bus"	  : 0.1017,
			"plane" : 0.090,
			"train" : 0.02585


		}
		
		

		this.tabRoute.forEach(route => 
			{
			this.step(route.villeD, route.latD, route.longD, route.villeA, route.latA, route.longA, route.travelMode, route.distance)
			});

		this.total();
		
		
	};
	step(villeD, latD, longD, villeA, latA, longA, travelMode, distance)
	{

		const article	      = document.createElement('article');
		const divDetail       = document.createElement('div')	 ;
		let   totalDistance   = distance * this.CO[travelMode]   ;
		this.totalCO		 += totalDistance;
			  this.i++;
		
			totalDistance = totalDistance.toFixed(2);
			totalDistance = totalDistance +    " kg";

		console.log("TravelMode" + travelMode)

		divDetail.className = "detail";
		divDetail.innerHTML += "<p>" + villeD + " - " + villeA + "</p>";
		divDetail.innerHTML += "<img src=/"+travelMode+".png>";
		divDetail.innerHTML += "<p>" + distance.toFixed(2) + " kilometers</p>"; 
		divDetail.innerHTML += "<p>Co2 Average per Kilometer " + (this.CO[travelMode]*1000).toFixed(2) + "g	</p>";
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
			disableScrollWheelZoom: true,
			disableZooming: true,
			disablePanning: true,
			liteMode: true,

		});
		  
		console.log("ok");
		const locVilleD = new Microsoft.Maps.Location( latD,  longD);
		const locVilleA = new Microsoft.Maps.Location( latA,  longA);

		const pinD = new Microsoft.Maps.Pushpin(locVilleD, {color: 'purple', text: 'A',title: villeD});
		const pinA = new Microsoft.Maps.Pushpin(locVilleA, {color: 'purple', text: 'B',title: villeA});

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

			directionsManager.setRequestOptions(
				{ 
					routeMode: Microsoft.Maps.Directions.RouteMode.driving,
					maxRoutes: 1,
					optimizeWaypoints: true,
					routeDraggable: false,
			});

			directionsManager.setRenderOptions({draggableRoutes: false,
				waypointPushpinOptions:{visible:false}})
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
		this.divTitle.innerHTML +="<h3> Your Travel From "+this.tabRoute[0].villeD + " to " + this.tabRoute[this.nbSteps-1].villeA +"</h3>";
		
		let str = "step";
		if (this.nbSteps > 1) { str +="s"}	
		this.divTitle.innerHTML += "<p>Detailled By <strong>"+ this.nbSteps+" </strong>"+ str +".</p>";
	}
	total() { this.divTitle.innerHTML += "<h3>Total Co2 Emitted : <strong>"+ this.totalCO.toFixed(2)+" </strong>kg.</h3>" }
}
