// first-event.js
// Accumulates the result

// var firstEvent = module.exports = function ( result, bigs, opWith, evnt, mayCollectCheck, msTillAssert, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, str, func, int, func, bool ) */
var firstEvent = module.exports = function ( result, bigs, opWith, doOnEvent, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, func, bool ) */

	var plab 	= bigs.playback,
		emitter = bigs.emitter;

	var op 	 = opWith.op,
		arg  = opWith.arg,
		evnt = opWith.event;


	var whenRun = function ( one, two, three, four ) {
		// Debugging
		// console.log( '1:', one._queue.slice(0) );
		// if ( evnt === 'rewindBegin' ) { console.log('1: rewoundBegun') }
		// console.log( '1:', evnt );
		// if ( evnt ) { console.log( '1:', one.getIndex(), evnt, two ) }
		// console.log( '1:', two )
		// console.trace( count, 'event === null', eventAssertion === null );
		// count++;
		// console.log( '1:', count, op, evnt );

		if ( doOnEvent ) {  // If this is the first of two tests
				emitter.removeAllListeners();
				doOnEvent( evnt, one, two, three, four );
		} else {

			// I happen to know this will be the fragment some of the time
			// and, most of the time it'll be the argument I'm interested in.
			result.arg2s.push( two );
			result.playback = one;
		}
	};


	// This assumes we're the only thing queueing and dequeueing right now...

	var getFuncID = function (plab, item, queue) {
		// console.log( 'queued @1:', item );
		emitter.off( 'queued', getFuncID );
		ourFuncID = item.id;
	};

	var startListening = function (plab, item, queue) {
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
	if ( op !== 'forceRest' ) {
		emitter.on( 'queued', getFuncID );
		// Start listening after func actually runs
		emitter.on( 'dequeued', startListening );
	} else {
		emitter.on( evnt, whenRun );
	}

	// console.log('1: listening')
	// console.log( '========= debug: listening' );
	plab[ op ]( arg );

};  // End firstEvent()
