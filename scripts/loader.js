var space = {
	images : {},

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
				'preload!scripts/input.js',
				'preload!scripts/jquery.js',
				'preload!scripts/random.js',
				'preload!scripts/particle-system.js',
				'preload!assets/vortex.png',
				'preload!assets/spaceship.png',
				'preload!assets/projectile.png',
				'preload!assets/middleasteroid.png',
				'preload!assets/littleasteroid.png',
				'preload!assets/explodsprite.png',
				'preload!assets/bigasteroid.png',
				'preload!assets/background.jpg',
				'preload!scripts/asteroids.js',
				'preload!scripts/renderer.js'

				
			],
			complete : function() {
				console.log('All files requested for loading...');
			}
		}
	]);
}, false);


// Extend yepnope with our own 'preload' prefix that...
// * Tracks how many have been requested to load
// * Tracks how many have been loaded
// * Places images into the 'images' object
yepnope.addPrefix('preload', function(resource) {
	console.log('preloading: ' + resource.url);
	
	space.status.preloadRequest += 1;
	var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
	resource.noexec = isImage;
	resource.autoCallback = function(e) {
		if (isImage) {
			var image = new Image();
			image.src = resource.url;
			space.images[resource.url] = image;
		}
		space.status.preloadComplete += 1;
		
		//
		// When everything has finished preloading, go ahead and start the game
		if (space.status.preloadComplete === space.status.preloadRequest) {
			console.log('Preloading complete!');
			space.initialize();
		}
	};
	
	return resource;
});
