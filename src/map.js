var CoordDep;
var CoordArr;

var map;
var directionsManager;

var numberSteps=0;

var villeDep;
var villeArr;

var totalDistance = 0;

var travelMode = 1;

var AutoSuggest = [];   

var totalDistanceDiv = document.getElementById('totaldistance');
totalDistanceDiv.style.display = "none";

document.getElementById('calculatedistance').disabled = true;

var pushpins = []

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
        
        manager2.attachAutosuggest('#searchBox2', '#searchBoxContainer', selectedSuggestion);

        AutoSuggest.push(manager);
        AutoSuggest.push(manager2);
        


    });

    function selectedSuggestion(suggestionResult) 
    {
        if (CoordDep == null)
        {
        CoordDep = suggestionResult.location.latitude + ',' + suggestionResult.location.longitude;
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        pushpins.push(pushpin);
        map.entities.push(pushpins[pushpins.length - 1]);
        villeDep = suggestionResult.formattedSuggestion;
        map.setView({ bounds: suggestionResult.bestView });
        }
        else
        {
        CoordArr = suggestionResult.location.latitude + ',' + suggestionResult.location.longitude;
        var pushpin = new Microsoft.Maps.Pushpin(suggestionResult.location);
        pushpins.push(pushpin);
        map.entities.push(pushpins[pushpins.length - 1]);
            ("selected.formatted : ");
        console.log(suggestionResult.formattedSuggestion);
        villeArr = suggestionResult.formattedSuggestion;
        numberSteps += 1;
        var btn = document.getElementById('calculatedistance');
        btn.disabled = false;
        btn.style.backgroundColor = 'green';
        console.log('fin de fonction');
        map.setView({ bounds: suggestionResult.bestView });
        }
    }



}


