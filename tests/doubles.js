/* tests/doubles.js
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

var waitTime = 50;  // Basically double of single tests (25 was just enough with singles)


var SetUp 		= require('./setup-default.js'),
	bigObjects 	= SetUp(),
	plab 		= bigObjects.playback,
	emitter 	= bigObjects.emitter;


var tester = require('./testing-core.js');
var runLastEvent  = require( './helpers/last-event.js' );
var runFirstEvent = require( './helpers/first-event.js' );


// 16 funcs
// + args = 29
var functsWithArgs = [
		{ func: 'play', args: [ null ] },  // * 26 for 1 event
		{ func: 'reset', args: [ null ]},
		{ func: 'restart', args: [ null ]},
		{ func: 'pause', args: [ null ]},
		{ func: 'stop', args: [ null ]},
		{ func: 'close', args: [ null ]},
		{ func: 'togglePlayPause', args: [ null ]},
		{ func: 'rewind', args: [ null ]},
		{ func: 'fastForward', args: [ null ]},
		{ func: 'jumpWords', args: [ -1, 0, 3, 4, 11, 100 ]},
		{ func: 'jumpSentences', args: [ -1, 0, 1, 3, 100 ]},
		{ func: 'nextWord', args: [ null ]},
		{ func: 'nextSentence', args: [ null ]},
		{ func: 'prevWord', args: [ null ]},
		{ func: 'prevSentence', args: [ null ]},
		{ func: 'jumpTo', args: [ -1, 0, 6, 11, 100 ]}
	// TODO: { func: 'resume', args: [ null ]}  // Put it in singles first
	// once?
];

// 26 events
var events = [
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

// Just doubles = 26 * 26 * 29 =  19,604 tests (about 1777325ms = 1777.325s = 29.6220833min )


// One function with itself calling all combos of events: #tests: 676
// 676 * 4 = 2704? Yup. `doingOnlyTwoOfSameFunction` works!
var doingOnlyTwoOfSameFunction = true;


var getStandardAssertions = null;  // Instantiated in `start()`
var getAltAssertions = null;
var currentAssertions = null;


var finished = false;
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

	// Loop 1
	const funcWArg1  = functsWithArgs[ func1Indx ];

	const func1Name = funcWArg1.func;
	const arg1		= funcWArg1.args[ arg1Indx ];
	const evnt1 	= events[ event1Indx ];

	label = label + ' ' + func1Name + '(' + arg1 + ')' + ' + ' + evnt1
	
	// Loop 2
	const funcWArg2  = functsWithArgs[ func2Indx ];

	const func2Name = funcWArg2.func;
	const arg2		= funcWArg2.args[ arg2Indx ];

	if ( event2Indx === 0 ) {
		currentAssertions = getStandardAssertions[ func2Name ][ JSON.stringify( arg2 ) ]( {} );
	}

	var events2AndAsserts = currentAssertions[ event2Indx ]

	const evnt2 = events2AndAsserts.event;
	var assert 	= events2AndAsserts.assertion;


	var shouldSkip = false;
	if ( doingOnlyTwoOfSameFunction ) {
		// If the second func and arg aren't the same, it's not a double. Skip
		if ( func1Name !== func2Name || arg1 !== arg2 ) { shouldSkip = true; }
	} else {
		// If the second func and arg /are/ the same, it's a double. Skip
		if ( func1Name === func2Name && arg1 === arg2 ) { shouldSkip = true; }
	}


	// console.log( func1Name, evnt1, func2Name, evnt2 );

	label = label + ' > ' + func2Name + '(' + arg2 + ')' + ' + ' + evnt2 ;

	var runAssert = function ( result, assertWaitTime, skip ) {
		setTimeout( function runAssert() {
			// Run a test
			tester.run( label, function tests ( done, skip ) {
				// console.log( 'skip?', skip, 'same?', label );
				if ( !shouldSkip ) {

					// do stuff
					try {

						// var preAssert = assert;
						assert = getAltAssertions.getAssertion( label, assert, false );
						// console.log( preAssert === assert, label )

						var outcome = assert( result, label, evnt2 );
						if ( outcome.passed ) {
							done();
						} else {
							done( outcome.message );
						}

					} catch (err) {
						done( err, label );
					}  // end try

				} else {
					skip();
				}  // end if !shouldSkip

			})  // End it()
			// Then increment and run this function again, testing again
			.then(() => {

				if ( tester.report.total % 200 === 0 ) {
					console.log('\n' + tester.report.total + ' tests done. ' + (Date.now() - startTime) + 'ms elapsed. On: ' + label );
				}

				var finished = increment({
					one: {
						func: func1Indx, arg: arg1Indx, event: event1Indx,
						funcs: functsWithArgs, args: funcWArg1.args, events: events
					},
					two: {
						func: func2Indx, arg: arg2Indx, event: event2Indx,
						funcs: functsWithArgs, args: funcWArg2.args, events: currentAssertions
					}
				});

				if ( finished ) {
					tester.finish();
					var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
					console.log( utc ) // time
					console.log( (Date.now() - startTime) + 'ms' );
				}

			});  // End .then()

		}, assertWaitTime );
	};  // End runAssert()


	// This should be mutated in `runLastEvent()`
	var result = { playback: null, arg2s: [] };

	var secondCalled = false;
	var afterFirstEvent = function () {
	// Need it in here for the variables. Called from first event as a callback.

		secondCalled = true;
		
		/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, int, bool ) */
		runLastEvent(
			result, bigObjects,
			{ op: func2Name, arg: arg2, event: evnt2 },
			false  // reset
		);

		runAssert( result, waitTime, shouldSkip );		
	};  // End afterFirstEvent()


	if ( shouldSkip ) {
		runAssert( null, 0, shouldSkip )
	} else {
		// Trigger first event that will trigger the next event
		/* ( func, {playback, emitter}, {op, arg, event}, bool ) */
		runFirstEvent(
			afterFirstEvent, bigObjects,
			{ op: func1Name, arg: arg1, event: evnt1 },
			true  // reset
		);

		// In case the first event was never triggered
		setTimeout(function() {
			if ( !secondCalled ) { runAssert( result, 0, shouldSkip ); }
		}, waitTime )
	}

};  // End iterate()


var startTime = 0;
// Get the variables we need
var start = function () {
	
	startTime = Date.now();
	var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
	console.log( utc ) // time

	getStandardAssertions 	= require('./helpers/single-assertions.js')( plab );
	getAltAssertions 		= require('./helpers/doubles-assertions.js')( plab );
	iterate('doubles:');

	// Too long to run on every single code change, but should
	// be run sometimes, just to check
}

start();
