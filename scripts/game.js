/*jslint browser: true, white: true, plusplus: true */
/*global SPACE */
// ------------------------------------------------------------------
// 				Base code courtesy of Dr. Mathias
//						Modified by Kenneth Parkinson
//
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------


SPACE.game = (function() {
	'use strict';
	
	function showScreen(id) {
		var screen = 0,
			screens = null;
		//
		// Remove the active state from all screens.  There should only be one...
		screens = document.getElementsByClassName('active');
		for (screen = 0; screen < screens.length; screen ++) {
			screens[screen].classList.remove('active');
		}
		//
		// Tell the screen to start actively running
		SPACE.screens[id].run();
		//
		// Then, set the new screen to be active
		document.getElementById(id).classList.add('active');
	}

	//------------------------------------------------------------------
	//
	// This function performs the one-time game initialization.
	//
	//------------------------------------------------------------------
	function initialize() {
		var screen = null;
		//
		// Go through each of the screens and tell them to initialize
		for (screen in SPACE.screens) {
			if (SPACE.screens.hasOwnProperty(screen)) {
				SPACE.screens[screen].initialize();
			}
		}
		
		//
		// Make the main-menu screen the active one
		showScreen('main-menu');
	}
	
	return {
		initialize : initialize,
		showScreen : showScreen
	};
}());
