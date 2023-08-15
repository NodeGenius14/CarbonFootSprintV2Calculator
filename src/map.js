var tabAutoSuggest = [];   
var tabPushpins = []
var tabRoute = [];
var travelMode = 1;	//1 = Driving, 2 = Bus, 3 = Train, 4 = Plane

var stps = 0;	//Steps

var travelDistance = 0;
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
		var pin = new Microsoft.Maps.Pushpin(suggestionResult.location, {
			title: suggestionResult.formattedSuggestion,
			text: ""+(tabPushpins.length + 1)

			
			});

			
		tabPushpins.push( pin);
		map.entities.push(tabPushpins[tabPushpins.length - 1]);
				if (tabRoute.length === 0 || tabRoute[0].getLatA === null)
				{
				
					if (tabRoute.length === 0)
					{
						var villeDep = suggestionResult.formattedSuggestion
						var latDep   = suggestionResult.location.latitude
						var longDep  = suggestionResult.location.longitude
						tabRoute.push(new Route(villeDep,null,latDep,longDep,null,null))
					}
					else
					{
					
							


						tabRoute[0].setVilleA = suggestionResult.formattedSuggestion;
						tabRoute[0].setLatitudeA = suggestionResult.location.latitude;
						tabRoute[0].setLongitudeA = suggestionResult.location.longitude;

						console.log('ville A :',tabRoute[0].getVilleA);
						console.log('lat A :',tabRoute[0].getLatA);
						console.log('long A :',tabRoute[0].getLongA);

							
						var btn = document.getElementById('calculatedistance');
						btn.disabled = false;
						btn.style.backgroundColor = 'green';
						console.log('fin de fonction');
					}
				
				}
				else
				{
					console.log("Dans le else")
					villeDep = tabRoute[stps].getVilleA;
					latDep   = tabRoute[stps].getLatA;
					longDep  = tabRoute[stps].getLongA;

					tabRoute.push(new Route(villeDep,suggestionResult.formattedSuggestion,latDep,longDep,suggestionResult.location.latitude,suggestionResult.location.longitude))
					stps++;
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

	function attachAutosuggestToInput(inputId) 
	{
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
	console.log('Nombre d\'étapes :',stps+1);
	console.log('Coordonnées de départ :',tabRoute[stps].getLatD,tabRoute[stps].getLongD);
	console.log('Coordonnées d\'arrivée :',tabRoute[stps].getLatA,tabRoute[stps].getLongA);
		

		if(travelMode === 3 || travelMode === 4)
		{
			// on part du principe que si trajet impossible en voiture alors impossible en train
				
			const coords = 
			[
				new Microsoft.Maps.Location(tabRoute[tabRoute.length-1].getLatD, tabRoute[tabRoute.length-1].getLongD),
				new Microsoft.Maps.Location(tabRoute[tabRoute.length-1].getLatA, tabRoute[tabRoute.length-1].getLongA)
				  
			];
			const line = new Microsoft.Maps.Polyline(coords, 
				{
					strokeColor: 'red',
					strokeThickness: 3,
					strokeDashArray: [4, 4]
				});

				tabRoute[stps].calculateDistance();
				travelDistance = tabRoute[stps].getDistance;
				console.log('Distance entre les deux points :', travelDistance);
				map.entities.push(line);
				AfficherEtapes();
				
				//map.entities.remove(tabPushpins[tabPushpins.length-1]);Commandes pour supprimer le dernier pushpin
		}

		
		else
		{
			Microsoft.Maps.loadModule('Microsoft.Maps.Directions', async function () 
			{
				directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

				Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function (e) 
				{
					var routeIdx = directionsManager.getRequestOptions().routeIndex;
					console.log('Directions updated:', e.routeSummary);
					travelDistance = e.routeSummary[routeIdx].distance;
					console.log('New Distance calculé  :', travelDistance);
					tabRoute[stps].setDistance = travelDistance;

					AfficherEtapes();


					
				});

				Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function (args) 
				{
					console.log('Directions error:', args.responseCode, args.message);
					travelDistance = -1;
					console.log('New Distance calculé error  :', travelDistance);
					// Faites ce que vous voulez lorsque le calcul des directions échoue
				});

			
		
		

		

				const seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `Start Step ${stps+1}`, location: new Microsoft.Maps.Location(tabRoute[stps].getLatD, tabRoute[stps].getLongD) });
				directionsManager.addWaypoint(seattleWaypoint);

				const workWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `End Step ${stps+1}`, location: new Microsoft.Maps.Location(tabRoute[stps].getLatA, tabRoute[stps].getLongA) });
				directionsManager.addWaypoint(workWaypoint);
			
				directionsManager.calculateDirections();

				const requestOptions = 
				{
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
			
		
			});

			if (travelDistance === -1) {const errorlabel = document.getElementById('errorLabel').textContent = 'Impossible de calculer la distance entre ces deux points'}
				
		}
		
		
		
		if (travelDistance != -1)
		{
			document.getElementById('searchBox0').disabled = true;
			document.getElementById('searchBox1').disabled = true;
		}

		totalDistance += Math.round(travelDistance);
		
		
}

function AfficherEtapes()
{
	totalDistance += travelDistance;
	let urlImage;
	switch (travelMode) 
	{
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
	console.log('Distance entre les deux points :', (tabRoute[stps].getDistance));

	document.getElementById('step').innerHTML += `<div class="stepContent"><img src="${urlImage}"><p>Step ${stps+1} ${tabRoute[stps].getVilleD}, ${tabRoute[stps].getVilleA} ${Math.round(travelDistance)} Km.</div>`;

	totalDistanceDiv = document.getElementById('totaldistance');
	totalDistanceDiv.style.display = "block";
	totalDistanceDiv.innerHTML = `<p>Total Distance ${Math.round(totalDistance)} Km.`;

}
