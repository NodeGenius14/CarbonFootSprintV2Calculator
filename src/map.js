var listCoords = []

function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        /* No need to set credentials if already passed in URL */
        center: new Microsoft.Maps.Location(47.606209, -122.332071),
        zoom: 12
    });
    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
        var options = {
            maxResults: 4,
            map: map
        };
        var manager = new Microsoft.Maps.AutosuggestManager(options);
        var manager2 = new Microsoft.Maps.AutosuggestManager(options);
        manager.attachAutosuggest('#searchBox', '#searchBoxContainer', selectedSuggestion);
        manager2.attachAutosuggest('#searchBox2', '#searchBoxContainer2', selectedSuggestion2);

        


    });

    function selectedSuggestion(suggestionResult) {
        //map.entities.clear();

        // test
        listCoords.push(suggestionResult.location.latitude+','+suggestionResult.location.longitude)
        console.log("test : ",listCoords[0])

        map.setView({ bounds: suggestionResult.bestView });
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        map.entities.push(pushpin);
        document.getElementById('printoutPanel').innerHTML =
            'Suggestion: ' + suggestionResult.formattedSuggestion +
            '<br> Lat: ' + suggestionResult.location.latitude +
            '<br> Lon: ' + suggestionResult.location.longitude;
    }
    function selectedSuggestion2(suggestionResult) {

        listCoords.push(suggestionResult.location.latitude+','+suggestionResult.location.longitude)
        //map.entities.clear();
        map.setView({ bounds: suggestionResult.bestView });
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        map.entities.push(pushpin);
        document.getElementById('printoutPanel2').innerHTML =
            'Suggestion: ' + suggestionResult.formattedSuggestion +
            '<br> Lat: ' + suggestionResult.location.latitude +
            '<br> Lon: ' + suggestionResult.location.longitude;
    }
}


async function CalculateDistance()
{

    //listCoords.forEach(val => console.log(val))
    //console.log("end")

    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${listCoords[0]}&destinations=${listCoords[1]}&travelMode=driving&key=Au3StwO6PwFS37gtE-52dLcOhomBX4tBcN_CZo7KZqP82ymvB9WHWh8Sjm2qs-m-`;

    //console.log(url)

    // const response = await fetch(url,{method:"GET"})

    console.log(url)

    fetch(url)
        .then(response => response.json()
        .then(data => 
            {
                //console.log(data);
                const travelDistance = data.resourceSets[0].resources[0].results[0].travelDistance;
                console.log('Distance entre les deux points :', travelDistance);

                if(travelDistance === -1)
                {
                    resultdistance.textContent = "Trajet Impossible !!!";

                }
                else resultdistance.textContent = "Distance entre les villes : " + travelDistance + "km";

            }))
        
        .catch(error => 
            {
                console.log(error);
            });

}