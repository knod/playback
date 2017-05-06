// doubles-assertions.js

// Alternative assertions for combo tests that don't get
// the same results as their resepctive single tests.
// All these tests should pass as well, though, so nothing
// should be failing in the 'doubles'? tests.


// ------------ setup ------------

var colors = {
  green: '\x1B[32m', red: '\x1B[31m',
  yellow: '\x1B[33m', none: '\x1B[0m'
};

var	parsedText = [
		[ 'Victorious,', 'you','brave', 'flag.' ],
		[ 'Delirious,', 'I', 'come', 'back.' ],
		[ '\n' ],
		[ 'Why,', 'oh', 'wattlebird?' ]
	];

var	forward = parsedText[0].concat(parsedText[1]).concat(parsedText[2]).concat(parsedText[3]);

var plab = null;


// ------------ helpers ------------

// // Originally meant for Array.prototype
// var arraysEqual = function ( array1, array2 ) {
//     // if the other array is a falsy value, return
//     if (!array1 || !array2)
//         return false;

//     // compare lengths - can save a lot of time 
//     if (array1.length != array2.length)
//         return false;

//     for (var i = 0, l = array1.length; i < l; i++) {
//         // Check if we have nested arrays
//         if ( array1[i] instanceof Array && array2[i] instanceof Array) {
//             // recurse into the nested arrays
//             if ( !arraysEqual( array1[i], array2[i] ) )
//                 return false;       
//         }           
//         else if ( array1[i] != array2[i]) { 
//             // Warning - two different object instances will never be equal: {x:20} != {x:20}
//             return false;   
//         }           
//     }       
//     return true;
// };

