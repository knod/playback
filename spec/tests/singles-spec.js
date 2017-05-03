
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
		plab._reset();  // No event

	});

	// afterEach(function() {
	// 	// state.emitter.removeAllListeners();
	// 	// plab.reset();
	// });



	
	// =========== SINGLES ===========

	// See 'spec/helpers/3-singles.js'
	it("should", function () {
		jasmine.testPlay( bigObjects, null, true, testText );
	}, 100)
	it("should", function () {
		jasmine.testRestart( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testReset( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testPause( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testStop( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testClose( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testTogglePlayPause( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testRewind( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testFastForward( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpWordsNegative1( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpWords0( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpWords3( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpWords4( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpWords11( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpWords100( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpSentencesNegative1( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpSentences0( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpSentences1( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpSentences3( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpSentences100( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testNextWord( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testNextSentence( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testPrevWord( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testPrevSentence( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpToNegative1( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpTo0( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpTo6( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpTo11( bigObjects, null, true, testText );
	}, 100);
	it("should", function () {
		jasmine.testJumpTo100( bigObjects, null, true, testText );
	}, 100);

	// xit("why isn't jumping causing an infinite loop in 'onceBegin'?")

});
