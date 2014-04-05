/*jslint browser: true, white: true, plusplus: true */
/*global Random */
function exhaustParticles(spec, graphics) {
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
				size: Random.nextGaussian(10, 4),
				center: {x: spec.center.x, y: spec.center.y},
				direction: Random.nextCircleVector(),
				speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
				rotation: 0,
				lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
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
				particle.center.x += (elapsedTime/1000 * particle.speed * particle.direction.x);
				particle.center.y += (elapsedTime/1000 * particle.speed * particle.direction.y);
				
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
				graphics.drawImage(particle);
			}
		}
	};
	
	return that;
}

function explosionAnimation(spec, graphics) {
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
		var directions = [
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
		];
		for(var i = 0; i < 12; ++i)
		{
			for (var j = 0; j < 4; ++j) 
			{
				for(var k = 0; k < 4; ++k)
				{
					var mod;
					if(j===0 && k!==0)
					{
						mod = k * 8;
					}
					else if (k===0 &&j!==0) 
					{
						mod = j * 8;
					}
					else
					{
						mod = j * k * 6;
					}
					var p = {
							image: spec.image,
							size: 32,
							center: {x: spec.center.x, y: spec.center.y},
							direction: directions[i],
							speed: 64 - mod, // pixels per second
							rotation: 0,
							lifetime: 3,	// How long the particle should live, in seconds
							alive: 0,	// How long the particle has been alive, in seconds
							clipCoordinates : {x : j*32, y : k*32 }
						};
					particles[nextName++] = p;
				}

			}
		};
		
		
		
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
				particle.center.x += (elapsedTime/1000 * particle.speed * particle.direction.x);
				particle.center.y += (elapsedTime/1000 * particle.speed * particle.direction.y);
				
				//
				// Rotate proportional to its speed
				//particle.rotation += particle.speed / 500;
				
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
				graphics.drawExplosion(particle);
			}
		}
	};
	
	return that;
}

function angleExplosionAnimation(spec, graphics) {
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
		var directions = [
		
		{x : 0.86602540378, y : .5},
		{x : 0.70710678118, y : 0.70710678118},
		{x : .5, y : 0.86602540378},
		
		// {x : -.5, y : 0.86602540378},
		// {x : -0.86602540378, y : .5},
		// {x : -1, y : 0},
		{x : -0.86602540378, y : -.5},
		{x : -0.70710678118, y : -0.70710678118},
		{x : -.5, y : -0.86602540378},
		// {x : 0, y : -1},
		// {x : .5, y : -0.86602540378},
		// {x : 0.86602540378, y : -.5}
		];
		for(var i = 0; i < 6; ++i)
		{
			for (var j = 0; j < 4; ++j) 
			{
				for(var k = 0; k < 4; ++k)
				{
					var directionX;
					var directionY;
					var coin = Math.floor(Math.random()*10)%2;
					if( coin === 0)
					{
						directionX = directions[i].x * -1;
						directionY = directions[i].y;
					}
					else
					{
						directionX = directions[i].x;
						directionY = directions[i].y;
					}
					var mod;
					if(j===0 && k!==0)
					{
						mod = k * 8;
					}
					else if (k===0 &&j!==0) 
					{
						mod = j * 8;
					}
					else
					{
						mod = j * k * 6;
					}
					var p = {
							image: spec.image,
							size: 32,
							center: {x: spec.center.x, y: spec.center.y},
							direction: {x : directionX, y : directionY},
							speed: 64 - mod, // pixels per second
							rotation: Random.nextCircleVector(),
							lifetime: 3+(16-k*j),	// How long the particle should live, in seconds
							alive: 0,	// How long the particle has been alive, in seconds
							clipCoordinates : {x : j*32, y : k*32 }
						};
					particles[nextName++] = p;
				}

			}
		};
		
		
		
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
				particle.center.x += (elapsedTime/1000 * particle.speed * particle.direction.x);
				particle.center.y += (elapsedTime/1000 * particle.speed * particle.direction.y);
				
				//
				// Rotate proportional to its speed
				//particle.rotation += particle.speed / 500;
				
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
				graphics.drawExplosion(particle);
			}
		}
	};
	
	return that;
}