
/******************************************************/
/* @author Arthur Lecomte <arthurlecomtefr@gmail.com> */
/*   & Baptiste Dudonné <bapt.14@hotmail.com> 		  */
/******************************************************/ 	

class Vue
{
	constructor (ctrl,map)
	{
		//Connexion avec le controleur
		this.ctrl = ctrl;

		this.nbInput     = 		  0 ;
		this.tabPins     = 		 [] ;
		this.travelMode  = "car" ;
		this.tabLocation = 		 [] ;
		this.map		 = 		map ; 

		//Options BING
		this.optionsAutoSuggest = 
			{
				maxResults: 4,
				map: this.map
			}

		this.directionsOptionRequest = null;
		this.directionsRenderOptions = null;
			

		this.count 		=		  0	;
		
			/*-----------------------------*/
			/* Création des Controles      */
			/*-----------------------------*/


		this.btnCalculate 		   = document.getElementById  			( 'calculatedistance' 		);
		this.btnCalculateContent   = document.querySelector	 			( "#calculatedistance div" 	);
		this.btnNewInput  		   = document.getElementById  			( 'newInput'	      		);
		this.btnTravelMode		   = document.querySelectorAll			( '.travelMode button'		);
		this.divSteps     		   = document.getElementById  			( 'step'			   		);
		this.divTotalDistance	   = document.getElementById			( 'totaldistance'			);
		this.searchBoxContainer    = document.getElementById  			( 'searchBoxContainer'		);
		this.errorLabel			   = document.getElementById  			( 'errorLabel'				);
		this.btnResultRedirect	   = document.getElementById			( 'redirectButton'			);
		this.classTravelMode	   = document.getElementsByClassName	( 'travelMode'				);	

			

			/*-----------------------------*/
			/* Activation des Controles    */
			/*-----------------------------*/
			

		this.btnCalculate.addEventListener('click', () =>
		{
			console.log("click btnCalculate");
			this.btnCalculateContent.classList.toggle("loading");
			this.btnCalculate.disabled = true;
			
			if (this.travelMode ==="train" || this.travelMode ==="plane"){this.calculateCrowFlies();}
			else {this.calculateByRoad()}

		});

		this.btnNewInput.addEventListener('click', () =>
		{
			this.createTextInput();
			this.btnNewInput.disabled = true;

		});

		this.btnTravelMode.forEach( ( button ) => 
		{
			button.addEventListener( 'click' , () => 
			{
				this.changeTravelMode( button );
			});

		});	

		this.btnResultRedirect.addEventListener('click', (e) =>
		{
			e.preventDefault();
			window.location.href = "/result";
			this.ctrl.getModele.sendData();
			
		});
		
		
	}

		/*-----------------------------*/
		/* Getters & Setters           */
		/*-----------------------------*/

	get getNbInput				    () { return this.nbInput 				  ;}
	set setStateBtnCalculate ( state ) 
	{ 
		this.btnCalculate.disabled              = !state 					   ;
		this.btnCalculate.style.backgroundColor = 'green'					   ;
	}
	set setMap				   ( map ) { this.map = map					      ;}

	
	createTextInput() 
	{
		this.nbInput++;
		const inputElement       = document.createElement ( "input" ) ;
		inputElement.type 		 = 						    "search"  ;
		inputElement.id 		 = "searchBox" + ( this.nbInput     ) ;
		inputElement.placeholder = 					"Enter a city"    ;
		  
		this.searchBoxContainer.appendChild	    ( inputElement      ) ;
		this.      attachAutosuggestToInput     ( inputElement.id   ) ;
	}

