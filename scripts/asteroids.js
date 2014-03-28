space.initialize = function() {
	'use strict';
	$(".mainDisplay").hide();
	$(".displayed").show();
	$("#spaceDiv").css({
		background: "url(" + space.images["assets/background.jpg"].src +") no-repeat left top",
		backgroundSize: "100% 100%",
		clear: "both"
	});
	space.elapsedTime = 0,
	space.lastTimeStamp = performance.now(),
	space.myKeyboard = space.input.Keyboard();
	space.level = 1;
};
space.gameStart = function() {
	space.myShip = space.graphics.Texture( {
			image : space.images['assets/spaceship.png'],
			center : { x : 100, y : 100 },
			width : 60, height : 60,
			rotation : 0,
			moveRate : 300,			// pixels per second
			rotateRate : 3.14159	// Radians per second
		});
	space.activeObjects = [];
	space.projectiles = [];
	space.projectileLifetimes = [];
	space.asteroids = [];
	//
	// Create the keyboard input handler and register the keyboard commands
	space.myKeyboard.registerCommand(KeyEvent.DOM_VK_A, space.myShip.rotateLeft);
	space.myKeyboard.registerCommand(KeyEvent.DOM_VK_D, space.myShip.rotateRight);
	space.myKeyboard.registerCommand(KeyEvent.DOM_VK_W, space.myShip.accelerate);
	space.myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, space.fire);
	space.activeObjects.push(space.myShip);
	requestAnimationFrame(space.gameLoop);
	space.numAsteroids = (Random.nextGaussian(space.level*10, 3));
	for (var i = 0; i < space.numAsteroids; ++i) {
		asteroid = space.graphics.asteroid({

		});
		space.asteroids.push(asteroid);
	};
};
space.gameLoop = function(time) {
	space.elapsedTime = time - space.lastTimeStamp;
	space.lastTimeStamp = time;
	space.update(space.elapsedTime);
	space.render();
	requestAnimationFrame(space.gameLoop);
};
space.update =  function(elapsedTime) {
	space.myKeyboard.update(elapsedTime);
	for(var i = 0; i<space.projectiles.length; ++i)
	{
		space.projectileLifetimes[i] -= elapsedTime/1000
		if(space.projectileLifetimes[i]<=0)
		{
			space.projectileLifetimes.splice(i, 1);
			space.projectiles.splice(i, 1);
		}
		else
		{
			space.projectiles[i].accelerate(elapsedTime);
		}

	}
};
space.render = function() {
	var canvas = document.getElementById('gameCanvas'),
		context = canvas.getContext('2d');
		context.clear();
	for(var i = 0; i<space.activeObjects.length; ++i)
	{
		space.activeObjects[i].draw();
	}
	for(var i = 0; i<space.projectiles.length; ++i)
	{
		space.projectiles[i].draw();
	}

};
space.fire = function() {
	var details = space.myShip.fire();
	
	var projectile = space.graphics.projectile( {
		image : space.images['assets/projectile.png'],
		center : details.location,
		width : 20, height : 20,
		rotation : details.rotation,
		moveRate : 400,			// pixels per second
		rotateRate : 3.14159,	// Radians per second
	});
	space.projectiles.push(projectile);
	space.projectileLifetimes.push(4);
};
