var tabAutoSuggest = [];   
var tabPushpins = []
var tabRoute = [];
var CoordDep = null;
var CoordArr = null;

var travelMode = 1;

var numberSteps = 0;

var totalDistance = 0;

var optionAutoSuggest =
{
	maxResults: 4,
	map: map
}
function loadMapScenario() 
{
		
	map = new Microsoft.Maps.Map('#myMap'), 
	{
				/* No need to set credentials if already passed in URL */
				center: new Microsoft.Maps.Location(48.86666,  2.333333),
				zoom: 5
		
		};
			
	Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () 
	{
		
		if (tabAutoSuggest.length == 0)
		{
			tabAutoSuggest.push(new Microsoft.Maps.AutosuggestManager(optionAutoSuggest));
			tabAutoSuggest.push(new Microsoft.Maps.AutosuggestManager(optionAutoSuggest));
			tabAutoSuggest[0].attachAutosuggest('#searchBox0', '#searchBoxContainer', selectedSuggestion);
			tabAutoSuggest[1].attachAutosuggest('#searchBox1', '#searchBoxContainer', selectedSuggestion);
			
		}


	});
	

	


}
function selectedSuggestion(suggestionResult) 
		{
		
		tabPushpins.push(new Microsoft.Maps.Pushpin(suggestionResult.location) );
		map.entities.push(tabPushpins[tabPushpins.length - 1]);
				if (tabRoute.length === 0 || CoordArr === null)
				{
					if (CoordDep === null)
			{
				tabRoute.push(new Route(suggestionResult.formattedSuggestion,null,suggestionResult.location.latitude,suggestionResult.location.longitude,null,null))
				CoordDep = suggestionResult.location.latitude + ',' + suggestionResult.location.longitude;
				villeDep = suggestionResult.formattedSuggestion;
				console.log("Coord Dep : ",CoordDep);
			}
				else
				{
				 
						

					CoordArr = suggestionResult.location.latitude + ',' + suggestionResult.location.longitude;
					tabRoute[numberSteps].setVilleA = suggestionResult.formattedSuggestion;
					tabRoute[numberSteps].setLatitudeA = suggestionResult.location.latitude;
					tabRoute[numberSteps].setLongitudeA = suggestionResult.location.longitude;

					console.log('ville A :',tabRoute[numberSteps].getVilleA);
					console.log('lat A :',tabRoute[numberSteps].getLatA);
					console.log('long A :',tabRoute[numberSteps].getLongA);
					console.log(numberSteps);

						
						var btn = document.getElementById('calculatedistance');
						btn.disabled = false;
						btn.style.backgroundColor = 'green';
						console.log('fin de fonction');
				}
				
				}
				else
				{
					console.log("Dans le else")
					villeDep = tabRoute[tabRoute.length-1].getVilleA;
					latDep   = tabRoute[tabRoute.length-1].getLatA;
					longDep  = tabRoute[tabRoute.length-1].getLongA;

					tabRoute.push(new Route(villeDep,suggestionResult.formattedSuggestion,latDep,longDep,suggestionResult.location.latitude,suggestionResult.location.longitude))
				}
		map.setView({ bounds: suggestionResult.bestView });
		}

function selectTravelMode(travelCode)
{
		var buttons = document.querySelectorAll('.travelMode button');
		buttons.forEach(function(button) {
				button.classList.remove('selected');
		});

		var selectedButton = document.querySelector('.travelMode button:nth-child(' + travelCode + ')');
		selectedButton.classList.add('selected');


		travelMode = travelCode;
		console.log('travelMode is : ',travelMode);

}

