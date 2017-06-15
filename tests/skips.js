// tests/skip.js
// Skips 'Victorious,', 'flag.', 'Delerious,', 'come', '\n', 'wattlebird?'


'use strict';


var typeName = 'skips';

var setUp = function () {

	var SetUp 		= require('./helpers/setup-default.js'),
		bigObjects 	= SetUp();

	// Skips 'Victorious,', 'flag.', 'Delirious,', 'come', '\n', 'wattlebird?'
	// What it looks like when skipping around. Does not give good indication of progress values.
	// var forward = [ 'you', 'brave', 'I', 'back.', 'Why,', 'oh' ];
	var skippers = [ 'Victorious,', 'flag.', 'Delirious,', 'come', '\n', 'wattlebird?' ];
	bigObjects.state.playback.transformFragment = function ( frag ) {
		if ( skippers.indexOf( frag ) > -1 ) {
			return '$$skip$$';
		} else {
			return frag;
		}
	}

	return bigObjects;
}

var getAssertions = require('./helpers/skip-assertions.js');

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

module.exports = require( './helpers/singles-runner.js' )( typeName, setUp, getAssertions, iterables );

