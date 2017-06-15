// first-event.js
// Accumulates the result

'use strict';

var firstEvent = module.exports = function ( result, bigs, opWith, doOnEvent, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, func, bool ) */

	var plab 	= bigs.playback,
		emitter = bigs.emitter;

	var op 	 = opWith.op,
		arg  = opWith.arg,
		evnt = opWith.event;


	var whenRun = function ( eventName, playback, three, four, five ) {
	// arguments: eventName, playback, other things

		// console.log( '1:', two );

		if ( doOnEvent ) {  // If this is the first of two tests
				emitter.removeAllListeners();
				doOnEvent( arguments );
		} else {
			// I happen to know this will be the fragment some of the time
			// and, a lot of the time it'll be the argument I'm interested in.
			result.arg2s.push( three );
			result.playback = playback;
		}
	};


	// This assumes we're the only thing queueing and dequeueing right now...

	var getFuncID = function (eventName, plab, item, queue) {
		// console.log( 'queued @1:', item );
		emitter.off( '_queued', getFuncID );
		ourFuncID = item.id;
	};

	var startListening = function (eventName, plab, item, queue) {
		// console.log( 'dequeued @1:', item )
		if ( item.id === ourFuncID ) {
			// console.log( 'starting to listen' );
			emitter.removeAllListeners();
			emitter.on( evnt, whenRun );
		}
	};


	emitter.removeAllListeners();
	if ( reset ) { bigs.playback.reset(); }

	var ourFuncID;

	// `forceReset()` skips the queue
	if ( op !== 'forceReset' ) {
		emitter.on( '_queued', getFuncID );
		// Start listening after func actually runs
		emitter.on( '_dequeued', startListening );
	} else {
		emitter.on( evnt, whenRun );
	}

	// console.log('1: listening')
	plab[ op ]( arg );

};  // End firstEvent()
