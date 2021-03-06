// setup-default.js

'use strict';

var SetUp = module.exports = function () {

	var Playback = require( '../../dist/Playback.js' );
	var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );

	var state = {};

	var emitter 	= state.emitter = new EventEmitter();  // Now has events
	state.stepper 	= { maxNumCharacters: 20 };
	state.delayer 	= { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
	state.playback 	= {};

	// Don't need this?
	state.playback.transformFragment = function ( frag ) {
		return frag;
	}
	state.playback.accelerate = function ( frag ) {
		return 1;  // speed up for testing
	};

	var parsedText = [
		[ 'Victorious,', 'you','brave', 'flag.' ],
		[ 'Delirious,', 'I', 'come', 'back.' ],
		[ '\n' ],
		[ 'Why,', 'oh', 'wattlebird?' ]
	];

	var plab = Playback( state );
	plab.process( parsedText );

	return { playback: plab, state: state, emitter: emitter };
};  // End setUp()
