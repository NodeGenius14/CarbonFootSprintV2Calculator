//require Route
route = require('./route.js');

var tabAutoSuggest = [];   
var tabPushpins = []
var tabRoute = [];
var CoordDep = null;

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
        if (CoordDep == null)
        {
			tabRoute.push(new Route(suggestionResult.formattedSuggestion,null,suggestionResult.location.latitude,suggestionResult.location.longitude,null,null))
        CoordDep = suggestionResult.location.latitude + ',' + suggestionResult.location.longitude;
        villeDep = suggestionResult.formattedSuggestion;
        
        }
        else
        {
			tabRoute[length-1].setVilleA(suggestionResult.formattedSuggestion);
			tabRoute[length-1].setlatitudeA(suggestionResult.location.latitude);
			tabRoute[length-1].setlongitudeA(suggestionResult.location.longitude);
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