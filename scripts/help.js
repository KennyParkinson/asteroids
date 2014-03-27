/*jslint browser: true, white: true, plusplus: true */
/*global SPACEGAME */
// Base code courtesy of Dr. Mathias
//		Modified by Kenneth Parkinson
//
SPACEGAME.screens['help'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-help-back').addEventListener(
			'click',
			function() { SPACEGAME.game.showScreen('main-menu'); },
			false);
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
