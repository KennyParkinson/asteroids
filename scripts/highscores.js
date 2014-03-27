/*jslint browser: true, white: true, plusplus: true */
/*global SPACEGAME */
SPACEGAME.screens['high-scores'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
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
