
'use strict'

// ---- Before all so it won't accumulate in `describe` --- \\

var Playback = require( '../../dist/Playback.js' );
var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );


var state, parsedText, plab, bigObjects;

var setUp = function () {
	state = {};

	state.emitter = new EventEmitter();  // Now has events
	state.stepper = { maxNumCharacters: 20 };
	state.delayer = { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
	state.playback = {};
	// state.playback.transformFragment = function ( frag ) {
	// 	var changed = frag.replace(/[\n\r]+/g, '$@skip@$');
	// 	return changed;
	// }
	state.playback.transformFragment = function ( frag ) {
		return frag;
	}
	state.playback.accelerate = function ( frag ) {
		return 1;
	};

	parsedText = [
		[ 'Victorious,', 'you','brave', 'flag.' ],
		[ 'Delirious,', 'I', 'come', 'back.' ],
		[ '\n' ],
		[ 'Why,', 'oh', 'wattlebird?' ]
	];

	plab = Playback( state );
	plab.process( parsedText );

	bigObjects = { playback: plab, state: state };
};  // End setUp()

setUp();

var testText = "When Playback calls";

var count = 100;

// ---- Initiate tests --- \\
describe( testText, function() {

	beforeEach(function () {

		state.emitter.removeAllListeners();  // THIS HAS TO COME FIRST!!!
		plab._reset();
		// jasmine.clock().install();

		// this.result = null;
		// console.log( 'result:', this.result );

		// None of these are defined in here
		// // ??: Needed?
		// thisText = null;
		// lastText = "it should return...";

		// // ??: Needed?
		// result 	= null;
		// whenRun = null;

		// // ??: Needed?
		// bigs 			= null;
		// opWith 			= null;
		// console.log('~~~~~~~~~~~~~~~')
		// evntAssertion 	= null;
		// mayCollectCheck = null;
		// msTillAssert 	= null;
		// reset 			= null;
		// testText 		= null;

	});

	afterEach(function() {
		// state.emitter.removeAllListeners();
		// plab.reset();
		// jasmine.clock().uninstall();
	});



	
	// =========== SINGLES ===========

	// See 'spec/helpers/3-singles.js'

	// jasmine.testPlay( bigObjects, null, true, testText );
	// jasmine.testRestart( bigObjects, null, true, testText );
	// jasmine.testReset( bigObjects, null, true, testText );
	// jasmine.testPause( bigObjects, null, true, testText );
	// jasmine.testStop( bigObjects, null, true, testText );
	// jasmine.testClose( bigObjects, null, true, testText );
	// jasmine.testTogglePlayPause( bigObjects, null, true, testText );
	// jasmine.testRewind( bigObjects, null, true, testText );
	// jasmine.testFastForward( bigObjects, null, true, testText );
	// jasmine.testJumpWordsNegative1( bigObjects, null, true, testText );
	// jasmine.testJumpWords0( bigObjects, null, true, testText );
	// jasmine.testJumpWords3( bigObjects, null, true, testText );
	// jasmine.testJumpWords4( bigObjects, null, true, testText );
	// jasmine.testJumpWords11( bigObjects, null, true, testText );
	// jasmine.testJumpWords100( bigObjects, null, true, testText );
	// jasmine.testJumpSentencesNegative1( bigObjects, null, true, testText );
	// jasmine.testJumpSentences0( bigObjects, null, true, testText );
	// jasmine.testJumpSentences1( bigObjects, null, true, testText );
	// jasmine.testJumpSentences3( bigObjects, null, true, testText );
	// jasmine.testJumpSentences100( bigObjects, null, true, testText );
	// jasmine.testNextWord( bigObjects, null, true, testText );
	// jasmine.testNextSentence( bigObjects, null, true, testText );
	// jasmine.testPrevWord( bigObjects, null, true, testText );
	// jasmine.testPrevSentence( bigObjects, null, true, testText );
	// jasmine.testJumpToNegative1( bigObjects, null, true, testText );
	// jasmine.testJumpTo0( bigObjects, null, true, testText );
	// jasmine.testJumpTo6( bigObjects, null, true, testText );
	// jasmine.testJumpTo11( bigObjects, null, true, testText );
	// jasmine.testJumpTo100( bigObjects, null, true, testText );

	// xit("why isn't jumping causing an infinite loop in 'onceBegin'?")

});
