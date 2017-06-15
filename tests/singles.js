// tests/singles.js

'use strict';

var typeName = 'singles',
	setUp 	 = require('./helpers/setup-default.js'),
	getAssertions = require('./helpers/single-assertions.js');

var iterables = {
	funcs: [
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

		// once(-1)?
		{ func: 'once', arg: [0,0,-2] },
		{ func: 'once', arg: [0,0,2] },  // 12
		{ func: 'current', arg: null },  // once( [0,0,0] )
		{ func: 'jumpTo', arg: -3 },  // 14
		{ func: 'jumpTo', arg: -1 },

		{ func: 'jumpTo', arg: 0 },  // 16
		{ func: 'jumpTo', arg: 6 },
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
	],
	events: [
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
	]
};  // end iterables{}

return require( './helpers/singles-runner.js' )( typeName, setUp, getAssertions, iterables );
