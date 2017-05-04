// tests/test-singles.js

var it = require('./tests-core.js');
var waitTime = 30;

var Playback = require( '../dist/Playback.js' );
var EventEmitter = require( '../node_modules/wolfy87-eventemitter/EventEmitter.js' );


var state, emitter, parsedText, plab, bigObjects;

var setUp = function () {
	state = {};

	emitter = state.emitter = new EventEmitter();  // Now has events
	state.stepper 	= { maxNumCharacters: 20 };
	state.delayer 	= { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
	state.playback 	= {};
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

	plab = Playback( state );
	plab.process( parsedText );

	bigObjects = { playback: plab, state: state };
};  // End setUp()

setUp();



var tester = require('./tests-core.js');
var runLastEvent = require( './helpers/last-event.js' );


var functsWithArgs = [
	{ func: 'play', args: [ null ] },
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
];


// var events = [
// 	// 'playBegin', 'playFinish',
// 	// 'resetBegin', 'resetFinish',
// 	// 'restartBegin', 'restartFinish',
// 	// 'pauseBegin', 'pauseFinish',
// 	// 'stopBegin', 'stopFinish',
// 	// 'closeBegin', 'closeFinish',
// 	// 'onceBegin', 'onceFinish',
// 	// 'resumeBegin', 'resumeFinish',
// 	// 'rewindBegin', 'rewindFinish',
// 	// 'fastForwardBegin', 'fastForwardFinish',
// 	// 'loopBegin', 'loopFinish',
// 	// 'newWordFragment',
// 	// 'loopSkip',
// 	// 'progress',
// 	'done'
// ];


var getAssertions = null;  // Instantiated in `start()`


var currentAssertions = null;

function iterate ( label = '', funcIndx = 0, argIndx = 0, eventIndx = 0 ) {

	emitter.removeAllListeners();

	const funcWArg  = functsWithArgs[ funcIndx ];

	const funcName 	= funcWArg.func;
	const arg 		= funcWArg.args[ argIndx ];
	// const evnt 	= events[ eventIndx ];

	if ( eventIndx === 0 ) {
		currentAssertions = getAssertions[ funcName ][ JSON.stringify(arg) ]( {} );
	}

	const evnt = currentAssertions[ eventIndx ].event;
	const assert = currentAssertions[ eventIndx ].assertion;

	var label = label + ' ' + funcName + '(' + arg + ')' + ' + ' + evnt ;

	// This should be mutated in `runLastEvent()`
	var result = { playback: null, arg2s: [] };
	/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, int, bool ) */
	runLastEvent(
		result,
		{ playback: plab, emitter: emitter },
		{ op: funcName, arg: arg, event: evnt },
		waitTime,
		true  // reset
	);

	setTimeout( function runAssert() {
	
		// Run a test
		tester.runOne( label, function tests ( done ) {
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

			if (nextEventI >= currentAssertions.length) {
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

				iterate( '', nextFuncI, nextArgI, nextEventI )  // iterate

			}  // end maybe repeat

		});  // End .then()

	}, waitTime + 10);
};  // End iterate()


// Get the variables we need
var start = function () {
	getAssertions = require('./helpers/single-assertions.js')( plab );
	iterate('1 func, 1 event:');
}

start();