async function DistanceCalculAPI(coord1, coord2) {
	const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${coord1}&destinations=${coord2}&travelMode=driving&key=Au3StwO6PwFS37gtE-52dLcOhomBX4tBcN_CZo7KZqP82ymvB9WHWh8Sjm2qs-m-`;
	

		console.log("affichage cords API : ",coord1,coord2); 

	try {
		const response = await fetch(url);
		const data = await response.json();
		const travelDistance = data.resourceSets[0].resources[0].results[0].travelDistance;
	
		console.log('Distance entre les deux points :', travelDistance);
	
		return travelDistance;
	} catch (error) {
		console.log(error);
		return -10;
	}
	}

	function createTextInput() 
		{
			const inputElement = document.createElement("input");
			inputElement.type = "search";
			inputElement.id = "searchBox" + (tabAutoSuggest.length);
			inputElement.placeholder = "Enter a city";
		  
			const container = document.getElementById("searchBoxContainer");
			container.appendChild(inputElement);
		  
			attachAutosuggestToInput(inputElement.id);
		  }

		function attachAutosuggestToInput(inputId) {
			const manager = new Microsoft.Maps.AutosuggestManager(optionAutoSuggest);
			manager.attachAutosuggest('#' + inputId, '#searchBoxContainer', selectedSuggestion);
			tabAutoSuggest.push(manager);
		  }


async function functionDisplaySteps()
{
		const errorlabel = document.getElementById('errorLabel').textContent = null;

		const button = document.getElementById('calculatedistance');
		button.disabled = true;
		button.style.backgroundColor = '#8bc09e';

		console.log("coords : ",);
	console.log('Nombre d\'étapes :',numberSteps);
	console.log('Coordonnées de départ :',tabRoute[numberSteps].getLatD,tabRoute[numberSteps].getLongD);
	console.log('Coordonnées d\'arrivée :',tabRoute[numberSteps].getLatA,tabRoute[numberSteps].getLongA);
		travelDistance = await DistanceCalculAPI((tabRoute[numberSteps].getLatD+','+tabRoute[numberSteps].getLongD),(tabRoute[numberSteps].getLatA+','+tabRoute[numberSteps].getLongA))

		if(travelMode === 3 || travelMode === 4)
		{
				// on part du principe que si trajet impossible en voiture alors impossible en train
				if(travelMode === 3 && travelDistance === -1)
				{
						errorlabel.textContent = 'Travel Impossible by train !!';
						return;
				}
				const coords = [
					new Microsoft.Maps.Location(tabRoute[tabRoute.length-1].getLatD, tabRoute[tabRoute.length-1].getLongD),
					new Microsoft.Maps.Location(tabRoute[tabRoute.length-1].getLatA, tabRoute[tabRoute.length-1].getLongA)
				  ];
				const line = new Microsoft.Maps.Polyline(coords, {
						strokeColor: 'red',
						strokeThickness: 3,
						strokeDashArray: [4, 4]
					});
					tabRoute[tabRoute.length-1].calculateDistance;
			
				map.entities.push(line);

		}
		else if(travelDistance === -1)
		{
				if(travelMode === 1)
				{
						errorlabel.textContent = 'Travel Impossible by car !';
				}
				if(travelMode === 2)
				{
						errorlabel.textContent = 'Travel impossible by bus !';
				}
				return;
		}
		else
		{
				tabRoute[numberSteps].setDistance = travelDistance;
				
				totalDistance += Math.round(travelDistance);
	
				Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
					directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
		
					const seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `Start Step ${numberSteps+1}`, location: new Microsoft.Maps.Location(tabRoute[numberSteps].getLatD, tabRoute[numberSteps].getLongD) });
					directionsManager.addWaypoint(seattleWaypoint);
		
					const workWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `End Step ${numberSteps+1}`, location: new Microsoft.Maps.Location(tabRoute[numberSteps].getLatA, tabRoute[numberSteps].getLongA) });
					directionsManager.addWaypoint(workWaypoint);
		
					directionsManager.calculateDirections();
		
					const requestOptions = {
						routeMode: Microsoft.Maps.Directions.RouteMode.driving,
						maxRoutes: 1,
						optimizeWaypoints: true,
						routeDraggable: false,
						setMapBestView: true
					};
		
					directionsManager.setRequestOptions(requestOptions);
		
					const renderOptions = directionsManager.getRenderOptions();
		
					renderOptions.draggableRoutes = false;
		
					renderOptions.routeIndex = 0;
					directionsManager.setRenderOptions(renderOptions);
		
					document.getElementById('searchBox0').disabled = true;
					document.getElementById('searchBox1').disabled = true;
		
					CoordDep = CoordArr;
		
			
				});
		}

		let urlImage;
		switch (travelMode) {
			case 1:
				urlImage = '/car.png';
				break;
			case 2:
				urlImage = '/bus.png';
				break;
			case 3:
				urlImage = '/train.png';
				break;
			case 4:
				urlImage = '/plane.png';
				break;
		}
		

	
		console.log('urlImage:', urlImage, 'travelMode:', travelMode);
		tabRoute[tabRoute.length-1].calculateDistance;
		console.log('Distance entre les deux points :', (tabRoute[tabRoute.length-1].getDistance));
	
		document.getElementById('step').innerHTML += `<div class="stepContent"><img src="${urlImage}"><p>Step ${numberSteps+1} ${tabRoute[numberSteps].getVilleD}, ${tabRoute[numberSteps].getVilleA} ${travelDistance} Km.</div>`;
	
	totalDistanceDiv = document.getElementById('totaldistance');
		totalDistanceDiv.style.display = "block";
		totalDistanceDiv.innerHTML = `<p>Total Distance ${totalDistance} Km.`;
	
		
}
