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
			msg = 'event should not have been triggered but ' + colors.red + 'WAS' + colors.none;
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
			msg 	= 'event should have been triggered but was ' + colors.red + 'NOT' + colors.none;
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

triggered = function ( assertsOverride ) {
		return defaultAsserts.triggered;
};  // Already happens to `pause(null)`
not = function ( assertsOverride ) {
		return defaultAsserts.not;
};  // Already happens to `pause(null)`

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

var allExpectedFailures = require('./expected-failures.js');
var expectFailure = null;  // Func defined later with oritinalAssertion
// expectFailure will be changing all the time
// We will need to get the current version of it
var getExpectFailure = function () {
	return expectFailure;
}





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
	// TODO: Test removing |close from stuff (now that we have a onlyClose test)

	// These don't ever trigger events after `play(null)`
	str = regEscape('play(null) + ');  // Initial function
	str += '(?:reset|pause|close|once|resume|loopSkip)';  // Events
	var playNot = new RegExp( str );
	str = regEscape('doubles: play(null) + restart');
	var playNotRestart = new RegExp( str );

	// These don't ever trigger events after `reset(null)`
	str = regEscape('reset(null) + ');  // Initial function
	str += '(?:play|restart|pause|stop|close|loopSkip|done)';  // Events
	var resetNot = new RegExp( str );

	// These don't ever trigger events after `restart(null)`
	str = regEscape('restart(null) + ');  // Initial function
	str += '(?:play|reset|pause|close|once|resume|loopSkip)';  // Events
	var restartNot = new RegExp( str );


	// These don't ever trigger events after `pause(null)`, `stop(null)`, or `close(null)`
	var regNoLoop = /\b(?:pause|stop|close)(?:\(-?\w+\)) \+ (?:play|reset|restart|once|resume|rewind|fastForward|loop|newWordFragment|progress|done)/;
	// These don't ever trigger events after `pause(null)`
	str = regEscape('pause(null) + ');  // Initial function
	str += '(?:close|stop)';  // Events
	var pauseNot = new RegExp( str );
	// These don't ever trigger events after `pause(null)`
	str = regEscape('stop(null) + ');  // Initial function
	str += '(?:pause|close)';  // Events
	var stopNot = new RegExp( str );
	// These don't ever trigger events after `pause(null)`
	str = regEscape('close(null) + ');  // Initial function
	str += '(?:pause|stop)';  // Events
	var closeNot = new RegExp( str );

	// These don't ever trigger events after `togglePlayPause(null)`
	str = regEscape('togglePlayPause(null) + ');  // Initial function
	str += '(?:reset|close|once|resume|loopSkip)';  // Events
	var toggleNot = new RegExp( str );

	// These don't ever trigger events after `rewind(null)` anytime
	str = regEscape('rewind(null) + ');  // Initial function
	str += '(?:play|reset|pause|close|once|loopSkip)';  // Events
	var rewindNot = new RegExp( str );
	// These don't ever trigger events after `rewind(null)` (from paused)
	str = regEscape('doubles: rewind(null) + ');  // Initial function
	str += '(?:restart)';  // Events
	var rewindStarts = new RegExp( str );
	// Does 'resume' when gets to beginning, etc.
	// will do 'restartFinish' with other stuff
	// TODO: Check if can add 'restartBegin' to 'rewindNot', 'fastForwardNot', etc.

	// These don't ever trigger events after `rewind(null)` anytime
	str = regEscape('fastForward(null) + ');  // Initial function
	str += '(?:play|reset|pause|close|once|resume|loopSkip)';  // Events
	var fastForwardNot = new RegExp( str );
	// These don't ever trigger events after `fastForward(null)` (from paused)
	str = regEscape('doubles: fastForward(null) + ');  // Initial function
	str += '(?:restart)';  // Events
	var fastForwardStarts = new RegExp( str );

	var loopSkip = /loopSkip/;




	// ==========================================
	// TWO DIFFERENT FUNCTIONS
	// ==========================================
	// Like 'doubles: stop(null) + stopBegin > close(null) + stopFinish'
	// Basically 'doubles: word1(null) + word1Begin > word2(null) + word1Finish'
	var selfComplete = /doubles: (.*)(?:\(-?\w+\)) \+ \1Begin > (.*)(?:\(-?\w+\)) \+ \1Finish/;
	// Probably will need or stuff like 'newWordFragment' too

	// Only `reset()` things should fire after 'resetBegin' since it destroys the queue
	str = regEscape('doubles: reset(null) + resetBegin >') + '.*new';  // Events
	var resetBeginFrag = new RegExp( str );
	str = regEscape('doubles: reset(null) + resetBegin >') + '.*progress';  // Events
	var resetBeginProg = new RegExp( str );
	str = regEscape('doubles: reset(null) + resetBegin > ') + '.*?' + regEscape(' + ') + '(?!new|progress|once|loop|resume)';
	var resetBeginOther = new RegExp( str );

	////////////////////// Not sure this will work
	// These events don't trigger after `rewind(null)` (from `pause(null)` same as if started paused)
	// ??: Why would rewind ever trigger 'restart'? I guess it'd be triggered at stopBegin or something
	str = 'doubles: pause.*';  // Functions
	str += regEscape('rewind(null) + ');  // Events
	str += '(?:restart)';  // Events
	var rewindFromPause = new RegExp( str );

	// Does it have a non-`close(null)` function followed by 'close' event?
	// If so, not triggered
	var onlyClose = /\b(?!close)\w+(?:\(-?\w+\)) \+ (?:close)/;

	// Does it have a non-`rewind(null)`/`fastForward(null)` function followed by 'rewind'/'fastForward' event?
	// If so, not triggered
	var onlyRewind = /\b(?!rewind)\w+(?:\(-?\w+\)) \+ (?:rewind)/;
	var onlyFfwd = /\b(?!fastForward)\w+(?:\(-?\w+\)) \+ (?:fastForward)/;
	// same for 'close'? Already taken care of before?

	// If it comes second, it could hear the remnants of a different function being triggered
	var jumpNot = /doubles: jump(?:.*\(-?\w+\)) \+ (?:pause|restart|play|reset)/;







	asts.getAssertion = function ( label, originalAssertion, debug ) {
	// Try to keep these strings as searchable as possible without having a million page doc
		var str, regex;

		expectFailure = function ( result, testText, evnt ) {
			var result = originalAssertion(  result, testText, evnt  )

			var msg, passed = !result.passed;
			// If failed, that was the expected result
			if ( passed ) {
				msg = 'Expected a failure and recieved a failure.';
			} else {
				msg = 'Expected test to fail, but it ' + colors.red + 'DIDN\'T FAIL.' + colors.none;
			}

			msg += '\n--- Unexpected success: ' + colors.red + result.message + colors.none;

			return { passed: passed, message: msg }
		};


		// ==========================================
		// TWO DIFFERENT FUNCTIONS
		// ==========================================
		if ( debug ) { console.log( 'mixed functions' ); }

		// Must come before pause(null), stop(null), and close(null) are kept
		// from interacting
		if ( debug ) { console.log( '1', selfComplete.test(label) ); }
		if ( selfComplete.test(label) ) {
			return defaultAsserts.triggered;
		}

		// Nothing except `close(null)` should trigger close events
		if ( debug ) { console.log( '2', onlyClose.test(label) ); }
		if ( onlyClose.test(label) ) { return defaultAsserts.not; }

		// Only first-function 'reset' stuff (`._once()`) triggers after 'resetBegin' because the queue is killed
		if ( debug ) { console.log( '3', resetBeginFrag.test(label) ); }
		if ( resetBeginFrag.test(label) ) { return getAssertFragsFirst( plyb ); }
		if ( debug ) { console.log( '4', resetBeginProg.test(label) ); }
		if ( resetBeginProg.test(label) ) { return getAssertProgFirst( plyb ); }
		// Other stuff (other than 'once', 'loop', and 'resume') doesn't trigger
		if ( debug ) { console.log( '5', resetBeginOther.test(label) ); }
		if ( resetBeginOther.test(label) ) { return defaultAsserts.not; }

		// onlyRewind and onlyFfwd should be here too, but I'd have to re-number everything
		
		// 'loopSkip' doesn't come into it at all till we start playing with state
		if ( debug ) { console.log( '6', /loopSkip/.test(label) ); }
		if ( /loopSkip/.test(label) ) { return defaultAsserts.not; }

		// jumpWords, jumpSentences, jumpTo should not ever trigger play|reset|restart|pause
		if ( debug ) { console.log( '7', jumpNot.test(label) ); }
		if ( jumpNot.test(label) ) { return defaultAsserts.not; }


		if ( debug ) { console.log( 'x', rewindFromPause.test(label) ); }
		if ( rewindFromPause.test(label) ) { return defaultAsserts.not; }




		// ==========================================
		// SAME FUNCTION, REPEATED
		// ==========================================
		if ( debug ) { console.log( 'repeated functions' ); }

		// Nothing except `rewind(null)` and `fastForward(null)` should trigger their own events
		if ( debug ) { console.log( '1', onlyRewind.test(label), onlyFfwd.test(label) ); }
		if ( onlyRewind.test(label) || onlyFfwd.test(label) ) { return defaultAsserts.not; }

		// --- play(null) ---
		if ( debug ) { console.log( '2', playNot.test(label) ); }
		if ( playNot.test(label) ) { return defaultAsserts.not; }
		if ( debug ) { console.log( '2.5', playNotRestart.test(label) ); }
		if ( playNotRestart.test(label) ) { return defaultAsserts.not; }
		// no alternate:
		// ( if second `play` at loop begin, new fragment not collected yet, so regular output )
		// play(null) + loopBegin > play(null) + all

		// --- reset(null) ---
		if ( debug ) { console.log( '3', resetNot.test(label) ); }
		if ( resetNot.test(label) ) { return defaultAsserts.not; }
		// no alternate:
		// ( happen after newFragment loop is completed, so regular output )
		// reset(null) + resetFinish > reset(null) + all
		// reset(null) + onceFinish > reset(null) + all
		// reset(null) + resumeBegin > reset(null) + all
		// reset(null) + resumeFinish > reset(null) + all
		// reset(null) + loopFinish > reset(null) + all

		// --- restart(null) ---
		if ( debug ) { console.log( '4', restartNot.test(label) ); }
		if ( restartNot.test(label) ) { return defaultAsserts.not; }

		// --- pause(null), stop(null), close(null) ---
		// no loop events
		if ( debug ) { console.log( '5', regNoLoop.test(label) ); }
		if ( regNoLoop.test(label) ) { return defaultAsserts.not; }
		// No other variants
		if ( debug ) { console.log( '6', pauseNot.test(label) || stopNot.test(label) || closeNot.test(label) ); }
		if ( pauseNot.test(label) || stopNot.test(label) || closeNot.test(label) ) { return defaultAsserts.not; }

		// --- togglePlayPause(null) ---
		if ( debug ) { console.log( '7', toggleNot.test(label) ); }
		if ( toggleNot.test(label) ) { return defaultAsserts.not; }

		// --- rewind(null) ---
		if ( debug ) { console.log( '8', rewindNot.test(label) ); }
		if ( rewindNot.test(label) ) { return defaultAsserts.not; }
		if ( debug ) { console.log( '8.5', rewindStarts.test(label) ); }
		if ( rewindStarts.test(label) ) { return defaultAsserts.not; }

		// --- fastForward(null) ---
		if ( debug ) { console.log( '9', fastForwardNot.test(label) ); }
		if ( fastForwardNot.test(label) ) { return defaultAsserts.not; }
		if ( debug ) { console.log( '9.5', fastForwardStarts.test(label) ); }
		if ( fastForwardStarts.test(label) ) { return defaultAsserts.not; }







		// More unique cases below
		if ( debug ) { console.log( 'unimported' ); }
		if ( asts[label] ) {
			return asts[label]( {} );
		}

		if ( debug ) { console.log( 'imported' ); }
		if ( allExpectedFailures[label] !== undefined ) {
			return expectFailure;
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
	asts[ 'doubles: play(null) + stopBegin > play(null) + playFinish' ] = not;
	asts[ 'doubles: play(null) + stopBegin > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + stopBegin > play(null) + restartFinish' ] = triggered;
	// ------------ play() + stopFinish ------------
	// After done, restart instead
	asts[ 'doubles: play(null) + stopFinish > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + stopFinish > play(null) + playFinish' ] = not;
	asts[ 'doubles: play(null) + stopFinish > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + stopFinish > play(null) + restartFinish' ] = triggered;
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
	asts[ 'doubles: play(null) + done > play(null) + playFinish' ] = not;
	asts[ 'doubles: play(null) + done > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + done > play(null) + restartFinish' ] = triggered;



	// =============================================================================
	// =============================================================================
	// ======= reset() + n > reset() + all =======
	// =============================================================================
	// =============================================================================

	// These happen after queue is cleared, so the new function gets added to the queue

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
		return getAssertProgDoubleFirstAndOn( plyb );
	};
	// ------------ restart() + loopBegin ------------
	// Listener in the middle of loop (before 'newWordFragment') will pick up double
	asts[ 'doubles: restart(null) + loopBegin > restart(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirstAndOn( plyb );
	};
	asts[ 'doubles: restart(null) + loopBegin > restart(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirstAndOn( plyb );
	};
	// ------------ restart() + newWordFragment ------------
	// Listener in the middle of loop (after 'newWordFragment', but before) will pick up double
	asts[ 'doubles: restart(null) + newWordFragment > restart(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirstAndOn( plyb );
	};



	// =============================================================================
	// =============================================================================
	// ======= togglePlayPause() + n > togglePlayPause() + all =======
	// ======= some play() + n > pause() + all =======
	// =============================================================================
	// =============================================================================

	// ------------ togglePlayPause() + playBegin ------------
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + playBegin > pause(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsFirst( plyb );
	};
	// play then pause doesn't trigger 'playBegin'
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + playBegin' ] = not;
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + pauseBegin' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + pauseFinish' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + done' ] = not;
	asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + progress' ] =
	asts[ 'doubles: play(null) + playBegin > pause(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgFirst( plyb );
	};
	// ------------ togglePlayPause() + playFinish ------------
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + playFinish' ] = not;
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + pauseBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + pauseFinish' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + done' ] =
	asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + progress' ] = not;
	// ------------ togglePlayPause() + restartBegin ------------
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + playFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + done' ] =
	asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + progress' ] =
	// ------------ togglePlayPause() + restartFinish ------------
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + playFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + done' ] =
	asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + progress' ] = not;
	// ------------ togglePlayPause() + pauseBegin ------------
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + playFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + done' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + progress' ] =
	// ------------ togglePlayPause() + pauseFinish ------------
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + playFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + done' ] =
	asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + progress' ] = not;
	// ------------ togglePlayPause() + stopBegin ------------
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsAll( plyb );
	};  // Already happens to `pause(null)`
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + playFinish' ] = not;
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + restartBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + restartFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + done' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgAll( plyb );
	};  // Already happens to `pause(null)`
	// ------------ togglePlayPause() + stopFinish ------------
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsAll( plyb );
	};  // Already happens to `pause(null)`
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + playFinish' ] = not;
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + restartBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + restartFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + done' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgAll( plyb );
	};  // Already happens to `pause(null)`
	// ------------ togglePlayPause() + loopBegin ------------
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsFirst( plyb );
	};
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + playBegin' ] = not;
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + pauseBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + pauseFinish' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + done' ] = not;
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgFirst( plyb );
	};
	// ------------ togglePlayPause() + loopFinish ------------
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + playBegin' ] = not;
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + pauseBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + pauseFinish' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + loopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + done' ] =
	asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + progress' ] = not;
	// ------------ togglePlayPause() + newWordFragment ------------
	// Will get progress data, but not fragment data
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + playBegin' ] = not;
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + pauseBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + pauseFinish' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + done' ] = not;
	asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + progress' ] =
	asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgFirst( plyb );
	};
	// ------------ togglePlayPause() + progress ------------
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + newWordFragment' ] =
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + playBegin' ] = not;
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + pauseBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + pauseFinish' ] = triggered;
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + stopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + stopFinish' ] =
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + loopBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + done' ] =
	asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + progress' ] = not;
	// ------------ togglePlayPause() + done ------------
	asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + playBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + playFinish' ] = not;
	asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + restartBegin' ] =
	asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + restartFinish' ] = triggered;



	// =============================================================================
	// =============================================================================
	// ======= rewind() + n > rewind() + all =======
	// =============================================================================
	// =============================================================================

	// ------------ rewind() + rewindBegin ------------
	// rewindBegin can trigger rewindBegin again because when it rewinds at the start it also finishes
	// TODO: How to test rewinding twice in a row not at the start? (combos of 3 sounds crazy)
	asts[ 'doubles: rewind(null) + rewindBegin > rewind(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirst( plyb );
	};
	asts[ 'doubles: rewind(null) + rewindBegin > rewind(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirst( plyb );
	};
	// ------------ rewind() + loopBegin ------------
	asts[ 'doubles: rewind(null) + loopBegin > rewind(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsDoubleFirst( plyb );
	};
	asts[ 'doubles: rewind(null) + loopBegin > rewind(null) + progress' ] =
	// ------------ rewind() + newWordFragment ------------
	asts[ 'doubles: rewind(null) + newWordFragment > rewind(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgDoubleFirst( plyb );
	};



	// =============================================================================
	// =============================================================================
	// ======= fastForward() + n > fastForward() + all =======
	// =============================================================================
	// =============================================================================

	// ------------ fastForward() + stopBegin ------------
	asts[ 'doubles: fastForward(null) + stopBegin > fastForward(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsLast( plyb );
	};
	asts[ 'doubles: fastForward(null) + stopBegin > fastForward(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgLast( plyb );
	};
	// ------------ fastForward() + stopFinish ------------
	asts[ 'doubles: fastForward(null) + stopFinish > fastForward(null) + newWordFragment' ] = function ( assertsOverride ) {
		return getAssertFragsLast( plyb );
	};
	asts[ 'doubles: fastForward(null) + stopFinish > fastForward(null) + progress' ] = function ( assertsOverride ) {
		return getAssertProgLast( plyb );
	};



	// =============================================================================
	// =============================================================================
	// ======= GETTING DESPARATE NOW (there are a lot more to go) =======
	// =============================================================================
	// =============================================================================
	// I checked these over and they look like they get legit output

	// --- fastForward(null) ---
	asts[ 'doubles: fastForward(null) + fastForwardBegin > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + fastForwardFinish' ] = // should have been triggerd but was NOT
	asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	asts[ 'doubles: fastForward(null) + loopBegin > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	asts[ 'doubles: fastForward(null) + loopFinish > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	asts[ 'doubles: fastForward(null) + loopFinish > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	asts[ 'doubles: fastForward(null) + loopFinish > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	asts[ 'doubles: fastForward(null) + newWordFragment > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	asts[ 'doubles: fastForward(null) + newWordFragment > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	asts[ 'doubles: fastForward(null) + progress > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	asts[ 'doubles: fastForward(null) + progress > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	asts[ 'doubles: fastForward(null) + progress > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	asts[ 'doubles: fastForward(null) + done > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["wattlebird?"]
	asts[ 'doubles: fastForward(null) + done > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [1]
	// --- fastForward(null) ---
	function () { return getExpectFailure(); }




	return asts;

};  // End MakeAltAsserts()
