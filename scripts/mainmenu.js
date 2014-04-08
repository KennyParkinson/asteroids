  /*jslint browser: true, white: true, plusplus: true */
/*global SPACEGAME */
//
//		Base code Courtesy of Dr. Mathias
//         Modified by Kenneth Parkinson
//
//
SPACEGAME.screens['main-menu'] = (function() {
	'use strict';
	
	function initialize() {
		//
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() { 
				SPACEGAME.game.showScreen('game-play');
				SPACEGAME.game.gamestart();
				 },
			false);

		document.getElementById('id-continue').addEventListener(
			'click',
			function() { SPACEGAME.game.showScreen('game-play'); },
			false);
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { SPACEGAME.game.showScreen('high-scores'); },
			false);
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { SPACEGAME.game.showScreen('help'); },
			false);
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { SPACEGAME.game.showScreen('about'); },
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
