// last-event.js

// var lastEvent = module.exports = function ( result, bigs, opWith, evnt, mayCollectCheck, msTillAssert, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, str, func, int, func, bool ) */
var lastEvent = module.exports = function ( doOnEvent, bigs, opWith, reset ) {
/* ( func, {playback, emitter}, {op, arg, event}, bool ) */

	var plab 	= bigs.playback,
		emitter = bigs.emitter;

	var op 	 = opWith.op,
		arg  = opWith.arg,
		evnt = opWith.event;


	whenRun = function ( one, two, three, four ) {

		// console.log( '1:', two );
		emitter.removeAllListeners();

		doOnEvent( evnt, one, two, three, four );

	};


	emitter.removeAllListeners();
	if ( reset ) { bigs.playback.reset(); }  // ??: Needed?

	// emitter.on( 'queued', function ( obj, item ) { console.log( 'queued @1:', item ) } );
	// emitter.on( 'dequeued', function ( obj, item ) { console.log( 'dequeued @1:', item ) } );

	emitter.on( evnt, whenRun );
	// console.log('1: listening')
	plab[ op ]( arg );

};  // End lastEvent()
