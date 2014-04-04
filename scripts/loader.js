var SPACEGAME = {
	images : {},
	screens : {},

	status : {
		preloadRequest : 0,
		preloadComplete : 0
	}
};

//------------------------------------------------------------------
//
// Wait until the browser 'onload' is called before starting to load
// any external resources.  This is needed because a lot of JS code
// will want to refer to the HTML document.
//
//------------------------------------------------------------------
window.addEventListener('load', function() {
	console.log('Loading resources...');
	Modernizr.load([
		{
			load : [
				'preload!scripts/random.js',
				'preload!scripts/renderer.js',
				'preload!scripts/particle-system.js',
				'preload!scripts/input.js',
				'preload!scripts/game.js',
				'preload!scripts/mainmenu.js',
				'preload!scripts/gameplay.js',
				'preload!scripts/highscores.js',
				'preload!scripts/help.js',
				'preload!scripts/about.js',
				'preload!images/vortex.png',
				'preload!images/exhaust.png',
				'preload!images/spaceship.png',
				'preload!images/projectile.png',
				'preload!images/middleasteroid.png',
				'preload!images/littleasteroid.png',
				'preload!images/explodsprite.png',
				'preload!images/bigasteroid.png',
				'preload!images/background.jpg',
				'preload!images/enemy.png',
				'preload!images/capitalShip.png',
				'preload!images/enemyprojectile.png'
			],
			complete : function() {
				console.log('All files requested for loading...');
			}
		}
	]);
}, false);

//
// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
	console.log('preloading: ' + resource.url);
	
	SPACEGAME.status.preloadRequest += 1;
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
	resource.noexec = isImage;
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			SPACEGAME.images[resource.url] = image;
		}
		SPACEGAME.status.preloadComplete += 1;
		
		//
		// When everything has finished preloading, go ahead and start the game
		if (SPACEGAME.status.preloadComplete === SPACEGAME.status.preloadRequest) {
			console.log('Preloading complete!');
			SPACEGAME.game.initialize();
		}
	};
	
	return resource;
});
