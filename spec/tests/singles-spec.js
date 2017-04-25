
describe("When Playback calls", function() {

	var Playback = require( '../../dist/Playback.js' );
	var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );
	var jas = jasmine;

	var shortTime = 30,
		longTime  = 60;

	var plab, state, parsedText, forward, stuff;
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

		stuff = { playback: plab, state: state };
	};  // End setUp()

	setUp();

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
	// - .togglePlayPause
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

	// jasmine.runSimpleTestWith = function ( bigs, opWith, evnt, mayCollectCheck, msTillAssert, assert, debug ) {
	// /* ( {playback, state}, {op, arg}, str, func, int, func, bool ) */
	// };


	// ------------ setup ------------

	var opWith;

	var getSingleOpWith = function ( opName ) {
		return { op: opName, arg: null }
	};

	var getOpWithOneArg = function ( opName, arg ) {
		return { op: opName, arg: arg }
	};


	var getAlwaysTrue = function () {
		return true;
	};


	// ------------ asserts ------------

	var assertFrags, assertProgress;

	var assertNOTtriggered = function( plbk, result ) {
		expect( result.args ).toEqual( [] );
		expect( result.frags ).toEqual( [] );
	};

	var assertTriggered = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		// No frags if not 'newWordFragment'
	};




	
	// =========== SINGLES ===========

	// // ----------- play() -----------

	// opWith = getSingleOpWith( 'play' );

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

	// jas.runSimpleTestWith( stuff, opWith, 'newWordFragment', getAlwaysTrue, longTime, assertFrags, false );
	
	// jas.runSimpleTestWith( stuff, opWith, 'playBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'playFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opWith, 'resetBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'resetFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'restartBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'restartFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'pauseBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'pauseFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opWith, 'stopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'stopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opWith, 'closeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'closeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'onceBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'onceFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'resumeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'resumeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'rewindBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'rewindFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'fastForwardBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'fastForwardFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opWith, 'loopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opWith, 'loopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opWith, 'loopSkip', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opWith, 'done', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opWith, 'progress', getAlwaysTrue, longTime, assertProgress, false );


	// // // ----------- restart() -----------

	// opsWith = getSingleOpWith( 'restart' );

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

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, longTime, assertFrags, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, longTime, assertProgress, false );


	// // ----------- reset() -----------

	// opsWith = getSingleOpWith( 'reset' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };


	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, longTime, assertFrags, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, longTime, assertProgress, false );


	// // ----------- pause() -----------

	// opsWith = getSingleOpWith( 'pause' );

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertNOTtriggered, false );


	// // ----------- stop() -----------
	// // Variant of `.pause()`

	// opsWith = getSingleOpWith( 'stop' );

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertNOTtriggered, false );


	// // ----------- close() -----------
	// // Variant of `.pause()`

	// opsWith = getSingleOpWith( 'close' );

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertNOTtriggered, false );


	// // ----------- togglePlayPause() -----------

	// opsWith = getSingleOpWith( 'togglePlayPause' );

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

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, longTime, assertFrags, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, longTime, assertProgress, false );


	// // ----------- rewind() -----------

	// opsWith = getSingleOpWith( 'rewind' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- fastForward() -----------
	// // One less word - first word not re-played

	// opsWith = getSingleOpWith( 'fastForward' );

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

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, longTime, assertFrags, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, longTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, longTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, longTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, longTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, longTime, assertProgress, false );


	// // ----------- jumpWords( -1 ) -----------

	// opsWith = getOpWithOneArg( 'jumpWords', -1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpWords( 0 ) -----------

	// opsWith = getOpWithOneArg( 'jumpWords', 0 )

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

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpWords( 3 ) -----------

	// opsWith = getOpWithOneArg( 'jumpWords', 3 )

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

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpWords( 4 ) -----------

	// opsWith = getOpWithOneArg( 'jumpWords', 4 )

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

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpWords( 11 ) -----------

	// opsWith = getOpWithOneArg( 'jumpWords', 11 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpWords( 100 ) -----------

	// opsWith = getOpWithOneArg( 'jumpWords', 100 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpSentences( -1 ) -----------

	// opsWith = getOpWithOneArg( 'jumpSentences', -1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 0 ) -----------

	// opsWith = getOpWithOneArg( 'jumpSentences', 0 )

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

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 1 ) -----------

	// opsWith = getOpWithOneArg( 'jumpSentences', 1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Delirious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 5/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 3 ) -----------

	// opsWith = getOpWithOneArg( 'jumpSentences', 3 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Why,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 10/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpSentences( 100 ) -----------

	// opsWith = getOpWithOneArg( 'jumpSentences', 100 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- nextWord() -----------

	// opsWith = getSingleOpWith( 'nextWord' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['you'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 2/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- nextSentence() -----------

	// opsWith = getSingleOpWith( 'nextSentence' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Delirious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 5/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- prevWord() -----------

	// opsWith = getSingleOpWith( 'prevWord' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- prevSentence() -----------

	// opsWith = getSingleOpWith( 'prevSentence' );

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpTo( -1 ) -----------
	// // Loops around to the end
	// // ??: Should this really trigger 'done', etc.?

	// opsWith = getOpWithOneArg( 'jumpTo', -1 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 12/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpTo( 0 ) -----------

	// opsWith = getOpWithOneArg( 'jumpTo', 0 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['Victorious,'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpTo( 6 ) -----------

	// opsWith = getOpWithOneArg( 'jumpTo', 6 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['come'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 7/12 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpTo( 11 ) -----------

	// opsWith = getOpWithOneArg( 'jumpTo', 11 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );


	// // ----------- jumpTo( 100 ) -----------

	// opsWith = getOpWithOneArg( 'jumpTo', 100 )

	// assertFrags = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );
	// 	expect( result.frags ).toEqual( ['wattlebird?'] );
	// };

	// assertProgress = function( plbk, result ) {
	// 	expect( result.args[0][0] ).toEqual( plab );

	// 	expect( result.args.length ).toEqual( 1 );

	// 	expect( result.args[0][1] ).toEqual( 1 );
	// };

	// jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getAlwaysTrue, shortTime, assertFrags, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	
	// jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getAlwaysTrue, shortTime, assertTriggered, false );  // TODO: Why not infinite loop?
	// jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getAlwaysTrue, shortTime, assertNOTtriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getAlwaysTrue, shortTime, assertTriggered, false );
	// jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getAlwaysTrue, shortTime, assertNOTtriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'done', getAlwaysTrue, shortTime, assertTriggered, false );

	// jas.runSimpleTestWith( stuff, opsWith, 'progress', getAlwaysTrue, shortTime, assertProgress, false );

	xit("why isn't jumping causing an infinite loop in 'onceBegin'?")

});
