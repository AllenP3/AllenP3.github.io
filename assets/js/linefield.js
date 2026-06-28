(function () {
	'use strict';

	var canvas = document.getElementById( 'line-field' );
	if ( ! canvas || ! canvas.getContext ) return;
	var ctx = canvas.getContext( '2d' );

	var prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	var dpr = Math.min( window.devicePixelRatio || 1, 2 );
	var width = 0, height = 0;
	var lines = [];
	var lineCount = 90;
	var sampleStep = 7;

	var mouseX = -9999, mouseY = -9999;
	var targetX = -9999, targetY = -9999;

	function resize() {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );
		buildLines();
	}

	function buildLines() {
		lines = [];
		var spacing = width / ( lineCount - 1 );
		for ( var i = 0; i < lineCount; i++ ) {
			lines.push( { baseX: i * spacing, seed: i * 12.9898 } );
		}
	}

	window.addEventListener( 'resize', resize );
	window.addEventListener( 'mousemove', function ( e ) {
		targetX = e.clientX;
		targetY = e.clientY;
	}, { passive: true } );
	window.addEventListener( 'mouseleave', function () {
		targetX = -9999;
		targetY = -9999;
	} );
	window.addEventListener( 'touchmove', function ( e ) {
		if ( e.touches && e.touches[ 0 ] ) {
			targetX = e.touches[ 0 ].clientX;
			targetY = e.touches[ 0 ].clientY;
		}
	}, { passive: true } );

	var t = 0;
	var radius = 240;

	function frame() {
		t += 0.0032;
		mouseX += ( targetX - mouseX ) * 0.07;
		mouseY += ( targetY - mouseY ) * 0.07;

		ctx.clearRect( 0, 0, width, height );
		ctx.lineWidth = 1;

		for ( var i = 0; i < lines.length; i++ ) {
			var line = lines[ i ];
			ctx.beginPath();
			for ( var y = -sampleStep; y <= height + sampleStep; y += sampleStep ) {
				var wobble = Math.sin( y * 0.012 + t * 1.4 + line.seed ) * 16
					+ Math.sin( y * 0.0035 - t * 0.6 + line.seed * 0.6 ) * 34;
				var x = line.baseX + wobble;

				var dx = x - mouseX;
				var dy = y - mouseY;
				var dist = Math.sqrt( dx * dx + dy * dy );
				if ( dist < radius ) {
					var force = 1 - dist / radius;
					force = force * force;
					var nx = dist > 0.001 ? dx / dist : 0;
					x += nx * force * 70;
				}

				if ( y === -sampleStep ) ctx.moveTo( x, y );
				else ctx.lineTo( x, y );
			}
			ctx.strokeStyle = 'rgba(92,141,255,0.14)';
			ctx.stroke();
		}

		if ( ! prefersReducedMotion ) requestAnimationFrame( frame );
	}

	resize();
	frame();
})();
