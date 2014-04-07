/*jslint browser: true, white: true */
/*global Settings */
var Settings = (function() {
	'use strict';
	var accelerateKey = KeyEvent.DOM_VK_W;
	var leftKey = KeyEvent.DOM_VK_W;
	var fireKey = KeyEvent.DOM_VK_W;
	var rightKey = KeyEvent.DOM_VK_W;
	var hyperKey = KeyEvent.DOM_VK_W;
	
	function setaccelerate() {
		var key = window.event.keyCode;
		console.log(key);
	}
	
	
	return {
		setaccelerate : setaccelerate,
		setfire : setfire,
		setleft : setleft,
		setright : setright,
		sethyperspace : sethyperspace
	};
	
}());