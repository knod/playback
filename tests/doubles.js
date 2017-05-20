/* tests/doubles.js
* (Actually doubles and combos now)
* 
* Rake testing at start of development to discover behavior
* other than single behavior and to reveal bugs, then later
* just regular tests.
* 
* Too long to run on every single code change, but should
* be run sometimes, just to check
* 
* TODO:
* - Allow setting for picking ranges of tests
* example desired result: run test #3 to test #100
* - Report every 300 or so tests, or when a new function
* is being used or something (including how many tests have
* been run)
*/

var debugTests = false;
// One function with itself calling all combos of events: #tests: 676
// 676 * 4 = 2704? Yup. `doingOnlyRepeatSameFunction` works!
var doingOnlyRepeatSameFunction = false;

// Why does this take so long? It's really just for one test
// (the first test runs independently)
var waitTime = 50;  // Basically double of single tests (25 was just enough with singles)

var SetUp 		= require('./setup-default.js'),
	bigObjects 	= SetUp(),
	plab 		= bigObjects.playback,
	emitter 	= bigObjects.emitter;

var tester = require('./testing-core.js');
var runLastEvent  = require( './helpers/last-event.js' );
var runFirstEvent = require( './helpers/first-event.js' );


// A note on `once()`
// The tests could go on forever... but they do get tested somewhat with
// jump, next, and prev, so don't /really/ need to tests singles or
// word or sentence incrementations. If that changes, these tests need
// to change


// 16 funcs
// + args = 29
var functsWithArgs1 = [
	// These two at the top for now for ease of debugging
	// { func: 'forceReset', args: [ null ]},
	{ func: 'current', args: [ null ]},  // once( [0,0,0] )
	// { func: 'play', args: [ null ] },  // * 26 for 1 event
	// { func: 'togglePlayPause', args: [ null ]},
	// { func: 'restart', args: [ null ]},
	// { func: 'reset', args: [ null ]},
	// { func: 'pause', args: [ null ]},
	// { func: 'stop', args: [ null ]},
	// { func: 'close', args: [ null ]},
	// { func: 'revert', args: [ null ]},
	// { func: 'rewind', args: [ null ]},
	// { func: 'fastForward', args: [ null ]},
	// { func: 'once', args: [ [0,0,-2], [0,0,2] ]},
	// { func: 'jumpTo', args: [ -1, 0, 6, 11, 100 ]},
	// { func: 'jumpWords', args: [ -1, 0, 3, 4, 11, 100 ]},
	// { func: 'jumpSentences', args: [ 3 ]},
	// { func: 'jumpSentences', args: [ -1, 0, 1, 3, 100 ]},
	// { func: 'nextWord', args: [ null ]},
	// { func: 'nextSentence', args: [ null ]},
	// { func: 'prevWord', args: [ null ]},
	// { func: 'prevSentence', args: [ null ]}
];

// 26 events * 21115 tests = 548990 tests
var events1 = [
	// 'playBegin',
	// 'playFinish',
	// 'resetBegin',
	// 'resetFinish',
	// 'restartBegin',
	// 'restartFinish',
	// 'pauseBegin',
	// 'pauseFinish',
	// 'stopBegin',
	// 'stopFinish',
	// 'closeBegin',
	// 'closeFinish',
	'onceBegin',
	'onceFinish',
	// 'revertBegin',
	// 'revertFinish',
	// 'rewindBegin',
	// 'rewindFinish',
	// 'fastForwardBegin',
	// 'fastForwardFinish',
	// 'loopBegin',
	// 'loopFinish',
	// 'newWordFragment',
	// 'progress',
	// 'done',
	// 'loopSkip'
];

