// tests/singles.js

var waitTime = 30;  // 20 is too short, 25 maybe ok


var SetUp 		= require('./setup-default.js'),
	bigObjects 	= SetUp(),
	plab 		= bigObjects.playback,
	emitter 	= bigObjects.emitter;


var tester = require('./testing-core.js');
var runEvent = require( './helpers/last-event.js' );


var functsWithArgs = [
	{ func: 'play', args: [ null ] },  // * 26 for 1 event
	{ func: 'togglePlayPause', args: [ null ]},
	{ func: 'restart', args: [ null ]},
	{ func: 'reset', args: [ null ]},
	{ func: 'pause', args: [ null ]},
	{ func: 'stop', args: [ null ]},
	{ func: 'close', args: [ null ]},
	{ func: 'rewind', args: [ null ]},
	{ func: 'fastForward', args: [ null ]},
	// These could go on forever... but they do get tested somewhat with
	// jump, next, and prev, so don't /really/ need to tests singles or
	// word or sentence incrementations. If that changes, these tests need
	// to change
	{ func: 'once', args: [ [0,0,-2], [0,0,0], [0,0,2] ]},
	{ func: 'jumpTo', args: [ -1, 0, 6, 11, 100 ]},
	{ func: 'jumpWords', args: [ -1, 0, 3, 4, 11, 100 ]},
	{ func: 'jumpSentences', args: [ -1, 0, 1, 3, 100 ]},
	{ func: 'nextWord', args: [ null ]},
	{ func: 'nextSentence', args: [ null ]},
	{ func: 'prevWord', args: [ null ]},
	{ func: 'prevSentence', args: [ null ]},
	{ func: 'revert', args: [ null ]}
];

var events = [
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
	'loopSkip'
];


var assertions = null;  // Instantiated in `start()`


var currentAssertion = null;

function iterate ( label = '', funcIndx = 0, argIndx = 0, eventIndx = 0 ) {

	emitter.removeAllListeners();

	const funcWArg  = functsWithArgs[ funcIndx ];

	const funcName 	= funcWArg.func;
	const arg 		= funcWArg.args[ argIndx ];
	const evnt 	= events[ eventIndx ];

	label = label + ' ' + funcName + '(' + JSON.stringify( arg ) + ')' + ' + ' + evnt ;

	currentAssertion = assertions[ funcName ][ JSON.stringify( arg ) ][ evnt ];

	const assert = currentAssertion.assertion;
	const type 	 = currentAssertion.type;

	// This should be mutated in `runEvent()`
	var result = { playback: null, arg2s: [] };
	/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, bool ) */
	runEvent(
		result, bigObjects,
		{ op: funcName, arg: arg, event: evnt },
		true  // reset
	);

	setTimeout( function runAssert() {
	
		// Run a test
		tester.run( label, function tests ( done ) {
			// do stuff
			try {

				var outcome = assert( result, label, evnt );
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

			let nextEventI 	= eventIndx + 1;
			let nextArgI 	= argIndx;
			let nextFuncI 	= funcIndx;

			if (nextEventI >= events.length) {
				nextEventI = 0;  // reset
				nextArgI++;  // increment the next array
			}
			if (nextArgI >= funcWArg.args.length) {
				nextArgI = 0;  // reset
				nextFuncI++;  // increment the next array
			}  // end increment

			// If top most level is done, all done
			if (nextFuncI >= functsWithArgs.length) {

				tester.finish();
				return;

			} else {

				iterate( 'singles:', nextFuncI, nextArgI, nextEventI )  // iterate

			}  // end maybe repeat

		});  // End .then()

	}, waitTime + 10 );
};  // End iterate()


// Get the variables we need
var start = function () {
	assertions = require('./helpers/single-assertions.js')( plab );
	iterate('singles:');
}

start();

