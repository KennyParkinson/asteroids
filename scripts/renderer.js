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

	function particleSystem(spec, graphics) {
		'use strict';
		var that = {},
			nextName = 1,	// unique identifier for the next particle
			particles = {};	// Set of all active particles

		//------------------------------------------------------------------
		//
		// This creates one new particle
		//
		//------------------------------------------------------------------
		that.create = function() {
			var p = {
					image: spec.image,
					size: spec.size,
					center: {x: spec.center.x, y: spec.center.y},
					direction: spec.direction,
					speed: spec.speed,
					rotation: 0,
					lifetime: .8,	// How long the particle should live, in seconds
					alive: 0	// How long the particle has been alive, in seconds
				};
			
			//
			// Ensure we have a valid size - gaussian numbers can be negative
			//p.size = Math.max(1, p.size);
			//
			// Same thing with lifetime
			//p.lifetime = Math.max(0.01, p.lifetime);
			//
			// Assign a unique name to each particle
			particles[nextName++] = p;
		};
		
		//------------------------------------------------------------------
		//
		// Update the state of all particles.  This includes remove any that 
		// have exceeded their lifetime.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime) {
			var removeMe = [],
				value,
				particle;
			
			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					//
					// Update how long it has been alive
					particle.alive += elapsedTime/1000;
					
					//
					// Update its position
					particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
					particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
					
					//
					// Rotate proportional to its speed
					particle.rotation += particle.speed / 500;
					
					//
					// If the lifetime has expired, identify it for removal
					if (particle.alive > particle.lifetime) {
						removeMe.push(value);
					}
				}
			}

			//
			// Remove all of the expired particles
			for (particle = 0; particle < removeMe.length; particle++) {
				delete particles[removeMe[particle]];
			}
			removeMe.length = 0;
		};
		
		//------------------------------------------------------------------
		//
		// Render all particles
		//
		//------------------------------------------------------------------
		that.render = function() {
			var value,
				particle;
			
			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					SPACEGAME.graphics.drawImage(particle);
				}
			}
		};
		that.setxandy = function(x, y){
			spec.center.x = x;
			spec.center.y = y;
		};
		return that;
	};

function exhaust(spec, graphics) {
		'use strict';
		var that = {},
			nextName = 1,	// unique identifier for the next particle
			particles = {};	// Set of all active particles

		//------------------------------------------------------------------
		//
		// This creates one new particle
		//
		//------------------------------------------------------------------
		that.create = function() {
			var p = {
					image: spec.image,
					size: spec.size,
					center: {x: spec.center.x, y: spec.center.y},
					direction: spec.direction,
					speed: spec.speed,
					rotation: 0,
					lifetime: .8,	// How long the particle should live, in seconds
					alive: 0	// How long the particle has been alive, in seconds
				};
			
			//
			// Ensure we have a valid size - gaussian numbers can be negative
			p.size = Math.max(1, p.size);
			//
			// Same thing with lifetime
			p.lifetime = Math.max(0.01, p.lifetime);
			//
			// Assign a unique name to each particle
			particles[nextName++] = p;
		};
		
		//------------------------------------------------------------------
		//
		// Update the state of all particles.  This includes remove any that 
		// have exceeded their lifetime.
		//
		//------------------------------------------------------------------
		that.update = function(elapsedTime) {
			var removeMe = [],
				value,
				particle;
			
			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					//
					// Update how long it has been alive
					particle.alive += elapsedTime/1000;
					
					//
					// Update its position
					particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
					particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
					
					//
					// Rotate proportional to its speed
					particle.rotation += particle.speed / 500;
					
					//
					// If the lifetime has expired, identify it for removal
					if (particle.alive > particle.lifetime) {
						removeMe.push(value);
					}
				}
			}

			//
			// Remove all of the expired particles
			for (particle = 0; particle < removeMe.length; particle++) {
				delete particles[removeMe[particle]];
			}
			removeMe.length = 0;
		};
		
		//------------------------------------------------------------------
		//
		// Render all particles
		//
		//------------------------------------------------------------------
		that.render = function() {
			var value,
				particle;
			
			for (value in particles) {
				if (particles.hasOwnProperty(value)) {
					particle = particles[value];
					SPACEGAME.graphics.drawImage(particle);
				}
			}
		};
		that.setxandy = function(x, y){
			spec.center.x = x;
			spec.center.y = y;
		};
		return that;
	};

	function ship(spec) {
		var that = {};

		that.isactive = function() {
			return spec.active;
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

			spec.velocity.x += directionX * (spec.moveRate * (elapsedTime / 1000));
			spec.velocity.y += directionY * (spec.moveRate * (elapsedTime / 1000));
		};

		that.update = function(elapsedTime) {
			spec.center.x += spec.velocity.x * elapsedTime /1000;
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
			spec.center.x += spec.moveRate * directionX * elapsedTime/1000;
			spec.center.y += spec.moveRate * directionY * elapsedTime/1000;
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

	function explosion(spec) {
		var that = {};


		return that;
	};

	return {
		drawImage : drawImage,
		particleSystem : particleSystem,
		clear : clear,
		ship : ship,
		missile : missile,
		asteroid: asteroid,
		exhaust :  exhaust
	};
}());
