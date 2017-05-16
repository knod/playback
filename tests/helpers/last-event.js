// last-event.js
// Accumulates the result

// var oneEvent = module.exports = function ( result, bigs, opWith, evnt, mayCollectCheck, msTillAssert, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, str, func, int, func, bool ) */
var oneEvent = module.exports = function ( result, bigs, opWith, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, bool ) */

	var plab 	= bigs.playback,
		emitter = bigs.emitter;

	var op 	 = opWith.op,
		arg  = opWith.arg,
		evnt = opWith.event;


	var whenRun = function ( one, two, three, four ) {
		// Debugging
		// console.log( '2:', one._queue.slice(0) );
		// if ( evnt === 'rewindBegin' ) { console.log('2: rewoundBegun') }
		// console.log( '2:', evnt );
		// if ( evnt ) { console.log( '2:', one.getIndex(), evnt, two ) }
		// console.log( '2:', two )
		// console.trace( count, 'event === null', eventAssertion === null );
		// count++;
		// if ( op === 'reset' && evnt === 'newWordFragment' ) { console.log( '2:', two ); }
		// console.log( '2:', count, op, evnt );

		result.playback = one;
		// I happen to know this will be the fragment some of the time
		// and, most of the time it'll be the argument I'm interested in.
		result.arg2s.push( two );

	};

	var startListening = function () {
		// console.log( 'starting to listen' );
		emitter.removeAllListeners();
		emitter.on( evnt, whenRun );
	};


	emitter.removeAllListeners();
	if ( reset ) { bigs.playback.reset(); }

	// emitter.on( 'queued', function ( obj, item ) { console.log( 'queued @2:', item ) } );
	// emitter.on( 'dequeued', function ( obj, item ) { console.log( 'dequeued @2:', item ) } );

	// Start listening after func actually runs
	emitter.on( 'dequeued', startListening );
	// console.log( '2 listeing for', evnt );

	// emitter.on( evnt, whenRun );
	// console.log( '========= debug: listening' );
	plab[ op ]( arg );

};  // End oneEvent()
