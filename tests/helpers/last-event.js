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


	whenRun = function ( one, two, three, four ) {

		// Debugging
		// console.log( '2:', evnt );
		// if ( evnt ) { console.log( '2:', one.getIndex(), evnt, two ) }
		// console.log( '2:' )
		// console.trace( count, 'event === null', eventAssertion === null );
		// count++;
		// if ( op === 'reset' && evnt === 'newWordFragment' ) { console.log( '2:', two ); }
		// console.log( '2:', count, op, evnt );

		result.playback = one;
		// I happen to know this will be the fragment some of the time
		// and, most of the time it'll be the argument I'm interested in.
		result.arg2s.push( two );

	};


	emitter.removeAllListeners();
	if ( reset ) { bigs.playback.reset(); }  // ??: Needed?

	emitter.on( evnt, whenRun );
	// console.log( '========= debug: listening' );
	plab[ op ]( arg );

};  // End oneEvent()
