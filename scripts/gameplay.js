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
		exhaust = null,
		missile1 = null,
		missile2 = null,
		missile3 = null,
		missile4 = null,
		cancelNextRequest = false,
		missiles = [],
		asteroids = [],
		explosions = [],
		lastfire = 0,
		level = 1,
		canvas = document.getElementById('canvas-main'),
		lastfire = 0,
		sfxvolume = .5,
		missilefire1 = new Audio('assets/missilefire.wav'),
		missilefire2 = new Audio('assets/missilefire.wav'),
		missilefire3 = new Audio('assets/missilefire.wav'),
		missilefire4 = new Audio('assets/missilefire.wav'),
		background = new Audio('assets/background.mp3')

	
	function initialize() {
		console.log('game initializing...');
		//--------------------------------------------------
		// This is the Ship Object
		//--------------------------------------------------
		myShip = SPACEGAME.graphics.ship( {
				image : SPACEGAME.images['images/spaceship.png'],
				center : { x : 284, y : 177 },
				width : 30, height : 30,
				active : true, 	
				velocity : {x : 0, y : 0 },		// if object should be displayed
				vector : 0,             // magnitude of the vector
				vectorx : 0,			// the x of vector
				vectory : 0,			// the y of vector
				lastx : 0,				// drift x
				lasty : 0, 				// drift y
				radius : 15,
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
				radius : 5,
				moveRate : missilespeed,			// pixels per second
		});

		missile2 = SPACEGAME.graphics.missile( {
				image : SPACEGAME.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 10, height : 10,
				lifetime : 0,			// time to check against performance.now() for lifetime
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				radius : 5,
				moveRate : missilespeed,			// pixels per second
		});
		
		missile3 = SPACEGAME.graphics.missile( {
				image : SPACEGAME.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 10, height : 10,
				lifetime : 0,			// time to check against performance.now() for lifetime
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				radius : 5,
				moveRate : missilespeed,			// pixels per second
		});

		missile4 = SPACEGAME.graphics.missile( {
				image : SPACEGAME.images['images/projectile.png'],
				center : { x : 0, y : 0},
				width : 10, height : 10,
				lifetime : 0,			// time to check against performance.now() for lifetime
				active : false,			// if object should be displayed 
				rotation : 0,			// radians going clock wise
				radius : 5,
				moveRate : missilespeed,			// pixels per second
		});
		
		exhaust = exhaustParticles( {
			image : SPACEGAME.images['images/exhaust.png'],
			center:myShip.getcenter(),
			speed: {mean: 10, stdev: 2},
			lifetime: {mean: 4, stdev: 1}
			},
			SPACEGAME.graphics
		);

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
				// missile sound volume
				var missilesound = sfxvolume;

				if (missile1.fired() === false){
					lastfire = performance.now();
					missile1.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					missilefire1.volume = missilesound; 
					missilefire1.play();
					console.log("launch missile 1");
				}
				else if (missile2.fired() === false){
					lastfire = performance.now();
					missile2.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					missilefire2.volume = missilesound;
					missilefire2.play();
					console.log("launch missile 2");
				}
				else if ( missile3.fired() === false){
					lastfire = performance.now();
					missile3.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					missilefire3.volume = missilesound;
					missilefire3.play();
					console.log("launch missile 3");
				}
				else if ( missile4.fired() === false){
					lastfire = performance.now();
					missile4.fire(myShip.getcenter(), myShip.gettraj(), myShip.getspeed());
					missilefire4.volume = missilesound;
					missilefire4.play();
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
			// Stop the music
			background.pause();
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
			while( thisX < 334 && thisX > 234 && thisY < 227 && thisY > 127){
				thisX = Random.nextRange(0, canvas.width);
				thisY = Random.nextRange(0, canvas.height);
			}
			var asteroid = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/bigasteroid.png'],
				volume : sfxvolume, 
				center : { x : thisX, y : thisY},
				width: 43,
				height: 43,
				rotation : Random.nextRange(0, 2*Math.PI),
				moveRate : Random.nextRange(1, 10),
				radius : 21.5,
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
		// initializing audio
		background.loop = true; // music set to loop
		background.volume = .1; // half volume
		background.play();

		SPACEGAME.elapsedTime = time - SPACEGAME.lastTimeStamp;
		SPACEGAME.lastTimeStamp = time;
		//--------------------------------------------------------------
		//  	Update Everything
		//--------------------------------------------------------------
		update(SPACEGAME.elapsedTime);
		//--------------------------------------------------------------
		//			Render Everything
		//--------------------------------------------------------------
		render();

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
			
		}
	}
	function update(elapsedTime) {
		myKeyboard.update(SPACEGAME.elapsedTime);
		if(myShip.isactive())
		{
			myShip.update(SPACEGAME.elapsedTime);
		}
		// updating active missiles
		for(var i = 0; i < 2; ++i)
		{
			exhaust.create();
		}
		for(var i = 0 ; i < missiles.length ; i++){
			if (missiles[i].fired() === true){
				missiles[i].update(SPACEGAME.elapsedTime);
			}
		};
		// updating active asteroids
		for (var i = 0; i < asteroids.length; ++i) {
			if(asteroids[i].isactive())
			{
				asteroids[i].update(SPACEGAME.elapsedTime);
			}
			else
			{
				asteroids.splice(i, 1);
			}
		};

		exhaust.update(elapsedTime);

		//-------------------------------------------------------------
		// checking for level completion (no asteroids and aliens gone)
		if(asteroids.length === 0){
			level ++;
			//populateAsteroidsandAliens(level);
		}


		//--------------------------------------------------------------------
		//			Qadrants for our 568 x 354 with a 50 px overlap
		//      qI (-25, -25)(309, 202)  	qII (259, -25)(593, 202)
		//		qIII (-25, 152)(309, 379) 	qIV (259, 152)(593, 379)
		var quad1 = quadrant (asteroids, missiles, myShip, -25, 309, -25, 202);
		var quad2 = quadrant (asteroids, missiles, myShip, 259, 593, -25, 202);
		var quad3 = quadrant (asteroids, missiles, myShip, -25, 309, 152, 379);
		var quad4 = quadrant (asteroids, missiles, myShip, 259, 593, 152, 379);
		var allquads = [];
		allquads.push(quad1);
		allquads.push(quad2);
		allquads.push(quad3);
		allquads.push(quad4);

		for (var i = allquads.length - 1; i >= 0; i--) {
			if(allquads[i].missilesinQuad.length > 0 &&allquads[i].AsteroidsinQuad.length > 0)
			{
				collisions(allquads[i].missilesinQuad, allquads[i].AsteroidsinQuad);
			}
			if(allquads[i].shipsinQuad.length > 0 &&allquads[i].AsteroidsinQuad.length > 0)
			{
				collisions(allquads[i].shipsinQuad, allquads[i].AsteroidsinQuad);
			}
		};
		
		// function split asteroids, ships and missiles into their respective quadrants
		//
		function quadrant(asteroids, missiles, myShip, x1, x2, y1, y2){
			var quad = {
				missilesinQuad : [],
				shipsinQuad : [],
				AsteroidsinQuad : []
			};
			
			//-----------------------------------------------------------
			//add all asteroids missiles and ships that exist in (x1, y1) (x2, y2)
			//-----------------------------------------------------------
			// ship check and add if in quadrant
			var shipcenter = myShip.getcenter();
			if(shipcenter.x > x1 && shipcenter.x < x2 && shipcenter.y > y1 && shipcenter.y < y2 && myShip.isactive())
				{quad.shipsinQuad.push(myShip);}
			// asteroids check if in quadrant and alive
			for(var count = 0; count< asteroids.length; count++){
				if(asteroids[count].isactive()){
					var asteroidcenter = asteroids[count].getcenter();
					if(asteroidcenter.x > x1 && asteroidcenter.x < x2 && asteroidcenter.y > y1 && asteroidcenter.y < y2){	
						quad.AsteroidsinQuad.push(asteroids[count]);
					}
				}
			}
			// missiles check if in quadrant and alive
			for(var count2 = 0; count2 < missiles.length; count2++){
				var missilecenter = missiles[count2].getcenter();
				if(missilecenter.x > x1 && missilecenter.x < x2 && missilecenter.y > y1 && missilecenter.y < y2){
					if(missiles[count2].fired()){
						quad.missilesinQuad.push(missiles[count2]);
					}
				}
			}
			// sending back array of 
			return quad;
		};
		// check collisions in respective quadrants using this function
		
		function collisions(array1, array2){
			var totalRadii = array1[0].getRadius() + array2[0].getRadius();
			for(var i = 0; i<array1.length; ++i)
			{
				for(var j = 0; j<array2.length; ++j)
				{
					if(lineDistance(array1[i].getcenter(), array2[j].getcenter()) < totalRadii)
					{
						//cause collision
						array1[i].destroyed();
						array2[j].destroyed();

						var center1 = array1[i].getcenter();
						var center2 = array2[j].getcenter();
						var centerX = (center1.x + center2.x)/2;
						var centerY = (center1.y + center2.y)/2;
						
						explode({x : centerX, y : centerY});

								
								// playing explosion sounds
							var explosion = new Audio('assets/explosion.wav');
							explosion.volume = sfxvolume;
							explosion.play();
						
								// end sounds


						if(array2[j].whatami()===3)
						{
							if(array2[j].getRadius() === 21.5)
							{
								for(var k = 0; k < 3; ++k)
								{
									var asteroid = SPACEGAME.graphics.asteroid( {
										image : SPACEGAME.images['images/middleasteroid.png'],
										center : array2[j].getcenter(),
										width : 25,
										height : 25, 
										rotation : Random.nextRange(0, 10),
										moveRate : Random.nextRange(1, 10),
										radius : 12.5,
										rotateRate : 3.14159,
										active : true
									});
									asteroids.push(asteroid);
								}
							}
							else if(array2[j].getRadius() === 12.5)
							{
								for(var k = 0; k < 4; ++k)
								{
									var asteroid = SPACEGAME.graphics.asteroid( {
										image : SPACEGAME.images['images/littleasteroid.png'],
										center : array2[j].getcenter(),
										width : 16,
										height : 16, 
										rotation : Random.nextRange(0, 10),
										moveRate : Random.nextRange(1, 10),
										radius : 8,
										rotateRate : 3.14159,
										active : true
									});
									asteroids.push(asteroid);
								}

							}
						}
					}
				}
			}
		};

		function lineDistance( point1, point2 ){
		  var xs = 0;
		  var ys = 0;
		 
		  xs = point2.x - point1.x;
		  xs = xs * xs;
		 
		  ys = point2.y - point1.y;
		  ys = ys * ys;
		 
		  return Math.sqrt( xs + ys );
		};
	}

	function explode(centerPoint) {
		var explosion = SPACEGAME.graphics.particleSystem();
	}

	function render(){
		SPACEGAME.graphics.clear();
		if(myShip.isactive())
		{
			exhaust.render();
			myShip.draw();
		}
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