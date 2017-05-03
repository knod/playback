// tests1.js

var it = require('./tests-core.js');

var Playback = require( '../../dist/Playback.js' );
var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );


var state, parsedText, plab, bigObjects;

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

	plab = Playback( state );
	plab.process( parsedText );

	bigObjects = { playback: plab, state: state };
};  // End setUp()

setUp();


var functsWithArgs = [
	{ func: 'play', args: [ null ] },
	// { func: 'reset', args: [ null ]},
	// { func: 'restart', args: [ null ]},
	// { func: 'pause', args: [ null ]},
	// { func: 'stop', args: [ null ]},
	// { func: 'close', args: [ null ]},
	// { func: 'rewind', args: [ null ]},
	// { func: 'fastForward', args: [ null ]},
	// { func: 'togglePlayPause', args: [ null ]},
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




function doOneThing ( label = '', funcIndx = 0, argIndx = 0, eventIndx = 0 ) {

	emitter.removeAllListeners();

	const funcWArg  = functsWithArgs[ funcIndx ];

	const func 	= funcWArg.func;
	const arg 	= funcWArg.args[ argIndx ];
	const evnt 	= events[ eventIndx ];

	// const evnt = eventAssertions[ func ][ arg ].event;
	// const assert = eventAssertions[ func ][ arg ].assertion;

	const label = label + func + '(' + arg + ')' + ' + ' + evnt ;

	// First run a test
	it( label, function tests ( done ) {
		// do stuff
		try {
			// There will be some failures on purpose
			if ( foo !== bar || bar !== baz || foo !== baz ) {
				done();
			} else {
				done( 'All were equal!', label );
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

		if (nextEventI >= functsWithArgs.length) {
			nextEventI = 0;  // reset
			nextArgI++;  // increment the next array
		}
		if (nextArgI >= funcWArg.args.length) {
			nextArgI = 0;  // reset
			nextFuncI++;  // increment the next array
		}  // end increment

		// If top most level is done, all done
		if (nextFuncI >= events.length) {

			return;

		} else {

			doOneThing( '', nextFuncI, nextArgI, nextEventI )  // iterate

		}  // end maybe repeat

		});  // End .then()
	};

doOneThing();
