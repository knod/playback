
var testText = "When Playback calls";  // Test text to collect for expected errors

describe( testText, function() {

	beforeEach(function () {

		var Playback 	 = require( '../../dist/Playback.js' );
		var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );

		var shortTime = 30,
			longTime  = 60,
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


		// // Events that will be triggerd by the original call to 'play'
		// var originalEvents = [
		// 	'playBegin', 'playFinish',
		// 		// 'resetBegin', 'resetFinish',
		// 		// 'restartBegin', 'restartFinish',
		// 		// 'pauseBegin', 'pauseFinish',
		// 	'stopBegin', 'stopFinish',
		// 		// 'closeBegin', 'closeFinish',
		// 		// 'onceBegin', 'onceFinish',
		// 		// 'resumeBegin', 'resumeFinish',
		// 		// 'rewindBegin', 'rewindFinish',
		// 		// 'fastForwardBegin', 'fastForwardFinish',
		// 	'loopBegin', 'loopFinish',
		// 	'newWordFragment',
		// 		// 'loopSkip',
		// 	'progress',
		// 	'done'
		// ];
	// 6/15

		// JumpWordsNegative1
		// JumpWords0
		// JumpWords3
		// JumpWords4
		// JumpWords11
		// JumpWords100
		// JumpSentencesNegative1
		// JumpSentences0
		// JumpSentences1
		// JumpSentences3
		// JumpSentences100
		// JumpToNegative1
		// JumpTo0
		// JumpTo6
		// JumpTo11
		// JumpTo100


		// - .getProgress
		// - .getLength
		// - .getIndex


		// ------------ setup ------------

		var opsWith;

		var get2ndOp = function ( op2Name ) {
			return { op1: 'play', arg1: null, op2: op2Name, arg2: null }
		};
		// var get2ndOpWith = function ( op2Name, arg2 ) {
		// 	return { op1: 'play', arg1: null, op2: op2Name, arg2: arg2 }
		// };
		var getOpsWith = function ( op1Name, arg1, op2Name, arg2 ) {
			return { op1: op1Name, arg1: arg1, op2: op2Name, arg2: arg2 }
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

		// var standardAssertsMap = {
		// 			'playBegin': assertTriggered, 'playFinish': assertTriggered,
		// 	'resetBegin': assertNOTtriggered, 'resetFinish': assertNOTtriggered,
		// 	'restartBegin': assertNOTtriggered, 'restartFinish': assertNOTtriggered,
		// 	'pauseBegin': assertNOTtriggered, 'pauseFinish': assertNOTtriggered,
		// 			'stopBegin': assertTriggered, 'stopFinish': assertTriggered,
		// 	'closeBegin': assertNOTtriggered, 'closeFinish': assertNOTtriggered,
		// 	'onceBegin': assertNOTtriggered, 'onceFinish': assertNOTtriggered,
		// 	'resumeBegin': assertNOTtriggered, 'resumeFinish': assertNOTtriggered,
		// 	'rewindBegin': assertNOTtriggered, 'rewindFinish': assertNOTtriggered,
		// 	'fastForwardBegin': assertNOTtriggered, 'fastForwardFinish': assertNOTtriggered,
		// 			'loopBegin': assertTriggered, 'loopFinish': assertTriggered,
		// 			'newWordFragment': assertFrags,
		// 	'loopSkip': assertNOTtriggered,
		// 			'progress': assertProgress,
		// 			'done': assertTriggered
		// };

		// var restartAssertsMap = {
		// 	'playBegin': assertNOTtriggered, 'playFinish': assertNOTtriggered,
		// 	'resetBegin': assertNOTtriggered, 'resetFinish': assertNOTtriggered,
		// 			'restartBegin': assertTriggered, 'restartFinish': assertTriggered,
		// 	'pauseBegin': assertNOTtriggered, 'pauseFinish': assertNOTtriggered,
		// 			'stopBegin': assertTriggered, 'stopFinish': assertTriggered,
		// 	'closeBegin': assertNOTtriggered, 'closeFinish': assertNOTtriggered,
		// 	'onceBegin': assertNOTtriggered, 'onceFinish': assertNOTtriggered,
		// 	'resumeBegin': assertNOTtriggered, 'resumeFinish': assertNOTtriggered,
		// 	'rewindBegin': assertNOTtriggered, 'rewindFinish': assertNOTtriggered,
		// 	'fastForwardBegin': assertNOTtriggered, 'fastForwardFinish': assertNOTtriggered,
		// 			'loopBegin': assertTriggered, 'loopFinish': assertTriggered,
		// 			'newWordFragment': assertFrags,
		// 	'loopSkip': assertNOTtriggered,
		// 			'progress': assertProgress,
		// 			'done': assertTriggered
		// };

		// assertsMap = {
		// 	// 'playBegin': standardAssertsMap, 'playFinish': standardAssertsMap,
		// 	// 	'resetBegin': null, 'resetFinish': null,
		// 	// 	'restartBegin': null, 'restartFinish': null,
		// 	// 	'pauseBegin': null, 'pauseFinish': null,
		// 	// 'stopBegin': restartAssertsMap, 'stopFinish': restartAssertsMap,
		// 	// 	'closeBegin': null, 'closeFinish': null,
		// 	// 	'onceBegin': null, 'onceFinish': null,
		// 	// 	'resumeBegin': null, 'resumeFinish': null,
		// 	// 	'rewindBegin': null, 'rewindFinish': null,
		// 	// 	'fastForwardBegin': null, 'fastForwardFinish': null,
		// 	// 'loopBegin': standardAssertsMap, 'loopFinish': standardAssertsMap,
		// 	// 'newWordFragment': standardAssertsMap,
		// 	// 	'loopSkip': null,
		// 	// 'progress': standardAssertsMap,
		// 	// 'done': restartAssertsMap
		// 	'playBegin': 'testPlay', 'playFinish': 'testPlay',
		// 		'resetBegin': null, 'resetFinish': null,
		// 		'restartBegin': null, 'restartFinish': null,
		// 		'pauseBegin': null, 'pauseFinish': null,
		// 	'stopBegin': 'testRestart', 'stopFinish': 'testRestart',
		// 		'closeBegin': null, 'closeFinish': null,
		// 		'onceBegin': null, 'onceFinish': null,
		// 		'resumeBegin': null, 'resumeFinish': null,
		// 		'rewindBegin': null, 'rewindFinish': null,
		// 		'fastForwardBegin': null, 'fastForwardFinish': null,
		// 	'loopBegin': 'testPlay', 'loopFinish': 'testPlay',
		// 	'newWordFragment': 'testPlay',
		// 		'loopSkip': null,
		// 	'progress': 'testPlay',
		// 	'done': 'testRestart'
		// };

		// // For `.play()` and every possible event that could be triggered
		// for ( let ev1i = 0; ev1i < originalEvents.length; ev1i++ ) {

		// 	let event1 = originalEvents[ ev1i ];

		// 	// // For every second operation
		// 	// for ( let opi = 0; opi < allOps.length; opi++ ) {

		// 		// let op2 = allOps[ opi ];

		// 		let op2 = 'testPlay';
		// 		// 'play' and this operation with no arguments passed in
		// 		opsWith = get2ndOp( op2 )

		// 		// // For every possible event for the second operation
		// 		// for ( let ev2i = 0; ev2i < allEvents.length; ev2i++ ) {

		// 		// 	let event2 = allEvents[ ev2i ],
		// 		let events = getEvents( event1, null );

		// 		// 	let thisAssert = null;

		// 		// 	let thisAssertMap = assertsMap[ event1 ]
		// 		// 	if ( thisAssertMap ) { thisAssert = thisAssertMap[ event2 ] }

		// 		// 	// console.log( event2, thisAssert );

		// 		// 	if ( thisAssert ) {
		// 			let thisAssert = null;
		// 				runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false );
		// 			// }

		// 		// }  // End events for 2

		// 	// }  // End 2nd op

		// }  // End events for 1

		

		// // For `.play()` and every possible event that could be triggered
		// for ( let ev1i = 0; ev1i < originalEvents.length; ev1i++ ) {

		// 	let event1 = originalEvents[ ev1i ];

		// 		let op2 = 'testRestart';
		// 		// 'play' and this operation with no arguments passed in
		// 		opsWith = get2ndOp( op2 )

		// 		// Placeholders till we know we don't need them anymore
		// 		let events = getEvents( event1, null );
		// 		let thisAssert = null;

		// 		runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false );

		// }  // End events for 1



		// // For `.play()` and every possible event that could be triggered
		// for ( let ev1i = 0; ev1i < originalEvents.length; ev1i++ ) {

		// 	let event1 = originalEvents[ ev1i ];

		// 	// For every singleton test we can do, trigger it next
		// 	for ( let testi = 0; testi < singleTests.length; testi++ ) {

		// 		let op2 = singleTests[ testi ];
		// 		// 'play' and this operation with no arguments passed in
		// 		opsWith = get2ndOp( op2 )

		// 		// Placeholders till we know we don't need them anymore
		// 		let events = getEvents( event1, null );
		// 		let thisAssert = null;

		// 		setTimeout( function () {
		// 			runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false );
		// 		}, longTime );

		// 	}

		// }  // End events for 1






		// var one = function ( index1, index2 ) {

		// 	if ( index1 < originalEvents.length ) {

		// 		var event1 = originalEvents[ index1 ];
		// 		index1++

		// 		two( event1, index1, index2 )
		// 	}

		// };

		// var two = function ( event1, index1, index2 ) {

		// 	if ( index2 < singleTests.length ) {

		// 		var op2 = singleTests[ index2 ];
		// 		index2++

		// 		// 'play' and this operation with no arguments passed in
		// 		opsWith = get2ndOp( op2 );

		// 		three( opsWith, event1, index1, index2 );
		// 	}

		// };

		// var three = function ( opsWith, event1, index1, index2 ) {

		// 	// Placeholders till we know we don't need them anymore
		// 	var events = getEvents( event1, null );
		// 	var thisAssert = null;

		// 	runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false );

		// 	setTimeout( function () {

		// 		if ( index2 < singleTests.length ) {
		// 			two( event1, index1, index2 );
		// 		}
		// 		else if ( index1 < originalEvents.length ) {
		// 			one( index1, index2 );
		// 		}

		// 	}, (longTime * 17));

		// };

		// one( 0, 0 );


		var allFunctions = {
			play: [ null ],
			// reset: [ null ],
			// restart: [ null ],
			// pause: [ null ],
			// stop: [ null ],
			// close: [ null ],
			// rewind: [ null ],
			// fastForward: [ null ],
			// togglePlayPause: [ null ],
			// jumpWords: [ -1, 0, 3, 4, 11, 100 ],
			// jumpSentences: [ -1, 0, 1, 3, 100 ],
			// nextWord: [ null ],
			// nextSentence: [ null ],
			// prevWord: [ null ],
			// prevSentence: [ null ],
			// jumpTo: [ -1, 0, 6, 11, 100 ]
		};

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

		// Comment out items in list to deactivate tests without 'pending' prints
		var allEvents = [
			'playBegin',// 'playFinish',
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
	// 200 across
	// 24 r/screen x 9
	// >43k

		var thisAssert = null;

		// var opsWith = get2ndOp( 'testPlay' )
		// var events = getEvents( 'newWordFragment', null );
		// runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false );

		// opsWith = get2ndOp( 'testPlay' )
		// events = getEvents( 'playBegin', null );
		// runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false );


		var testing = true;  // Quick toggle

		if ( testing ) {

			var runDetector  = jasmine.detectUnusualResultsWith;
			// For every function (the starting function)
			for ( let funcKey in allFunctions ) {

				let op1  = funcKey;
				let args = allFunctions[ funcKey ];

				// For every argument that should be tested with the first function
				for ( let argi = 0; argi < args.length; argi++ ) {

					let arg = args[ argi ];

					// For every one-function test (the follow-up function)
					for ( let testi = 0; testi < singleTests.length; testi++ ) {

						let op2 = singleTests[ testi ];
						// For every argument for the prequel function, use the argument
						let opsWith = getOpsWith( op1, arg, op2, null );

						// For every event
						for ( let eventi = 0; eventi < allEvents.length; eventi++ ) {
							// console.log( testText )
							let events = getEvents( allEvents[ eventi ], null );
							runDetector( bigs, opsWith, events, get_allTrue(), longTime, thisAssert, false, testText );

						}

					}

				}

			}

		}




		/*
		'newWordFragment' then 'newWordFragment'
		'newWordFragment' then 'playBegin'
		'newWordFragment' then 'playFinish'

		asserts.frags = ...

		I would have to pass in every assert for every combination...
		I think this is a nope.
		*/
	});

	it("this is here to get other stuff to run", function () {
		console.log('first trigger')
	})

});

