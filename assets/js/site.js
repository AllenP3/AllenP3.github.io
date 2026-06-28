(function () {
	'use strict';

	var prefersReducedMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* Reveal-on-scroll */
	var revealEls = document.querySelectorAll( '.reveal' );
	if ( 'IntersectionObserver' in window && ! prefersReducedMotion ) {
		var io = new IntersectionObserver( function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'is-visible' );
					io.unobserve( entry.target );
				}
			} );
		}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' } );
		revealEls.forEach( function ( el ) { io.observe( el ); } );
	} else {
		revealEls.forEach( function ( el ) { el.classList.add( 'is-visible' ); } );
	}

	/* Sticky header state */
	var header = document.querySelector( '.site-header' );
	if ( header ) {
		var onScroll = function () {
			header.classList.toggle( 'is-scrolled', window.scrollY > 40 );
		};
		document.addEventListener( 'scroll', onScroll, { passive: true } );
		onScroll();
	}

	/* Magnetic buttons */
	if ( ! prefersReducedMotion ) {
		document.querySelectorAll( '.magnetic' ).forEach( function ( el ) {
			el.addEventListener( 'mousemove', function ( e ) {
				var rect = el.getBoundingClientRect();
				var x = e.clientX - rect.left - rect.width / 2;
				var y = e.clientY - rect.top - rect.height / 2;
				el.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.25 + 'px)';
			} );
			el.addEventListener( 'mouseleave', function () {
				el.style.transform = 'translate(0,0)';
			} );
		} );
	}

	/* Cursor glow that follows the pointer */
	if ( ! prefersReducedMotion && window.matchMedia( '(pointer: fine)' ).matches ) {
		var glow = document.createElement( 'div' );
		glow.className = 'cursor-glow';
		document.body.appendChild( glow );
		var gx = 0, gy = 0, cx = 0, cy = 0;
		document.addEventListener( 'mousemove', function ( e ) {
			gx = e.clientX;
			gy = e.clientY;
		} );
		function loop() {
			cx += ( gx - cx ) * 0.12;
			cy += ( gy - cy ) * 0.12;
			glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
			requestAnimationFrame( loop );
		}
		loop();
	}

	/* Animated counters */
	document.querySelectorAll( '.stat-number' ).forEach( function ( el ) {
		var target = parseFloat( el.getAttribute( 'data-count' ) || '0' );
		var suffix = el.getAttribute( 'data-suffix' ) || '';
		var started = false;
		var run = function () {
			if ( started ) return;
			started = true;
			var start = null;
			var duration = 1400;
			function step( ts ) {
				if ( ! start ) start = ts;
				var progress = Math.min( ( ts - start ) / duration, 1 );
				var eased = 1 - Math.pow( 1 - progress, 3 );
				el.textContent = Math.round( eased * target ) + suffix;
				if ( progress < 1 ) requestAnimationFrame( step );
			}
			requestAnimationFrame( step );
		};
		if ( 'IntersectionObserver' in window && ! prefersReducedMotion ) {
			var statIo = new IntersectionObserver( function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) { run(); statIo.unobserve( entry.target ); }
				} );
			}, { threshold: 0.6 } );
			statIo.observe( el );
		} else {
			el.textContent = target + suffix;
		}
	} );

	/* Mobile nav toggle */
	var toggle = document.querySelector( '.nav-toggle' );
	var nav = document.querySelector( '.site-nav' );
	if ( toggle && nav ) {
		toggle.addEventListener( 'click', function () {
			nav.classList.toggle( 'is-open' );
		} );
		nav.querySelectorAll( 'a' ).forEach( function ( link ) {
			link.addEventListener( 'click', function () { nav.classList.remove( 'is-open' ); } );
		} );
	}
})();
