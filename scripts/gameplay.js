/*jslint browser: true, white: true, plusplus: true */
/*global SPACE, console, KeyEvent, requestAnimationFrame, performance */
//
//			Base code by Dr. Mathias
//				Modified by Kenneth Parkinson
//
SPACE.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
		myMouse = SPACE.input.Mouse(),
		myKeyboard = SPACE.input.Keyboard(),
		myShip = null,
		missile1 = null,
		missile2 = null,
		missile3 = null,
		cancelNextRequest = false,
		activeObjects = [];
	
	function initialize() {
		console.log('game initializing...');
		//--------------------------------------------------
		// This is the Ship Object
		//--------------------------------------------------
		myShip = SPACE.graphics.ship( {
				image : SPACE.images['images/spaceship.png'],
				center : { x : 320, y : 213 },
				width : 30, height : 30,
				active : true, 			// if object should be displayed
				vector : 0,             // magnitude of the vector
				vectorx : 0,			// the x of vector
				vectory : 0,			// the y of vector
				lastx : 0,				// drift x
				lasty : 0, 				// drift y
				rotation : 0,			// radians going clock wise
				moveRate : 10,			// pixels per second
				rotateRate : 3.14159	// Radians per second
			});
		//---------------------------------------------------
		//	All 3 missiles
		//---------------------------------------------------
		missile1 = SPACE.graphics.missile( {
				image : SPACE.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 60, height : 60,
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				moveRate : 10,			// pixels per second
		});
		missile2 = SPACE.graphics.missile( {
				image : SPACE.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 60, height : 60,
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				moveRate : 10,			// pixels per second
		});
		
		missile3 = SPACE.graphics.missile( {
				image : SPACE.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 60, height : 60,
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				moveRate : 10,			// pixels per second
		});
		// Array of live objects on the field
		activeObjects = [];
		
		//---------------------------------------------------------------------
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myShip.rotateLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myShip.rotateRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myShip.accelerate);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, function() {
			//
			// Check missiles to see if they can be fired and fire first available missile
			if (missile1.active == false){
				missile1.fire();
			}
			else if (missile2.active == false){

			}
			else if ( missile3.active == false){

			}

		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			SPACE.game.showScreen('main-menu');
		});

		// Adding Ship to the active Objects array
		activeObjects.push(myShip);

	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		SPACE.elapsedTime = time - SPACE.lastTimeStamp;
		SPACE.lastTimeStamp = time;
		
		//--------------------------------------------------------------
		//  	Update Everything
		//--------------------------------------------------------------
		myShip.update();
		myKeyboard.update(SPACE.elapsedTime);
		//--------------------------------------------------------------
		//			Render Everything
		//--------------------------------------------------------------
		SPACE.graphics.clear();
		myShip.draw();
		for(var i = 0 ; i < activeObjects.length ; i++){
			if (activeObjects[i].active === true){
				activeObjects[i].draw();
			}
		}

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		SPACE.lastTimeStamp = performance.now();
		//--------------------------------------------------------------
		//	Here we can reset the game state to start a new game
		//--------------------------------------------------------------

		//
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());