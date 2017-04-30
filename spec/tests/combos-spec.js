// combos-spec.js
// There should be a limited number of these. Finding them
// through 'find-unusual-tests-spec.js'

var testText = "When Playback calls";
describe( testText, function() {

	var Playback = require( '../../dist/Playback.js' );
	var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );
	var runSimple = jasmine.runSimpleTestWith;

	var waitTime = 45;

	var plab, state, parsedText, forward, bigObjects;
	var setUp = function () {
		state = {};

		state.emitter = new EventEmitter();  // Now has events
		state.stepper = { maxNumCharacters: 20 };
		state.delayer = { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
		state.playback = {};
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
	var runCombo = jas.runComboTestWith;
	
	// =========== DOUBLES ===========

	// Why isn't play > rewind in here? It should have different word fragments.





	// =========================================
	// NEW
	// =========================================

	var getOpsWith = function ( op1Name, arg1, op2Name, arg2 ) {
		return { op1: op1Name, arg1: arg1, op2: op2Name, arg2: arg2 }
	};

	var getEvents = function ( firstEvent, secondEvent ) {
		return { one: firstEvent, two: secondEvent }
	};

	var alwaysTrue = function () { return true; };  // TODO: Not needed anymore?

	var get_allTrue = function () {
		return { op2: alwaysTrue, collect: alwaysTrue };
	};


	var asserts = {
		not: function( plbk, result, testText, eventName ) {

			// var shouldFail = checkExpectedToFail( testText );
			// if ( shouldFail ) {
			// 	// Nothing is expected, it's failing for good reasons
			// } else {
				expect( result.args ).toEqual( [] );
				expect( result.arg2s ).toEqual( [] );
			// }
		},

		triggered: function( plbk, result, testText, eventName ) {

			// var shouldFail = checkExpectedToFail( testText );
			// if ( shouldFail ) {
			// 	// Nothing is expected, it's failing for good reasons
			// } else {
				// No frags if not 'newWordFragment'
				// expect( result.args[0][0] ).toBe( plbk );
				// console.log( 'assert trigger:', result, eventName );
				expect( result.args[0][0] ).toBe( plab );
			// }
		}
	};



	var callAll = function ( bigs, opWith, eventAssertions, whenToCollect, waitTime, reset, testText ) {
		bigs.state.emitter.removeAllListeners();
		for ( var evai = 0; evai < eventAssertions.length; evai++ ) {
			plab.reset()
			runCombo( bigs, opWith, eventAssertions[ evai ], whenToCollect, waitTime, reset, testText );
		}
	};


	// // ------------- 'play' -------------

	// var opsWith = getOpsWith( 'play', null, 'play', null );
	// var eventAsserts = [
	// 	// Doesn't get triggered because the first event never gets triggered
	// 	{ event1: 'resetFinish', event2: 'playBegin', assertion: asserts.not },
	// 	{ event1: 'resetFinish', event2: 'playFinish', assertion: asserts.not },
	// 	{ event1: 'resetFinish', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'resetFinish', event2: 'restartFinish', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'playBegin', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'playFinish', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'restartFinish', assertion: asserts.not }
	// ];

	// callAll( bigObjects, opsWith, eventAsserts, get_allTrue(), waitTime, true, testText );


	// // ------------- 'reset' -------------

	// var opsWith = getOpsWith( 'reset', null, 'play', null );
	// var eventAsserts = [
	// 	{ event1: 'resetFinish', event2: 'playBegin', assertion: asserts.triggered },
	// 	{ event1: 'resetFinish', event2: 'playFinish', assertion: asserts.triggered },
	// 	{ event1: 'resetFinish', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'resetFinish', event2: 'restartFinish', assertion: asserts.not },
	// 	// Doesn't get triggered because the first event never gets triggered
	// 	{ event1: 'restartFinish', event2: 'playBegin', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'playFinish', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'restartFinish', assertion: asserts.not }
	// ];

	// callAll( bigObjects, opsWith, eventAsserts, get_allTrue(), waitTime, true, testText );


	// // FAILING SEQUENCES
	// // play,  restartFinish, play, playBegin, 		restart, playBegin, play, playBegin
	// // play,  restartFinish, play, playFinish, 		restart, playBegin, play, playBegin
	// // play,  restartFinish, play, restartBegin, 	restart, playBegin, play, playBegin
	// // play,  restartFinish, play, restartFinish, 	restart, playBegin, play, playBegin

	// // play,  restartFinish, play, playBegin, 		restart, playBegin, play, playFinish
	// // play,  restartFinish, play, playFinish, 		restart, playBegin, play, playFinish
	// // play,  restartFinish, play, restartBegin, 	restart, playBegin, play, playFinish
	// // play,  restartFinish, play, restartFinish, 	restart, playBegin, play, playFinish

	// // reset, restartFinish, play, playBegin, 		restart, playBegin, play, playBegin
	// // reset, restartFinish, play, playFinish, 		restart, playBegin, play, playBegin
	// // reset, restartFinish, play, restartBegin, 	restart, playBegin, play, playBegin
	// // reset, restartFinish, play, restartFinish, 	restart, playBegin, play, playBegin

	// // reset, restartFinish, play, playBegin, 		restart, playBegin, play, playFinish
	// // reset, restartFinish, play, playFinish, 		restart, playBegin, play, playFinish
	// // reset, restartFinish, play, restartBegin, 	restart, playBegin, play, playFinish
	// // reset, restartFinish, play, restartFinish, 	restart, playBegin, play, playFinish

	// // same with
	// // reset, restartFinish, play, restartFinish, 	restart, playFinish, play, playBegin/Finish

	// // COMMONALITIES
	// // reset/play/rewind (basically, not restart), restartBegin/Finish, play, x, restart, playBegin/Finish, play, playBegin/Finish
	// // !restart, ..., restart, playBegin/Finish (shouldn't be triggered), play, playBegin/Finish


	// // ------------- 'restart' -------------
	// // TODO: Damn - even if the first event doesn't happen, I want to listen for the second event. How to do that?!?!
	// // What if they're the same event!!!
	// var opsWith = getOpsWith( 'restart', null, 'play', null );
	// var eventAsserts = [
	// 	// Doesn't get triggered because the first event never gets triggered
	// 	// TODO: !!!: HOW IS THIS TRIGGERED IN THE test-tests (showing us the triggered versions as failures)?
		

	// 	{ event1: 'playBegin', event2: 'playBegin', assertion: asserts.not },
	// 	{ event1: 'playBegin', event2: 'playFinish', assertion: asserts.not },

	// 	{ event1: 'playBegin', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'playBegin', event2: 'restartFinish', assertion: asserts.not },


	// 	{ event1: 'playFinish', event2: 'playBegin', assertion: asserts.not },
	// 	{ event1: 'playFinish', event2: 'playFinish', assertion: asserts.not },


	// 	{ event1: 'playFinish', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'playFinish', event2: 'restartFinish', assertion: asserts.not },
	// 	// TODO: !!!: WHY IS 'resetBegin' NOT IN HERE? (I added it in after the fact just to check)
	// 	{ event1: 'resetBegin', event2: 'playBegin', assertion: asserts.not },
	// 	{ event1: 'resetBegin', event2: 'playFinish', assertion: asserts.not },
	// 	{ event1: 'resetBegin', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'resetBegin', event2: 'restartFinish', assertion: asserts.not },
	// 	// TODO: !!!: OR, CONVERSLEY, WHY _IS_ 'resetFinish' IN HERE?
	// 	{ event1: 'resetFinish', event2: 'playBegin', assertion: asserts.not },
	// 	{ event1: 'resetFinish', event2: 'playFinish', assertion: asserts.not },
	// 	{ event1: 'resetFinish', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'resetFinish', event2: 'restartFinish', assertion: asserts.not },

	// 	{ event1: 'restartBegin', event2: 'playBegin', assertion: asserts.triggered },
	// 	{ event1: 'restartBegin', event2: 'playFinish', assertion: asserts.triggered },

	// 	{ event1: 'restartBegin', event2: 'restartBegin', assertion: asserts.not },
	// 	// When 'play' is called, 'restartFinish' (from the original 'restart') hasn't fired yet, so then it fires
	// 	{ event1: 'restartBegin', event2: 'restartFinish', assertion: asserts.triggered },
	// 	{ event1: 'restartFinish', event2: 'playBegin', assertion: asserts.triggered },
	// 	{ event1: 'restartFinish', event2: 'playFinish', assertion: asserts.triggered },

	// 	{ event1: 'restartFinish', event2: 'restartBegin', assertion: asserts.not },
	// 	{ event1: 'restartFinish', event2: 'restartFinish', assertion: asserts.not }
	// ];

	// callAll( bigObjects, opsWith, eventAsserts, get_allTrue(), waitTime, true, testText );


});