var functsWithArgs2 = [
	// These two at the top for now for ease of debugging
	{ func: 'forceReset', args: [ null ]},
	// { func: 'current', args: [ null ]},  // once( [0,0,0] )
	// { func: 'play', args: [ null ] },  // * 26 for 1 event
	// { func: 'togglePlayPause', args: [ null ]},
	// { func: 'restart', args: [ null ]},
	// { func: 'reset', args: [ null ]},
	// { func: 'pause', args: [ null ]},
	// { func: 'stop', args: [ null ]},
	// { func: 'close', args: [ null ]},
	// { func: 'revert', args: [ null ]},
	// { func: 'rewind', args: [ null ]},
	// { func: 'fastForward', args: [ null ]},
	// { func: 'once', args: [ [0,0,-2], [0,0,2] ]},
	// { func: 'jumpTo', args: [ -1, 0, 6, 11, 100 ]},
	// { func: 'jumpWords', args: [ -1, 0, 3, 4, 11, 100 ]},
	// { func: 'jumpSentences', args: [ 3 ]},
	// { func: 'jumpSentences', args: [ -1, 0, 1, 3, 100 ]},
	// { func: 'nextWord', args: [ null ]},
	// { func: 'nextSentence', args: [ null ]},
	// { func: 'prevWord', args: [ null ]},
	// { func: 'prevSentence', args: [ null ]}
];
var events2 = [
	'playBegin', 'playFinish',
	'resetBegin', 'resetFinish',
	'restartBegin', 'restartFinish',
	'pauseBegin', 'pauseFinish',
	'stopBegin', 'stopFinish',
	'closeBegin', 'closeFinish',
	'onceBegin', 'onceFinish',
	'revertBegin', 'revertFinish',
	'rewindBegin', 'rewindFinish',
	'fastForwardBegin', 'fastForwardFinish',
	'loopBegin', 'loopFinish',
	'newWordFragment',
	'progress',
	'done',
	// 'loopSkip'
];

// Just doubles = 26 * 26 * 29 =  19,604 tests (about 1777325ms = 1777.325s = 29.6220833min )

var alreadyTestedCombos = [];



var singleAssertions = null;  // Instantiated in `start()`
var altAssertionater = null;
var currentAssertion = null;


var increment = function ( indices ) {

	var two = indices.two, one = indices.one;

	// Loop 2
	let event2i = two.event + 1;
	let arg2i 	= two.arg;
	let func2i 	= two.func;

	// Loop 1
	let event1i = one.event;
	let arg1i 	= one.arg;
	let func1i 	= one.func;

	if (event2i >= two.events.length) {
		event2i = 0;  // reset
		arg2i++;  // increment the next array
	}

	if (arg2i >= two.args.length) {
		arg2i = 0;  // reset
		func2i++;  // increment the next array
	}

	if (func2i >= two.funcs.length) {  // num functions
		func2i = 0;  // reset
		event1i++;  // increment the next array
	}

	if (event1i >= one.events.length) {
		event1i = 0;  // reset
		arg1i++;  // increment the next array
	}

	if (arg1i >= one.args.length) {
		arg1i = 0;  // reset
		func1i++;  // increment the next array
	}



	var finished = false;
	// If top most level is done, all done
	if ( func1i >= one.funcs.length ) {  // num functions

		finished = true;

	} else {

		iterate( 'doubles:', func1i, arg1i, event1i, func2i, arg2i, event2i );  // iterate

	}  // end maybe repeat

	return finished;
};  // End increment()



