/* tests/combos.js
* (Actually combos and combos now)
* 
* Too long to run on every single code change, but should
* be run sometimes, just to check
* 
* Rake testing at start of development to discover behavior
* other than single behavior and to reveal bugs, then later
* just regular tests.
* 
* TODO:
* - Allow setting for picking ranges of tests
* example desired result: run test #3 to test #100
*/

var debugTests = false;

// Basically double of single tests - 25 was just enough with singles.
// ??: Why does need so much time? It's really just for one test since
// the first test runs independently, but race conditions if shorter
var waitTime = 50;

var SetUp 		= require('./setup-default.js'),
	bigObjects 	= SetUp(),
	plab 		= bigObjects.playback,
	emitter 	= bigObjects.emitter;

var tester = require('./testing-core.js');
var runLastEvent  = require( './helpers/last-event.js' );
var runFirstEvent = require( './helpers/first-event.js' );


// A note on `once()`
// Those tests could go on forever... but they do get tested somewhat with
// next, prev, and the jumps so a lot taken care of. If that changes, these
// tests need to change

var funcsWithArgs1 = [
	{ func: 'forceReset', args: [ null ]},  // 0
	{ func: 'reset', args: [ null ]},
	{ func: 'restart', args: [ null ]},  // 2
	{ func: 'play', args: [ null ] },
	{ func: 'togglePlayPause', args: [ null ]},  // 4
	{ func: 'pause', args: [ null ]},
	{ func: 'stop', args: [ null ]},  // 6
	{ func: 'close', args: [ null ]},
	{ func: 'revert', args: [ null ]},  // 8
	{ func: 'rewind', args: [ null ]},
	{ func: 'fastForward', args: [ null ]},  // 10
	{ func: 'once', args: [ [0,0,-2] ]},
	{ func: 'once', args: [ [0,0,2] ]},  // 12
	{ func: 'current', args: [ null ]},  // once( [0,0,0] )
	{ func: 'jumpTo', args: [ -3 ]},  // 14
	{ func: 'jumpTo', args: [ -1 ]},
	{ func: 'jumpTo', args: [ 0 ]},  // 16
	{ func: 'jumpTo', args: [ 6 ]},
	{ func: 'jumpTo', args: [ 11 ]},  // 18
	{ func: 'jumpTo', args: [ 100 ]},
	{ func: 'jumpWords', args: [ -3 ]},  // 20
	{ func: 'jumpWords', args: [ -1 ]},
	{ func: 'jumpWords', args: [ 0 ]},  // 22
	{ func: 'jumpWords', args: [ 4 ]},
	{ func: 'jumpWords', args: [ 11 ]},  // 24
	{ func: 'jumpWords', args: [ 100 ]},
	{ func: 'jumpSentences', args: [ -3 ]},  // 26
	{ func: 'jumpSentences', args: [ -1 ]},
	{ func: 'jumpSentences', args: [ 0 ]},  // 28
	{ func: 'jumpSentences', args: [ 1 ]},
	{ func: 'jumpSentences', args: [ 3 ]},  // 30
	{ func: 'jumpSentences', args: [ 100 ]},
	{ func: 'nextWord', args: [ null ]},  // 32
	{ func: 'nextSentence', args: [ null ]},
	{ func: 'prevWord', args: [ null ]},  // 34
	{ func: 'prevSentence', args: [ null ]}  // 35
];

// 26 events * 21115 tests = 548990 tests
var events1 = [
	'resetBegin', 'resetFinish',
	// 'restartBegin', 'restartFinish',
	// 'playBegin', 'playFinish',
	// 'pauseBegin', 'pauseFinish',
	// 'closeBegin', 'closeFinish',
	// 'onceBegin', 'onceFinish',
	// 'revertBegin', 'revertFinish',
	// 'rewindBegin', 'rewindFinish',
	// 'fastForwardBegin', 'fastForwardFinish',
	// 'loopBegin', 'loopFinish',
	// 'newWordFragment',
	// 'progress',
	// 'stopBegin', 'stopFinish',
	// 'done',  // 24
	// // 'loopSkip'  // Not relevant till `state` experiments
];

var functsWithArgs2 = [
	{ func: 'forceReset', args: [ null ]},
	// { func: 'reset', args: [ null ]},
	// { func: 'restart', args: [ null ]},
	// { func: 'play', args: [ null ] },
	// { func: 'togglePlayPause', args: [ null ]},
	// { func: 'pause', args: [ null ]},
	// { func: 'stop', args: [ null ]},
	// { func: 'close', args: [ null ]},
	// { func: 'revert', args: [ null ]},
	// { func: 'rewind', args: [ null ]},
	// { func: 'fastForward', args: [ null ]},
	// { func: 'once', args: [ [0,0,-2] ]},
	// { func: 'once', args: [ [0,0,2] ]},
	// { func: 'current', args: [ null ]},  // once( [0,0,0] )
	// { func: 'jumpTo', args: [ -3 ]},
	// { func: 'jumpTo', args: [ -1 ]},
	// { func: 'jumpTo', args: [ 0 ]},
	// { func: 'jumpTo', args: [ 6 ]},
	// { func: 'jumpTo', args: [ 11 ]},
	// { func: 'jumpTo', args: [ 100 ]},
	// { func: 'jumpWords', args: [ -3 ]},
	// { func: 'jumpWords', args: [ -1 ]},
	// { func: 'jumpWords', args: [ 0 ]},
	// { func: 'jumpWords', args: [ 4 ]},
	// { func: 'jumpWords', args: [ 11 ]},
	// { func: 'jumpWords', args: [ 100 ]},
	// { func: 'jumpSentences', args: [ -3 ]},
	// { func: 'jumpSentences', args: [ -1 ]},
	// { func: 'jumpSentences', args: [ 0 ]},
	// { func: 'jumpSentences', args: [ 1 ]},
	// { func: 'jumpSentences', args: [ 3 ]},
	// { func: 'jumpSentences', args: [ 100 ]},
	// { func: 'nextWord', args: [ null ]},
	// { func: 'nextSentence', args: [ null ]},
	// { func: 'prevWord', args: [ null ]},
	// { func: 'prevSentence', args: [ null ]}
];

