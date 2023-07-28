var tabAutoSuggest = [];   
var tabPushpins = []
var tabRoute = [];
var CoordDep = null;
var CoordArr = null;

var travelMode = 1;

var numberSteps = 0;

var totalDistance = 0;


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
		var options = 
		{
			maxResults: 4,
			map: map
		};
		if (tabAutoSuggest.length == 0)
		{
			tabAutoSuggest.push(new Microsoft.Maps.AutosuggestManager(options));
			tabAutoSuggest.push(new Microsoft.Maps.AutosuggestManager(options));
			tabAutoSuggest[0].attachAutosuggest('#searchBox0', '#searchBoxContainer', selectedSuggestion);
			tabAutoSuggest[1].attachAutosuggest('#searchBox1', '#searchBoxContainer', selectedSuggestion);
		}

	});
	

	function selectedSuggestion(suggestionResult) 
    {
		
		tabPushpins.push(new Microsoft.Maps.Pushpin(suggestionResult.location) );
		map.entities.push(tabPushpins[tabPushpins.length - 1]);
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
			tabRoute[length].VilleA = suggestionResult.formattedSuggestion;
            tabRoute[length].LatA = suggestionResult.location.latitude;
            tabRoute[length].LongA = suggestionResult.location.longitude;

            numberSteps += 1;
            var btn = document.getElementById('calculatedistance');
            btn.disabled = false;
            btn.style.backgroundColor = 'green';
            console.log('fin de fonction');
        }
		map.setView({ bounds: suggestionResult.bestView });
    }


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



  async function functionDisplaySteps() {
    
    document.getElementById('errorLabel').textContent = null;
  
    const button = document.getElementById('calculatedistance');
    button.disabled = true;
    button.style.backgroundColor = '#8bc09e';
  
    const [lat1, lon1] = CoordDep.split(',');
    const [lat2, lon2] = CoordArr.split(',');
  
    console.log('into function display step');
    let travelDistance;
  
    travelDistance = await DistanceCalculAPI(CoordDep, CoordArr);
  
    console.log('travelDistance value:', travelDistance);
  
    const coords = [
      new Microsoft.Maps.Location(lat1, lon1),
      new Microsoft.Maps.Location(lat2, lon2)
    ];
  
    if ((travelMode === 3 || travelMode === 4) && travelDistance === -1) {
      console.log('route impossible by train!');
      document.getElementById('errorLabel').textContent =
        'Error!, you can\'t use this travelMode for this route.';
      const dernierPushpin = pushpins.pop();
      const avantDernierPushpin = pushpins.pop();
      map.entities.remove(dernierPushpin);
      map.entities.remove(avantDernierPushpin);
      return;
    }
  
    if (travelMode === 3 || travelMode === 4) {
      const line = new Microsoft.Maps.Polyline(coords, {
        strokeColor: 'red',
        strokeThickness: 3,
        strokeDashArray: [4, 4]
      });
  
      map.entities.push(line);
  
      const r = new Route(villeDep, villeArr, lat1, lon1, lat2, lon2);
  
      travelDistance = Math.round(r.distance);
  
      totalDistance += Math.round(r.distance);
    } else {
      if (travelDistance === -1) {
        document.getElementById('errorLabel').textContent =
          'Error!, you can\'t use this travelMode for this route.';
        const dernierPushpin = pushpins.pop();
        const avantDernierPushpin = pushpins.pop();
        map.entities.remove(dernierPushpin);
        map.entities.remove(avantDernierPushpin);
        return;
      }
  
      totalDistance += Math.round(travelDistance);
  
      Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
  
        const seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `Start Step ${numberSteps}`, location: new Microsoft.Maps.Location(lat1, lon1) });
        directionsManager.addWaypoint(seattleWaypoint);
  
        const workWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `End Step ${numberSteps}`, location: new Microsoft.Maps.Location(lat2, lon2) });
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
  
        document.getElementById('searchBox').disabled = true;
        document.getElementById('searchBox2').disabled = true;
  
        CoordDep = CoordArr;
  
        createTextInput();
      });
    }
  
    if (travelMode === 3 || travelMode === 4) {
      document.getElementById('searchBox').disabled = true;
      document.getElementById('searchBox2').disabled = true;
  
      CoordDep = CoordArr;
  
      createTextInput();
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
  
    document.getElementById('step').innerHTML += `<div class="stepContent"><img src="${urlImage}"><p>Step ${numberSteps} ${villeDep}, ${villeArr} ${Math.round(travelDistance)} Km.</div>`;
  
    totalDistanceDiv.style.display = "block";
    totalDistanceDiv.innerHTML = `<p>Total Distance ${totalDistance} Km.`;
  }
  
  
  