function attachAutosuggestToInput(inputId, containerId) {
    var options = {
        maxResults: 4,
        map: map
    };
    var manager = new Microsoft.Maps.AutosuggestManager(options);
    manager.attachAutosuggest('#' + inputId, '#' + containerId, selectedSuggestion);
    AutoSuggest.push(manager); // Ajouter le gestionnaire d'autosuggestion au tableau AutoSuggest
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
  


void function clearMap()
{
    map = new Microsoft.Maps.Map();
}

/*
function createTextInput() {
    // Créer un nouvel élément input de type "text"
    var inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "searchBox" + (AutoSuggest.length+1); // Changer l'ID pour qu'il soit unique
    console.log('longueur de ' + AutoSuggest.length);
    
    // Ajouter des attributs et des styles si nécessaire
    inputElement.placeholder = "Enter a city";
  
    // Récupérer le conteneur où l'on veut insérer l'input
    var container = document.getElementById("inputContainer");
  
    // Ajouter l'input à l'intérieur du conteneur
    container.appendChild(inputElement);
  
    // Créer un nouvel autosuggest manager pour le nouvel input
    var options = {
        maxResults: 4,
        map: map
    };
    var manager3 = new Microsoft.Maps.AutosuggestManager(options);
    manager.attachAutosuggest('#' + inputElement.id, '#searchBoxContainer', selectedSuggestion);
    AutoSuggest.push(manager3); // Ajouter le gestionnaire d'autosuggestion au tableau AutoSuggest
  }
  */


  function createTextInput() {
    // Créer un nouvel élément input de type "text"
    var inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "searchBox" + (AutoSuggest.length+1); // Changer l'ID pour qu'il soit unique
    
    // Ajouter des attributs et des styles si nécessaire
    inputElement.placeholder = "Enter a city";
  
    // Récupérer le conteneur où l'on veut insérer l'input
    var container = document.getElementById("inputContainer");
  
    // Ajouter l'input à l'intérieur du conteneur
    container.appendChild(inputElement);
  
    // Appeler la fonction d'attachement de l'autosuggestion pour le nouvel input
    attachAutosuggestToInput(inputElement.id, "searchBoxContainer");
    initializeAutosuggest(inputElement.id);
}
  

function initializeAutosuggest(inputId) {
    const suggestionList = document.getElementById("suggestionList");
    const inputElement = document.getElementById(inputId);

    // Créez un nouvel objet AutoSuggest pour la saisie automatique
    const autosuggestManager = new window.Microsoft.Maps.AutosuggestManager({ map: null });

    // Événement de suggestion
    autosuggestManager.addEventListener('autosuggest', function (event) {
        suggestionList.innerHTML = '';
        const suggestions = event.result.suggestions;
        suggestions.forEach(function (suggestion) {
            const listItem = document.createElement('li');
            listItem.textContent = suggestion.formattedSuggestion;
            suggestionList.appendChild(listItem);
        });
    });

    // Attachez l'événement de saisie pour mettre à jour les suggestions
    inputElement.addEventListener('input', function () {
        const query = inputElement.value;
        if (query.length > 0) {
            autosuggestManager.getSuggestions(query);
        } else {
            suggestionList.innerHTML = '';
        }
    });
}


async function functionDisplaySteps()
{


    document.getElementById('errorLabel').textContent = null;

    button = document.getElementById('calculatedistance');
    button.disabled = true;
    button.style.backgroundColor = '#8bc09e';

    var cord1 = CoordDep.split(',');
    var cord2 = CoordArr.split(',');

    console.log('into function display step');
    var travelDistance;

    travelDistance = await DistanceCalculAPI(CoordDep,CoordArr);

    console.log('travelDistance value :',travelDistance);

    
    var coords = [
        new Microsoft.Maps.Location(cord1[0],cord1[1]),
        new Microsoft.Maps.Location(cord2[0],cord2[1])
    ];

    if(travelMode === 3 || travelMode === 4 )
    {

        if(travelMode === 3 && travelDistance === -1)
        {
            console.log('route impossible by train!');
            document.getElementById('errorLabel').textContent = 'Error !, you can\'t use this travelMode for this route.';
            dernierPushpin = pushpins.pop(); // Supprimer le dernier pushpin
            avantDernierPushpin = pushpins.pop(); // Supprimer le deuxième dernier pushpin
            map.entities.remove(dernierPushpin); // Supprimer le dernier pushpin de la carte
            map.entities.remove(avantDernierPushpin); // Supprimer le deuxième dernier pushpin de la carte
            return;

        }

        var line = new Microsoft.Maps.Polyline(coords, {
            strokeColor: 'red',
            strokeThickness: 3,
            strokeDashArray: [4, 4]
        });
        
        map.entities.push(line);
        
        var r = new Route(villeDep,villeArr,cord1[0],cord1[1],cord2[0],cord2[1]);

        //document.getElementById('stepItinary').innerHTML+=`<br>Étape ${numberSteps} ${citySteps[0]}, ${citySteps[1]}, ${Math.round(r.Distance)} Km`;

        travelDistance = Math.round(r.distance);

        totalDistance+=Math.round(r.Distance);
        
    }
    else 
    {

        if(travelDistance === -1)
        {
            document.getElementById('errorLabel').textContent = 'Error !, you can\'t use this travelMode for this route.';
            dernierPushpin = pushpins.pop(); // Supprimer le dernier pushpin
            avantDernierPushpin = pushpins.pop(); // Supprimer le deuxième dernier pushpin
            map.entities.remove(dernierPushpin); // Supprimer le dernier pushpin de la carte
            map.entities.remove(avantDernierPushpin); // Supprimer le deuxième dernier pushpin de la carte
            return;
        }

        totalDistance+=Math.round(travelDistance);
    
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
            // Créez une instance du gestionnaire d'itinéraires.
            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
          
            

            coordArray = CoordDep.split(',');

            var seattleWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `Start Step ${numberSteps}`, location: new Microsoft.Maps.Location(coordArray[0],coordArray[1]) });
            directionsManager.addWaypoint(seattleWaypoint);
          
            coordArray = CoordArr.split(',');

            var workWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: `End Step ${numberSteps}`, location: new Microsoft.Maps.Location(coordArray[0],coordArray[1]) });
            directionsManager.addWaypoint(workWaypoint);

            directionsManager.calculateDirections();  

            var requestOptions = {
                routeMode: Microsoft.Maps.Directions.RouteMode.driving,
                maxRoutes: 1,
                optimizeWaypoints: true,
                routeDraggable:false,
                setMapBestView: true
             };


            directionsManager.setRequestOptions(requestOptions)

            var renderOptions = directionsManager.getRenderOptions();
          
            renderOptions.draggableRoutes = false;  

            renderOptions.routeIndex = 0;
            directionsManager.setRenderOptions(renderOptions);

            //document.getElementById('stepItinary').innerHTML+=`<br>Etape ${numberSteps} : ${citySteps[numberSteps-1]}, ${citySteps[numberSteps]} ${Math.round(travelDistance)} Km.`;
            
           document.getElementById('searchBox').disabled = true;
           document.getElementById('searchBox2').disabled = true;
            
        
            
        
            CoordDep = CoordArr;

            createTextInput();
           
        });
    }

    if(travelMode == 3 || travelMode == 4)
    {
        document.getElementById('searchBox').disabled = true;
        document.getElementById('searchBox2').disabled = true;
            
        
            
        
            CoordDep = CoordArr;

            createTextInput();
    }

    var urlImage;
    switch(travelMode)
    {
        case 1 : 
            urlImage = '/car.png';
            break;

        case 2 : 
            urlImage = '/bus.png';
            break;

        case 3 :
            urlImage = '/train.png';
            break;

        case 4 : 
            urlImage = '/plane.png';
            break;
    }

    console.log('urlImage : ',urlImage, 'travelMode : ',travelMode);

    document.getElementById('step').innerHTML += `<div class="stepContent"><img src="${urlImage}"><p>Step ${numberSteps} ${villeDep}, ${villeArr} ${Math.round(travelDistance)} Km.</div>`;

    totalDistanceDiv = document.getElementById('totaldistance');
    if(totalDistanceDiv.style.display === "none")
    {
        totalDistanceDiv.style.display = "block";      
    }
    totalDistanceDiv.innerHTML = `<p>Total Distance ${totalDistance} Km.`;

    
}

