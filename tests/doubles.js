// tests/doubles.js

// Too long to run on every single code change, but should
// be run sometimes, just to check

var waitTime = 60;  // Double of single tests


var SetUp 		= require('./setup-default.js'),
	bigObjects 	= SetUp(),
	plab 		= bigObjects.playback,
	emitter 	= bigObjects.emitter;


var tester = require('./testing-core.js');
var runLastEvent  = require( './helpers/last-event.js' );
var runFirstEvent = require( './helpers/first-event.js' );


var functsWithArgs = [
	{ func: 'play', args: [ null ] },
	// { func: 'reset', args: [ null ]},
	// { func: 'restart', args: [ null ]},
	// { func: 'pause', args: [ null ]},
	// { func: 'stop', args: [ null ]},
	// { func: 'close', args: [ null ]},
	// { func: 'togglePlayPause', args: [ null ]},
	// { func: 'rewind', args: [ null ]},
	// { func: 'fastForward', args: [ null ]},
	// { func: 'jumpWords', args: [ -1, 0, 3, 4, 11, 100 ]},
	// { func: 'jumpSentences', args: [ -1, 0, 1, 3, 100 ]},
	// { func: 'nextWord', args: [ null ]},
	// { func: 'nextSentence', args: [ null ]},
	// { func: 'prevWord', args: [ null ]},
	// { func: 'prevSentence', args: [ null ]},
	// { func: 'jumpTo', args: [ -1, 0, 6, 11, 100 ]}
];


var events = [
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
	// 'newWordFragment',
	// 'loopSkip',
	// 'progress',
	'done'
];




var getStandardAssertions = null;  // Instantiated in `start()`
var getAltAssertions = null;
var currentAssertions = null;

function iterate ( label = '', func1Indx = 0, arg1Indx = 0, event1Indx = 0, func2Indx = 0, arg2Indx = 0, event2Indx = 0 ) {

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

	const evnt2 = currentAssertions[ event2Indx ].event;
	var assert 	= currentAssertions[ event2Indx ].assertion;

	label = label + ' > ' + func2Name + '(' + arg2 + ')' + ' + ' + evnt2 ;

	var afterFirstEvent = function () {
		
		// This should be mutated in `runLastEvent()`
		var result = { playback: null, arg2s: [] };
		/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, int, bool ) */
		runLastEvent(
			result, bigObjects,
			{ op: func2Name, arg: arg2, event: evnt2 },
			false  // reset
		);

		setTimeout( function runAssert() {
		
			// Run a test
			tester.run( label, function tests ( done ) {
				// do stuff
				try {

					if ( getAltAssertions[label] ) {
						assert = getAltAssertions[label]( {} );
					}

					var outcome = assert( result, label, evnt2 );
					if ( outcome.passed ) {
						done();
					} else {
						done( label + ': ' + outcome.message );
					}

				} catch (err) {

					done(err, label);

				}  // End try
			})  // End it()
			// Then increment and run this function again, testing again
			.then(() => {

				// Loop 2
				let nextEvent2I = event2Indx + 1;
				let nextArg2I 	= arg2Indx;
				let nextFunc2I 	= func2Indx;

				// Loop 1
				let nextEvent1I = event1Indx;
				let nextArg1I 	= arg1Indx;
				let nextFunc1I 	= func1Indx;

				if (nextEvent2I >= currentAssertions.length) {
					nextEvent2I = 0;  // reset
					nextArg2I++;  // increment the next array
				}

				if (nextArg2I >= funcWArg2.args.length) {
					nextArg2I = 0;  // reset
					nextFunc2I++;  // increment the next array
				}

				if (nextFunc2I >= functsWithArgs.length) {  // num functions
					nextFunc2I = 0;  // reset
					nextEvent1I++;  // increment the next array
				}

				if (nextEvent1I >= events.length) {
					nextEvent1I = 0;  // reset
					nextArg1I++;  // increment the next array
				}

				if (nextArg1I >= funcWArg1.args.length) {
					nextArg1I = 0;  // reset
					nextFunc1I++;  // increment the next array
				}

				// If top most level is done, all done
				if (nextFunc1I >= functsWithArgs.length) {  // num functions

					tester.finish();
					return;

				} else {

					iterate( 'doubles:', nextFunc1I, nextArg1I, nextEvent1I, nextFunc2I, nextArg2I, nextEvent2I )  // iterate

					// Too long to run on every single code change, but should
					// be run sometimes, just to check

				}  // end maybe repeat

			});  // End .then()

		}, waitTime + 10);
	};  // End afterFirstEvent()


	runFirstEvent(
		afterFirstEvent, bigObjects,
		{ op: func1Name, arg: arg1, event: evnt1 },
		true  // reset
	);

};  // End iterate()


// Get the variables we need
var start = function () {
	getStandardAssertions 	= require('./helpers/single-assertions.js')( plab );
	getAltAssertions 		= require('./helpers/alt-assertions.js')( plab );
	iterate('doubles:');

	// Too long to run on every single code change, but should
	// be run sometimes, just to check
}

start();