	attachAutosuggestToInput(inputId) {
		const manager = new Microsoft.Maps.AutosuggestManager(this.optionsAutoSuggest); // Create manager
		const self = this; // Store a reference to "this" to use within the callback
	
		manager.attachAutosuggest('#' + inputId, '#searchBoxContainer', function( result ) 
		{
			self.ctrl.getModele.selectedSuggestion(result.formattedSuggestion, result.location.latitude, result.location.longitude);
		});
	this.searchBoxContainer.scrollTop = this.searchBoxContainer.scrollHeight;

	this.btnResultRedirect.style.display = "none";

		
	}
	ajouterPushpin(ville, latitude, longitude)
	{
		

		this.tabLocation.push( new Microsoft.Maps.Location( latitude,  longitude 						) );
		let pin 			=  new Microsoft.Maps.Pushpin ( this.tabLocation [ this.tabLocation.length-1 ] , 
		{
			title: ville,
			text: ""+( this.tabPins.length+1 ),
			color: Microsoft.Maps.Color.fromHex( '#660000' )
		});


		this.map.entities.push( pin );										//Ajout du pushpin sur la carte
		this.tabPins.push( pin );											//Ajout du pushpin dans le tableau pour le supprimer si besoin
		
		if(this.tabLocation.length === 1){this.map.setView({ center: this.tabLocation [ this.tabLocation.length-1 ], zoom: 5 });}		//Vue sur la derniere location}
		
		else
		{
		let locs = 									this.tabLocation ;
		let rect = Microsoft.Maps.LocationRect.fromLocations( locs ) ;

		map.setView({ bounds: rect, padding: 80 }) ;

		this.btnResultRedirect.style.display = "none";
		}

		//Vue sur toutes les locations
		
		this.count++
	}

	retirerPushpin()	
	{
		map.entities.remove( this.tabPins.pop() ) ;
		this.count--							  ;
	}


	changeTravelMode( selectedButton )
	{	
		this.btnTravelMode.forEach( function( button ) 
		{
				button.classList.remove('selected');
		});

		selectedButton.classList.add('selected') ;
		this.travelMode 	 = selectedButton.id.substring(3).toLowerCase() ;

	}


