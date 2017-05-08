// first-event.js

// var firstEvent = module.exports = function ( result, bigs, opWith, evnt, mayCollectCheck, msTillAssert, reset ) {
/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, str, func, int, func, bool ) */
var firstEvent = module.exports = function ( doOnEvent, bigs, opWith, reset ) {
/* ( func, {playback, emitter}, {op, arg, event}, bool ) */

	var plab 	= bigs.playback,
		emitter = bigs.emitter;

	var op 	 = opWith.op,
		arg  = opWith.arg,
		evnt = opWith.event;


	whenRun = function ( one, two, three, four ) {

if ( evnt === 'rewindBegin' ) { console.log('1: rewoundBegun') }
		emitter.removeAllListeners();
		doOnEvent( evnt, one, two, three, four );

	};


	emitter.removeAllListeners();
	if ( reset ) { bigs.playback.reset(); }  // ??: Needed?

	emitter.on( evnt, whenRun );
	plab[ op ]( arg );

};  // End firstEvent()