function iterate ( label = '', func1Indx = 0, arg1Indx = 0, event1Indx = 0, func2Indx = 0, arg2Indx = 0, event2Indx = 0 ) {
	// console.log(func1Indx, arg1Indx, event1Indx, func2Indx, arg2Indx, event2Indx)
	emitter.removeAllListeners();

	// var assert1Obj, assert2Obj, assert1, type1, assert2, type2;
	var assert1Obj, assert2Obj;

	// Loop 1
	const funcWArg1 = functsWithArgs1[ func1Indx ];

	const func1Name = funcWArg1.func;
	const arg1		= funcWArg1.args[ arg1Indx ];
	const evnt1 	= events1[ event1Indx ];

	label = label + ' ' + func1Name + '(' + JSON.stringify( arg1 ) + ')' + ' + ' + evnt1
	// The single assertion for this combo. May end up matching up just fine.
	// Not currently checking if the match up is a false positive
	assert1Obj 	= singleAssertions[ func1Name ][ JSON.stringify( arg1 ) ][ evnt1 ];
	
	// Loop 2
	const funcWArg2 = functsWithArgs2[ func2Indx ];

	const func2Name = funcWArg2.func;
	const arg2		= funcWArg2.args[ arg2Indx ];
	const evnt2 	= events2[ event2Indx ]
	// The single assertion for this combo. May end up matching up just fine.
	// Not currently checking if the match up is a false positive
	assert2Obj 		= singleAssertions[ func2Name ][ JSON.stringify( arg2 ) ][ evnt2 ];

	label = label + ' > ' + func2Name + '(' + JSON.stringify( arg2 ) + ')' + ' + ' + evnt2 ;
	// console.log( label );

	var shouldSkip = false;
	if ( doingOnlyRepeatSameFunction ) {
		// If the second func and arg aren't the same, it's not a double. Skip
		if ( func1Name !== func2Name || arg1 !== arg2 ) { shouldSkip = true; }
	} else {
		// If the second func and arg /are/ the same, it's a double. Skip
		if ( func1Name === func2Name && arg1 === arg2 ) { shouldSkip = true; }
	}


	var runAssert = function ( result, assertNum, skip ) {
	// console.log('called');
	// `result`: First test is pre-asserted, so this could be just
	// the outcome being sent here
		// setTimeout( function runAssert() {
			// Run a test
			// tester.store? tester.complete? No, it's running a function
			tester.run( label, function tests ( done, skip ) {
				// console.log( 'skip?', skip, 'same?', label );
				if ( !shouldSkip ) {

					// do stuff
					try {

						var outcome;

						if ( assertNum === 1 ) { outcome = assert1Obj.assertion( result ); }
						else {
							// assert = altAssertionater.assert( label, assertObj, result, debugTests );
							/* label, originalAssertion, result, debug */
							outcome = altAssertionater.assert( label, assert2Obj, result, debugTests );
						}

						if ( outcome.passed ) { done(); }
						else { done( outcome.message ); }

					} catch (err) {
						done( err, label );
					}  // end try

					if ( tester.report.total > 0 && tester.report.total % 676 === 0 ) {  // should get on switch to new test
						console.log('\n======== ' + tester.report.total + ' tests done. ' + (Date.now() - startTime) + 'ms elapsed. On: ' + label );
					}

				} else {
					skip();
				}  // end if !shouldSkip

			})  // End it()
			// Then increment and run this function again, testing again
			.then(() => {

				var finished = increment({
					one: {
						func: func1Indx, arg: arg1Indx, event: event1Indx,
						funcs: functsWithArgs1, args: funcWArg1.args, events: events1
					},
					two: {
						func: func2Indx, arg: arg2Indx, event: event2Indx,
						funcs: functsWithArgs2, args: funcWArg2.args, events: events2
					}
				});
				if ( finished ) {
					tester.finish();

					var time = (new Date()).toString().split(' ')[4];
					console.log( 'Combo tests triggered:', altAssertionater.getWhichOnesWereRun().sort() );
					console.log( 'End:', time );
					console.log( (Date.now() - startTime)/1000 + 's' );
				}

			});  // End .then()

		// }, assertWaitTime );
	};  // End runAssert()


	// This should be mutated in `runLastEvent()`
	var result = { playback: null, arg2s: [] };

	var firstCalled = false;
	var afterFirstEvent = function () {
	// Need it in here for the variables. Called from first event as a callback.

		firstCalled = true;
		// console.trace( 'triggered:', firstCalled );

		/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, bool ) */
		runLastEvent(
			result, bigObjects,
			{ op: func2Name, arg: arg2, event: evnt2 },
			false  // don't reset
		);

		setTimeout( function () {
			runAssert( result, 2, shouldSkip );
		}, waitTime);	
	
	};  // End afterFirstEvent()


	if ( shouldSkip ) {
		if ( debugTests ) { console.log( 'skipping:', label ); }
		runAssert( null, null, shouldSkip )
	} else {
		// console.log( label );

		// Trigger first event that will trigger the next event
		/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, func, func, bool ) */
		runFirstEvent(
			{ playback: null, arg2s: [] }, bigObjects,
			{ op: func1Name, arg: arg1, event: evnt1 },
			afterFirstEvent,
			true  // reset
		);

		// In case the first event was never triggered
		setTimeout(function() {
			// console.trace( 'not triggered:', firstCalled );
			if ( !firstCalled ) { runAssert( result, 1, shouldSkip ); }
		}, waitTime );  // the first one should have been triggered sooner
	}
};  // End iterate()


var startTime = 0;
// Get the variables we need
var start = function () {
	
	startTime = Date.now();
	var time = (new Date()).toString().split(' ')[4];
	console.log( 'Start:', time )

	singleAssertions 	= require('./helpers/single-assertions.js')( plab );
	altAssertionater 	= require('./helpers/doubles-assertions.js')( plab );
	iterate('doubles:');

	// Too long to run on every single code change, but should
	// be run sometimes, just to check
}

start();
