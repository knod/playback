/* tests/skip-combos.js
* 
* Too long to run on every single code change, but should
* be run sometimes, just to check
*/

'use strict';

// ( typeName, consoleArg, setupFunc, singleAssertionsFunc, altAssertionaterFunc, iterables )
var typeName 	= 'skip-combos';
var consoleArg 	= process.argv[2];


var setupFunc = function () {

	const bigObjects = require('./setup-default.js')();
	const skippers = [ 'Victorious,', 'flag.', 'Delirious,', 'come', '\n', 'wattlebird?' ];
	bigObjects.state.playback.transformFragment = function ( frag ) {
		if ( skippers.indexOf(frag) > -1 ) {
			return '$@skip@$'
		} else {
			return frag;
		}
	}

	return bigObjects;
};  // End setupFunc()


var singleAssertionsFunc = require( './helpers/skip-assertions.js' );
var altAssertionaterFunc = require( './helpers/skip-combos-assertions.js' );


// A note on `once()`
// Those tests could go on forever... but they do get tested somewhat with
// next, prev, and the jumps so a lot taken care of. If that changes, these
// tests need to change
var iterables = { one: {}, two: {} };

iterables.one.funcs = [
	{ func: 'forceReset', arg: null },  // 0 (0 index)
	{ func: 'reset', arg: null },
	{ func: 'restart', arg: null },  // 2
	{ func: 'play', arg: null },
	{ func: 'toggle', arg: null },  // 4
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

iterables.one.events = [
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
	'loopSkip'  // Relevant now
];

iterables.two.funcs = [
	{ func: 'forceReset', arg: null },  // 0 (0 index)
	{ func: 'reset', arg: null },
	{ func: 'restart', arg: null },  // 2
	{ func: 'play', arg: null },
	{ func: 'toggle', arg: null },  // 4
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

iterables.two.events = [
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
	'loopSkip'  // Relevant now
];


var runner = require( './helpers/combos-runner.js');
runner( typeName, consoleArg, setupFunc, singleAssertionsFunc, altAssertionaterFunc, iterables );
