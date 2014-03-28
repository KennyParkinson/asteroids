/*jslint browser: true, white: true, plusplus: true */
/*global SPACEGAME, console, KeyEvent, requestAnimationFrame, performance */
//
//			Base code by Dr. Mathias
//				Modified by Kenneth Parkinson
//
SPACEGAME.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
		myMouse = SPACEGAME.input.Mouse(),
		myKeyboard = SPACEGAME.input.Keyboard(),
		myShip = null,
		missile1 = null,
		missile2 = null,
		missile3 = null,
		missile4 = null,
		bigAsteroid1 = null,
		bigAsteroid2 = null,
		midAsteroid1 = null,
		midAsteroid2 = null,
		midAsteroid3 = null,
		cancelNextRequest = false,
		missiles = [],
		asteroids = [],
		lastfire = 0
	
	function initialize() {
		console.log('game initializing...');
		//--------------------------------------------------
		// This is the Ship Object
		//--------------------------------------------------
		myShip = SPACEGAME.graphics.ship( {
				image : SPACEGAME.images['images/spaceship.png'],
				center : { x : 250, y : 250 },
				width : 30, height : 30,
				active : true, 			// if object should be displayed
				vector : 0,             // magnitude of the vector
				vectorx : 0,			// the x of vector
				vectory : 0,			// the y of vector
				lastx : 0,				// drift x
				lasty : 0, 				// drift y
				rotation : 0,			// radians going clock wise
				moveRate : .001,			// pixels per second
				rotateRate : 3.14159	// Radians per second
			});
		//---------------------------------------------------
		//	All 3 missiles
		//---------------------------------------------------
		var missilespeed = 4;
		missile1 = SPACEGAME.graphics.missile( {
				image : SPACEGAME.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 10, height : 10,
				lifetime : 0,			// time to check against performance.now() for lifetime
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				moveRate : missilespeed,			// pixels per second
		});

		missile2 = SPACEGAME.graphics.missile( {
				image : SPACEGAME.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 10, height : 10,
				lifetime : 0,			// time to check against performance.now() for lifetime
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				moveRate : missilespeed,			// pixels per second
		});
		
		missile3 = SPACEGAME.graphics.missile( {
				image : SPACEGAME.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 10, height : 10,
				lifetime : 0,			// time to check against performance.now() for lifetime
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				moveRate : missilespeed,			// pixels per second
		});

		missile4 = SPACEGAME.graphics.missile( {
				image : SPACEGAME.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 10, height : 10,
				lifetime : 0,			// time to check against performance.now() for lifetime
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				moveRate : missilespeed,			// pixels per second
		});

		bigAsteroid1 = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/bigasteroid.png'],
				center : { x : 0, y : 250 },
				width : 100, height : 100,
				active : true, 			// if object should be displayed
				rotation : Math.PI,			// radians going clock wise
				moveRate : .1,		// pixels per second
				rotateRate : 3.14159	// Radians per second
		});
		bigAsteroid2 = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/bigasteroid.png'],
				center : { x : 250, y : 100 },
				width : 100, height : 100,
				active : true, 			// if object should be displayed
				rotation : Math.PI /4,			// radians going clock wise
				moveRate : .1,		// pixels per second
				rotateRate : 3.14159	// Radians per second
		});
		midAsteroid1 = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/middleasteroid.png'],
				center : { x : 1, y : 1 },
				width : 100, height : 100,
				active : true, 			// if object should be displayed
				rotation : Math.PI /6,			// radians going clock wise
				moveRate : .1,		// pixels per second
				rotateRate : 3.14159	// Radians per second
		});
		midAsteroid2 = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/middleasteroid.png'],
				center : { x : 350, y : 5 },
				width : 100, height : 100,
				active : true, 			// if object should be displayed
				rotation : Math.PI * 3,			// radians going clock wise
				moveRate : .1,		// pixels per second
				rotateRate : 3.14159	// Radians per second
		});
		midAsteroid3 = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/middleasteroid.png'],
				center : { x : 0 , y : 350 },
				width : 100, height : 100,
				active : true, 			// if object should be displayed
				rotation : Math.PI * 6,			// radians going clock wise
				moveRate : .1,		// pixels per second
				rotateRate : 3.14159	// Radians per second
		});


		// Arrays of objects on the field
		missiles = [];
		asteroids = [];
		
		//---------------------------------------------------------------------
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myShip.rotateLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myShip.rotateRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myShip.accelerate);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_F, function () {
			// enough time has elapsed since last missile fire
			if (performance.now() > lastfire + 150){
				//
				// Check missiles to see if they can be fired and fire first available missile

				if (missile1.fired() === false){
					lastfire = performance.now();
					missile1.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					console.log("launch missile 1");
				}
				else if (missile2.fired() === false){
					lastfire = performance.now();
					missile2.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					console.log("launch missile 2");
				}
				else if ( missile3.fired() === false){
					lastfire = performance.now();
					missile3.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					console.log("launch missile 3");
				}
				else if ( missile4.fired() === false){
					lastfire = performance.now();
					missile4.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					console.log("launch missile 4");
				}
				else{console.log("all missiles fired");}
			}
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function () {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			SPACEGAME.game.showScreen('main-menu');
		});

		// Adding missiles to missles to the active Objects array
		missiles.push(missile1);
		missiles.push(missile2);
		missiles.push(missile3);
		missiles.push(missile4);
		// Adding asteroids to array
		asteroids.push(bigAsteroid1);
		asteroids.push(bigAsteroid2);
		asteroids.push(midAsteroid1);
		asteroids.push(midAsteroid2);
		asteroids.push(midAsteroid3);

	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		SPACEGAME.elapsedTime = time - SPACEGAME.lastTimeStamp;
		SPACEGAME.lastTimeStamp = time;
		
		//--------------------------------------------------------------
		//  	Update Everything
		//--------------------------------------------------------------

		myKeyboard.update(SPACEGAME.elapsedTime);
		myShip.update();
		// updating active missiles
		for(var i = 0 ; i < missiles.length ; i++){
			if (missiles[i].fired() === true){
				missiles[i].update();
			}
		}
		// updating active asteroids
		for(var i = 0 ; i < asteroids.length ; i++){
				asteroids[i].update();
		}

		//--------------------------------------------------------------
		//			Render Everything
		//--------------------------------------------------------------
		SPACEGAME.graphics.clear();
		myShip.draw();
		// drawing active missiles
		for(var i = 0 ; i < missiles.length ; i++){
			if (missiles[i].fired() === true){
				missiles[i].draw();
			}
		}
		// drawing active asteroids
		for(var i = 0 ; i < asteroids.length ; i++){
			if (asteroids[i].destroyed() !== false){
				asteroids[i].draw();
			}
		}

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		SPACEGAME.lastTimeStamp = performance.now();
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