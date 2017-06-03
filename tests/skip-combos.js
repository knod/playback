/* tests/skip-combos.js
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
* 	example desired result: run test #3 to test #100
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


var skippers = [ 'Victorious,', 'flag.', 'Delirious,', 'come', '\n', 'wattlebird?' ];
bigObjects.state.playback.transformFragment = function ( frag ) {
	if ( skippers.indexOf(frag) > -1 ) {
		return '$@skip@$'
	} else {
		return frag;
	}
}


// A note on `once()`
// Those tests could go on forever... but they do get tested somewhat with
// next, prev, and the jumps so a lot taken care of. If that changes, these
// tests need to change
var funcsWithArgs1 = [
	{ func: 'forceReset', arg: null },  // 0 (0 index)
	{ func: 'reset', arg: null },
	{ func: 'restart', arg: null },  // 2
	{ func: 'play', arg: null },
	{ func: 'togglePlayPause', arg: null },  // 4
	{ func: 'pause', arg: null },

	{ func: 'stop', arg: null },  // 6
	{ func: 'close', arg: null },
	{ func: 'revert', arg: null },  // 8
	{ func: 'rewind', arg: null },
	{ func: 'fastForward', arg: null },  // 10

	{ func: 'once', arg: [0,0,-2] },
	{ func: 'once', arg: [0,0,2] },  // 12
	{ func: 'current', arg: null },  // once( [0,0,0] )
	{ func: 'jumpTo', arg: -3 },  // 14
	{ func: 'jumpTo', arg: -1 },

	{ func: 'jumpTo', arg: 0 },  // 16
	// Different than non-skip!
	{ func: 'jumpTo', arg: 4 },
	{ func: 'jumpTo', arg: 11 },  // 18
	{ func: 'jumpTo', arg: 100 },
	{ func: 'jumpWords', arg: -3 },  // 20

	{ func: 'jumpWords', arg: -1 },
	{ func: 'jumpWords', arg: 0 },  // 22
	{ func: 'jumpWords', arg: 4 },
	{ func: 'jumpWords', arg: 11 },  // 24
	{ func: 'jumpWords', arg: 100 },

	{ func: 'jumpSentences', arg: -3 },  // 26
	{ func: 'jumpSentences', arg: -1 },
	{ func: 'jumpSentences', arg: 0 },  // 28
	{ func: 'jumpSentences', arg: 1 },
	{ func: 'jumpSentences', arg: 3 },  // 30

	{ func: 'jumpSentences', arg: 100 },
	{ func: 'nextWord', arg: null },  // 32
	{ func: 'nextSentence', arg: null },
	{ func: 'prevWord', arg: null },  // 34
	{ func: 'prevSentence', arg: null }  // 35 (#36 with index 1)
];

// 26 events * 21115 tests = 548990 tests
var events1 = [
	'resetBegin', 'resetFinish',
	'restartBegin', 'restartFinish',
	'playBegin', 'playFinish',
	'pauseBegin', 'pauseFinish',
	'closeBegin', 'closeFinish',
	'onceBegin', 'onceFinish',
	'revertBegin', 'revertFinish',
	'rewindBegin', 'rewindFinish',
	'fastForwardBegin', 'fastForwardFinish',
	'loopBegin', 'loopFinish',
	'newWordFragment',
	'progress',
	'stopBegin', 'stopFinish',
	'done',  // 24
	'loopSkip'  // Not relevant till `state` experiments
];

var funcsWithArgs2 = [
	{ func: 'forceReset', arg: null },  // 0 (0 index)
	{ func: 'reset', arg: null },
	{ func: 'restart', arg: null },  // 2
	{ func: 'play', arg: null },
	{ func: 'togglePlayPause', arg: null },  // 4
	{ func: 'pause', arg: null },

	{ func: 'stop', arg: null },  // 6
	{ func: 'close', arg: null },
	{ func: 'revert', arg: null },  // 8
	{ func: 'rewind', arg: null },
	{ func: 'fastForward', arg: null },  // 10

	{ func: 'once', arg: [0,0,-2] },
	{ func: 'once', arg: [0,0,2] },  // 12
	{ func: 'current', arg: null },  // once( [0,0,0] )
	{ func: 'jumpTo', arg: -3 },  // 14
	{ func: 'jumpTo', arg: -1 },

	{ func: 'jumpTo', arg: 0 },  // 16
	// Different than singles!
	{ func: 'jumpTo', arg: 4 },
	{ func: 'jumpTo', arg: 11 },  // 18
	{ func: 'jumpTo', arg: 100 },
	{ func: 'jumpWords', arg: -3 },  // 20

	{ func: 'jumpWords', arg: -1 },
	{ func: 'jumpWords', arg: 0 },  // 22
	{ func: 'jumpWords', arg: 4 },
	{ func: 'jumpWords', arg: 11 },  // 24
	{ func: 'jumpWords', arg: 100 },

	{ func: 'jumpSentences', arg: -3 },  // 26
	{ func: 'jumpSentences', arg: -1 },
	{ func: 'jumpSentences', arg: 0 },  // 28
	{ func: 'jumpSentences', arg: 1 },
	{ func: 'jumpSentences', arg: 3 },  // 30

	{ func: 'jumpSentences', arg: 100 },
	{ func: 'nextWord', arg: null },  // 32
	{ func: 'nextSentence', arg: null },
	{ func: 'prevWord', arg: null },  // 34
	{ func: 'prevSentence', arg: null }  // 35 (#36 with index 1)
];

var events2 = [
	'playBegin', 'playFinish',
	'resetBegin', 'resetFinish',
	'restartBegin', 'restartFinish',
	'pauseBegin', 'pauseFinish',
	'closeBegin', 'closeFinish',
	'onceBegin', 'onceFinish',
	'revertBegin', 'revertFinish',
	'rewindBegin', 'rewindFinish',
	'fastForwardBegin', 'fastForwardFinish',
	'loopBegin', 'loopFinish',
	'newWordFragment',
	'progress',
	'stopBegin', 'stopFinish',
	'done',
	'loopSkip'  // Not relevant till `state` experiments
];


// Assigned in `start()`
var singleAssertions = null;
var altAssertionater = null;


var increment = function ( indices ) {

	var two = indices.two, one = indices.one;

	// Loop 2
	let event2i = two.event + 1;
	// let arg2i 	= two.arg;
	let func2i 	= two.func;

	// Loop 1
	let event1i = one.event;
	// let arg1i 	= one.arg;
	let func1i 	= one.func;

	if (event2i >= two.events.length) {
		event2i = 0;  // reset
		func2i++;  // increment the next array
	}

	if (func2i >= two.funcs.length) {  // num functions
		func2i = 0;  // reset
		event1i++;  // increment the next array
	}

	if (event1i >= one.events.length) {
		event1i = 0;  // reset
		func1i++;  // increment the next array
	}

	var finished = false;
	// If top most level is done, all done
	if ( func1i >= one.funcs.length ) {  // num functions
		finished = true;
	} else {
		// iterate( 'skip-combos:', func1i, arg1i, event1i, func2i, arg2i, event2i );  // iterate
		iterate( 'skip-combos:', func1i, event1i, func2i, event2i );  // iterate
	}  // end maybe repeat

	return finished;
};  // End increment()



function iterate ( label = '', func1Indx = 0, event1Indx = 0, func2Indx = 0, event2Indx = 0 ) {
	emitter.removeAllListeners();

	var assert1Obj, assert2Obj;

	// Loop 1
	const funcWArg1 = funcsWithArgs1[ func1Indx ];

	const func1Name = funcWArg1.func;
	const arg1		= funcWArg1.arg;
	const evnt1 	= events1[ event1Indx ];

	label = label + ' ' + func1Name + '(' + JSON.stringify( arg1 ) + ')' + ' + ' + evnt1
	// The single assertion for this combo. May end up matching up just fine.
	// Not currently checking if the match up is a false positive
	assert1Obj = singleAssertions[ func1Name ][ JSON.stringify( arg1 ) ][ evnt1 ];
	
	// Loop 2
	const funcWArg2 = funcsWithArgs2[ func2Indx ];

	const func2Name = funcWArg2.func;
	const arg2		= funcWArg2.arg;
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
					// func: func1Indx, arg: arg1Indx, event: event1Indx,
					// funcs: funcsWithArgs1, args: funcWArg1.args, events: events1
					func: func1Indx, event: event1Indx,
					funcs: funcsWithArgs1, events: events1
				},
				two: {
					// func: func2Indx, arg: arg2Indx, event: event2Indx,
					// funcs: funcsWithArgs2, args: funcWArg2.args, events: events2
					func: func2Indx, event: event2Indx,
					funcs: funcsWithArgs2, events: events2
				}
			});
			if ( finished ) {
				tester.finish();

				var time = (new Date()).toString().split(' ')[4];
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
// .slice( begin, end ) where `end` is not included
	
	startTime = Date.now();
	var time = (new Date()).toString().split(' ')[4];
	console.log( 'Start:', time )

	// When `node tests/combos.js` is called in the terminal it needs one
	// argument in order to run. An index number or 'all'.
	if ( typeof process.argv[2] === 'string' ) {

		var arg1 = process.argv[2];

		// If we're supposed to run all combo tests
		if ( arg1 === 'all' ) {

			singleAssertions = require('./helpers/skip-assertions.js')( plab );
			altAssertionater = require('./helpers/skip-combos-assertions.js')( plab );
			iterate('skip-combos:');

		} else {
			arg1 = eval( arg1 );
			var arg2 = eval( process.argv[3] );

			var newArray;

			if ( typeof arg1 === 'number' && typeof arg2 === 'number' ) {
				newArray = funcsWithArgs1.slice( arg1, arg2 );
			} else if ( typeof arg1 === 'number' ) {
				newArray = [ funcsWithArgs1[ arg1 ] ];
			}

			// If we've got a valid first argument, run with that argument
			if ( newArray && !newArray.includes(undefined) ) {

				console.log( 'Testing starting with:', newArray[ 0 ].func + '(' + newArray[ 0 ].arg + ')' );
				funcsWithArgs1 = newArray;

				singleAssertions = require('./helpers/skip-assertions.js')( plab );
				altAssertionater = require('./helpers/skip-combos-assertions.js')( plab );
				iterate('skip-combos:');
			} else if ( newArray.includes(undefined) ) {
				console.log('Arguments are out of bounds. Length of actual array:', funcsWithArgs1.length)
			}
			// If it wasn't 'all' and wasn't a valid first argument, don't do anything

		}  // end if 'all'
	}  // end if called with an argument
}  // End start()

start();