var events2 = [
	'playBegin', 'playFinish',
	// 'resetBegin', 'resetFinish',
	// 'restartBegin', 'restartFinish',
	// 'pauseBegin', 'pauseFinish',
	// 'closeBegin', 'closeFinish',
	// 'onceBegin', 'onceFinish',
	// 'revertBegin', 'revertFinish',
	// 'rewindBegin', 'rewindFinish',
	// 'fastForwardBegin', 'fastForwardFinish',
	// 'loopBegin', 'loopFinish',
	// 'newWordFragment',
	// 'progress',
	// 'stopBegin', 'stopFinish',
	// 'done',
	// // 'loopSkip'  // Not relevant till `state` experiments
];


// Assigned in `start()`
var singleAssertions = null;
var altAssertionater = null;


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
		iterate( 'combos:', func1i, arg1i, event1i, func2i, arg2i, event2i );  // iterate
	}  // end maybe repeat

	return finished;
};  // End increment()



function iterate ( label = '', func1Indx = 0, arg1Indx = 0, event1Indx = 0, func2Indx = 0, arg2Indx = 0, event2Indx = 0 ) {
	emitter.removeAllListeners();

	var assert1Obj, assert2Obj;

	// Loop 1
	const funcWArg1 = funcsWithArgs1[ func1Indx ];

	const func1Name = funcWArg1.func;
	const arg1		= funcWArg1.args[ arg1Indx ];
	const evnt1 	= events1[ event1Indx ];

	label = label + ' ' + func1Name + '(' + JSON.stringify( arg1 ) + ')' + ' + ' + evnt1
	// The single assertion for this combo. May end up matching up just fine.
	// Not currently checking if the match up is a false positive
	assert1Obj = singleAssertions[ func1Name ][ JSON.stringify( arg1 ) ][ evnt1 ];
	
	// Loop 2
	const funcWArg2 = functsWithArgs2[ func2Indx ];

	const func2Name = funcWArg2.func;
	const arg2		= funcWArg2.args[ arg2Indx ];
	const evnt2 	= events2[ event2Indx ]
	// The single assertion for this combo. May end up matching up just fine.
	// Not currently checking if the match up is a false positive
	assert2Obj 		= singleAssertions[ func2Name ][ JSON.stringify( arg2 ) ][ evnt2 ];

	label = label + ' > ' + func2Name + '(' + JSON.stringify( arg2 ) + ')' + ' + ' + evnt2 ;

	var runAssert = function ( result, assertNum, shouldSkip ) {
	// console.log('called');
	// `result`: First test is pre-asserted, so this could be just
	// the outcome being sent here
			
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
					funcs: funcsWithArgs1, args: funcWArg1.args, events: events1
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

	};  // End runAssert()


	// This should be mutated in `runLastEvent()`
	var result = { playback: null, arg2s: [] };

	var firstCalled = false;
	var afterFirstEvent = function () {
	// Need it in here for the variables. Called from first event as a callback.
		firstCalled = true;

		/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, bool ) */
		runLastEvent(
			result, bigObjects,
			{ op: func2Name, arg: arg2, event: evnt2 },
			false  // don't reset
		);
		// Once result has had a chance to fill up, run the test on it
		setTimeout( function () { runAssert( result, 2, false ); }, waitTime);	
	
	};  // End afterFirstEvent()

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
		if ( !firstCalled ) { runAssert( result, 1, false ); }
	}, waitTime );  // the first one should have been triggered sooner

};  // End iterate()


var startTime = 0;
// Get the variables we need and start the ball rolling
var start = function ( funcObj ) {
	
	startTime = Date.now();
	var time = (new Date()).toString().split(' ')[4];
	console.log( 'Start:', time )

	// When `node tests/combos.js` is called in the terminal it needs one
	// argument in order to run. An index number or 'all'.
	if ( typeof process.argv[2] === 'string' ) {

		var arg = process.argv[2]

		// If we're supposed to run all combo tests
		if ( arg === 'all' ) {

			singleAssertions = require('./helpers/single-assertions.js')( plab );
			altAssertionater = require('./helpers/combos-assertions.js')( plab );
			iterate('combos:');

		} else {

			var indx = parseInt( arg );
			var obj = funcsWithArgs1[ indx ]

			// If we've got a valid first argument, run with that argument
			if ( indx < funcsWithArgs1.length && obj ) {

				console.log( 'Testing with:', obj.func );
				funcsWithArgs1 = [ obj ];

				singleAssertions = require('./helpers/single-assertions.js')( plab );
				altAssertionater = require('./helpers/combos-assertions.js')( plab );
				iterate('combos:');
			}
			// If it wasn't 'all' and wasn't a valid first argument, don't do anything

		}  // end if 'all'
	}  // end if called with an argument
}  // End start()

start();
