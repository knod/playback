
describe("When Playback has", function() {

	var Playback = require( '../dist/Playback.js' );
	var EventEmitter = require( '../node_modules/wolfy87-eventemitter/EventEmitter.js' );
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


	var runTestWith = function ( plbk, op1, op2, toListenFor, op2Check, msTillAssert, assert, debug, arg1, arg2 ) {
	/*
	* 
	* `op1()` - initial function called at start
	* `op2()` - function called later in the `toListenFor` event
	* `toListenFor` - String name of event that will be listened for
	* 	and in which `op2Check()` and `op2()` will be run
	* `op2Check()` - should return Bool, ready to trigger opt2 or not,
	* 	will be given the `Playback` instance and the current result
	* `msTillAssert` - how long to let the events run before running the
	* 	assertion
	* `assert()` - will be given the `Playback` instance and an object
	* 	containing 1) all fragments collected 2) lists of all lists of
	* 	arguments collected
	* `debug` - option to trigger debug logs (in here or in `op`s)
	* 
	* ??: Add 'doneCheck' for an optional function to check if it's time
	* 	to call done early?
	*/
		describe( "`." + op2 + "()` with " + arg2 + " called after `." + op1 + "()` with " + arg1 + " on '" + toListenFor + "'", function () {

			var frags, args, result;
			msTillAssert = msTillAssert || 0;

			var whenRun = function ( arg1, arg2, arg3, arg4 ) {

				if ( op2Check && op2Check( plbk, result ) ) {
					op2Called = true;
					if ( op2 ) { plbk[ op2 ]( arg2, debug ); }
				}

				// I happen to know this will be the fragment some of the time
				// and, most of the time it'll be the argument I'm interested in.
				frags.push( arg2 );
				args.push( [ arg1, arg2, arg3, arg4 ] );

				if ( debug ) { console.log( '====== frag:', arg2, arg1.getIndex() ) }

			};  // End whenRun


			beforeEach(function ( done ) {
				frags = [], args = [], result = { frags: frags, args: args };

				plbk.reset();

				state.emitter.on( toListenFor, whenRun );

				plbk[ op1 ]( arg1, debug );

				setTimeout( done, (msTillAssert - (msTillAssert/4)) )

			}, msTillAssert );


			it("should...", function () {
				state.emitter.off( toListenFor, whenRun );
				if ( assert ) { assert( plbk, result ) }
			});

		});  // End describe

	};  // End runTestWith


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

	var getSimpleOpsWith = function ( op1Name ) {
		return { op1: op1Name, arg1: null, op2: null, arg2: null }
	};

	var getOpsWithOneArg = function ( op1Name, arg1 ) {
		return { op1: op1Name, arg1: arg1, op2: null, arg2: null }
	};

	var assertNOTtriggered = function( plbk, result ) {
		expect( result.args ).toEqual( [] );
		expect( result.frags ).toEqual( [] );
	};

	var assertTriggered = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		// No frags if not 'newWordFragment'
	};

	var getOneRepeat = function () {
		var count = 0;
		return function ( plbk, frag ) {
			if ( count > 0 ) { return false; }
			else { count++; }
		};
	};

	var assertFrags, assertProgress, opsWith;
	
	// =========== SINGLES ===========

	// ----------- play() -----------

	opsWith = getSimpleOpsWith( 'play' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( forward );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 12 );

		expect( result.args[0][1] ).toEqual( 1/12 );
		expect( result.args[2][1] ).toEqual( 0.25 );
		expect( result.args[5][1] ).toEqual( 0.5 );
		expect( result.args[8][1] ).toEqual( 0.75 );
		expect( result.args[11][1] ).toEqual( 1 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, longTime, assertFrags, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, longTime, assertProgress, false );


	// ----------- restart() -----------
	opsWith = getSimpleOpsWith( 'restart' );

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getOneRepeat(), longTime, assertFrags, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getOneRepeat(), longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getOneRepeat(), longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getOneRepeat(), longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', getOneRepeat(), longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', getOneRepeat(), longTime, assertProgress, false );


	// ----------- reset() -----------

	opsWith = getSimpleOpsWith( 'reset' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};


	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', getOneRepeat(), longTime, assertFrags, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', getOneRepeat(), longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', getOneRepeat(), longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', getOneRepeat(), longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', getOneRepeat(), longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', getOneRepeat(), longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', getOneRepeat(), longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', getOneRepeat(), longTime, assertProgress, false );


	// ----------- pause() -----------

	opsWith = getSimpleOpsWith( 'pause' );

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertNOTtriggered, false );


	// ----------- stop() -----------
	// Variant of `.pause()`

	opsWith = getSimpleOpsWith( 'stop' );

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertNOTtriggered, false );


	// ----------- close() -----------
	// Variant of `.pause()`

	opsWith = getSimpleOpsWith( 'close' );

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertNOTtriggered, false );


	// ----------- togglePlayPause() -----------

	opsWith = getSimpleOpsWith( 'togglePlayPause' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( forward );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 12 );

		expect( result.args[0][1] ).toEqual( 1/12 );
		expect( result.args[2][1] ).toEqual( 0.25 );
		expect( result.args[5][1] ).toEqual( 0.5 );
		expect( result.args[8][1] ).toEqual( 0.75 );
		expect( result.args[11][1] ).toEqual( 1 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, longTime, assertFrags, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, longTime, assertProgress, false );


	// ----------- rewind() -----------

	opsWith = getSimpleOpsWith( 'rewind' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- fastForward() -----------
	// One less word - first word not re-played

	opsWith = getSimpleOpsWith( 'fastForward' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		var ffwd = [ 'you','brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ];
		expect( result.frags ).toEqual( ffwd );
	};
	
	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 11 );

		expect( result.args[0][1] ).toEqual( 2/12 );
		expect( result.args[1][1] ).toEqual( 3/12 );
		expect( result.args[4][1] ).toEqual( 0.5 );
		expect( result.args[7][1] ).toEqual( 0.75 );
		expect( result.args[10][1] ).toEqual( 1 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, longTime, assertFrags, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, longTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, longTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, longTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, longTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, longTime, assertProgress, false );


	// ----------- jumpWords( -1 ) -----------

	opsWith = getOpsWithOneArg( 'jumpWords', -1 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpWords( 0 ) -----------

	opsWith = getOpsWithOneArg( 'jumpWords', 0 )

	// TODO: ??: Add abilit to get start of current word or current sentence?

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpWords( 3 ) -----------

	opsWith = getOpsWithOneArg( 'jumpWords', 3 )

	// // End of sentence

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['flag.'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 4/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpWords( 4 ) -----------

	opsWith = getOpsWithOneArg( 'jumpWords', 4 )

	// Start of next sentence

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Delirious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 5/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpWords( 11 ) -----------

	opsWith = getOpsWithOneArg( 'jumpWords', 11 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['wattlebird?'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 12/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpWords( 100 ) -----------

	opsWith = getOpsWithOneArg( 'jumpWords', 100 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['wattlebird?'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 12/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpSentences( -1 ) -----------

	opsWith = getOpsWithOneArg( 'jumpSentences', -1 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpSentences( 0 ) -----------

	opsWith = getOpsWithOneArg( 'jumpSentences', 0 )

	// TODO: ??: Add abilit to get start of current word or current sentence?

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpSentences( 1 ) -----------

	opsWith = getOpsWithOneArg( 'jumpSentences', 1 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Delirious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 5/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpSentences( 3 ) -----------

	opsWith = getOpsWithOneArg( 'jumpSentences', 3 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Why,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 10/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpSentences( 100 ) -----------

	opsWith = getOpsWithOneArg( 'jumpSentences', 100 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['wattlebird?'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 12/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- nextWord() -----------

	opsWith = getSimpleOpsWith( 'nextWord' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['you'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 2/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- nextSentence() -----------

	opsWith = getSimpleOpsWith( 'nextSentence' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Delirious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 5/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- prevWord() -----------

	opsWith = getSimpleOpsWith( 'prevWord' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- prevSentence() -----------

	opsWith = getSimpleOpsWith( 'prevSentence' );

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpTo( -1 ) -----------
	// Loops around to the end
	// ??: Should this really trigger 'done', etc.?

	opsWith = getOpsWithOneArg( 'jumpTo', -1 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['wattlebird?'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 12/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpTo( 0 ) -----------

	opsWith = getOpsWithOneArg( 'jumpTo', 0 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['Victorious,'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpTo( 6 ) -----------

	opsWith = getOpsWithOneArg( 'jumpTo', 6 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['come'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 7/12 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpTo( 11 ) -----------

	opsWith = getOpsWithOneArg( 'jumpTo', 11 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['wattlebird?'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );


	// ----------- jumpTo( 100 ) -----------

	opsWith = getOpsWithOneArg( 'jumpTo', 100 )

	assertFrags = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( ['wattlebird?'] );
	};

	assertProgress = function( plbk, result ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 1 );

		expect( result.args[0][1] ).toEqual( 1 );
	};

	jas.runSimpleTestWith( stuff, opsWith, 'newWordFragment', function () { return true; }, shortTime, assertFrags, false );

	jas.runSimpleTestWith( stuff, opsWith, 'playBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'playFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resetFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'restartFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'pauseFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	
	jas.runSimpleTestWith( stuff, opsWith, 'stopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'stopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'closeBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'closeFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'onceBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'onceFinish', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'resumeFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'rewindBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'rewindFinish', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardBegin', function () { return true; }, shortTime, assertNOTtriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'fastForwardFinish', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopBegin', function () { return true; }, shortTime, assertTriggered, false );
	jas.runSimpleTestWith( stuff, opsWith, 'loopFinish', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'loopSkip', function () { return true; }, shortTime, assertNOTtriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'done', function () { return true; }, shortTime, assertTriggered, false );

	jas.runSimpleTestWith( stuff, opsWith, 'progress', function () { return true; }, shortTime, assertProgress, false );



// - .getProgress
// - .getLength
// - .getIndex
	// =========== DOUBLES ===========
	var assert = function( plbk, result ) {
		expect( plbk._persistentAction ).toEqual( 'pause' );
		expect( result.frags ).toEqual( forward );
	};
	// runTestWith( stuff, 'play', 'play', 'newWordFragment', function () { return true; }, shortTime, assert, false );


	// =========== PAIRS ===========

	// ----------- Play -----------
	assert = function( plbk, result ) {
		expect( plbk._persistentAction ).toEqual( 'pause' );
		expect( result.frags ).toEqual( [ 'Victorious,' ].concat( forward ) );
	};
	// runTestWith( stuff, 'play', 'restart', 'newWordFragment', function () { return true; }, shortTime, assert, false );

	


	state.emitter.on('playBegin', function () {
		// console.log('Began play')
	});
	state.emitter.on('restartBegin', function () {
		// console.trace('Began restart');
	});



});
