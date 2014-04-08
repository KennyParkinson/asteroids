/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, requestAnimationFrame, console, SPACEGAME */
// ------------------------------------------------------------------
//  Base code courtesy of Dean Mathias has been modified by Kenneth Parkinson
//
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------
SPACEGAME.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d');
	
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	function clear() {
		context.clear();
	};
	function drawImage(spec) {
		context.save();
		
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(
			spec.image, 
			spec.center.x - spec.size/2, 
			spec.center.y - spec.size/2,
			spec.size, spec.size);
		
		context.restore();
	};

	function drawExplosion(spec) {
		context.save();
		
		context.translate(spec.center.x, spec.center.y);
		context.rotate(spec.rotation);
		context.translate(-spec.center.x, -spec.center.y);
		
		context.drawImage(spec.image, spec.clipCoordinates.x, spec.clipCoordinates.y, spec.size, spec.size, spec.center.x - spec.size/2, spec.center.y - spec.size/2, spec.size, spec.size);
		//context.drawImage(img,      sx,                     sy,                     swidth,    sheight,   x,                           y,                           width,     height);
		context.restore();
	};

	

	function ship(spec) {//make enemy ships match this
		var that = {};

		that.isactive = function() {
			return spec.active;
		};

		that.destroyed = function() {
			spec.active = false;
		};

		that.revive = function() {
			spec.active = true;
			spec.center.x = canvas.width/2;
			spec.center.y = canvas.height/2;
			spec.velocity.x = 0;
			spec.velocity.y = 0;
			spec.vector = 0;
			spec.rotation = 0;
		};

		that.hyperspace = function(x, y){
			// relocate ship to new center
			spec.center.x = x;
			spec.center.y = y;
		};

		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
			// if the rotation is greater than 2PI radians +2PI radians
			if(spec.rotation >= 2*Math.PI)
				{spec.rotation = spec.rotation - 2*Math.PI;}
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
			// if the rotation is less than 2PI radians +2PI radians
			if(spec.rotation <= 2*Math.PI)
				{spec.rotation = spec.rotation + 2*Math.PI;}
		};
		
		that.accelerate = function(elapsedTime) {
			SPACEGAME.accelerating = true;
			var directionX = Math.cos(spec.rotation);
			var directionY = Math.sin(spec.rotation);

			spec.velocity.x += directionX * (spec.moveRate * (elapsedTime / 1000));
			spec.velocity.y += directionY * (spec.moveRate * (elapsedTime / 1000));
		};

		that.update = function(elapsedTime) {
			spec.center.x += spec.velocity.x * elapsedTime / 1000;
			spec.center.y += spec.velocity.y * elapsedTime / 1000;

			if(spec.center.x >= canvas.width + 25)
			{
				spec.center.x = 0-25;
			}
			else if(spec.center.x <= 0-25)
			{
				spec.center.x = canvas.width + 25;
			}
			if(spec.center.y >= canvas.height + 25)
			{
				spec.center.y = 0-25;
			}
			else if(spec.center.y <= 0-25)
			{
				spec.center.y = canvas.height + 25;
			}
		};
		
		that.getcenter = function() {
			return (spec.center);
		};

		that.gettraj = function() {
			return (spec.rotation);
		};

		that.getspeed = function() {
			return (spec.vector);
		};

		that.getRadius = function() {
			return (spec.radius);
		};

		that.whatami = function() {
			// ship = 1, missile = 2, asteroid = 3
			return 1;
		};
		
		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2);//,
				//spec.width, spec.height);
			
			context.restore();
		};
		
		return that;
	};

	function missile(spec) {
		var that = {};
		that.fire = function(shipcoords, shiptraj, shipspeed) {
			// activiate missile
			spec.active = true;
			// set launch coordinates
			spec.center.x = shipcoords.x;
			spec.center.y = shipcoords.y;
			// set trajectory
			spec.rotation = shiptraj;
		};

		that.fired = function() {
			return(spec.active);
		};

		that.destroyed = function() {
			spec.active = false;
		};
			
		that.update = function(elapsedTime) {
			// if lifetime is past then disappear
			spec.lifetime += elapsedTime/1000
			if(spec.lifetime > 1.8){
				spec.active = false;
				spec.lifetime = 0;
			}
			
			var directionX = Math.cos(spec.rotation);
			var directionY = Math.sin(spec.rotation);
			
			spec.center.x += spec.moveRate * directionX * elapsedTime /1000;
			spec.center.y += spec.moveRate * directionY * elapsedTime / 1000;

			if(spec.center.x >= canvas.width + 25)
			{
				spec.center.x = 0-25;
			}
			else if(spec.center.x <= 0-25)
			{
				spec.center.x = canvas.width + 25;
			}
			if(spec.center.y >= canvas.height + 25)
			{
				spec.center.y = 0-25;
			}
			else if(spec.center.y <= 0-25)
			{
				spec.center.y = canvas.height + 25;
			}
		};

		that.getcenter = function() {
			return (spec.center);
		};

		that.getRadius = function() {
			return (spec.radius);
		};

		that.whatami = function() {
			// ship = 1, missile = 2, asteroid = 3
			return 2;
		};
		
		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2);//,
				//spec.width, spec.height);
			
			context.restore();
		};
		
		return that;
	};

	function enemymissile(spec) {
		var that = {};
		that.fire = function(shipcoords, shiptraj, shipspeed) {
			// activiate missile
			spec.active = true;
			// set launch coordinates
			spec.center.x = shipcoords.x;
			spec.center.y = shipcoords.y;
			// set trajectory
			spec.rotation = shiptraj;
		};

		that.fired = function() {
			return(spec.active);
		};

		that.destroyed = function() {
			spec.active = false;
		};
			
		that.update = function(elapsedTime) {
			// if lifetime is past then disappear
			spec.lifetime += elapsedTime/1000
			if(spec.lifetime > 1.8){
				spec.active = false;
				spec.lifetime = 0;
			}
			
			var directionX = Math.cos(spec.rotation);
			var directionY = Math.sin(spec.rotation);
			spec.center.x += spec.moveRate * directionX * elapsedTime /1000;
			spec.center.y += spec.moveRate * directionY * elapsedTime / 1000;
			if(spec.center.x >= canvas.width + 25)
			{
				spec.center.x = 0-25;
			}
			else if(spec.center.x <= 0-25)
			{
				spec.center.x = canvas.width + 25;
			}
			if(spec.center.y >= canvas.height + 25)
			{
				spec.center.y = 0-25;
			}
			else if(spec.center.y <= 0-25)
			{
				spec.center.y = canvas.height + 25;
			}
		};

		that.getcenter = function() {
			return (spec.center);
		};

		that.getRadius = function() {
			return (spec.radius);
		};

		that.whatami = function() {
			// ship = 1, missile = 2, asteroid = 3
			return 2;
		};
		
		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2);//,
				//spec.width, spec.height);
			
			context.restore();
		};
		
		return that;
	};

	function asteroid(spec){
		var that = {};
		that.destroyed = function() {
			spec.active = false;  // deactivate asteroid
		};
		that.isactive = function() {
			return spec.active;
		};

		that.update = function(elapsedTime) {
			
			var directionX = Math.cos(spec.rotation);
			var directionY = Math.sin(spec.rotation);
			spec.center.x += spec.moveRate * directionX * elapsedTime /1000;
			spec.center.y += spec.moveRate * directionY * elapsedTime /1000;
			
			if(spec.center.x >= canvas.width)
			{
				spec.center.x = 0;
			}
			else if(spec.center.x <= 0)
			{
				spec.center.x = canvas.width;
			}
			if(spec.center.y >= canvas.height)
			{
				spec.center.y = 0;
			}
			else if(spec.center.y <= 0)
			{
				spec.center.y = canvas.height;
			}
			spec.rotation += spec.moveRate / 10000;
		};

		that.getRadius = function() {
			return (spec.radius);
		};

		that.getcenter = function() {
			return (spec.center);
		};

		that.whatami = function() {
			// ship = 1, missile = 2, asteroid = 3
			return 3;
		};

		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2);//,
				//spec.width, spec.height);
			
			context.restore();
		};

		return that;
	};

	function enemyCruiser(spec) {
		var that = {};

		that.setVelocity = function(newVelocity) {
			spec.velocity = newVelocity;
		};

		that.isactive = function() {
			return spec.active;
		};

		that.changeTime = function(elapsedTime) {
			spec.timeToNextAction -= elapsedTime/1000
		};

		that.resetTime = function() {
			spec.timeToNextAction = 2;
		};

		that.getTime = function() {
			return spec.timeToNextAction;
		};

		that.behavior = function() {
			return spec.behavior;
		};

		that.changeBehavior = function(newBehavior) {
			spec.behavior = newBehavior;
		};

		that.destroyed = function() {
			spec.active = false;
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
			// if the rotation is greater than 2PI radians +2PI radians
			if(spec.rotation >= 2*Math.PI)
				{spec.rotation = spec.rotation - 2*Math.PI;}
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
			// if the rotation is less than 2PI radians +2PI radians
			if(spec.rotation <= 2*Math.PI)
				{spec.rotation = spec.rotation + 2*Math.PI;}
		};
		
		that.accelerate = function(elapsedTime) {
			if(spec.behavior === "fly")
			{
				var dud = 0;
			}
			var directionX = Math.cos(spec.rotation);
			var directionY = Math.sin(spec.rotation);

			spec.velocity.x = directionX * (spec.moveRate * (elapsedTime / 1000));
			spec.velocity.y = directionY * (spec.moveRate * (elapsedTime / 1000));
		};

		that.update = function(elapsedTime) {
				
			spec.center.x += spec.velocity.x * elapsedTime /1000;
			spec.center.y += spec.velocity.y * elapsedTime / 1000;
			if(spec.center === undefined)
			{
				var dud = 0;
			}
			if(isNaN(spec.center.x))
			{
				var dud = 0;
			}
			if(spec.center.x >= canvas.width + 51)
			{
				spec.behavior = "deactivate";
			}
			else if(spec.center.x <= 0-51)
			{
				spec.behavior = "deactivate";
			}
			if(spec.center.y >= canvas.height + 25)
			{
				spec.behavior = "deactivate";
			}
			else if(spec.center.y <= 0-25)
			{
				spec.behavior = "deactivate";
			}
		};
		
		that.getcenter = function() {
			return (spec.center);
		};

		that.gettraj = function() {
			return (spec.rotation);
		};

		that.getspeed = function() {
			return (spec.vector);
		};

		that.getRadius = function() {
			return (spec.radius);
		};

		that.whatami = function() {
			// ship = 1, missile = 2, asteroid = 3, enemyShip = 4, enemy missile = 5
			return 4;
		};

		that.isCapital = function() {
			return false;
		};

		that.setRotation = function(angle) {
			spec.rotation = angle;
		};

		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2);//,
				//spec.width, spec.height);
			
			context.restore();
		};

		that.setCenter = function(newCenter)
		{
			spec.center = newCenter;
		};

		return that;
	};

	function enemyCapital(spec) {
		var that = {};

		that.setVelocity = function(newVelocity) {
			spec.velocity = newVelocity;
		};

		that.isactive = function() {
			return spec.active;
		};

		that.isCapital = function() {
			return true;
		};

		that.behavior = function() {
			return spec.behavior;
		};

		that.resetTime = function() {
			spec.timeToNextAction = 2;
		};

		that.changeTime = function(elapsedTime) {
			spec.timeToNextAction -= elapsedTime/1000
		};

		that.getTime = function() {
			return spec.timeToNextAction;
		};

		that.changeBehavior = function(newBehavior) {
			spec.behavior = newBehavior;
		};

		that.destroyed = function() {
			spec.active = false;
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
			// if the rotation is greater than 2PI radians +2PI radians
			if(spec.rotation >= 2*Math.PI)
				{spec.rotation = spec.rotation - 2*Math.PI;}
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
			// if the rotation is less than 2PI radians +2PI radians
			if(spec.rotation <= 2*Math.PI)
				{spec.rotation = spec.rotation + 2*Math.PI;}
		};
		
		that.accelerate = function(elapsedTime) {
			var directionX = Math.cos(spec.rotation);
			var directionY = Math.sin(spec.rotation);

			spec.velocity.x = directionX * (spec.moveRate * (elapsedTime / 1000));
			spec.velocity.y = directionY * (spec.moveRate * (elapsedTime / 1000));
		};

		that.update = function(elapsedTime) {
			spec.center.x = spec.velocity.x * elapsedTime /1000;
			spec.center.y = spec.velocity.y * elapsedTime / 1000;

			if(spec.center.x >= canvas.width + 25)
			{
				spec.behavior = "deactivate";
			}
			else if(spec.center.x <= 0-25)
			{
				spec.behavior = "deactivate";
			}
			if(spec.center.y >= canvas.height + 25)
			{
				spec.behavior = "deactivate";
			}
			else if(spec.center.y <= 0-25)
			{
				spec.behavior = "deactivate";
			}
		};
		
		that.getcenter = function() {
			return (spec.center);
		};

		that.gettraj = function() {
			return (spec.rotation);
		};

		that.getspeed = function() {
			return (spec.vector);
		};

		that.getRadius = function() {
			return (spec.radius);
		};

		that.whatami = function() {
			// ship = 1, missile = 2, asteroid = 3, enemyship = 4, enemy missile = 5
			return 4;
		};
		
		that.draw = function() {
			context.save();
			
			context.translate(spec.center.x, spec.center.y);
			context.rotate(spec.rotation);
			context.translate(-spec.center.x, -spec.center.y);
			
			context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2);//,
				//spec.width, spec.height);
			
			context.restore();
		};

		that.setCenter = function(newCenter)
		{
			spec.center = newCenter;
		};
		
		return that;
	};

	return {
		drawImage : drawImage,
		drawExplosion : drawExplosion,
		clear : clear,
		ship : ship,
		missile : missile,
		asteroid : asteroid,
		enemyCruiser : enemyCruiser,
		enemyCapital : enemyCapital,
		enemymissile : enemymissile
	};
}());
