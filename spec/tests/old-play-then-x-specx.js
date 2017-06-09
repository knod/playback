
describe("When Playback calls", function() {

	var Playback = require( '../../dist/Playback.js' );
	var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );
	var jas = jasmine;

	var shortTime = 30,
		longTime  = 60,
		superLongTime = 300;

	var plab, state, parsedText, forward, stuff;
	var setUp = function () {
		state = {};

		state.emitter = new EventEmitter();  // Now has events
		state.stepper = { maxNumCharacters: 20 };
		state.delayer = { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
		state.playback = {};
		// state.playback.transformFragment = function ( frag ) {
		// 	var changed = frag.replace(/[\n\r]+/g, '$$skip$$');
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

		stuff = { playback: plab, state: state };
	};  // End setUp()

	setUp();


	// var runTestWith = function ( plbk, op1, op2, toListenFor, op2Check, msTillAssert, assert, debug, arg1, arg2 ) {
	// /*
	// * 
	// * `op1()` - initial function called at start
	// * `op2()` - function called later in the `toListenFor` event
	// * `toListenFor` - String name of event that will be listened for
	// * 	and in which `op2Check()` and `op2()` will be run
	// * `op2Check()` - should return Bool, ready to trigger opt2 or not,
	// * 	will be given the `Playback` instance and the current result
	// * `msTillAssert` - how long to let the events run before running the
	// * 	assertion
	// * `assert()` - will be given the `Playback` instance and an object
	// * 	containing 1) all fragments collected 2) lists of all lists of
	// * 	arguments collected
	// * `debug` - option to trigger debug logs (in here or in `op`s)
	// * 
	// * ??: Add 'doneCheck' for an optional function to check if it's time
	// * 	to call done early?
	// */

	// - 'playBegin', 'playFinish'
	// - 'resetBegin', 'resetFinish'
	// - 'restartBegin', 'restartFinish'
	// - 'pauseBegin', 'pauseFinish'
	// - 'stopBegin', 'stopFinish'
	// - 'closeBegin', 'closeFinish'
	// - 'onceBegin', 'onceFinish'
	// - 'resumeBegin', 'resumeFinish'
	// - 'rewindBegin', 'rewindFinish'
	// - 'fastForwardBegin', 'fastForwardFinish'
	// - 'loopBegin', 'loopFinish'
	// - 'newWordFragment'
	// - 'loopSkip'
	// - 'progress'
	// - 'done'

	// - .play
	// - .reset
	// - .restart
	// - .pause, .stop, .close (proxies/variants for each other)
	// - .rewind
	// - .fastForward
	// - .toggle
	// - .jumpWords
	// - .jumpSentences
	// - .nextWord
	// - .nextSentence
	// - .prevWord
	// - .prevSentence
	// - .jumpTo
	// - .getProgress
	// - .getLength
	// - .getIndex

	// ------------ setup ------------

	var opsWith;

	var getSecondOpsWith = function ( op2Name ) {
		return { op1: 'play', arg1: null, op2: op2Name, arg2: null }
	};

	var getOpsWithOneArg = function ( op1Name, arg1 ) {
		return { op1: op1Name, arg1: arg1, op2: null, arg2: null }
	};

	// ------------ asserts ------------

	var assertFrags, assertProgress;

	var assertNOTtriggered = function( plbk, result, evnt ) {
		expect( result.args ).toEqual( [] );
		expect( result.frags ).toEqual( [] );
	};

	// No frags if not 'newWordFragment'
	var assertTriggered = function( plbk, result, evnt ) {
		expect( result.args[0][0] ).toEqual( plab );
	};

	// ------------ repeats ------------

	var getTrueOnFirstRepeat = function () {
		var count = 1;
		return function trueOnFirstRepeat ( plbk, result ) {

			var callSecondOp = false;
			if ( count === 1 ) { callSecondOp = true; }

			count++;
			return callSecondOp;
		};
	};

	var getTrueOnSecondRepeat = function () {
		var count = 1;
		return function trueOnSecondRepeat ( plbk, result ) {

			var callSecondOp = false;
			if ( count === 2 ) { callSecondOp = true; }
			// console.log( 'secondRepeat:', count, callSecondOp );

			count++;
			return callSecondOp;
		};
	};


	var getTrueOnNthGo = function ( nth ) {
		var count = 1;
		return function trueOnNthGo ( plbk, result ) {

			var callSecondOp = false;
			if ( count === nth ) { callSecondOp = true; }
			// console.log( 'nthRepeat:', count, callSecondOp );

			count++;
			return callSecondOp
		};
	};

	var getAlwaysTrue = function ( nth ) {
		return function returnTrue ( plbk, result ) {
			var callSecondOp = true;
			return callSecondOp
		};
	};

	var getTrueAfterNthRepeat = function ( nth ) {
		var count = 1;
		return function trueAfterNthRepeat ( plbk, result ) {

			var callSecondOp = true;
			if ( count <= nth ) { callSecondOp = false; }

			count++;
			return callSecondOp
		};
	};


	// ------------ checks ------------

	var get_allTrue = function () {
		return { op2: getAlwaysTrue(), collect: getAlwaysTrue() };
	}

	var get_opOnN_collAlways = function ( op2IterNum ) {
		return { op2: getTrueOnNthGo( op2IterNum ), collect: getAlwaysTrue() };
	}

	var get_opOnN_collAfterN = function ( op2IterNum, collectIterNum ) {
		return { op2: getTrueOnNthGo( op2IterNum ), collect: getTrueAfterNthRepeat( collectIterNum ) };
	}

	// var get_opOnN_collOnN = function ( op2IterNum, collectIterNum ) {
	// 	return { op2: getTrueOnNthGo( op2IterNum ), collect: getTrueOnNthGo( collectIterNum ) };
	// }

	var checks_oneAndAlways = get_opOnN_collAlways( 1 ),
		checks_both1 = get_opOnN_collAfterN( 1, 1 ),
		checks_both2 = get_opOnN_collAfterN( 2, 2 ),
		checks_both3 = get_opOnN_collAfterN( 3, 3 );


	// ------------ events ------------

	var events;

	var getEvents = function ( secondEvent ) {
		return { first: 'play', second: secondEvent }
	};


	
	// =========== DOUBLES ===========

	// // ----------- play() -----------

	// opsWith = getSecondOpsWith( 'play' );

	// assertFrags = function( plbk, result ) {
	// 	var minusStart = forward.slice(0);
	// 	// Second play called after 'Victorious,' has already passed by
	// 	minusStart.shift();

	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( minusStart );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 12 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// 	expect( result.args[2][1] ).toEqual( 0.25 );
	// 	expect( result.args[5][1] ).toEqual( 0.5 );
	// 	expect( result.args[8][1] ).toEqual( 0.75 );
	// 	expect( result.args[11][1] ).toEqual( 1 );
	// };

	// events = getEvents( 'play' );

	// // This is tricky - want to get what the 2nd `.play()` triggers, but not the 1st,
	// // but what about 'playFinish', of which there is only 1?
	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', checks_both1, longTime, assertFrags, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', checks_oneAndAlways, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', checks_oneAndAlways, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', checks_oneAndAlways, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', checks_oneAndAlways, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', checks_oneAndAlways, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', checks_oneAndAlways, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', checks_oneAndAlways, longTime, assertProgress, false );


	// // ----------- restart() -----------
	// opsWith = getSecondOpsWith( 'restart' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( forward );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 12 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// 	expect( result.args[2][1] ).toEqual( 0.25 );
	// 	expect( result.args[5][1] ).toEqual( 0.5 );
	// 	expect( result.args[8][1] ).toEqual( 0.75 );
	// 	expect( result.args[11][1] ).toEqual( 1 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', checks_both3, longTime, assertFrags, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', checks_both1, longTime, assertProgress, false );


	// // ----------- reset() -----------

	// opsWith = getSecondOpsWith( 'reset' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };


	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', checks_both1, longTime, assertFrags, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', checks_both1, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', checks_both1, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', checks_both1, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', checks_both1, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', checks_both1, longTime, assertProgress, false );


	// // ----------- pause() -----------

	// opsWith = getSecondOpsWith( 'pause' );

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertNOTtriggered, false );


	// // ----------- stop() -----------
	// // Variant of `.pause()`

	// opsWith = getSecondOpsWith( 'stop' );

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertNOTtriggered, false );


	// // ----------- close() -----------
	// // Variant of `.pause()`

	// opsWith = getSecondOpsWith( 'close' );

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertNOTtriggered, false );


	// // ----------- toggle() -----------

	// opsWith = getSecondOpsWith( 'toggle' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( forward );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 12 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// 	expect( result.args[2][1] ).toEqual( 0.25 );
	// 	expect( result.args[5][1] ).toEqual( 0.5 );
	// 	expect( result.args[8][1] ).toEqual( 0.75 );
	// 	expect( result.args[11][1] ).toEqual( 1 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, longTime, assertFrags, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, longTime, assertProgress, false );


	// // ----------- rewind() -----------

	// opsWith = getSecondOpsWith( 'rewind' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- fastForward() -----------
	// // One less word - first word not re-played

	// opsWith = getSecondOpsWith( 'fastForward' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	var ffwd = [ 'you','brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ];
	// 	expect( result.frags ).toEqual( ffwd );
	// };
	
	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 11 );

	// 	expect( result.args[0][1] ).toEqual( 2/12 );
	// 	expect( result.args[1][1] ).toEqual( 3/12 );
	// 	expect( result.args[4][1] ).toEqual( 0.5 );
	// 	expect( result.args[7][1] ).toEqual( 0.75 );
	// 	expect( result.args[10][1] ).toEqual( 1 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, longTime, assertFrags, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, longTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, longTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, longTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, longTime, assertProgress, false );


	// // ----------- jumpWords( -1 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpWords', -1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpWords( 0 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpWords', 0 )

	// // TODO: ??: Add abilit to get start of current word or current sentence?

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpWords( 3 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpWords', 3 )

	// // // End of sentence

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['flag.'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 4/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpWords( 4 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpWords', 4 )

	// // Start of next sentence

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Delirious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 5/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpWords( 11 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpWords', 11 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpWords( 100 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpWords', 100 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpSentences( -1 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpSentences', -1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 0 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpSentences', 0 )

	// // TODO: ??: Add abilit to get start of current word or current sentence?

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 1 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpSentences', 1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Delirious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 5/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 3 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpSentences', 3 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Why,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 10/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 100 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpSentences', 100 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- nextWord() -----------

	// opsWith = getSecondOpsWith( 'nextWord' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['you'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 2/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- nextSentence() -----------

	// opsWith = getSecondOpsWith( 'nextSentence' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Delirious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 5/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- prevWord() -----------

	// opsWith = getSecondOpsWith( 'prevWord' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- prevSentence() -----------

	// opsWith = getSecondOpsWith( 'prevSentence' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpTo( -1 ) -----------
	// // Loops around to the end
	// // ??: Should this really trigger 'done', etc.?

	// opsWith = getOpsWithOneArg( 'jumpTo', -1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpTo( 0 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpTo', 0 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpTo( 6 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpTo', 6 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['come'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 7/12 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpTo( 11 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpTo', 11 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// // ----------- jumpTo( 100 ) -----------

	// opsWith = getOpsWithOneArg( 'jumpTo', 100 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1 );
	// };

	// jas.runCombinationTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'playBegin', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'playFinish', checks_both2, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	// jas.runCombinationTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	// jas.runCombinationTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	// jas.runCombinationTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );

});