	calculateByRoad()
	{
		let tabRoute = this.ctrl.getModele.getTabRoute ;
		let cptR     = tabRoute.length				   ;
		let self 	 = this							   ;
				let directionsManager = new Microsoft.Maps.Directions.DirectionsManager(this.map);

				Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated',  (e) => 
				{
					let routeIdx 			       = directionsManager.getRequestOptions().routeIndex ;		// Recupere idx de la route
					tabRoute[ cptR-1 ].setDistance = e.routeSummary[ routeIdx ].distance    		  ;		// Recuperation de la distance calculé
					self.ctrl.getModele.incrTotalDistance( tabRoute[cptR-1].getDistance )		      ;		// Ajoute la distance au total
					 
					this.resetCalculateBtn		   ();		// Reset L'animation
					this.afficherStep	 		   ();		// Afficher l'étape
					this.btnNewInput.disabled = false;		// Peut creer un nouvel input
					this.btnNewInput.style.backgroundColor = '#3498db';	//couleur du bonton qui cree un nouvel input
	
				});

				Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', (args) => 
				{
					this.errorDistance();
					

				});

				const startStep = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(tabRoute[cptR-1].getLatD, tabRoute[cptR-1].getLongD) });
				const endStep   = new Microsoft.Maps.Directions.Waypoint({ location: new Microsoft.Maps.Location(tabRoute[cptR-1].getLatA, tabRoute[cptR-1].getLongA) });
				
				directionsManager.addWaypoint( startStep );
				directionsManager.addWaypoint(   endStep );
				directionsManager.calculateDirections   ();		//Calcul de la route

				directionsManager.setRequestOptions( this.directionsOptionRequest );	
				directionsManager.setRenderOptions ( this.directionsRenderOptions );

				//For each input set disable



			
	}

	errorDistance()
	{
		this.resetCalculateBtn();
		this.errorLabel.textContent =   "Error Distance";
		let lgt       				= this.ctrl.getModele.getTabRoute.length		; //Tableau de route Length
		let tabRoute  				= this.ctrl.getModele.getTabRoute				;
		let lastInput 				= document.getElementById('searchBox'+ (lgt+1)) ;
		
		/*Animations*/
		lastInput.classList.add('shake-animation');
		this.btnTravelMode.forEach( function( button )
		{
			button.classList.add('shake-animation');
		});
		
		setTimeout(() => 
		{
			lastInput.classList.remove('shake-animation');
			this.btnTravelMode.forEach( function( button )
			{
				button.classList.remove('shake-animation');

			})
		}, 500);
		lastInput.value = ""		;
		lastInput.disabled = false  ;
		lastInput.focus()			;	

		//retirer le dernier pushpin
		map.entities.remove( this.tabPins.pop() );
		if (lgt > 1)
		{
			this.ctrl.getModele.getTabRoute.pop();
		}
		else {
			console.log("Dans le elseztzztt")
			tabRoute[0].setVilleA     = null  ;
			tabRoute[0].setLatitudeA  = null  ;
			tabRoute[0].setLongitudeA = null  ;
			tabRoute[0].setComplete   = false ;
	
			
			}
			this.btnCalculate.disabled = true;
			this.btnNewInput.disabled  = true;
	}

	calculateCrowFlies ()	//Calcul de la distance à vol d'oiseau
	{
		//Reset le label erreur
		this.errorLabel.textContent = ""  ;		// Reset le label Erreur
		this.btnCalculate.disabled = true ;		// desactivation btnCalculer
		this.resetCalculateBtn		   () ;		// Reset l'animation
		this.btnNewInput.disabled = false ;		// Activation du btn Add Steps

		let tabRoutes = this.ctrl.getModele.getTabRoute;
		
		
		
		console.log( tabRoutes[ tabRoutes.length-1 ].toString () )
		const coords = 
		[
			new Microsoft.Maps.Location( tabRoutes[ tabRoutes.length-1 ].getLatD, tabRoutes[ tabRoutes.length-1 ].getLongD ),
			new Microsoft.Maps.Location( tabRoutes[ tabRoutes.length-1 ].getLatA, tabRoutes[ tabRoutes.length-1 ].getLongA )		
		];

		const line = new Microsoft.Maps.Polyline( coords, 
			{
				strokeColor     :  'red' ,
				strokeThickness : 	   3 ,
				strokeDashArray : [ 4, 4 ]

			} );

			tabRoutes [ tabRoutes.length-1 ].calculateDistance();									//Calcul à vol d'oiseau
			this.ctrl.getModele.incrTotalDistance( tabRoutes [ tabRoutes.length-1 ].getDistance );	//incrémention de totalDistance

			this.map.entities.push( line ) ;														//Ajout de la ligne sur la carte
			this.afficherStep   	    () ;														//Affichage des étapes et de la distance total

		
	}
	afficherStep()
	{
		let tabRoute	  = this.ctrl.getModele.getTabRoute		    	   ;
		let step 		  = tabRoute.length						   	       ;
		let villeD		  = tabRoute[tabRoute.length-1].getVilleD   	   ;
		let villeA		  = tabRoute[tabRoute.length-1].getVilleA   	   ;
		let distance	  = tabRoute[tabRoute.length-1].getDistance 	   ;
		let totalDistance = this.ctrl.getModele.getTotalDistance 		   ;
		let urlImage 	  = null
		
		
		tabRoute[ tabRoute.length-1 ].setTravelMode = this.travelMode ;
		

		console.log("travelMode" + this.travelMode)
		console.log(`<div class="stepContent"><img src="/${ this.travelMode }.png><p>Step ${ step } <br> ${ villeD } ➜ ${ villeA } <br> ${ Math.round( distance ) } Km.</div>` )

		this.divSteps.innerHTML += `<div class="stepContent"><img src="/${this.travelMode}.png"><p>Step ${step} <br> ${villeD} ➜ ${villeA} <br> ${Math.round(distance)} Km.</div>`;
		this.divTotalDistance.style.display = "block" 																												    ;
		this.divTotalDistance.innerHTML     = `<p>Total Distance ${Math.round(totalDistance)} Km.` 																		;
		this.divSteps.scrollTop = this.divSteps.scrollHeight;

		this.btnResultRedirect.style.display = "block";
	}


	//Annulation Bouton de chargement pour le calcul de distance
	resetCalculateBtn () 
	{ 
		this.btnCalculateContent.classList.toggle( "loading" ) ; 
		this.btnCalculate.disabled = true					   ;
		this.btnCalculate.style.backgroundColor = '#8bc09e'	   ;
	}

	
	
	init () 
	{
		Microsoft.Maps.loadModule( 'Microsoft.Maps.AutoSuggest', () => 
		{
			this.createTextInput ();
			this.createTextInput ();
			document.getElementById("searchBox2").disabled = true;
		});

		Microsoft.Maps.loadModule('Microsoft.Maps.Directions',   () => 
			{
				console.log("Initialisé")
				this.directionsOptionRequest =
				{
					routeMode: Microsoft.Maps.Directions.RouteMode.driving,
					maxRoutes: 1,
					optimizeWaypoints: true,
					routeDraggable: false
				}
				this.directionsRenderOptions =
				{
					draggableRoutes: false,
					waypointPushpinOptions:{visible:false}
				}
			});
		
	}
}
