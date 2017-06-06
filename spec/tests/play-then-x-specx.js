describe("When Playback calls", function() {

	var Playback = require( '../../dist/Playback.js' );
	var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );
	var runCombo = jasmine.runCombinationTestWith;

	var shortTime = 30,
		longTime  = 60,
		superLongTime = 300;

	var plab, state, parsedText, forward, bigs;
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

		bigs = { playback: plab, state: state };
	};  // End setUp()

	setUp();


	// Events that will be triggerd by the original call to 'play'
	var originalEvents = [
		'playBegin', 'playFinish',
			// 'resetBegin', 'resetFinish',
			// 'restartBegin', 'restartFinish',
			// 'pauseBegin', 'pauseFinish',
		'stopBegin', 'stopFinish',
			// 'closeBegin', 'closeFinish',
			// 'onceBegin', 'onceFinish',
			// 'resumeBegin', 'resumeFinish',
			// 'rewindBegin', 'rewindFinish',
			// 'fastForwardBegin', 'fastForwardFinish',
		'loopBegin', 'loopFinish',
		'newWordFragment',
			// 'loopSkip',
		'progress',
		'done'
	];

	var allEvents = [
		'playBegin', 'playFinish',
		// 'resetBegin', 'resetFinish',
		// 'restartBegin', 'restartFinish',
		// 'pauseBegin', 'pauseFinish',
		// 'stopBegin', 'stopFinish',
		// 'closeBegin', 'closeFinish',
		// 'onceBegin', 'onceFinish',
		// 'resumeBegin', 'resumeFinish',
		// 'rewindBegin', 'rewindFinish',
		// 'fastForwardBegin', 'fastForwardFinish',
		// 'loopBegin', 'loopFinish',
		// 'newWordFragment',
		// 'loopSkip',
		// 'progress',
		// 'done'
	];

	var allOps = [
		// 'play',
		// 'reset',
		// 'restart',
		// 'pause', 'stop', 'close',  // (proxies/variants for each other)
		// 'rewind',
		// 'fastForward',
		// 'toggle',
		// 'jumpWords',
		// 'jumpSentences',
		// 'nextWord',
		// 'nextSentence',
		// 'prevWord',
		// 'prevSentence',
		// 'jumpTo'
	];

	// // Asserts that will be triggered after 2nd operation is called
	// var assertsMap = {
	// 	'play': {
	// 				'playBegin': assertTriggered, 'playFinish': assertTriggered,
	// 		'resetBegin': assertNOTtriggered, 'resetFinish': assertNOTtriggered,
	// 		'restartBegin': assertNOTtriggered, 'restartFinish': assertNOTtriggered,
	// 		'pauseBegin': assertNOTtriggered, 'pauseFinish': assertNOTtriggered,
	// 				'stopBegin': assertTriggered, 'stopFinish': assertTriggered,
	// 		'closeBegin': assertNOTtriggered, 'closeFinish': assertNOTtriggered,
	// 		'onceBegin': assertNOTtriggered, 'onceFinish': assertNOTtriggered,
	// 		'resumeBegin': assertNOTtriggered, 'resumeFinish': assertNOTtriggered,
	// 		'rewindBegin': assertNOTtriggered, 'rewindFinish': assertNOTtriggered,
	// 		'fastForwardBegin': assertNOTtriggered, 'fastForwardFinish': assertNOTtriggered,
	// 				'loopBegin': assertTriggered, 'loopFinish': assertTriggered,
	// 				'newWordFragment': assertFrags,
	// 		'loopSkip': assertNOTtriggered,
	// 				'progress': assertProgress,
	// 				'done': assertTriggered
	// 	},
	// 	'reset': {
	// 		'playBegin': assertNOTtriggered, 'playFinish': assertNOTtriggered,
	// 			'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': assertNOTtriggered, 'restartFinish': assertNOTtriggered,
	// 		'pauseBegin': assertNOTtriggered, 'pauseFinish': assertNOTtriggered,
	// 		'stopBegin': assertNOTtriggered, 'stopFinish': assertNOTtriggered,
	// 		'closeBegin': assertNOTtriggered, 'closeFinish': assertNOTtriggered,
	// 			'onceBegin': null, 'onceFinish': null,
	// 			'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': assertNOTtriggered, 'rewindFinish': assertNOTtriggered,
	// 		'fastForwardBegin': assertNOTtriggered, 'fastForwardFinish': assertNOTtriggered,
	// 			'loopBegin': null, 'loopFinish': null,
	// 			'newWordFragment': null,
	// 		'loopSkip': assertNOTtriggered,
	// 			'progress': null,
	// 			'done': null
	// 	},
	// 	'restart': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'pause': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'stop': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'close': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'rewind': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'fastForward': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'toggle': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'jumpWords': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'jumpSentences': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'nextWord': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'nextSentence': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'prevWord': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'prevSentence': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	},
	// 	'jumpTo': {
	// 		'playBegin': null, 'playFinish': null,
	// 		'resetBegin': null, 'resetFinish': null,
	// 		'restartBegin': null, 'restartFinish': null,
	// 		'pauseBegin': null, 'pauseFinish': null,
	// 		'stopBegin': null, 'stopFinish': null,
	// 		'closeBegin': null, 'closeFinish': null,
	// 		'onceBegin': null, 'onceFinish': null,
	// 		'resumeBegin': null, 'resumeFinish': null,
	// 		'rewindBegin': null, 'rewindFinish': null,
	// 		'fastForwardBegin': null, 'fastForwardFinish': null,
	// 		'loopBegin': null, 'loopFinish': null,
	// 		'newWordFragment': null,
	// 		'loopSkip': null,
	// 		'progress': null,
	// 		'done': null
	// 	}
	// }

	// - .getProgress
	// - .getLength
	// - .getIndex


	// ------------ setup ------------

	var opsWith;

	var get2ndOp = function ( op2Name ) {
		return { op1: 'play', arg1: null, op2: op2Name, arg2: null }
	};
	var get2ndOpWith = function ( op2Name, arg2 ) {
		return { op1: 'play', arg1: null, op2: op2Name, arg2: arg2 }
	};
	var getOpsWith = function ( arg1, op2Name, arg2 ) {
		return { op1: 'play', arg1: arg1, op2: op2Name, arg2: arg2 }
	};


	// ------------ repeats ------------

	var getAlwaysTrue = function ( nth ) {
		return function returnTrue ( plbk, result ) {
			var callSecondOp = true;
			return callSecondOp
		};
	};

	var getTrueOnNth = function ( nth ) {
		var count = 1;
		return function trueOnNth ( plbk, result ) {

			var callSecondOp = false;
			if ( count === nth ) { callSecondOp = true; }
			// console.log( 'nthRepeat:', count, callSecondOp );

			count++;
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
	};

	var get_opAlways_collectAfterN = function ( collectIterNum ) {
		return { op2: getAlwaysTrue(), collect: getTrueAfterNthRepeat( collectIterNum ) };
	};
	var get_collectAfterN = get_opAlways_collectAfterN;

	var get_opOnN_collAfterN = function ( op2IterNum, collectIterNum ) {
		return { op2: getTrueOnNth( op2IterNum ), collect: getTrueAfterNthRepeat( collectIterNum ) };
	};

	// var get_opOnN_collAlways = function ( op2IterNum ) {
	// 	return { op2: getTrueOnNth( op2IterNum ), collect: getAlwaysTrue() };
	// };

	// var get_opOnN_collOnN = function ( op2IterNum, collectIterNum ) {
	// 	return { op2: getTrueOnNth( op2IterNum ), collect: getTrueOnNth( collectIterNum ) };
	// }

	// var checks_oneAndAlways = get_opOnN_collAlways( 1 ),
	// 	checks_both1 = get_opOnN_collAfterN( 1, 1 ),
	// 	checks_both2 = get_opOnN_collAfterN( 2, 2 ),
	// 	checks_both3 = get_opOnN_collAfterN( 3, 3 );

	// var checks_


	// ------------ events ------------

	var events;

	var getEvents = function ( firstEvent, secondEvent ) {
		return { one: firstEvent, two: secondEvent }
	};


	// ------------ asserts ------------

	var assertsMap;

	var assertFrags, assertProgress;

	var assertNOTtriggered = function assertNOTtriggered ( plbk, result, evnt ) {
		expect( result.args ).toEqual( [] );
		expect( result.frags ).toEqual( [] );
	};

	// No frags if not 'newWordFragment'
	var assertTriggered = function assertTriggered ( plbk, result, evnt ) {
		expect( result.args[0][0] ).toEqual( plab );
	};

	// asserts = {
	// 	triggered: assertTriggered,
	// 	notTriggered: assertNOTtriggered,
	// 	frags: null, progress: null
	// }


	// jasmine.runCombinationTestWith = function ( bigs, opsWith, events, checks, msTillAssert, assert, debug ) {
	/* (
	* 	{playback: {}, state: {}},
	* 	{op1: str, arg1: any, op2: str, arg2: any},
	* 	{one: str, two: str},
	* 	{op2: func, collect: func},
	* 	int,
	* 	func,
	* 	bool
	*  )
	*/


	// =========== DOUBLES ===========

	// ----------- play() -----------

	assertFrags = function assertFrags ( plbk, result, evnt ) {
		var minusStart = forward.slice(0);
		// Second play called after 'Victorious,' has already passed by
		minusStart.shift();

		expect( result.args[0][0] ).toEqual( plab );
		expect( result.frags ).toEqual( minusStart );
	};

	assertProgress = function assertProgress ( plbk, result, evnt ) {
		expect( result.args[0][0] ).toEqual( plab );

		expect( result.args.length ).toEqual( 12 );

		expect( result.args[0][1] ).toEqual( 1/12 );
		expect( result.args[2][1] ).toEqual( 0.25 );
		expect( result.args[5][1] ).toEqual( 0.5 );
		expect( result.args[8][1] ).toEqual( 0.75 );
		expect( result.args[11][1] ).toEqual( 1 );
	};


	// var forTriggered = [
	// 	'playBegin', 'playFinish',
	// 	'stopBegin', 'stopFinish',
	// 	'loopBegin', 'loopFinish',
	// 	'newWordFragment'
	// ]
	// var forFrags = [
	// 	'newWordFragment'
	// ]
	// var forProgress = [
	// 	'progress'
	// ]

	var standardAssertsMap = {
				'playBegin': assertTriggered, 'playFinish': assertTriggered,
		'resetBegin': assertNOTtriggered, 'resetFinish': assertNOTtriggered,
		'restartBegin': assertNOTtriggered, 'restartFinish': assertNOTtriggered,
		'pauseBegin': assertNOTtriggered, 'pauseFinish': assertNOTtriggered,
				'stopBegin': assertTriggered, 'stopFinish': assertTriggered,
		'closeBegin': assertNOTtriggered, 'closeFinish': assertNOTtriggered,
		'onceBegin': assertNOTtriggered, 'onceFinish': assertNOTtriggered,
		'resumeBegin': assertNOTtriggered, 'resumeFinish': assertNOTtriggered,
		'rewindBegin': assertNOTtriggered, 'rewindFinish': assertNOTtriggered,
		'fastForwardBegin': assertNOTtriggered, 'fastForwardFinish': assertNOTtriggered,
				'loopBegin': assertTriggered, 'loopFinish': assertTriggered,
				'newWordFragment': assertFrags,
		'loopSkip': assertNOTtriggered,
				'progress': assertProgress,
				'done': assertTriggered
	};

	var restartAssertsMap = {
		'playBegin': assertNOTtriggered, 'playFinish': assertNOTtriggered,
		'resetBegin': assertNOTtriggered, 'resetFinish': assertNOTtriggered,
				'restartBegin': assertTriggered, 'restartFinish': assertTriggered,
		'pauseBegin': assertNOTtriggered, 'pauseFinish': assertNOTtriggered,
				'stopBegin': assertTriggered, 'stopFinish': assertTriggered,
		'closeBegin': assertNOTtriggered, 'closeFinish': assertNOTtriggered,
		'onceBegin': assertNOTtriggered, 'onceFinish': assertNOTtriggered,
		'resumeBegin': assertNOTtriggered, 'resumeFinish': assertNOTtriggered,
		'rewindBegin': assertNOTtriggered, 'rewindFinish': assertNOTtriggered,
		'fastForwardBegin': assertNOTtriggered, 'fastForwardFinish': assertNOTtriggered,
				'loopBegin': assertTriggered, 'loopFinish': assertTriggered,
				'newWordFragment': assertFrags,
		'loopSkip': assertNOTtriggered,
				'progress': assertProgress,
				'done': assertTriggered
	};

	assertsMap = {
		// 'playBegin': standardAssertsMap, 'playFinish': standardAssertsMap,
		// 	'resetBegin': null, 'resetFinish': null,
		// 	'restartBegin': null, 'restartFinish': null,
		// 	'pauseBegin': null, 'pauseFinish': null,
		// 'stopBegin': restartAssertsMap, 'stopFinish': restartAssertsMap,
		// 	'closeBegin': null, 'closeFinish': null,
		// 	'onceBegin': null, 'onceFinish': null,
		// 	'resumeBegin': null, 'resumeFinish': null,
		// 	'rewindBegin': null, 'rewindFinish': null,
		// 	'fastForwardBegin': null, 'fastForwardFinish': null,
		// 'loopBegin': standardAssertsMap, 'loopFinish': standardAssertsMap,
		// 'newWordFragment': standardAssertsMap,
		// 	'loopSkip': null,
		// 'progress': standardAssertsMap,
		// 'done': restartAssertsMap
		'playBegin': 'testPlay', 'playFinish': 'testPlay',
			'resetBegin': null, 'resetFinish': null,
			'restartBegin': null, 'restartFinish': null,
			'pauseBegin': null, 'pauseFinish': null,
		'stopBegin': 'testRestart', 'stopFinish': 'testRestart',
			'closeBegin': null, 'closeFinish': null,
			'onceBegin': null, 'onceFinish': null,
			'resumeBegin': null, 'resumeFinish': null,
			'rewindBegin': null, 'rewindFinish': null,
			'fastForwardBegin': null, 'fastForwardFinish': null,
		'loopBegin': 'testPlay', 'loopFinish': 'testPlay',
		'newWordFragment': 'testPlay',
			'loopSkip': null,
		'progress': 'testPlay',
		'done': 'testRestart'
	};

	// For `.play()` and every possible event that could be triggered
	for ( let ev1i = 0; ev1i < originalEvents.length; ev1i++ ) {

		let event1 = originalEvents[ ev1i ];

		// // For every second operation
		// for ( let opi = 0; opi < allOps.length; opi++ ) {

			// let op2 = allOps[ opi ];

			let op2 = 'play';
			// 'play' and this operation with no arguments passed in
			opsWith = get2ndOp( op2 )

			// For every possible event for the second operation
			for ( let ev2i = 0; ev2i < allEvents.length; ev2i++ ) {

				let event2 = allEvents[ ev2i ],
					events = getEvents( event1, event2 );

				let thisAssert = null;

				let thisAssertMap = assertsMap[ event1 ]
				if ( thisAssertMap ) { thisAssert = thisAssertMap[ event2 ] }

				// console.log( event2, thisAssert );

				if ( thisAssert ) {
					runCombo( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false );
				}

			}  // End events for 2

		// }  // End 2nd op

	}  // End events for 1


	// // This is tricky - want to get what the 2nd `.play()` triggers, but not the 1st,
	// // but what about 'playFinish', of which there is only 1?
	// runCombo( bigs, opsWith, 'newWordFragment', checks_both1, longTime, assertFrags, false );
	



});
