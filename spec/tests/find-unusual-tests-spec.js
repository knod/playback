
'use strict'

// ---- Before all so it won't accumulate in `describe` --- \\

var testing = false;  // Quick toggle

var Playback 	 = require( '../../dist/Playback.js' );
var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );

// var shortTime = 30,
// 	longTime  = 60,
// 	superLongTime = 300;

var shortTime = 80,
	longTime  = 80,
	superLongTime = 300;

var plab, state, parsedText, forward, bigs;
var setUp = function () {
	state = {};

	state.emitter 	= new EventEmitter();  // Now has events
	state.stepper 	= { maxNumCharacters: 20 };
	state.delayer 	= { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 10; } };  // Speed it up a bit for testing
	state.playback 	= {};
	// state.playback.transformFragment = function ( frag ) {
	// 	var changed = frag.replace(/[\n\r]+/g, '$@skip@$');
	// 	return changed;
	// }
	state.playback.transformFragment = function ( frag ) {
		return frag;
	};
	state.playback.accelerate = function ( frag ) {
		return 10;
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


// ------------ setup ------------

// var get2ndOp = function ( op2Name ) {
// 	return { op1: 'play', arg1: null, op2: op2Name, arg2: null }
// };
// var get2ndOpWith = function ( op2Name, arg2 ) {
// 	return { op1: 'play', arg1: null, op2: op2Name, arg2: arg2 }
// };
var getOpsWith = function ( op1Name, arg1, op2Name, arg2 ) {
	return { op1: op1Name, arg1: arg1, op2: op2Name, arg2: arg2 }
};


// ------------ repeats ------------

var getAlwaysTrue = function ( nth ) {
	return function returnTrue ( plbk, result ) {
		return true;
	};
};

// var getTrueOnNth = function ( nth ) {
// 	var count = 1;
// 	return function trueOnNth ( plbk, result ) {

// 		var callSecondOp = false;
// 		if ( count === nth ) { callSecondOp = true; }
// 		// console.log( 'nthRepeat:', count, callSecondOp );

// 		count++;
// 		return callSecondOp
// 	};
// };

// var getTrueAfterNthRepeat = function ( nth ) {
// 	var count = 1;
// 	return function trueAfterNthRepeat ( plbk, result ) {

// 		var callSecondOp = true;
// 		if ( count <= nth ) { callSecondOp = false; }

// 		count++;
// 		return callSecondOp
// 	};
// };


// ------------ checks ------------

var get_allTrue = function () {
	return { op1: getAlwaysTrue(), collect: getAlwaysTrue() };
};

// var get_opAlways_collectAfterN = function ( collectIterNum ) {
// 	return { op2: getAlwaysTrue(), collect: getTrueAfterNthRepeat( collectIterNum ) };
// };
// var get_collectAfterN = get_opAlways_collectAfterN;

// var get_opOnN_collAfterN = function ( op2IterNum, collectIterNum ) {
// 	return { op2: getTrueOnNth( op2IterNum ), collect: getTrueAfterNthRepeat( collectIterNum ) };
// };

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


// ------------ events ------------

var events;

var getEvents = function ( firstEvent, secondEvent ) {
	return { one: firstEvent, two: secondEvent }
};


// // ------------ asserts ------------

// var assertsMap;

// var assertFrags, assertProgress;

// var assertNOTtriggered = function assertNOTtriggered ( plbk, result, evnt ) {
// 	expect( result.args ).toEqual( [] );
// 	expect( result.frags ).toEqual( [] );
// };

// // No frags if not 'newWordFragment'
// var assertTriggered = function assertTriggered ( plbk, result, evnt ) {
// 	expect( result.args[0][0] ).toEqual( plab );
// };

// var assertFrags = function assertFrags ( plbk, result, evnt ) {
// 	var minusStart = forward.slice(0);
// 	// Second play called after 'Victorious,' has already passed by
// 	minusStart.shift();

// 	expect( result.args[0][0] ).toEqual( plab );
// 	expect( result.frags ).toEqual( minusStart );
// };

// var assertProgress = function assertProgress ( plbk, result, evnt ) {
// 	expect( result.args[0][0] ).toEqual( plab );

// 	expect( result.args.length ).toEqual( 12 );

// 	expect( result.args[0][1] ).toEqual( 1/12 );
// 	expect( result.args[2][1] ).toEqual( 0.25 );
// 	expect( result.args[5][1] ).toEqual( 0.5 );
// 	expect( result.args[8][1] ).toEqual( 0.75 );
// 	expect( result.args[11][1] ).toEqual( 1 );
// };


var argsForAllFunctions = {
	// play: [ null ],
	// reset: [ null ],
	// restart: [ null ],
	// pause: [ null ],
	// stop: [ null ],
	// close: [ null ],
	// rewind: [ null ],
	// fastForward: [ null ],
	// toggle: [ null ],
	// jumpWords: [ -1, 0, 3, 4, 11, 100 ],
	// jumpSentences: [ -1, 0, 1, 3, 100 ],
	// nextWord: [ null ],
	// nextSentence: [ null ],
	// prevWord: [ null ],
	// prevSentence: [ null ],
	// jumpTo: [ -1, 0, 6, 11, 100 ]
};

// Comment out items in list to deactivate tests without 'pending' prints
var allEvents = [
	// 'playBegin', 'playFinish',
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
	'newWordFragment',
	// 'loopSkip',
	// 'progress',
	// 'done'
];

// (can show 100 failures max - sometimes just one test)
var singleTests = [
	'testPlay',
	'testRestart',
	'testReset',
	'testPause',
	'testStop',
	'testClose',
	'testTogglePlayPause',
	'testRewind',
	'testFastForward',
	'testJumpWordsNegative1',
	'testJumpWords0',
	'testJumpWords3',
	'testJumpWords4',
	'testJumpWords11',
	'testJumpWords100',
	'testJumpSentencesNegative1',
	'testJumpSentences0',
	'testJumpSentences1',
	'testJumpSentences3',
	'testJumpSentences100',
	'testNextWord',
	'testNextSentence',
	'testPrevWord',
	'testPrevSentence',
	'testJumpToNegative1',
	'testJumpTo0',
	'testJumpTo6',
	'testJumpTo11',
	'testJumpTo100'
];

var thisAssert = null;
var opsWith;




var testText = "When Playback calls";  // Test text to collect for expected errors

describe( testText, function() {

// jasmine.detectUnusualResultsWith = function ( bigs, opsWith, events, checks, msTillAssert, assert, reset, testText ) {
/* (
* 	{playback: {}, state: {}},
* 	{op1: str, arg1: any, op2: str, arg2: any},
* 	{one: str, two: str},
* 	{op2: func, collect: func},
* 	int,
* 	func,
* 	bool,
* 	str
*  )
*/


	beforeEach(function () {

		plab.reset();
		state.emitter.removeAllListeners();
	    // jasmine.clock().install();

		testText = "When Playback calls";

	});

	afterEach(function() {
		// jasmine.clock().uninstall();
	});


	// 200 across
	// 24 rows/screen x 9
	// >43k


	// =========== DOUBLES TO FIND WEIRD RESULTS (STRESS TESTS) ===========

	if ( testing ) {

		var runDetector  = jasmine.detectUnusualResultsWith;
		// For every function (the starting function)
		for ( let funcKey in argsForAllFunctions ) {

			let op1  = funcKey;  // str

			// For every argument that should be tested with the first function
			for ( let argi = 0; argi < argsForAllFunctions[ funcKey ].length; argi++ ) {

				let arg = argsForAllFunctions[ funcKey ][ argi ];  // str

				// For every one-function test (the follow-up function)
				for ( let testi = 0; testi < singleTests.length; testi++ ) {

					// For every argument for the prequel function, use the argument
					let opsWith = getOpsWith( op1, arg, singleTests[ testi ], null );  // object { op1: op1Name, arg1: arg1, op2: op2Name, arg2: arg2 }

					// For every event
					for ( let eventi = 0; eventi < allEvents.length; eventi++ ) {
						// console.log( testText )
						let events = getEvents( allEvents[ eventi ], null );  // object { one: firstEvent, two: secondEvent }
						runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false, testText );

						events = null;  // ??: Needed to avoid memory leak?

					}

					opsWith = null;  // ??: Needed to avoid memory leak?

				}

				arg = null;  // ??: Needed to avoid memory leak?

			}

			op1 = null;  // ??: Needed to avoid memory leak?

		}

	}

	// Not defined
	// console.log('funcKey:', funcKey)  // DEBUG testing to see if this gets retained


});

