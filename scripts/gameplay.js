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
		enemyActivityCountdown = 0,
		missiles = [],
		enemyMissiles = [],
		enemies = [],
		activeEnemies = [],
		asteroids = [],
		explosions = [],
		lastfire = 0,
		canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d'),
		lastfire = 0,
		sfxvolume = .5,
		missilefire1 = new Audio('assets/missilefire.wav'),
		missilefire2 = new Audio('assets/missilefire.wav'),
		missilefire3 = new Audio('assets/missilefire.wav'),
		missilefire4 = new Audio('assets/missilefire.wav'),
		background = new Audio('assets/background.mp3'),
		behaviors = ["launch", "fly", "turn", "shoot", "dodge", "deactivate"],
		directions = [
		{x : 1, y : 0},
		{x : 0.86602540378, y : .5},
		{x : .5, y : 0.86602540378},
		{x : 0, y : 1},
		{x : -.5, y : 0.86602540378},
		{x : -0.86602540378, y : .5},
		{x : -1, y : 0},
		{x : -0.86602540378, y : -.5},
		{x : -.5, y : -0.86602540378},
		{x : 0, y : -1},
		{x : .5, y : -0.86602540378},
		{x : 0.86602540378, y : -.5}
		],
		startingPoints = [
		{x : 0, y : 0},
		{x : 0, y : canvas.width},
		{x : 0, y : canvas.width/3 *2},
		{x : 0, y : canvas.width/3},
		{x : canvas.height, y : 0},
		{x : canvas.height/3*2, y : 0},
		{x : canvas.height/3, y : 0},
		{x : canvas.height, y : canvas.width},
		{x : canvas.height/3*2, y : canvas.width/3*2},
		{x : canvas.height/3, y : canvas.width/3},
		],
		countDownTime = 3,
		newLevel = true

		SPACEGAME.accelerating = false;
		SPACEGAME.level = 1;
		SPACEGAME.lives = 3;
		

	
	function initialize() {
		console.log('game initializing...');
		//-----------------------------------------------------------------------------------------------------------
		// This is the Ship Object
		//-----------------------------------------------------------------------------------------------------------
		myShip = SPACEGAME.graphics.ship( {
				image : SPACEGAME.images['images/spaceship.png'],
				center : { x : 284, y : 177 },
				width : 30, height : 30,
				active : true, 	
				velocity : {x : 0, y : 0 }, // velocity of object with an x and y
				vector : 0,             // magnitude of the vector
				radius : 15,
				rotation : 0,			// radians going clock wise
				moveRate : 200,			// pixels per second
				rotateRate : 3.14159	// Radians per second
			});
		
		//--------------------------------------------------------------------------------------------------
		// Create the keyboard input handler and register the keyboard commands
		//--------------------------------------------------------------------------------------------------
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myShip.rotateLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myShip.rotateRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myShip.accelerate);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_H, function(){
			var newx = Random.nextRange(0, canvas.width);
			var newy = Random.nextRange(0, canvas.height);
			while(!isSafe(newx, newy)){
				newx = Random.nextRange(0, canvas.width);//something new
				newy = Random.nextRange(0, canvas.height);// something new
			}
			myShip.hyperspace(newx, newy);
			// function used to check if safe radius exists around the ship
			var isSafe = function(x, y){ /// here is the issue-----------------------------------------------------------------------------------------------------
				var returnval = false;
				// if 100 px. radius exists around ship return true
				for (var zcount = 0; zcount < asteroids.length ; zcount++){
					zcenter = asteroids[zcount].getcenter();
					if(zcenter.x <= x+50 || zcenter.x >= x-50 && zcenter.y <= y+50 || zcenter.y >= y-50){
						returnval = false;
					}
					else{
						returnval = true;
					}

				}
				// return if x, y location is safe
				return returnval;
			};
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_F, function () {
			// enough time has elapsed since last missile fire
			if(!myShip.isactive())
				return;
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
		gameStart();
		// Adding missiles to missles to the active Objects array
		
				
	}
	function gameStart() {
		// Empty arrays
		missiles = [];
		enemyMissiles = [];
		asteroids = [];

		//-----------------------------------------------------------------------------------------------------------
		// These are the missile objects all 4 of them
		//-----------------------------------------------------------------------------------------------------------
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
		missiles.push(missile1);
		missiles.push(missile2);
		missiles.push(missile3);
		missiles.push(missile4);
		//----------------------------------------------------------------------------------------------
		// Exhaust particle systems
		//----------------------------------------------------------------------------------------------
		exhaust = exhaustParticles( {
			image : SPACEGAME.images['images/exhaust.png'],
			center:myShip.getcenter(),
			speed: {mean: 10, stdev: 2},
			lifetime: {mean: 4, stdev: 1}
			},
			SPACEGAME.graphics
		);

		// Level set to one
		SPACEGAME.level = 1;
		// Start new level
		levelStart(SPACEGAME.level);
	}
	function levelStart(level) {
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
			// getting and setting random x and y
			var thisX = Random.nextRange(0, canvas.width);
			var thisY = Random.nextRange(0, canvas.height);
			//verifying asteroids don't spawn on top of ship
			while( thisX < 334 && thisX > 234 && thisY < 227 && thisY > 127){
				thisX = Random.nextRange(0, canvas.width);
				thisY = Random.nextRange(0, canvas.height);
			}
			//getting random rotation
			var thisRotation = Random.nextRange(0, 2*Math.PI);
			//getting random move rate
			var thisMoveRate = Random.nextRange(20, 50);

			var asteroid = SPACEGAME.graphics.asteroid( {
				image : SPACEGAME.images['images/bigasteroid.png'],
				volume : sfxvolume, 
				center : { x : thisX, y : thisY},
				width: 43,
				height: 43,
				velocity : {x : 0, y : 0 }, // velocity of object with an x and y
				rotation : thisRotation,
				moveRate : thisMoveRate,
				radius : 21.5,
				rotateRate : 3.14159,
				active : true
			});
			asteroids.push(asteroid);
		}
		for(var i = 0; i < level*2; ++i)
		{
			var startingX;
			var startingY;
			var coin = Math.floor(Math.random()*10)%2;
			if(coin === 0)
			{
				startingX = Random.nextRange(-10, 0);
				startingY = Random.nextRange(0, canvas.width);
			}
			else
			{
				startingX = Random.nextRange(0, canvas.height);
				startingY = Random.nextRange(-10, 0);
			}
			
			var enemy = SPACEGAME.graphics.enemyCruiser({
				image : SPACEGAME.images['images/enemy.png'],
				center : startingPoints[Random.nextRange(0, startingPoints.length)],
				//velocity : {x : 0, y : 0 },	
				width : 75,
				height : 36,
				active : true,
				radius : 35,
				velocity: directions[Random.nextRange(0, directions.length)],
				moveRate : Random.nextRange(600, 650),
				behavior : "launch",
				rotation : 0,
				timeToNextAction : 2
			});
			enemies.push(enemy);
		}

		for(var i = 0; i < level; ++i)
		{
			var startingX = (Math.random() * 100) % canvas.height;
			var startingY  = (Math.random()*10)%2 === 0 ? 0 : canvas.width;
			
			var enemy = SPACEGAME.graphics.enemyCruiser({
				image : SPACEGAME.images['images/capitalShip.png'],
				//velocity : {x : 0, y : 0 },	
				center : startingPoints[Random.nextRange(0, startingPoints.length)],
				width : 75,
				height : 36,
				active : true,
				radius : 50,
				velocity: directions[Random.nextRange(0, directions.length)],
				moveRate : Random.nextRange(600, 650),
				behavior : "launch",
				rotation : 0,
				timeToNextAction : 1
			});
			enemies.push(enemy);
		}
		enemyActivityCountdown = 5;
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
		
	if(newLevel)
	{
		countDownTime -= elapsedTime/1000;
		if(countDownTime <= 0)
		{
			newLevel = false;
		}
	}
	else
	{
		myKeyboard.update(SPACEGAME.elapsedTime);
		if(myShip.isactive())
		{
			myShip.update(SPACEGAME.elapsedTime);
		}
		// updating active missiles
		if(SPACEGAME.accelerating)
		{
			for(var i = 0; i < 2; ++i)
			{
				exhaust.create();
			}
			SPACEGAME.accelerating = false;
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
		for(var i = 0; i < explosions.length; ++i)
		{
			explosions[i].lifetime -= SPACEGAME.elapsedTime/1000;
			if(explosions[i].lifetime > 0)
			{
				explosions[i].animation.update(SPACEGAME.elapsedTime);
			}
			else
			{
				explosions.splice(i, 1);
			}
		}

		exhaust.update(elapsedTime);
		enemyActivityCountdown -= elapsedTime/1000;
		if(enemyActivityCountdown <= 0 && enemies.length > 0)
		{
			enemyActivityCountdown = 3;
			activeEnemies.push(enemies.shift());
			activeEnemies[activeEnemies.length - 1].changeBehavior("launch");
		}
		for(var i = 0; i < activeEnemies.length; ++i)
		{
			if(activeEnemies[i].isactive())
			{
				activeEnemies[i].changeTime(SPACEGAME.elapsedTime);
				enemyMove(activeEnemies[i], i);
			}
		}
		//-------------------------------------------------------------
		// checking for level completion (no asteroids and aliens gone)
		if(asteroids.length === 0 && enemies.length === 0 && activeEnemies.length ===0){//add check for aliens once that gets working
			SPACEGAME.level ++;
			newLevel = true;
			countDownTime = 3;
			levelStart(SPACEGAME.level);
			//populateAsteroidsandAliens(level);
		}


		//--------------------------------------------------------------------
		//			Qadrants for our 568 x 354 with a 50 px overlap
		//      qI (-25, -25)(309, 202)  	qII (259, -25)(593, 202)
		//		qIII (-25, 152)(309, 379) 	qIV (259, 152)(593, 379)
		var quad1 = quadrant (asteroids, missiles, myShip, activeEnemies, -25, 309, -25, 202);
		var quad2 = quadrant (asteroids, missiles, myShip, activeEnemies, 259, 593, -25, 202);
		var quad3 = quadrant (asteroids, missiles, myShip, activeEnemies, -25, 309, 152, 379);
		var quad4 = quadrant (asteroids, missiles, myShip, activeEnemies, 259, 593, 152, 379);
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
			// if(allquads[i].enemiesinQuad.length > 0 &&allquads[i].AsteroidsinQuad.length > 0)
			// {
			// 	collisions(allquads[i].enemiesinQuad, allquads[i].AsteroidsinQuad);
			// }
			// if(allquads[i].missilesinQuad.length > 0 &&allquads[i].enemiesinQuad.length > 0)
			// {
			// 	collisions(allquads[i].missilesinQuad, allquads[i].enemiesinQuad);
			// }
		};
	}//end else
		// function split asteroids, ships and missiles into their respective quadrants
		//
		function quadrant(asteroids, missiles, myShip, activeEnemies, x1, x2, y1, y2){
			var quad = {
				missilesinQuad : [],
				shipsinQuad : [],
				AsteroidsinQuad : [],
				enemiesinQuad : []
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
			for(var count2 = 0; count2 < activeEnemies.length; count2++){
				var enemyCenter = activeEnemies[count2].getcenter();
				if(enemyCenter.x > x1 && enemyCenter.x < x2 && enemyCenter.y > y1 && enemyCenter.y < y2 && !activeEnemies[count2].isCapital()){
					quad.enemiesinQuad.push(activeEnemies[count2]);
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
						if(array1[i].whatami() === 1 && array2[j].whatami() === 3)
						{
							//------------------------------if ship hits a missile
							SPACEGAME.lives = SPACEGAME.lives - 1;
							explode({x : centerX, y : centerY});
							
							// playing explosion sounds
							var explosion = new Audio('assets/explosion.wav');
							explosion.volume = sfxvolume;
							explosion.play();
								// end sounds
							//-------------------------------------------------------------------
							// lose a life if possible else game over // this code is buggyy...??
							//-------------------------------------------------------------------
							/*
							if(SPACEGAME.lives <= 0){
								//end of game
								console.log("GAME OVER!");
							}
							else{
								var open = false;
								while(!open){
									for(var ac = 0; ac < asteroids.length; ac++){
										var theCenter = asteroids[ac].getcenter();
										if(theCenter.x > 334 || theCenter.x < 234 && theCenter.y > 227 || theCenter.y < 127){
												open = true;
										}
										else{
											open = false;
										}
									}
								}
								//revive ship
								myShip.revive();
							}
							*/

						}

						if(array2[j].whatami()===3)
						{
							if(array2[j].getRadius() === 21.5)
							{
								for(var k = 0; k < 3; ++k)	
								{	// make array of different rotations for multiple instances, then make asteroid generation function
									//getting random rotation
									var thisRotation = Random.nextRange(0, 2*Math.PI);
									//getting random move rate
									var thisMoveRate = Random.nextRange(20, 30);

									var asteroid = SPACEGAME.graphics.asteroid( {
										image : SPACEGAME.images['images/middleasteroid.png'],
										center : array2[j].getcenter(),
										width : 25,
										height : 25, 
										velocity : {x : 0, y : 0 }, // velocity of object with an x and y
										rotation : thisRotation,
										moveRate : thisMoveRate,
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
									//getting random rotation
									var thisRotation = Random.nextRange(0, 2*Math.PI);
									//getting random move rate
									var thisMoveRate = Random.nextRange(30, 40);

									var asteroid = SPACEGAME.graphics.asteroid( {
										image : SPACEGAME.images['images/littleasteroid.png'],
										center : array2[j].getcenter(),
										width : 16,
										height : 16, 
										velocity : {x : 0, y : 0 }, // velocity of object with an x and y
										rotation : thisRotation,
										moveRate : thisMoveRate,
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
	}
	function lineDistance( point1, point2 ) {
		  var xs = 0;
		  var ys = 0;
		 
		  xs = point2.x - point1.x;
		  xs = xs * xs;
		 
		  ys = point2.y - point1.y;
		  ys = ys * ys;
		 
		  return Math.sqrt( xs + ys );
	}

	function explode(centerPoint) {
		var explosion = {animation: angleExplosionAnimation({
			image : SPACEGAME.images["images/explodsprite.png"],
			center :  centerPoint
		},
		SPACEGAME.graphics), lifetime : 6}
		explosion.animation.create();
		explosions.push(explosion);
	}

	function explodeCircle(centerPoint) {
		var explosion = {animation: explosionAnimation({
			image : SPACEGAME.images["images/explodsprite.png"],
			center :  centerPoint
		},
		SPACEGAME.graphics), lifetime : 6}
		explosion.animation.create();
		explosions.push(explosion);
	}

	function enemyMove(ship, index) {
		var behavior = ship.behavior();
		var randY = Math.random()*canvas.height;
		var coin = Math.floor(Math.random()*10)%2;
		if(coin === 0)
		{
			var left = true;
		}
		switch(behavior)
		{
			
			case "launch" :
				ship.setCenter(startingPoints[Random.nextRange(0, startingPoints.length-1)]);

				ship.changeBehavior("fly");
				break;
			case "deactivate" :
				ship.changeBehavior("launch");
				ship.setVelocity({x: 0, y: 0});
				enemies.push(activeEnemies[index]);
				activeEnemies.splice(index, 1);
				break;
			case "turn" :
				if(left)
				{
					ship.rotateLeft(SPACEGAME.elapsedTime);
				}
				else
				{
					ship.rotateRight(SPACEGAME.elapsedTime);
				}
				break;
			case "shoot" :
				var missilespeed = 400;
				missile1 = SPACEGAME.graphics.enemymissile( {
						image : SPACEGAME.images['images/enemyprojectile.png'],
						center : { x : 0, y : 0},
						width : 10, height : 10,
						lifetime : 0,			// time to check against performance.now() for lifetime
						active : false,			// if object should be displayed 
						rotation : 0,			// radians going clock wise
						radius : 10,
						moveRate : missilespeed,			// pixels per second
				});
				enemyMissiles.push(missile1);
				enemyMissiles[enemyMissiles.length - 1].fire(ship.getcenter(), ship.gettraj(), ship.getspeed());
				break;

			case "fly" :
				ship.accelerate(SPACEGAME.elapsedTime);
				break;
			case "dodge" :
				if(!ship.isCapital())
				{
					if(asteroids.length > 0){
						ship.setRotation(findClosestAsteroid(ship.getcenter()));
					}
					
				}
				// if(left)
				// {
				// 	while()
				// }
				ship.accelerate(SPACEGAME.elapsedTime);
				break;
			
			
		}
		//var centerPoint = ship.getcenter();
		if(ship.getTime() < 0)
		{
			ship.changeBehavior(behaviors[Random.nextRange(1, behaviors.length)-1]);
			ship.resetTime();
		}
		ship.update(SPACEGAME.elapsedTime);
	}

	function findClosestAsteroid(centerPoint)
	{
		var min = Infinity;
		var index;
		for(var i = 0; i < asteroids.length; ++i)
		{
			var asteroidCenter = asteroids[i].getcenter();
			var dist = lineDistance(centerPoint, asteroidCenter);
			if(dist < min)
			{
				min = dist;
				index = i;
			}
		}
		return getVectorFromPoints(asteroids[index].getcenter(), centerPoint);
	}

	function getVectorFromPoints(point1, point2)
	{ 
		var xDiff = point2.x - point1.x; 
		var yDiff = point2.y - point1.y; 
		return Math.atan2(yDiff, xDiff); 
	} 

	function render(){
		SPACEGAME.graphics.clear();
		if(newLevel)
		{
			context.font = "30px Verdana";
			context.fillStyle ="rgba(0, 255, 51, 1)"
			context.shadowBlur=20;
			context.shadowColor="black";
			context.fillText("Starting in: ", 233, 105);
			var text = Math.ceil(countDownTime);
			context.fillText(text, 299, 135);
		}
		else
		{
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
			for(var i = 0; i < activeEnemies.length; ++i)
			{
				activeEnemies[i].draw();
			}
			for(var i = 0; i < explosions.length; ++i)
			{
				explosions[i].animation.render();
			}
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