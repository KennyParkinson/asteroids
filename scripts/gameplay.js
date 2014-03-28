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
		missiles.push(missile4);
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
				rotateRate : 3.14159,
				active : true
			});
			asteroids.push(asteroid);
		}

		

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
		update(SPACEGAME.elapsedTime);
		
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

		//--------------------------------------------------------------------
		//			Qadrants for our 568 x 354 with a 50 px overlap
		//      qI (-25, -25)(309, 202)  	qII (259, -25)(593, 202)
		//		qIII (-25, 152)(309, 379) 	qIV (259, 152)(593, 379)
		var quad1 = quadrant (asteroids, missiles, myShip, -25, 309, -25, 202);
		var quad2 = quadrant (asteroids, missiles, myShip, 259, 593, -25, 202);
		var quad3 = quadrant (asteroids, missiles, myShip, -25, 309, 152, 379);
		var quad4 = quadrant (asteroids, missiles, myShip, 259, 593, 152, 379);
		//--------------------------------------------------------------------
		//	Checking collisions in each quadrant

		//------------------------------------------------------------
		// function split asteroids, ships and missiles into their respective quadrants
		//
		function quadrant(asteroids, missiles, myShip, x1, x2, y1, y2){
			var quadarray = [];
			//-----------------------------------------------------------
			//add all asteroids missiles and ships that exist in (x1, y1) (x2, y2)
			//-----------------------------------------------------------
			// ship check and add if in quadrant
			var shipcenter = myShip.getcenter();
			if(shipcenter.x > x1 && shipcenter.x < x2 && shipcenter.y > y1 && shipcenter.y < y2)
				{quadarray.push(myShip);}
			// asteroids check if in quadrant and alive
			for(var count = 0; count< asteroids.length; count++){
				if(asteroids[count].isactive()){
					var asteroidcenter = asteroids[count].getcenter();
					if(asteroidcenter.x > x1 && asteroidcenter.x < x2 && asteroidcenter.y > y1 && asteroidcenter.y < y2){	
						quadarray.push(asteroids[count]);
					}
				}
			}
			// missiles check if in quadrant and alive
			for(var count2 = 0; count2 < missiles.length; count2++){
				var missilecenter = missiles[count2].getcenter();
				if(missilecenter.x > x1 && missilecenter.x < x2 && missilecenter.y > y1 && missilecenter.y < y2){
					if(missiles[count2].fired()){
						quadarray.push(missiles[count2]);
					}
				}
			}
			// sending back array of 
			return quadarray;
		};
		// check collisions in respective quadrants using this function
		
		function collisions(quadrantArray){
			//----------------------------------------------
			// if collisions occur do what needs to happen
			//----------------------------------------------
			//			whatami() results are ship = 1, missile =2, asteroid = 3
			// check missiles against asteroids and ship against asteroids
			for(var count = quadrantArray.length-1; count > 0; count--){
				for(var count2 = count-1; count >= 0; count2--){
					// if is ship
					if(quadrantArray[count].whatami() === 1 || quadrantArray[count].whatami() === 2){
						if(quadrantArray[count2].whatami() === 3){
							//possibile collisions between ship/missile and asteroid check locations
							//need an is touching function where we compare 2 objects somehow


						}
					}
				}
			}
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