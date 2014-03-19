/*jslint browser: true, white: true */
/*global CanvasRenderingContext2D, requestAnimationFrame, console, space */
// ------------------------------------------------------------------
// 
// This is the game object.  Everything about the game is located in 
// this object.
//
// ------------------------------------------------------------------

space.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('gameCanvas'),
		context = canvas.getContext('2d');
	
	//------------------------------------------------------------------
	//
	// Place a 'clear' function on the Canvas prototype, this makes it a part
	// of the canvas, rather than making a function that calls and does it.
	//
	//------------------------------------------------------------------
	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	//------------------------------------------------------------------
	//
	// Public function that allows the client code to clear the canvas.
	//
	//------------------------------------------------------------------
	function clear() {
		context.clear();
	}
	
	//------------------------------------------------------------------
	//
	// This is used to create a texture function that can be used by client
	// code for rendering.
	//
	//------------------------------------------------------------------
	function Texture(spec) {
		var that = {};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
		};
		
		that.accelerate = function(elapsedTime) {
			var newX = Math.cos(spec.rotation);
			var newY = Math.sin(spec.rotation);
			spec.center.x += spec.moveRate * (elapsedTime / 1000) * newX;
			spec.center.y += spec.moveRate * (elapsedTime / 1000) * newY;
		};

		that.moveLeft = function(elapsedTime) {
			spec.center.x -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveRight = function(elapsedTime) {
			spec.center.x += spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveUp = function(elapsedTime) {
			spec.center.y -= spec.moveRate * (elapsedTime / 1000);
		};
		
		that.moveDown = function(elapsedTime) {
			spec.center.y += spec.moveRate * (elapsedTime / 1000);
		};

		that.fire = function() {
			return {
				rotation : spec.rotation,
				location : spec.center
			};
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
	}
	function projectile(spec) {
		var that = {};

		that.accelerate = function(elapsedTime) {
			var newX = Math.cos(spec.rotation);
			var newY = Math.sin(spec.rotation);
			spec.center.x += spec.moveRate * (elapsedTime / 1000) * newX;
			spec.center.y += spec.moveRate * (elapsedTime / 1000) * newY;
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
	}


	return {
		clear : clear,
		Texture : Texture,
		projectile : projectile
	};
}());