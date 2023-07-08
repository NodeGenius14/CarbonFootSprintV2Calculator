var listxCoords = []
var listyCoords = []
var map;
var directionsManager;

function loadMapScenario() 
{
       
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        /* No need to set credentials if already passed in URL */
        center: new Microsoft.Maps.Location(49.182451, -0.374625),
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
        
        while(listxCoords.length > 0)
        {
            listxCoords.pop();
        }

        
        while(listyCoords.length > 0)
        {
            listyCoords.pop();
        }

        listxCoords.push(suggestionResult.location.latitude)
        listyCoords.push(suggestionResult.location.longitude)
        

        console.log("coordonénes 1 :",listxCoords[0],',',listyCoords[1])

        //console.log("test : ",listCoords[0])

        map.setView({ bounds: suggestionResult.bestView });
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        map.entities.push(pushpin);
        document.getElementById('printoutPanel').innerHTML =
            'Suggestion: ' + suggestionResult.formattedSuggestion +
            '<br> Lat: ' + suggestionResult.location.latitude +
            '<br> Lon: ' + suggestionResult.location.longitude;
    }
    function selectedSuggestion2(suggestionResult) {

        listxCoords.push(suggestionResult.location.latitude)
        listyCoords.push(suggestionResult.location.longitude)


        console.log("coordonénes 1 :",listxCoords[0],',',listyCoords[1])
        
       // listCoords.push(suggestionResult.location.latitude+','+suggestionResult.location.longitude)
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

    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${listxCoords[0]+','+listyCoords[0]}&destinations=${listxCoords[1]+','+listyCoords[1]}&travelMode=driving&key=Au3StwO6PwFS37gtE-52dLcOhomBX4tBcN_CZo7KZqP82ymvB9WHWh8Sjm2qs-m-`;

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


                    var coords = [
                        new Microsoft.Maps.Location(listxCoords[0], listyCoords[0]),
                        new Microsoft.Maps.Location(listxCoords[1], listyCoords[1])
                    ];
                    
                    coords.forEach(v => console.log(v));
                    
                    var line = new Microsoft.Maps.Polyline(coords, {
                        strokeColor: 'red',
                        strokeThickness: 3,
                        strokeDashArray: [4, 4]
                    });
                    
                    map.entities.push(line);
                    
                }
                else
                {
                    resultdistance.textContent = "Distance entre les villes : " + travelDistance + "km";
                    
                    
                map.entities.clear()

                Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                    // Créez une instance du gestionnaire d'itinéraires.
                    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
                  
                    var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: 'Départ', location: new Microsoft.Maps.Location(listxCoords[0], listyCoords[0]) });
                    directionsManager.addWaypoint(seattleWaypoint);
                  
                    var workWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: 'Destination', location: new Microsoft.Maps.Location(listxCoords[1], listyCoords[1]) });
                    directionsManager.addWaypoint(workWaypoint);
                  
                    // Calculez les directions.
                    directionsManager.calculateDirections();
                  

                    var requestOptions = {
                        routeMode: Microsoft.Maps.Directions.RouteMode.driving,
                        maxRoutes: 1,
                        optimizeWaypoints: true,
                        routeDraggable:false
                        // Autres options de requête...
                      };


                    directionsManager.setRequestOptions(requestOptions)

                    // Obtenez l'objet DirectionsRenderOptions.
                    var renderOptions = directionsManager.getRenderOptions();
                  
                    // Désactivez la fonctionnalité de glisser-déposer pour modifier l'itinéraire.
                    renderOptions.draggableRoutes = false;  

                    renderOptions.routeIndex = 0;
                    directionsManager.setRenderOptions(renderOptions);



                  });
                  
                    
                } 
            }))
        
        .catch(error => 
            {
                console.log(error);
            });

}