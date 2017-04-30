
var testText = "When Playback calls";
describe( testText, function() {

	this.testText = testText;

	this.Playback = require( '../../dist/Playback.js' );
	this.EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );
	this.runSimple = jasmine.runSimpleTestWith;


	this.setUp = function () {
		this.state = {};

		this.state.emitter = new this.EventEmitter();  // Now has events
		this.state.stepper = { maxNumCharacters: 20 };
		this.state.delayer = { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
		this.state.playback = {};
		// this.state.playback.transformFragment = function ( frag ) {
		// 	var changed = frag.replace(/[\n\r]+/g, '$@skip@$');
		// 	return changed;
		// }
		this.state.playback.transformFragment = function ( frag ) {
			return frag;
		}
		this.state.playback.accelerate = function ( frag ) {
			return 1;
		};

		this.parsedText = [
			[ 'Victorious,', 'you','brave', 'flag.' ],
			[ 'Delirious,', 'I', 'come', 'back.' ],
			[ '\n' ],
			[ 'Why,', 'oh', 'wattlebird?' ]
		];

		this.plab = this.Playback( this.state );
		this.plab.process( this.parsedText );

		this.bigObjects = { playback: this.plab, state: this.state };
	};  // End setUp()

	this.setUp();
	
	// =========== SINGLES ===========

	// See 'spec/helpers/3-singles.js'

	// jasmine.testPlay( this.bigObjects, null, true, this.testText );
	// jasmine.testRestart( this.bigObjects, null, true, this.testText );
	// jasmine.testReset( this.bigObjects, null, true, this.testText );
	// jasmine.testPause( this.bigObjects, null, true, this.testText );
	// jasmine.testStop( this.bigObjects, null, true, this.testText );
	// jasmine.testClose( this.bigObjects, null, true, this.testText );
	// jasmine.testTogglePlayPause( this.bigObjects, null, true, this.testText );
	// jasmine.testRewind( this.bigObjects, null, true, this.testText );
	// jasmine.testFastForward( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpWordsNegative1( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpWords0( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpWords3( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpWords4( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpWords11( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpWords100( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpSentencesNegative1( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpSentences0( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpSentences1( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpSentences3( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpSentences100( this.bigObjects, null, true, this.testText );
	// jasmine.testNextWord( this.bigObjects, null, true, this.testText );
	// jasmine.testNextSentence( this.bigObjects, null, true, this.testText );
	// jasmine.testPrevWord( this.bigObjects, null, true, this.testText );
	// jasmine.testPrevSentence( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpToNegative1( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpTo0( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpTo6( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpTo11( this.bigObjects, null, true, this.testText );
	// jasmine.testJumpTo100( this.bigObjects, null, true, this.testText );

	// xit("why isn't jumping causing an infinite loop in 'onceBegin'?")

});