// Simple and suited to our purposes
// https://github.com/micro-js/equal-array/blob/master/lib/index.js
var arraysEqual = function ( arr1, arr2 ) {
  var a1Len = arr1.length;
  var a2Len = arr2.length;

  if ( a1Len === a2Len ) {
    for (var i = 0; i < a1Len; ++i) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  return false;
};  // End arraysEqual()



// ------------ default assertions ------------

var defaultAsserts = {
	triggered: null,
	not: null,
	frags: null,
	progress: null
}

defaultAsserts.not = function ( result, testText, evnt ) {

	var passes 	= true;
	// var msg 	= 'no arguments accumulated';
	var msg 	= 'event NOT triggered';

	// var shouldFail = checkExpectedToFail( testText );
	// if ( shouldFail ) {
	// 	// Nothing is expected, it's failing for good reasons
	// } else {
		if ( result.arg2s.length !== 0 ) {
			passes = false;
			msg = 'event should not have been triggerd but ' + colors.red + 'WAS' + colors.none;
		}
	// }

	return { message: msg, passed: passes };

};

defaultAsserts.triggered = function ( result, testText, evnt ) {

	var passes 	= true,
		msg 	= 'event was triggered';

	// var shouldFail = checkExpectedToFail( testText );
	// if ( shouldFail ) {
	// 	// Nothing is expected, it's failing for good reasons
	// } else {
		if ( result.arg2s.length === 0 ) {
			passes 	= false;
			msg 	= 'event should have been triggerd but was ' + colors.red + 'NOT' + colors.none;
		} else if ( result.playback !== plab ) {
			passes 	= false;
			msg 	= 'object recieved was ' + colors.red + 'NOT' + colors.none + ' the expected Playback instance';
		}
	// }

	return { message: msg, passed: passes };
};



// ------------ assertion builders ------------


var makeFragAsserter = function ( plyb, frags ) {
/* ( Playback, [ strs ] ) -> func
* 
* Basically here to abstract away the expected failures check.
* 
* Returns a fragment assertion function with the given values
* which asserts that the given fragments are the ones that
* were collected.
*/
	return function assertFrags( result, testText, evnt ) {

		var passes 	= true,
			msg 	= 'correct fragments were accumulated'

		// console.log( result.arg2s );

		// var shouldFail = checkExpectedToFail( testText );
		// if ( supressExpectedFailures && shouldFail ) {
		// 	// Nothing is expected, it's failing for good reasons
		// } else {
			var triggeredVals = defaultAsserts.triggered( result, testText, evnt );
			if ( !triggeredVals.passed ) { return triggeredVals; }
			else {
				passes = arraysEqual( result.arg2s, frags );
				if ( !passes ) { msg = 'frags expected ' + JSON.stringify( frags ) + ', but got ' + colors.red + JSON.stringify( result.arg2s ) + colors.none }
			}
		// }
		return { message: msg, passed: passes };
	};
};  // End makeFragAsserter()


var makeProgressAsserter = function ( plyb, numItems, vals ) {
/* ( Playback, int, [ floats ] ) -> func
* 
* `vals` should include all the progress vals that will come up
* 
* Basically here to abstract away the expected failures check.
* 
* Returns a progress assertion function with the given values
* which asserts that the correct progress was made at
* the 0, 2, 5, 8, and 11th triggereing of the 'progress' event.
* 
* TODO: Remove `numItems` from calls
*/
	return function assertProgress ( result, testText, evnt ) {

		var passes 	= true,
			msg 	= 'correct progress values were accumulated'

		// var shouldFail = checkExpectedToFail( testText );
		// if ( supressExpectedFailures && shouldFail ) {
		// 	// Nothing is expected, it's failing for good reasons
		// } else {

			var triggeredVals = defaultAsserts.triggered( result, testText, evnt );
			if ( !triggeredVals.passed ) { return triggeredVals; }
			else {
				passes = arraysEqual( result.arg2s, vals );
				if ( !passes ) { msg = '\'progress\' expected ' + JSON.stringify( vals ) + ', but got ' + colors.red + JSON.stringify( result.arg2s ) + colors.none }
			}

		// }
		return { message: msg, passed: passes };
	};
};  // End makeProgressAsserter()




// ------------ common assertions ------------
// ('Delerious,' is also a popular one, but less so)

// - All 12 words -
var getAssertFragsAll = function ( plyb ) {
	return makeFragAsserter( plyb, forward );
};
var getAssertProgAll = function ( plyb ) {
	return makeProgressAsserter( plyb, 12, [ 1/12, 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 1 ] );
};

// - missing first word -
var getAssertFragsNoFirst = function ( plyb ) {
	var less = forward.slice(0);
	less.shift();
	return makeFragAsserter( plyb, less );
};
var getAssertProgNoFirst = function ( plyb ) {
	return makeProgressAsserter( plyb, 11, [ 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 1 ] );
};

// - just first -
var getAssertFragsFirst = function ( plyb ) {
	return makeFragAsserter( plyb, [ 'Victorious,' ] );
};
var getAssertProgFirst = function ( plyb ) {
	return makeProgressAsserter( plyb, 1, [ 1/12 ] );
};

// - just last -
var getAssertFragsLast = function ( plyb ) {
	return makeFragAsserter( plyb, [ 'wattlebird?' ] );
};
var getAssertProgLast = function ( plyb ) {
	return makeProgressAsserter( plyb, 1, [ 12/12 ] );
};

// - double first word -
var getAssertFragsDoubleFirst = function ( plyb ) {
	return makeFragAsserter( plyb, ["Victorious,","Victorious,"] );
};
var getAssertProgDoubleFirst = function ( plyb ) {
	return makeProgressAsserter( plyb, 2, [1/12, 1/12] );
};

// - double first word and then keep going -
var getAssertFragsDoubleFirstAndOn = function ( plyb ) {
	return makeFragAsserter( plyb, ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"] );
};
var getAssertProgDoubleFirstAndOn = function ( plyb ) {
	return makeProgressAsserter( plyb, 13, [1/12, 1/12, 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 12/12] );
};


var cloneAsserts = function ( defaults, override ) {
/* ( {}, {} ) -> other {}
*/
	var asserts = {};

	for ( let astKey in defaults ) {
		if ( override[ astKey ] ) {
			asserts[ astKey ] = override[ astKey ];
		} else {
			asserts[ astKey ] = defaults[ astKey ];
		}
	}

	return asserts;
};  // End cloneAsserts()





// ------------ correct assertions for special combos ------------

module.exports = MakeAltAsserts = function ( plyb ) {
// Could make this into a function that parses the label handed in and gets
// the right assert ( e.g. /doubles: play(null) + reset/.test(label) ),
// but I think that would be less clear, less easy to look up
// May be necessary, though. Ex:
// /^doubles: play(null) + resetBegin/.test(  )

// Note: Nothing should trigger 'loopSkip' in here (the doubles tests)


// asts[ 'doubles: play(null) + done > play(null) + playBegin' ] = function ( assertsOverride ) {
// 	// Example of ways to do make asserts
// 	var asserts = cloneAsserts( defaultAsserts, assertsOverride );
// 	// asserts.frags 	 = getAssertFragsAll( plyb );
// 	// asserts.progress = getAssertProgAll( plyb );
// 	// asserts.frags 	 = makeFragAsserter( plyb, ['Victorious,'] );
// 	// asserts.progress = makeProgressAsserter( plyb, 1, [ 1/12 ] );
// 	return asserts.not;
// };

	plab = plyb;

	var asts = {};

	var functsWithArgs = [
		// { func: 'play', args: [ null ] },
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
		// once?
		// resume?

		// play
		// reset
		// restart
		// pause
		// stop
		// close
		// togglePlayPause
		// rewind
		// fastForward
		// jumpWords
		// jumpSentences
		// nextWord
		// nextSentence
		// prevWord
		// prevSentence
		// jumpTo
		// once?
		// resume?
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
		// 'rewindBegin', 'rewindFinish',  // only rewind
		// 'fastForwardBegin', 'fastForwardFinish',  // only fastForward
		// 'loopBegin', 'loopFinish',
		// 'newWordFragment',
		// 'loopSkip',
		// 'progress',
		// 'done'
	];

	// Always happen together:
	// 1:
		// once
		// loop
		// Skip (maybe)
		// progress
		// Fragment
		// resume


	// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#6969486
	// https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
	// Construct this before so it doesn't have to be constructed every single time
	var escapeRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

	var regEscape = function ( str ) {
	/* ( str ) -> other str
	* 
	* Return a regex-escaped version of `str`. This is so the strings
	* can be as searchable as possible since they're not actually the full strings
	*/
		return str.replace(escapeRegex, '\\$&');
	};  // End escape()


	var str;


	// ==========================================
	// SAME FUNCTION, REPEATED
	// ==========================================
	// These don't ever trigger events after `play(null)`
	str = regEscape('play(null) + ');  // Inital function
	str += '(?:reset|pause|close|once|resume|loopSkip)';  // Events
	var playNot = new RegExp( str );

	// These don't ever trigger events after `reset(null)`
	str = regEscape('reset(null) + ');  // Inital function
	str += '(?:play|restart|pause|stop|close|loopSkip|done)';  // Events
	var resetNot = new RegExp( str );

	// These don't ever trigger events after `restart(null)`
	str = regEscape('restart(null) + ');  // Inital function
	str += '(?:play|reset|pause|close|once|resume|loopSkip)';  // Events
	var restartNot = new RegExp( str );


	// These don't ever trigger events after `pause(null)`, `stop(null)`, or `close(null)`
	var regNoLoop = /\b(?:pause|stop|close)(?:\(-?\w+\)) \+ (?:play|reset|restart|once|resume|rewind|fastForward|loop|newWordFragment|progress|done)/;
	// These don't ever trigger events after `pause(null)`
	str = regEscape('pause(null) + ');  // Inital function
	str += '(?:close|stop)';  // Events
	var pauseNot = new RegExp( str );
	// These don't ever trigger events after `pause(null)`
	str = regEscape('stop(null) + ');  // Inital function
	str += '(?:pause|close)';  // Events
	var stopNot = new RegExp( str );
	// These don't ever trigger events after `pause(null)`
	str = regEscape('close(null) + ');  // Inital function
	str += '(?:pause|stop)';  // Events
	var closeNot = new RegExp( str );

	// Does it have a non-`rewind(null)`/`fastForward(null)` function followed by 'rewind'/'fastForward' event?
	// If so, not triggered
	var regNoRewind = /\b(?!rewind)\w+(?:\(-?\w+\)) \+ (?:rewind)/;
	var regNoFfwd = /\b(?!fastForward)\w+(?:\(-?\w+\)) \+ (?:fastForward)/;
	// same for 'close' and 'pause'?


	// ==========================================
	// TWO DIFFERENT FUNCTIONS
	// ==========================================
	// Like 'doubles: stop(null) + stopBegin > close(null) + stopFinish'
	// Basically 'doubles: word1(null) + word1Begin > word2(null) + word1Finish'
	var selfComplete = /doubles: (.*)(?:\(-?\w+\)) \+ \1Begin > (.*)(?:\(-?\w+\)) \+ \1Finish/;
	// Probably will need or stuff like 'newWordFragment' too


	asts.getAssertion = function ( label, originalAssertion, debug ) {
	// Try to keep these strings as searchable as possible without having a million page doc
		var str, regex;


		// ==========================================
		// TWO DIFFERENT FUNCTIONS
		// ==========================================
if ( debug ) { console.log( 'mixed functions', regNoLoop.test(label) ); }

		// Must come before pause(null), stop(null), and close(null) are kept
		// from interacting
if ( debug ) { console.log( '1', regNoLoop.test(label) ); }
		if ( selfComplete.test(label) ) {
			return defaultAsserts.triggered;
		}




		// ==========================================
		// SAME FUNCTION, REPEATED
		// ==========================================
if ( debug ) { console.log( 'repeated functions', regNoLoop.test(label) ); }
if ( debug ) { console.log( '1', regNoRewind.test(label), regNoFfwd.test(label) ); }
		// Nothing except `rewind(null)` and `fastForward(null)` should trigger rewind and fast forward events
		if ( regNoRewind.test(label) || regNoFfwd.test(label) ) {
			return defaultAsserts.not;
		}

if ( debug ) { console.log( '2', playNot.test(label) ); }
		// --- play(null) ---
		if ( playNot.test(label) ) {
			return defaultAsserts.not;
		}
		// no alternate:
		// ( if second `play` at loop begin, new fragment not collected yet, so regular output )
		// play(null) + loopBegin > play(null) + all

if ( debug ) { console.log( '3', resetNot.test(label) ); }
		// --- reset(null) ---
		if ( resetNot.test(label) ) {
			return defaultAsserts.not;
		}
		// no alternate:
		// ( happen after newFragment loop is completed, so regular output )
		// reset(null) + resetFinish > reset(null) + all
		// reset(null) + onceFinish > reset(null) + all
		// reset(null) + resumeBegin > reset(null) + all
		// reset(null) + resumeFinish > reset(null) + all
		// reset(null) + loopFinish > reset(null) + all

if ( debug ) { console.log( '4', restartNot.test(label) ); }
		// --- restart(null) ---
		if ( restartNot.test(label) ) {
			return defaultAsserts.not;
		}

		// --- pause(null), stop(null), close(null) ---
		// no loop events
if ( debug ) { console.log( '5', regNoLoop.test(label) ); }
		if ( regNoLoop.test(label) ) {
			return defaultAsserts.not;
		}
		// No other variants
if ( debug ) { console.log( '6', regNoLoop.test(label) ); }
		if ( pauseNot.test(label) || stopNot.test(label) || closeNot.test(label) ) {
			return defaultAsserts.not;
		}










if ( debug ) { console.log( 'pre-end' ); }
		// More unique cases below
		if ( asts[label] ) {
			return asts[label]( {} );
		}

if ( debug ) { console.log( 'end' ); }
		// If none of these match, return the original assertion
		return originalAssertion;
	};  // End getAssertion() (func from label)



	// =============================================================================
	// =============================================================================
	// ======= play() + n > play() + all =======
	// =============================================================================
	// =============================================================================

	// ------------ play() + playBegin ------------
	// Triggers before loop, so all words are still collected on the 'newWordFragmet' event

	// ------------ play() + playFinish ------------
	// Triggers after loop has run, so missing the first word
	asts[ 'doubles: play(null) + playFinish > play(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsNoFirst( plyb );
	};

	asts[ 'doubles: play(null) + playFinish > play(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgNoFirst( plyb );
	};

	// ------------ play() + stopBegin ------------
	// After done, restart instead
	asts[ 'doubles: play(null) + stopBegin > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + stopBegin > play(null) + playFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};
	asts[ 'doubles: play(null) + stopBegin > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + stopBegin > play(null) + restartFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.triggered;
	};
	// ------------ play() + stopFinish ------------
	// After done, restart instead
	asts[ 'doubles: play(null) + stopFinish > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + stopFinish > play(null) + playFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};
	asts[ 'doubles: play(null) + stopFinish > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + stopFinish > play(null) + restartFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.triggered;
	};

	// ------------ play() + loopBegin ------------

	// ------------ play() + loopFinish ------------
	asts[ 'doubles: play(null) + loopFinish > play(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsNoFirst( plyb );
	};
	asts[ 'doubles: play(null) + loopFinish > play(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgNoFirst( plyb );
	};

	// ------------ play() + newWordFragment ------------
	asts[ 'doubles: play(null) + newWordFragment > play(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsNoFirst( plyb );
	};

	// ------------ play() + progress ------------
	asts[ 'doubles: play(null) + progress > play(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsNoFirst( plyb );
	};
	asts[ 'doubles: play(null) + progress > play(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgNoFirst( plyb );
	};

	// ------------ play() + done ------------
	// After done, restart instead
	asts[ 'doubles: play(null) + done > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + done > play(null) + playFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};
	asts[ 'doubles: play(null) + done > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + done > play(null) + restartFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.triggered;
	};



	// =============================================================================
	// =============================================================================
	// ======= reset() + n > reset() + all =======
	// =============================================================================
	// =============================================================================

	// ------------ reset() + resetBegin ------------
	// Listener in the middle of loop (before 'newWordFragment') will pick up double
	asts[ 'doubles: reset(null) + resetBegin > reset(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirst( plyb );
	};
	asts[ 'doubles: reset(null) + resetBegin > reset(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirst( plyb );
	};

	// ------------ reset() + onceBegin ------------
	// Listener in the middle of loop (before 'newWordFragment') will pick up double
	asts[ 'doubles: reset(null) + onceBegin > reset(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirst( plyb );
	};
	asts[ 'doubles: reset(null) + onceBegin > reset(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirst( plyb );
	};

	// ------------ reset() + loopeBegin ------------
	// Listener in the middle of loop (before 'newWordFragment') will pick up double
	asts[ 'doubles: reset(null) + loopBegin > reset(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirst( plyb );
	};
	asts[ 'doubles: reset(null) + loopBegin > reset(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirst( plyb );
	};

	// ------------ reset() + newWordFragment ------------
	// Listener in the middle of loop (after 'newWordFragment', but before) will pick up double
	asts[ 'doubles: reset(null) + newWordFragment > reset(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirst( plyb );
	};



	// =============================================================================
	// =============================================================================
	// ======= restart() + n > restart() + all =======
	// =============================================================================
	// =============================================================================

	// ------------ restart() + restartBegin ------------
	// Listener in the middle of loop (before 'newWordFragment') will pick up double
	asts[ 'doubles: restart(null) + restartBegin > restart(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirstAndOn( plyb );
	};
	asts[ 'doubles: restart(null) + restartBegin > restart(null) + progress' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirstAndOn( plyb );
	};

	// ------------ restart() + loopBegin ------------
	// Listener in the middle of loop (before 'newWordFragment') will pick up double
	asts[ 'doubles: restart(null) + loopBegin > restart(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirstAndOn( plyb );
	};
	asts[ 'doubles: restart(null) + loopBegin > restart(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirstAndOn( plyb );
	};

	// ------------ restart() + newWordFragment ------------
	// Listener in the middle of loop (after 'newWordFragment', but before) will pick up double
	asts[ 'doubles: restart(null) + newWordFragment > restart(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirstAndOn( plyb );
	};



	return asts;

};  // End MakeAltAsserts()

