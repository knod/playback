// last-event.js
// Accumulates the result

'use strict';

var lastEvent = module.exports = function ( result, bigs, opWith, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, bool ) */

	const plab 	= bigs.playback,
		emitter = bigs.emitter;

	const op 	 = opWith.op,
		arg  = opWith.arg,
		evnt = opWith.event;


	const whenRun = function ( one, two, three, four ) {
		// console.log( '2:', two );

		// I happen to know this will be the fragment some of the time
		// and, a lot of the time it'll be the argument I'm interested in.
		result.arg2s.push( two );
		result.playback = one;

	};


	// This assumes we're the only thing queueing and dequeueing right now...

	const getFuncID = function (plab, item, queue) {
		// console.log( 'queued @2:', item );
		emitter.off( '_queued', getFuncID );
		ourFuncID = item.id;
	};

	const startListening = function (plab, item, queue) {
		// console.log( 'dequeued @2:', item );
		if ( item.id === ourFuncID ) {
			// console.log( 'starting to listen' );
			emitter.off( '_dequeued', startListening );
			emitter.on( evnt, whenRun );
		}
	};


	emitter.removeAllListeners();
	if ( reset ) { bigs.playback.forceReset(); }

	var ourFuncID;

	// `forceReset()` skips the queue
	if ( op !== 'forceReset' ) {
		emitter.on( '_queued', getFuncID );
		// Start listening after func actually runs
		emitter.on( '_dequeued', startListening );
	} else {
		emitter.on( evnt, whenRun );
	}

	// console.log('2: listening')
	plab[ op ]( arg );

};  // End lastEvent()
