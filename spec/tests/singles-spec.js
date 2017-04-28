
var testText = "When Playback calls";
describe( testText, function() {

	var Playback = require( '../../dist/Playback.js' );
	var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );
	var runSimple = jasmine.runSimpleTestWith;

	var shortTime = 30,
		longTime  = 60;

	var plab, state, parsedText, forward, bigObjects;
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

		forward = parsedText[0].concat(parsedText[1].concat(parsedText[2]).concat(parsedText[3]));

		plab = Playback( state );
		plab.process( parsedText );

		bigObjects = { playback: plab, state: state };
	};  // End setUp()

	setUp();

	var jas = jasmine;
	
	// =========== SINGLES ===========

	// See 'spec/helpers/3-singles.js'

	// jas.testPlay( bigObjects, null, true, testText );
	// jas.testRestart( bigObjects, null, true, testText );
	// jas.testReset( bigObjects, null, true, testText );
	// jas.testPause( bigObjects, null, true, testText );
	// jas.testStop( bigObjects, null, true, testText );
	// jas.testClose( bigObjects, null, true, testText );
	// jas.testTogglePlayPause( bigObjects, null, true, testText );
	// jas.testRewind( bigObjects, null, true, testText );
	// jas.testFastForward( bigObjects, null, true, testText );
	// jas.testJumpWordsNegative1( bigObjects, null, true, testText );
	// jas.testJumpWords0( bigObjects, null, true, testText );
	// jas.testJumpWords3( bigObjects, null, true, testText );
	// jas.testJumpWords4( bigObjects, null, true, testText );
	// jas.testJumpWords11( bigObjects, null, true, testText );
	// jas.testJumpWords100( bigObjects, null, true, testText );
	// jas.testJumpSentencesNegative1( bigObjects, null, true, testText );
	// jas.testJumpSentences0( bigObjects, null, true, testText );
	// jas.testJumpSentences1( bigObjects, null, true, testText );
	// jas.testJumpSentences3( bigObjects, null, true, testText );
	// jas.testJumpSentences100( bigObjects, null, true, testText );
	// jas.testNextWord( bigObjects, null, true, testText );
	// jas.testNextSentence( bigObjects, null, true, testText );
	// jas.testPrevWord( bigObjects, null, true, testText );
	// jas.testPrevSentence( bigObjects, null, true, testText );
	// jas.testJumpToNegative1( bigObjects, null, true, testText );
	// jas.testJumpTo0( bigObjects, null, true, testText );
	// jas.testJumpTo6( bigObjects, null, true, testText );
	// jas.testJumpTo11( bigObjects, null, true, testText );
	// jas.testJumpTo100( bigObjects, null, true, testText );

	// xit("why isn't jumping causing an infinite loop in 'onceBegin'?")

});
