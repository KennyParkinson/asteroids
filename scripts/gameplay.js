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
		lastfire = 0,
		level = 1,
		canvas = document.getElementById('canvas-main')
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
				active : true, 	
				velocity : {x : 0, y : 0 },		// if object should be displayed
				vector : 0,             // magnitude of the vector
				vectorx : 0,			// the x of vector
				vectory : 0,			// the y of vector
				lastx : 0,				// drift x
				lasty : 0, 				// drift y
				rotation : 0,			// radians going clock wise
				moveRate : 200,			// pixels per second
				rotateRate : 3.14159	// Radians per second
			});
		//---------------------------------------------------
		//	All 3 missiles
		//---------------------------------------------------
		var missilespeed = 400;
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
		var numAsteroids = level * Random.nextGaussian(6,2);
		if(numAsteroids < 0)
		{
			numAsteroids *= -1;
		}
		if(numAsteroids < level+5)
		{
			numAsteroids = level + 5;
		}
		for(var i = 0; i < numAsteroids; ++i)
		{
			var thisX = Random.nextRange(0, canvas.width);
			var thisY = Random.nextRange(0, canvas.height);
			var asteroid = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/bigasteroid.png'],
				center : { x : thisX, y : thisY},
				width : 15, height : 15,
				rotation : Random.nextDouble(),
				moveRate : Random.nextRange(1, 10),
				rotateRate : 3.14159
			});
			asteroids.push(asteroid);
		}

		missiles.push(missile4);

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
		update(elapsedTime);
		
		render();
		//--------------------------------------------------------------
		//			Render Everything
		//--------------------------------------------------------------
		

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	function update(elapsedTime) {
		myKeyboard.update(SPACEGAME.elapsedTime);
		myShip.update(SPACEGAME.elapsedTime);
		// updating active missiles

		for(var i = 0 ; i < missiles.length ; i++){
			if (missiles[i].fired() === true){
				missiles[i].update(SPACEGAME.elapsedTime);
			}
		}
		// updating active asteroids
		for (var i = 0; i < asteroids.length; ++i) {
			asteroids[i].update(SPACEGAME.elapsedTime);
		};
	}

	function render(){
		SPACEGAME.graphics.clear();
		myShip.draw();
		// drawing active missiles
		for(var i = 0 ; i < missiles.length ; i++){
			if (missiles[i].fired() === true){
				missiles[i].draw();
			}
		}

		for (var i = 0; i < asteroids.length; ++i) {
			asteroids[i].draw();
		};
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