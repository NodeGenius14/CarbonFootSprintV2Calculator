var listCoords = []

var map;
var directionsManager;

var numberSteps=0;
var citySteps = []

var totalDistance = 0;

var travelMode = 1;

function loadMapScenario() 
{
       
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        /* No need to set credentials if already passed in URL */
        center: new Microsoft.Maps.Location(48.86666,  2.333333),
        zoom: 5
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
        
        while(listCoords.lenght > 0)
        {listCoords.pop();}

        listCoords.push(suggestionResult.location.latitude+','+suggestionResult.location.longitude)
    

        map.setView({ bounds: suggestionResult.bestView });
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        map.entities.push(pushpin);
        
        /*
        document.getElementById('printoutPanel').innerHTML =
            'Suggestion: ' + suggestionResult.formattedSuggestion +
            '<br> Lat: ' + suggestionResult.location.latitude +
            '<br> Lon: ' + suggestionResult.location.longitude;

        */
        citySteps.push(suggestionResult.formattedSuggestion);
        
        
    }


    function selectedSuggestion2(suggestionResult) {


        document.getElementById('searchBox2').value = suggestionResult.formattedSuggestion;


        listCoords.push(suggestionResult.location.latitude+','+suggestionResult.location.longitude)
        
        console.log(listCoords[1])

        //map.entities.clear();
        map.setView({ bounds: suggestionResult.bestView });
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        map.entities.push(pushpin);
        
        /*document.getElementById('printoutPanel2').innerHTML =
            'Suggestion: ' + suggestionResult.formattedSuggestion +
            '<br> Lat: ' + suggestionResult.location.latitude +
            '<br> Lon: ' + suggestionResult.location.longitude;
        
        */
        console.log("selected.formatted : ");
        console.log(suggestionResult.formattedSuggestion);

        citySteps.push(suggestionResult.formattedSuggestion);
        numberSteps+=1;

        console.log('fin de fonction')

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


async function DistanceCalculAPI(coord1,coord2)
{

    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${coord1}&destinations=${coord2}&travelMode=driving&key=Au3StwO6PwFS37gtE-52dLcOhomBX4tBcN_CZo7KZqP82ymvB9WHWh8Sjm2qs-m-`;

    fetch(url)
        .then(response => response.json())
        .then(data =>{

            const travelDistance = data.resourceSets[0].resources[0].results[0].travelDistance;

            //console.log('Distance entre les deux points :', travelDistance);

            return travelDistance;

        })
        .catch(error => 
            {
                console.log(error);
                return -10;
            });
}


void function clearMap()
{
    map = new Microsoft.Maps.Map();
}


async function functionDisplaySteps()
{

    var travelDistance;

    if(travelMode === 4)
    {
        var r = new Route(citySteps[0],citySteps[1],cord1[0],cord1[1],cord2[0],cord2[1]);
        travelDistance = r.CalculateDistance();
        totalDistance+=travelDistance;
    }
    else travelDistance = DistanceCalculAPI(listCoords[0],listCoords[1]);

    if(travelDistance === - 10)
    {
        // to do later display error message
        // error with API
        console.log('');
    }
    return;

    
}


async function CalculateDistance()
{

    //listCoords.forEach(val => console.log(val))
    //console.log("end")

    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${listCoords[0]}&destinations=${listCoords[1]}&travelMode=driving&key=Au3StwO6PwFS37gtE-52dLcOhomBX4tBcN_CZo7KZqP82ymvB9WHWh8Sjm2qs-m-`;


    console.log('\n\n');
    console.log(url)

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

                    //resultdistance.textContent = "Trajet en avion !!!";
                    var cord1 = listCoords[0].split(',');
                    var cord2 = listCoords[1].split(',');


                    var coords = [
                        new Microsoft.Maps.Location(cord1[0],cord1[1]),
                        new Microsoft.Maps.Location(cord2[0],cord2[1])
                    ];
                    

                    console.log("affichage coords");
                    coords.forEach(v => console.log(v));
                    
                    var line = new Microsoft.Maps.Polyline(coords, {
                        strokeColor: 'red',
                        strokeThickness: 3,
                        strokeDashArray: [4, 4]
                    });
                    
                    map.entities.push(line);
                    
                    var r = new Route(citySteps[0],citySteps[1],cord1[0],cord1[1],cord2[0],cord2[1]);

                    document.getElementById('stepItinary').innerHTML+=`<br>Étape ${numberSteps} ${citySteps[0]}, ${citySteps[1]}, ${Math.round(r.Distance)} Km`;

                    totalDistance+=Math.round(r.Distance);
                    
                }
                else
                {

                    //resultdistance.textContent = "Distance entre les villes : " + travelDistance + "km";
                                        
                map.entities.clear()

                totalDistance+=travelDistance;

                
                Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                    // Créez une instance du gestionnaire d'itinéraires.
                    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
                  
                    // location: new Microsoft.Maps.Location(listCoords[0])

                    coordArray = listCoords[0].split(',');

                    var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `Départ Étape ${numberSteps}`, location: new Microsoft.Maps.Location(coordArray[0],coordArray[1]) });
                    directionsManager.addWaypoint(seattleWaypoint);
                  
                    coordArray = listCoords[1].split(',');

                    var workWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `Destination Étape ${numberSteps}`, location: new Microsoft.Maps.Location(coordArray[0],coordArray[1]) });
                    directionsManager.addWaypoint(workWaypoint);

                    directionsManager.calculateDirections();  

                    var requestOptions = {
                        routeMode: Microsoft.Maps.Directions.RouteMode.driving,
                        maxRoutes: 1,
                        optimizeWaypoints: true,
                        routeDraggable:false
                     };


                    directionsManager.setRequestOptions(requestOptions)

                    var renderOptions = directionsManager.getRenderOptions();
                  
                    renderOptions.draggableRoutes = false;  

                    renderOptions.routeIndex = 0;
                    directionsManager.setRenderOptions(renderOptions);

                    document.getElementById('stepItinary').innerHTML+=`<br>Etape ${numberSteps} : ${citySteps[numberSteps-1]}, ${citySteps[numberSteps]} ${Math.round(travelDistance)} Km.`;
                  
                    
                    var input = document.getElementById('searchBox');
                    input.value = citySteps[numberSteps];
                    input.disabled = true;
        
                    
                    var input = document.getElementById('searchBox2');
                    input.value = "";
        
        
                    listCoords[0] = listCoords[1];
                    listCoords.length = 1;

                  });
                  
                } 

                    document.getElementById('totaldistance').textContent = `${Math.round(totalDistance)} Kilomètres`;
                    
                
            
            }))

        .catch(error => 
            {
                console.log(error);
            });

        

           

}