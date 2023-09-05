/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	





function loadMap() {
    console.log("loadMap");
    map = new Microsoft.Maps.Map('#myMap', {
        center: new Microsoft.Maps.Location(48.86666, 2.333333),
        zoom: 5,
        liteMode: true,
        mapTypeId: Microsoft.Maps.MapTypeId.road, // Type de carte (route, aérien, etc.)
        showZoomButtons: true,
		showDashboard: false
		});

    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
        optionAutoSuggestions = {
            maxResults: 4,
            map: map
        }
    });

    ctrl = new Controleur(map);
    ctrl.getVue.init();
}
