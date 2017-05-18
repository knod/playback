// last-event.js

// var lastEvent = module.exports = function ( result, bigs, opWith, evnt, mayCollectCheck, msTillAssert, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, str, func, int, func, bool ) */
var lastEvent = module.exports = function ( result, bigs, opWith, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, bool ) */

	var plab 	= bigs.playback,
		emitter = bigs.emitter;

	var op 	 = opWith.op,
		arg  = opWith.arg,
		evnt = opWith.event;


	whenRun = function ( one, two, three, four ) {

		// console.log( '2:', two );

		// I happen to know this will be the fragment some of the time
		// and, most of the time it'll be the argument I'm interested in.
		result.arg2s.push( two );
		result.playback = one;

	};


	// This assumes we're the only thing queueing and dequeueing right now...

	var getFuncID = function (plab, item, queue) {
		// console.log( 'queued @2:', item );
		emitter.off( 'queued', getFuncID );
		ourFuncID = item.id;
	};

	var startListening = function (plab, item, queue) {
		// console.log( 'dequeued @2:', item );
		if ( item.id === ourFuncID ) {
			// console.log( 'starting to listen' );
			emitter.off( 'dequeued', startListening );
			emitter.on( evnt, whenRun );
		}
	};


	emitter.removeAllListeners();
	if ( reset ) { bigs.playback._resetProxy(); }

	var ourFuncID;
	emitter.on( 'queued', getFuncID );
	// Start listening after func actually runs
	emitter.on( 'dequeued', startListening );

	// console.log('2: listening')
	// console.log( '========= debug: listening' );
	plab[ op ]( arg );

};  // End lastEvent()
