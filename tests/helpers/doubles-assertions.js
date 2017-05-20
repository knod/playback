// doubles-assertions.js

// Alternative assertions for combo tests that don't get
// the same results as their resepctive single tests.
// All these tests should pass as well, though, so nothing
// should be failing in the 'doubles'? tests.

// Note: double values not caused by actual second function, just by listener that's added to the test

// TODO: This isn't great - it matters which thing comes before
// what. It should be more robust than that


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

var wordIndicies = [],
	wordIndex = -1;

for ( let senti = 0; senti < parsedText.length; senti++ ) {
	// Need the position number of the first word in each sentence
	if ( parsedText[ senti - 1 ] ) {
		let sent = parsedText[ senti - 1 ];
		wordIndex += sent.length;
	}

	wordIndicies.push( wordIndex );
}
// To represent the end of the text
wordIndicies.push( 12 );


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

defaultAsserts.not = function ( result, testID, evnt ) {

	var passes 	= true;
	// var msg 	= 'no arguments accumulated';
	var msg 	= 'Combos-' + testID +': Event NOT triggered';

	// var shouldFail = checkExpectedToFail( testID );
	// if ( shouldFail ) {
	// 	// Nothing is expected, it's failing for good reasons
	// } else {
		if ( result.arg2s.length !== 0 ) {
			passes = false;
			var testID
			msg = 'Combos-' + testID +': Event should not have been triggered but ' + colors.red + 'WAS' + colors.none;
		}
	// }

	return { message: msg, passed: passes };

};

defaultAsserts.triggered = function ( result, testID, evnt ) {

	var passes 	= true,
		msg 	= 'Combos-' + testID +': Event was triggered';

	// var shouldFail = checkExpectedToFail( testID );
	// if ( shouldFail ) {
	// 	// Nothing is expected, it's failing for good reasons
	// } else {
		if ( result.arg2s.length === 0 ) {
			passes 	= false;
			msg 	= 'Combos-' + testID +': Event should have been triggered but was ' + colors.red + 'NOT' + colors.none;
		} else if ( result.playback !== plab ) {
			passes 	= false;
			msg 	= 'Combos-' + testID +': Object recieved was ' + colors.red + 'NOT' + colors.none + ' the expected Playback instance';
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
	return function assertFrags( result, testID, evnt ) {

		var passes 	= true,
			msg 	= 'Combos-' + testID +': Correct fragments were accumulated'

		// console.log( result.arg2s );

		// var shouldFail = checkExpectedToFail( testID );
		// if ( supressExpectedFailures && shouldFail ) {
		// 	// Nothing is expected, it's failing for good reasons
		// } else {
			var triggeredVals = defaultAsserts.triggered( result, testID, evnt );
			if ( !triggeredVals.passed ) { return triggeredVals; }
			else {
				passes = arraysEqual( result.arg2s, frags );
				if ( !passes ) { msg = 'Combos-' + testID +': Frags expected ' + JSON.stringify( frags ) + ', but got ' + colors.red + JSON.stringify( result.arg2s ) + colors.none }
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
	return function assertProgress ( result, testID, evnt ) {

		var passes 	= true,
			msg 	= 'Combos-' + testID +': Correct progress values were accumulated'

		// var shouldFail = checkExpectedToFail( testID );
		// if ( supressExpectedFailures && shouldFail ) {
		// 	// Nothing is expected, it's failing for good reasons
		// } else {

			var triggeredVals = defaultAsserts.triggered( result, testID, evnt );
			if ( !triggeredVals.passed ) { return triggeredVals; }
			else {
				passes = arraysEqual( result.arg2s, vals );
				if ( !passes ) { msg = 'Combos-' + testID +': \'progress\' expected ' + JSON.stringify( vals ) + ', but got ' + colors.red + JSON.stringify( result.arg2s ) + colors.none }
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
/* (  {} ) -> other {}
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
		// revert?

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
		// revert?
	];


	var events = [
		// 'playBegin', 'playFinish',
		// 'resetBegin', 'resetFinish',
		// 'restartBegin', 'restartFinish',
		// 'pauseBegin', 'pauseFinish',
		// 'stopBegin', 'stopFinish',
		// 'closeBegin', 'closeFinish',
		// 'onceBegin', 'onceFinish',
		// 'revertBegin', 'revertFinish',
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
		// revert


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
	// BASICS
	// ==========================================
	// play, [ null ]  // * 26 for 1 even
	// togglePlayPause, [ null ]
	// restart, [ null ]
	// reset, [ null ]
	// pause, [ null ]
	// stop, [ null ]
	// close, [ null ]
	// rewind, [ null ]
	// fastForward, [ null ]
	// // // These could go on forever... but they do get tested somewhat with
	// // // jump, next, and prev, so don't /really/ need to tests singles or
	// // // word or sentence incrementations. If that changes, these tests need
	// // // to change
	// once, [ [0,0,-2], [0,0,0], [0,0,2] ]
	// jumpTo, [ -1, 0, 6, 11, 100 ]
	// jumpWords, [ -1, 0, 3, 4, 11, 100 ]
	// jumpSentences, [ -1, 0, 1, 3, 100 ]
	// nextWord, [ null ]
	// nextSentence, [ null ]
	// prevWord, [ null ]
	// prevSentence, [ null ]
	// revert, [ null ]
	
	// === NEVER TRIGGERS (play + event combos) ===

	// var playAlwaysNot = /play(?:\(.*\)) \+ (?:reset|pause|close|once|revert|rewind|fast|loopSkip)/;
	// var toggleAlwaysNot = /togglePlayPause(?:\(.*\)) \+ (?:reset|close|once|revert|rewind|fast|loopSkip)/;
	// // restart + play?|reset|pause|close|once|revert|rewind|fast|loopSkip
	// var restartAlwaysNot = /restart(?:\(.*\)) \+ (?:play|reset|pause|close|once|revert|rewind|fast|loopSkip)/;
	// var resetAlwaysNot = /reset(?:\(.*\)) \+ (?:play|restart|pause|stop|close|rewind|fast|loopSkip|done)/;
	// // alternatively to the below: /(?:pause|stop|close)(?:\(.*\)) \+ (?!\1)/;  // (only itself)
	// var pauseAlwaysNot = /pause(?:\(.*\)) \+ (?:play|reset|restart|stop|close|once|revert|rewind|fast|loop|new|loopSkip|progress|done)/;  // (only itself)
	// var stopAlwaysNot = /stop(?:\(.*\)) \+ (?:play|reset|restart|pause|close|once|revert|rewind|fast|loop|new|loopSkip|progress|done)/;  //(only itself)
	// var closeAlwaysNot = /close(?:\(.*\)) \+ (?:play|reset|restart|pause|stop|once|revert|rewind|fast|loop|new|loopSkip|progress|done)/;  //(only itself)
	// // revert + play|reset|restart|pause|stop?|close|once|rewind|fast|loopSkip|done? (maybe should trigger play/pause) ('stop' and 'done' may fire if 'play', then go to just before the end)
	// var revertAlwaysNot = /revert(?:\(.*\)) \+ (?:play|reset|restart|pause|stop?|close|once|rewind|fast|loopSkip|done)/;

	// // rewind + play|reset|restart|close|once|fast|loopSkip  // if play, revert to play if revert? but goes to start and then done, so...
	// var rewindAlwaysNot = /rewind(?:\(.*\)) \+ (?:play|reset|restart|close|once|fast|loopSkip)/;
	// var fastForwardAlwaysNot = /fastForward(?:\(.*\)) \+ (?:play|reset|restart|pause|close|once|revert|rewind|loopSkip)/;  // never reverts on its own, always goes to end

	// // Both negative and positive should not trigger these
	// var onceAlwaysNot = /once(?:\(.*\)) \+ (?:play|reset|restart|close|rewind|fast|loopSkip)/;
	// // Only positive should not trigger these
	// var oncePositiveAlwaysNot = /once\([^)-]+\) \+ (?:pause|stop|revert|done)/;

	// // next + reset|restart?|pause?|close|rewind|fast|loopSkip
	// var nextAlwaysNot = /next(?:.*\(.*\)) \+ (?:reset|restart|pause|close|rewind|fast|loopSkip)/;
	// var prevAlwaysNot = /prev(?:.*\(.*\)) \+ (?:reset|restart|pause|close|rewind|fast|loopSkip)/;
	// var jumpAlwaysNot = /jump(?:.*\(.*\)) \+ (?:reset|restart|pause|close|rewind|fast|loopSkip)/;  // Should this be expected behavior, even if >0 at very end?

	// Should be in different area
	// TODO: Needed?
	var jumpPastEndAlwaysNot = /(?:jumpTo\(11\)|jumpTo\(100\)|jumpWords\(11\)|jumpWords\(100\)|jumpSentences\(100\)) \+ (?:play)/;
	
	// // === IF AT START, NEVER TRIGGERS ===
	// // Only things additional to the above (Always) ones
	// var playAtStartNot = /doubles: play(?:\(.*\)) \+ (?:restart)/;
	// var toggleAtStartNot = /doubles: togglePlayPause(?:\(.*\)) \+ (?:restart|pause)/;
	// var rewindAtStartNot = /doubles: rewind(?:\(.*\)) \+ (?:play)/;  // TODO: May be unnecessary
	// var nextAtStartNot = /doubles: next(?:.*\(.*\)) \+ (?:play|stop|done)/;
	// var prevAtStartNot = /doubles: prev(?:.*\(.*\)) \+ (?:play)/;
	// var jumpAtStartNot = /doubles: jump(?:.*\(.*\)) \+ (?:play)/;
	// var jumpToAtStartNot = /doubles: (?:jumpTo\(0\)|jumpTo\(6\)) \+ (?:play|stop|done)/;  // [ -1, 0, 6, 11, 100 ]
	// var jumpWordsAtStartNot = /doubles: (?:jumpWords\(0\)|jumpWords\(3\)|jumpWords\(4\)) \+ (?:play|stop|done)/;  // [ -1, 0, 3, 4, 11, 100 ]
	// var jumpSentencesAtStartNot = /doubles: (?:jumpSentences\(0\)|jumpSentences\(1\)|jumpSentences\(3\)) \+ (?:play|stop|done)/;  // [ -1, 0, 1, 3, 100 ]


	var forward = '(?:play|restart|toggle|fast|next|jump)(?:.*\([^)-]*\))'

	// ==========================================
	// COMPLEX COMBOS
	// ==========================================
	// var playOnceNoRestart = /doubles: play(?:\(.*\)) \+ (?:restart.* > )(?!play)/;  // ??: What? Does this make sense?
	// var playNotAfterRestart = /doubles: .*(?:\(.*\)) \+ (?:restart.* > )(?!play)/;  // ??: What? Does this make sense?
	
	// // If play-like gets to done, no play, yes restart
	// // var doneThenNotPlay = /doubles: (?:play|restart|toggle|rewind|fastForward|prev)(?:\(.*\)) \+ (?:stop|done)(?:.* > play)/;
	// var doneThenYesRestart = /doubles: (?:play|restart|toggle|rewind|fastForward|prev)(?:\(.*\)) \+ (?:stop|done)(?:.* > play)/;
	// var jumpPreStartNotPlay = /doubles: (?:jump.*)(?:\(-\w+\)) \+ (?:stop|done)(?:.* > play)/;
	// var jumpPreStartYesRestart = /doubles: (?:jump.*)(?:\(-\w+\)) \+ (?:stop|done)(?:.* > restart)/;
	// var jumpPastEndNotPlay = /doubles: (?:jump)(?:\(.*\)) \+ (?:stop|done)(?:.* > play)/;
	// var jumpPastEndYesRestart = /doubles: (?:jump)(?:\(.*\)) \+ (?:stop|done)(?:.* > restart)/;

	// stop/done then play = not play, yes restart (but only if the previous one was triggered)
	// Needs extensive testing
	var doneThenPlayThenPlayNot = /doubles: (?:(?!stop).*\(.*\)) \+ (?:stop|done).* > (?:play|toggle)(?:.*\(.*\)) \+ play/;
	// stop/done > play + restart = triggered
	var doneThenPlayThenRestartYes = /doubles: (?:(?!stop).*\(.*\)) \+ (?:stop|done).* > (?:play|toggle)(?:.*\(.*\)) \+ restart/;

	var playToggleNotPauseNo = /doubles: (?:play|restart|toggle)(?:.*\(.*\)) \+ (?!stop|done).* > (?:toggle)(?:.*\(.*\)) \+ (?!pause)/;
	var playTogglePauseYes = /doubles: (?:play|restart|toggle)(?:.*\(.*\)) \+ (?!stop|done).* > (?:toggle)(?:.*\(.*\)) \+ (?:pause)/;
	// NOT TRIGGERED. If event added to queue anytime before 'resetFinish'
	// it gets removed from queue. It isn't called and its events don't get triggerd.
	var resetKillsQueue = /doubles: (?:reset|force)(?:.*\(.*\)) \+ (?:resetBegin|once|current|revert|loopBegin|loopFinish|new|progress)(.* >)/;


	// Test bug
	// ============ play|toggle|restart + any? except done & stop?
	// > revert + play = triggered
	// > revert + pause = not triggered
	var revertsToPlayTriggersPlay = /doubles: (?:play|restart|toggle)(?:.*\(.*\)) \+ (?!stop|done).* > revert(?:.*\(.*\)) \+ play/;
	var revertsToPlayNoTriggersPause = /doubles: (?:play|restart|toggle)(?:.*\(.*\)) \+ (?!stop|done).* > revert(?:.*\(.*\)) \+ pause/

	// Was #E5-ish (doesn't run expectFailure, but does sort of mean it)
	// In here - it just makes sure these were triggered or not
	// Calculates what position should be in text
	var changesPositionAtStart = /doubles: (?:play|restart|toggle|once|current|fast|rewind|next|prev|jump)/;
	var getsValuesAtEnd = /> (?:play|toggle|once|current|fast|rewind|next|prev|jump)(?:.*\(.*\)) \+ (?:new|progress)/;

	// test bug - play-like (!stop) + stop|done? > moveForward with not play-like (jump etc. that's >=0) + stop|done = triggered
	// jumpTo(-1) doesn't trigger done, so we're fine there since we're only looking for a first event of stop|done
	var doneAtEndThenForwardDoneYes = /doubles: (?:(?!stop).*\([^)-]*\)) \+ (?:stop|done).* > (?:next|once|current|jump)(?:.*\([^)-]*\)) \+ (?:stop|done)/;
	var doneAtEndThenBackDoneNo = /doubles: (?:(?!stop).*\([^)-]*\)) \+ (?:stop|done).* > (?:next|once|jump)(?:.*\(.*(?:-).*\)) \+ (?:stop|done)/;


	// ========== 10
	// state to play:
	//	play|toggle|restart
	// play-like:
	// 	play|toggle|restart|fast
	// forward not to end:
	// 	next|current(null)|once([0,0,2])|jumpTo(0/6)|jumpWords(0|3|4)|jumpS(0||1|3)
	// backward:
	// 	prev|once([0,0,-2])|jumpW|S(-1)
	// forward to end:
	// 	jumpTo(11|100)|jumpW(11|100)|jumpS(100)
	// backward to "end":
	// 	jumpTo(-1)



	// ==========================================
	// EXPECT FAILURE
	// ==========================================
	// play-like + play doesn't get normal play output

	// play|toggle|restart|fastForward|next() + ... > play() + new|progress
	// jumpW > 0 | (<11?) + ... > play() + new|progress
	// jumpS > 0 | (<4?) + ... > play() + new|progress
	// jumpTo (<0?) | >0 | (<11?) + ... > play() + new|progress
	// ... might = (!loopSkip)play|loop|new|progress

	// not at start of text + play or toggle gets non-single function output
	// doubles: 
	// 	next
	// 	jumpTo(!0 <11?)
	// 	jumpW(>0 <11?)
	// 	jumpS(>0 <4?)

	// + ... > toggle + new|progress
	// ... might = (!loopSkip)play|loop|new|progress
	// = expect error






	// in tests/brainstorming/trigger.md
	// ========== 5 ==========
	// from
	// _1st Func Change Pos_ (starting at start, function 1) change the position in the text
	// to
	// _Middle_ as second function would change output if was in middle
	// TODO
	// 'play-like' first does [0, 0, 0] and then moves on
	// CODE BUG? Why does the same not happen for `once([0,0,-2])`?
	
	// BUT
	// Play only does 'current word' before ffwd|next cancels loop and goes to next
	// word|sentence as usual, so don't include that
	str = 'doubles: (?:play|toggle|restart|fast|next';
	str += ''; // Something with jump turned into regex
	// continue that till all the jump things are in here
	// str += ')(?:.*\\(.*\\)) \\+ (?:play|fast|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|fast|next|prev|once';
	// str += ')(?:.*\\(.*\\)) \\+ (?:play|restart|fast|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|prev|once';
	str += ')(?:.*\\(.*\\)) \\+ (?:play|restart|fast|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|prev|once|current';
	str += ''; // Something with jump turned into regex
	// continue that till all the jump things are in here
	str += ')(?:.*\\([^)-]*\\)) \\+ (?:new|progress)'; // Nothing with a negative in it
	// #E2
	var changePosInMiddleWithoutReachingEnd = new RegExp( str );
	// console.log(changePosInMiddleWithoutReachingEnd)
	
	
	// // TODO
	// // 'play-like' first does [0, 0, 0] and then moves on
	// // CODE BUG? Why does the same not happen for `once([0,0,-2])`?

	// str = 'doubles: (?:play|toggle|restart|fast|next';
	// str += ''; // Something with jump turned into regex
	// // continue that till all the jump things are in here
	// // str += ')(?:.*\\(.*\\)) \\+ (?:play|fast|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|fast|next|prev|once';
	// // str += ')(?:.*\\(.*\\)) \\+ (?:play|restart|fast|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|prev|once';
	// str += ')(?:.*\\(.*\\)) \\+ (?:play|restart|fast|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|prev|once';
	// str += ''; // Something with jump turned into regex
	// // continue that till all the jump things are in here
	// str += ')(?:.*\\(.*\\)) \\+ (?:new|progress)';
	// // #E2
	// var changePosInMiddleWithoutReachingEnd = new RegExp( str );
	// console.log(changePosInMiddleWithoutReachingEnd)


	// But play or toggle on stop|done `restart()`s, so it gets the same new|progress values as before
	// so don't include them here
	str = 'doubles: (?:play|toggle|restart|fast|next';
	str += ''; // Something with jump turned into regex
	// continue that till all the jump things are in here
	str += ')(?:.*\\(.*\\)) \\+ (?:stop|done)(?:.* > )(?:fast|next|prev|once|current';
	str += ''; // Something with jump turned into regex
	// continue that till all the jump things are in here
	str += ')(?:.*\\(.*\\)) \\+ (?:new|progress)';
	// Maybe separate ones for jumps
	// #E1 (why does this come first?)
	var noRestartersChangePosInMiddle = new RegExp( str );
	// console.log(noRestartersChangePosInMiddle)
	// doubles: (?:play|toggle|restart|fast|next)(?:.*\(.*\)) \+ (?:play|loopBegin|loopEnd|new|progress)(?:.* > )(?:play|toggle|fast|next|prev)(?:.*\(.*\)) \+ (?:new|progress)


	// Things like next and prev use `once()` and the stuff that comes with it,
	// so the change in position is going to show during those events
	str = 'doubles: (?:fast|next|current';  // not sure about `current()`
	str += ''; // Something with jump turned into regex
	// continue that till all the jump things are in here
	// str += ')(?:.*\\(.*\\)) \\+ (?:once|revert)(?:.* > )(?:play|toggle|next|prev';  // once doesn't revert anymore
	str += ')(?:.*\\(.*\\)) \\+ (?:once)(?:.* > )(?:play|toggle|next|prev';
	str += ''; // Something with jump turned into regex
	// continue that till all the jump things are in here
	str += ')(?:.*\\(.*\\)) \\+ (?:new|progress)';
	// #E3
	var diffPosOnOnceAsFirst = new RegExp( str );

	// // /Positive/ /ARRAY/ incrementors with `once()` change position as well and
	// // position change = change of output for `once()` as well
	// str = 'doubles: (?:once'
	// str += ')(?:.*\\(\\[[^)-]+\\]\\)) \\+ (?:once|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|fast|next|prev|once';
	// str += ')(?:.*\\(.*\\)) \\+ (?:new|progress)';
	// var onceArrayChangesPosition = new RegExp( str );
	// console.log(onceArrayChangesPosition)

	// /Positive/ /ARRAY/ incrementors with `once()` change position as well and
	// position change = change of output for `once()` as well
	// This only works for one specific input unfortunately. Not flexible at all, but
	// I guess that's what you get
	str = 'doubles: (?:once'
	str += ')(?:.*\\(\\[0,0,2\\]\\)) \\+ (?:once|loopBegin|loopFinish|new|progress)(?:.* > )(?:play|toggle|fast|next|prev|once|current';
	str += ')(?:.*\\(.*\\)) \\+ (?:new|progress)';
	// #E4
	var onceArrayChangesPosition = new RegExp( str );
	// console.log(onceArrayChangesPosition)

	// #E6-sh (doesn't run expectFailure, but does sort of mean it)
	// I think this only works because it comes after everything else
	var doneAtEnd = /> jump(?:.*\([^)-]*\)) \+ (?:done|stop)/;



	// TODO:
	var jumpAndDoneThenLoopShouldRestart = '?';
	// TODO: Just add list of combos that would hit done/stop (at start or end)




	// jumpTo( -1 ) + play|toggle = restart?
	// jumpTo( 11 ) + play|toggle = restart?
	// jumpTo( 100 ) + play|toggle = restart?
	// jumpW( 11 ) + play|toggle = restart?
	// jumpW( 100 ) + play|toggle = restart?
	// jumpS( 100 ) + play|toggle = restart?





	// // ??: This one too?
	// // Things like next and prev use `once()` and the stuff that comes with it,
	// // so the change in position is going to show during those events
	// // Does this include when play and such start?
	// str = 'doubles: (?:fast|next';
	// str += ''; // Something with jump turned into regex
	// // continue that till all the jump things are in here
	// str += ')(?:.*\\(.*\\)) \\+ (?:once|revert)(?:.* > )(?:play|toggle|next|prev';
	// str += ''; // Something with jump turned into regex
	// // continue that till all the jump things are in here
	// str += ')(?:.*\\(.*\\)) \\+ (?:new|progress)';
	// var diffPosOnOnceAsSecond = new RegExp( str );


	// ==========================================
	// SAME FUNCTION, REPEATED
	// ==========================================
	// TODO: Test removing |close from stuff (now that we have a onlyClose test)

	// // These don't ever trigger events after `play(null)`
	// str = regEscape('play(null) + ');  // Initial function
	// str += '(?:reset|pause|close|once|revert|loopSkip)';  // Events
	// var playNot = new RegExp( str );
	// // // Only if there's no play afterwards!
	// // str = regEscape('doubles: play(null) + restart');
	// // var playNotRestart = new RegExp( str );

	// // These don't ever trigger events after `reset(null)`
	// str = regEscape('reset(null) + ');  // Initial function
	// str += '(?:play|restart|pause|stop|close|loopSkip|done)';  // Events
	// var resetNot = new RegExp( str );

	// // These don't ever trigger events after `restart(null)`
	// str = regEscape('restart(null) + ');  // Initial function
	// str += '(?:play|reset|pause|close|once|revert|loopSkip)';  // Events
	// var restartNot = new RegExp( str );


	// // These don't ever trigger events after `pause(null)`, `stop(null)`, or `close(null)`
	// var regNoLoop = /\b(?:pause|stop|close)(?:\(.*\)) \+ (?:play|reset|restart|once|revert|rewind|fastForward|loop|newWordFragment|progress|done)/;
	// // These don't ever trigger events after `pause(null)`
	// str = regEscape('pause(null) + ');  // Initial function
	// str += '(?:close|stop)';  // Events
	// var pauseNot = new RegExp( str );
	// // These don't ever trigger events after `pause(null)`
	// str = regEscape('stop(null) + ');  // Initial function
	// str += '(?:pause|close)';  // Events
	// var stopNot = new RegExp( str );
	// // These don't ever trigger events after `pause(null)`
	// str = regEscape('close(null) + ');  // Initial function
	// str += '(?:pause|stop)';  // Events
	// var closeNot = new RegExp( str );


	// // These don't ever trigger events after `togglePlayPause(null)`
	// str = regEscape('togglePlayPause(null) + ');  // Initial function
	// str += '(?:reset|close|once|revert|loopSkip)';  // Events
	// var toggleNot = new RegExp( str );

	// // These don't ever trigger events after `rewind(null)` anytime
	// str = regEscape('rewind(null) + ');  // Initial function
	// str += '(?:play|reset|pause|close|once|loopSkip)';  // Events
	// var rewindNot = new RegExp( str );
	// ------------ not sure of this one. something special?
	// // These don't ever trigger events after `rewind(null)` (from paused at start)
	// str = regEscape('doubles: rewind(null) + ');  // Initial function
	// str += '(?:restart)';  // Events
	// var rewindStarts = new RegExp( str );
	// // Does 'revert' when gets to beginning, etc.
	// // will do 'restartFinish' with other stuff
	// // TODO: Check if can add 'restartBegin' to 'rewindNot', 'fastForwardNot', etc.

	// // These don't ever trigger events after `fastForward(null)` anytime
	// str = regEscape('fastForward(null) + ');  // Initial function
	// str += '(?:play|reset|pause|close|once|revert|loopSkip)';  // Events
	// var fastForwardNot = new RegExp( str );
	// // These don't ever trigger events after `fastForward(null)` (from paused at start)
	// str = regEscape('doubles: fastForward(null) + ');  // Initial function
	// str += '(?:restart)';  // Events
	// var fastForwardStarts = new RegExp( str );

	// var loopSkip = /loopSkip/;




	// ==========================================
	// TWO DIFFERENT OR SAME FUNCTIONS
	// ==========================================
	// Like 'doubles: stop(null) + stopBegin > close(null) + stopFinish'
	// Basically 'doubles: word1(null) + word1Begin > word2(null) + word1Finish'
	// Once everything that shouldn't have been triggered wasn't triggered... that may not work
	// Maybe change 1st one calls own events, second one calls own events
	var selfComplete = /doubles: (?:.*)(?:\(.*\)) \+ (?: > )(.*)(?:\(.*\)) \+ \1Finish/;
	// Probably will need or stuff like 'newWordFragment' too

	// // // Only `reset()` things should fire after 'resetBegin' since it destroys the queue
	// // str = regEscape('doubles: reset(null) + resetBegin >') + '.*new';  // Events
	// // var resetBeginFrag = new RegExp( str );
	// // str = regEscape('doubles: reset(null) + resetBegin >') + '.*progress';  // Events
	// // var resetBeginProg = new RegExp( str );
	// // str = regEscape('doubles: reset(null) + resetBegin > ') + '.*?' + regEscape(' + ') + '(?!new|progress|once|loop|revert)';
	// // var resetBeginOther = new RegExp( str );

	// // Queue gets destroyed in reset, so anythind added before that should not be called
	// str = regEscape('doubles: reset(null) + resetBegin >');
	// var resetBeginNot = new RegExp( str );

	// // TODO: Wish I could do: When playing and finish then toggle, run restart assertions

	// // When set to playing then toggled, only pause should be triggered
	// var doneThenToggle = /doubles: (?:play|restart|toggle).*\(.*\) \+ (?:stop|done).* > toggle.*\(.*\) \+ (?:new|restart|loopBegin|loopFinish|progress|stop|done).*/;
	// var playThenToggle = /doubles: (?:play|restart|toggle).*\(.*\) \+ .* > toggle.*\(.*\) \+ (?!pause).*/;
	// var playTogglePause = /doubles: ((?:play|restart|toggle)).*\(.*\) \+ (?:new|progress|\1)(?:.*) > toggle.*\(.*\) \+ pause.*/;

	// // toggle never restarts if it is the first function
	// var toggleStartsThenNot = /doubles: (?:toggle).*\(.*\) \+ .*(?:restart|pause).* >/i

	// ////////////////////// Not sure this will work
	// // These events don't trigger after `rewind(null)` (from `pause(null)` same as if started paused)
	// // ??: Why would rewind ever trigger 'restart'? I guess it'd be triggered at stopBegin or something
	// str = 'doubles: pause.*';  // Functions
	// str += regEscape('rewind(null) + ');  // Events
	// str += '(?:restart)';  // Events
	// var rewindFromPause = new RegExp( str );

	// // Does it have a non-`close(null)` function followed by 'close' event?
	// // If so, not triggered
	// var onlyClose = /\b(?!close)\w+(?:\(.*\)) \+ (?:close)/;

	// // Does it have a non-`rewind(null)`/`fastForward(null)` function followed by 'rewind'/'fastForward' event?
	// // If so, not triggered
	// var onlyRewind = /\b(?!rewind)\w+(?:\(.*\)) \+ (?:rewind)/;
	// var onlyFfwd = /\b(?!fastForward)\w+(?:\(.*\)) \+ (?:fastForward)/;
	// // same for 'close'? Already taken care of before?

	// // If it comes second, it could hear the remnants of a different function being triggered
	// var jumpNot = /doubles: jump(?:.*\(.*\)) \+ (?:play|reset|restart|pause|close)/;

	// // nextWord (as the first function) also never triggers play, reset, restart, pause, stop, close, done
	// str = regEscape( 'doubles: nextWord(null) + ' ) + '(?:play|reset|restart|pause|stop|close|done)';
	// var nextWordNot = new RegExp( str );

	// // nextSentence (as the first function) also never triggers play, reset, restart, pause, stop, close, done
	// str = regEscape( 'doubles: nextSentence(null) + ' ) + '(?:play|reset|restart|pause|stop|close|done)';
	// var nextSentenceNot = new RegExp( str );

	// // prevWord (as the first function) also never triggers play, reset, restart, pause, close (stop/done when hits beginning)
	// str = regEscape( 'doubles: prevWord(null) + ' ) + '(?:play|reset|restart|pause|close)';
	// var prevWordNot = new RegExp( str );

	// // nextSentence (as the first function) also never triggers play, reset, restart, pause, stop, close, done
	// str = regEscape( 'doubles: prevSentence(null) + ' ) + '(?:play|reset|restart|pause|close)';
	// var prevSentenceNot = new RegExp( str );


	var onesRun = [];
	asts.getWhichOnesWereRun = function () {
		return onesRun;
	}

	asts.assert = function ( label, originalAssertion, result, debug ) {
	// By this point, the first test/assertion was passed and gotten some
	// result, so nothing should be interfereing with the possibility of further results

		// Try to keep these tests as searchable as possible without having a million
		// page doc of each individual label

		if ( debug ) { console.log( label ); }

		var assert = originalAssertion.assertion;

		// If the asser
		if ( result.arg2s.length <= 0 && originalAssertion.type === 'not' ) {
			if ( debug ) { console.log( 'Combos result is not?', defaultAsserts.not( result, label ) ); }
			// return defaultAsserts.not( result, label, evnt2 );
			return defaultAsserts.not( result, label );
		}

		var testNum = '';
		// TODO: Expect opposite?
		expectFailure = function ( result, testID, evnt ) {
			var result = assert(  result, testID, evnt  )

			var msg, passed = !result.passed;
			// If failed, that was the expected result
			if ( passed ) {
				msg = 'Combos-' + testID +': Expected a failure and recieved a failure at combo test.';
			} else {
				msg = 'Combos-' + testID +': Expected test to fail, but it ' + colors.red + 'DIDN\'T FAIL' + colors.none + '.';
			}

			msg += '\n--- Unexpected success: ' + colors.red + result.message + colors.none;

			return { passed: passed, message: msg }
		};


		// ==========================================
		// TWO DIFFERENT FUNCTIONS
		// ==========================================

		// new
		// if ( debug ) { console.log( 'Basics' ); }
		var pre = 'Basics ';

		// Must come before pause(null), stop(null), and close(null) are kept
		// from interacting
		testNum = 'B1'; 
		if ( debug && selfComplete.test(label) ) { onsole.log( testNum ); }
		if ( selfComplete.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.triggered( result, testNum ); }

		// testNum = 'B2'; 
		// if ( debug && playAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( playAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B3'; 
		// if ( debug && toggleAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( toggleAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B4'; 
		// if ( debug && restartAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( restartAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B5'; 
		// if ( debug && resetAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( resetAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B6'; 
		// if ( debug && pauseAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( pauseAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B7'; 
		// if ( debug && stopAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( stopAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B8'; 
		// if ( debug && closeAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( closeAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B9'; 
		// if ( debug && revertAlwaysNot.test(label) ) { onsole.log( testNum ); }
		// if ( revertAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B10';
		// if ( debug && rewindAlwaysNot.test(label) ) { console.log( testNum ); }
		// if ( rewindAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B11';
		// if ( debug && fastForwardAlwaysNot.test(label) ) { console.log( testNum ); }
		// if ( fastForwardAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B11';
		// if ( debug && onceAlwaysNot.test(label) ) { console.log( testNum5' ); }
		// if ( onceAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B11';
		// if ( debug && oncePositiveAlwaysNot.test(label) ) { console.log( testNum55' ); }
		// if ( oncePositiveAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B12';
		// if ( debug && nextAlwaysNot.test(label) ) { console.log( testNum ); }
		// if ( nextAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B13';
		// if ( debug && prevAlwaysNot.test(label) ) { console.log( testNum ); }
		// if ( prevAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B14';
		// if ( debug && jumpAlwaysNot.test(label) ) { console.log( testNum ); }
		// if ( jumpAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		testNum = 'B2-last';
		if ( debug && jumpPastEndAlwaysNot.test(label) ) { console.log( testNum ); }
		if ( jumpPastEndAlwaysNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B16';
		// if ( debug && playAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( playAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B17';
		// if ( debug && toggleAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( toggleAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B18';
		// if ( debug && rewindAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( rewindAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B19';
		// if ( debug && nextAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( nextAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B20';
		// if ( debug && prevAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( prevAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B21';
		// if ( debug && jumpAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( jumpAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B22';
		// if ( debug && jumpToAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( jumpToAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B23';
		// if ( debug && jumpWordsAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( jumpWordsAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// testNum = 'B24';
		// if ( debug && jumpSentencesAtStartNot.test(label) ) { console.log( testNum ); }
		// if ( jumpSentencesAtStartNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }



		// ==========================================
		// COMPLEX COMBOS
		// ==========================================
		// if ( debug ) { console.log( '24', playNotAfterRestart.test(label) ); }
		// if ( playNotAfterRestart.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, label ); }
		// if ( debug ) { console.log( 'Complex Combos' ); }
		pre = 'Complex Combos ';

		testNum = 'CC1';
		if ( debug && doneThenPlayThenPlayNot.test(label) ) { console.log( testNum ); }
		if ( doneThenPlayThenPlayNot.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		testNum = 'CC2';
		if ( debug && doneThenPlayThenRestartYes.test(label) ) { console.log( testNum ); }
		if ( doneThenPlayThenRestartYes.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.triggered( result, testNum ); }

		testNum = 'CC3';
		if ( debug && playToggleNotPauseNo.test(label) ) { console.log( testNum ); }
		if ( playToggleNotPauseNo.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		testNum = 'CC4';
		if ( debug && playTogglePauseYes.test(label) ) { console.log( testNum ); }
		if ( playTogglePauseYes.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.triggered( result, testNum ); }

		testNum = 'CC5';
		if ( debug && resetKillsQueue.test(label) ) { console.log( testNum ); }
		if ( resetKillsQueue.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		testNum = 'CC6';
		if ( debug && revertsToPlayTriggersPlay.test(label) ) { console.log( testNum ); }
		if ( revertsToPlayTriggersPlay.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.triggered( result, testNum ); }

		testNum = 'CC7';
		if ( debug && revertsToPlayNoTriggersPause.test(label) ) { console.log( testNum ); }
		if ( revertsToPlayNoTriggersPause.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }

		// If it could have changed position at the start function and the end function can
		// trigger loops
		var couldMessUpValues = changesPositionAtStart.test( label ) && getsValuesAtEnd.test( label );

		if ( couldMessUpValues ) {
			testNum = 'CC8';
			if ( debug ) { console.log( testNum ); }
			// Then we'll assume that's what messed up values if those values were messed up
			// so we'll just test for triggering (since ones that were supposed to not trigger
			// were weeded out earlier)
			if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); }
		 	return defaultAsserts.triggered( result, testNum );
		}

		testNum = 'CC9';
		if ( debug && doneAtEndThenForwardDoneYes.test(label) ) { console.log( testNum ); }
		if ( doneAtEndThenForwardDoneYes.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.triggered( result, testNum ); }

		testNum = 'CC10-last';
		if ( debug && doneAtEndThenBackDoneNo.test(label) ) { console.log( testNum ); }
		if ( doneAtEndThenBackDoneNo.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return defaultAsserts.not( result, testNum ); }




		// After everything that can't be triggered has been filtered out,
		// some triggered stuff will get different output than with a single
		// function call
		// ==========================================
		// EXPECT FAILURE
		// ==========================================
		// if ( debug ) { console.log( 'Expect Failure' ); }
		pre = 'Expect Failure ';

		testNum = 'E1';
		if ( debug && noRestartersChangePosInMiddle.test(label) ) { console.log( testNum ); }
		if ( noRestartersChangePosInMiddle.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return expectFailure( result, testNum ); }

		testNum = 'E2';
		if ( debug && changePosInMiddleWithoutReachingEnd.test(label) ) { console.log( testNum ); }
		if ( changePosInMiddleWithoutReachingEnd.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return expectFailure( result, testNum ); }

		testNum = 'E3';
		if ( debug && diffPosOnOnceAsFirst.test(label) ) { console.log( testNum ); }
		if ( diffPosOnOnceAsFirst.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return expectFailure( result, testNum ); }

		testNum = 'E4';
		if ( debug && onceArrayChangesPosition.test(label) ) { console.log( testNum ); }
		if ( onceArrayChangesPosition.test(label) ) { if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); } return expectFailure( result, testNum ); }



		// Are we checking for done at end after jump (TODO: Maybe add once with positives)
		if ( doneAtEnd.test( label ) ) {
			testNum = 'E5-last';
			if ( debug ) { console.log( testNum ); }
			// If the numbers add up to past the end, we should trigger done and stop
			// TODO: Change this into plain old list of regex later
			var matches = /doubles: (?:(.*)\((.*)\) \+ )(?:.* > )(?:(.*)\((.*)\) \+ )/.exec( label );

			var func1 	= matches[1],
				arg1 	= JSON.parse(matches[2]),
				func2 	= matches[3],
				arg2 	= JSON.parse(matches[4]);

			if ( /prev/.test( func2 ) ) { arg2 = -1; }
			if ( /next/.test( func2 ) ) { arg2 = 1; }

			var wordPos = 0;
			var sentencePos = 0;

			// Doesn't matter if the first one goes backwards or not
			if ( /(?:play|restart|toggle)/.test( func1 ) ) {
				wordPos = 11;
			} else if ( /(?:nextWord)/.test( func1 ) ) {
				wordPos += 1;
			} else if ( /(?:nextSentence)/.test( func1 ) ) {
				sentencePos += 1;
				wordPos = wordIndicies[ sentencePos ];
			} else if ( /jumpTo/.test( func1 ) ) {

				if ( arg1 < 0 ) { wordPos = 12 + arg1 }
				else { wordPos += Math.min( 12, arg1 ) }
			
			} else if ( /jumpWord/.test( func1 ) ) {
			
				if ( arg1 > 0 )	{ wordPos += Math.min( 12, arg1 ) }
			
			} else if ( /jumpSentence/.test( func1 ) ) {
			
				if ( arg1 > 0 ) {
					var num = Math.min( 4, arg1 );
					sentencePos = num;
					// If it was 4, it got to the last word
					wordPos = wordIndicies[ num ];
				}
			
			}  // ??: If `once()`?

			// console.log( 'at end of 1st:', wordPos, sentencePos );

			// if ( /(?:play|restart|toggle)/.test( func2 ) ) {
			// 	wordPos = 12;
			// } else

			// Add up to find out finishing position
			if ( /jumpTo/.test( func2 ) ) {

				wordPos += arg2
				// jump(-1) from 0 will mean going to the end, but not stopping
				if ( wordPos < 0 ) { wordPos = 12 + wordPos; }
			
			} else if ( /jumpWord/.test( func2 ) ) {
				
				wordPos += arg2;
				// // Got to the start by travenling backwards, triggereing an end
				// if ( arg2 < 0 && wordPos <= 0 ) {
				// 	wordPos = -1;
				// } else if 

				// if ( wordPos > 2) {
					
				// 	if ( arg2 < 0 ) { wordPos += arg2 }


				// } else if ( ) {

				// }

			} else if ( /jumpSentence/.test( func2 ) ) {

				// console.log( 'jumping sentence' );
				sentencePos += arg2;
				// console.log( 'new sPos', sentencePos );
				var sentencePos = Math.min( 4, sentencePos );
				sentencePos = Math.max( 0, sentencePos );
				// console.log( 'new sPos', sentencePos );

				wordPos = wordIndicies[ sentencePos ];

				// // If it's 0 now, we have to figure out if
				// // we were moving backwards or forwards
				// if ( sentencePos === 0 ) {
				// 	if ( arg2 < 0 ) {
				// 		wordPos = -1;
				// 	} else {
				// 		wordPos = 0;
				// 	}
				// // Otherwise it was moving forwards
				// } else if ( sentencePos > 0 ) {
				// 	wordPos = wordIndicies[ sentencePos ];
				// }

				// if ( sentencePos > wordIndicies.length ){
				// 	wordPos = 11;
				// // If near the end and pushed over the edge (0 counts as forward)
				// } else if ( wordPos >= wordIndicies[3] && arg2 >= 0 ) {
				// 	wordPos = 11;
				// // if at the start and go backward
				// } else if ( wordPos <= 0 && arg2 < 0 ) {
				// 	wordPos = -1;
				// }

			// Is this needed or is it taken care of elsewhere?
			}  else if ( /(?:prevWord|nextWord)/.test( func2 ) ) {

				// arg2 was assigned appropriate values if this was the case
				wordPos += arg2;
				// // If was traveling backward and hit start,
				// // that will trigger stop and done
				// if ( wordPos === 0 ) { wordPos = -1 }

			} else if ( /(?:prevSentence|nextSentence)/.test( func2 ) ) {

				sentencePos += arg2;
				num = Math.max( 0, num );
				wordPos = wordIndicies[ sentencePos ]
				// // If was traveling backward and hit start,
				// // that will trigger stop and done
				// if ( wordPos === 0 ) { wordPos = -1 }

			} // ??: If `once()`?

			console.log( 'at end of 2nd:', wordPos, sentencePos );

			var assertName = 'not';

			// If final word position would be before the start or after the end
			if ( wordPos > 11 || wordPos < 0 ) {
				assertName = 'triggered';
			// If final word was at end, but got there while moving forward
			} else if ( wordPos === 11 && typeof arg2 === 'number' && arg2 >= 0 ) {
				assertName = 'triggered';
			// If final word was at start, but got there while moving backwards
			} else if ( wordPos === 0 && typeof arg2 === 'number' && arg2 < 0 ) {
				assertName = 'triggered';
			}

			if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); }
			return defaultAsserts[ assertName ]( result, testNum );


			// if ( wordPos >= 11 || wordPos < 0 ) {
			// 	 if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); }
			// 	return defaultAsserts.triggered( result, testNum );
			// } else {
			// 	 if ( !onesRun.includes(testNum) ) { onesRun.push( testNum ); }
			// 	return defaultAsserts.not( result, testNum );	
			// }
		}  // End if 'done' or 'stop' event


		// old

		// // ==========================================
		// // TWO DIFFERENT FUNCTIONS
		// // ==========================================

		// // Nothing except `close(null)` should trigger close events
		// if ( debug ) { console.log( '2', onlyClose.test(label) ); }
		// if ( onlyClose.test(label) ) { return defaultAsserts.not( result, label ); }

		// // // Only first-function 'reset' stuff (`._once()`) triggers after 'resetBegin' because the queue is killed
		// // if ( debug ) { console.log( '3', resetBeginFrag.test(label) ); }
		// // if ( resetBeginFrag.test(label) ) { return getAssertFragsFirst( plyb ); }
		// // if ( debug ) { console.log( '4', resetBeginProg.test(label) ); }
		// // if ( resetBeginProg.test(label) ) { return getAssertProgFirst( plyb ); }
		// // // Other stuff (other than 'once', 'loop', and 'revert') doesn't trigger
		// // if ( debug ) { console.log( '5', resetBeginOther.test(label) ); }
		// // if ( resetBeginOther.test(label) ) { return defaultAsserts.not( result, label ); }

		// // Queue gets destroyed in reset, so anything added before that destruction should not be called
		// if ( debug ) { console.log( '3', resetBeginNot.test(label) ); }
		// if ( resetBeginNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // toggle has a bunch of weird behavior
		// // At end, restarts
		// if ( debug ) { console.log( '4', doneThenToggle.test(label) ); }
		// if ( doneThenToggle.test(label) ) { return defaultAsserts.triggered( result, label ); }
		// // From play it pauses, so no playing stuff
		// if ( debug ) { console.log( '5', playThenToggle.test(label) ); }
		// if ( playThenToggle.test(label) ) { return defaultAsserts.not( result, label ); }
		// // From play it pauses, so yes pausing stuff
		// if ( debug ) { console.log( '5.5', playTogglePause.test(label) ); }
		// if ( playTogglePause.test(label) ) { return defaultAsserts.triggered( result, label ); }
		// // Toggle as the first thing never triggers 'restart' for itself
		// if ( debug ) { console.log( '5.55', toggleStartsThenNot.test(label) ); }
		// if ( toggleStartsThenNot.test(label) ) { return defaultAsserts.not( result, label ); }

		

		// // onlyRewind and onlyFfwd should be here too, but I'd have to re-number everything
		
		// // 'loopSkip' doesn't come into it at all till we start playing with state
		// if ( debug ) { console.log( '6', /loopSkip/.test(label) ); }
		// if ( /loopSkip/.test(label) ) { return defaultAsserts.not( result, label ); }

		// // jumpWords, jumpSentences, jumpTo, when the first function, should not ever trigger stuff listed above
		// if ( debug ) { console.log( '7', jumpNot.test(label) ); }
		// if ( jumpNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // nextWord, when the first function, should not ever trigger stuff listed above
		// if ( debug ) { console.log( '8', nextWordNot.test(label) ); }
		// if ( nextWordNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // nextSentence, when the first function, should not ever trigger stuff listed above
		// if ( debug ) { console.log( '9', nextSentenceNot.test(label) ); }
		// if ( nextSentenceNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // prevWord, when the first function, should not ever trigger stuff listed above
		// if ( debug ) { console.log( '10', prevWordNot.test(label) ); }
		// if ( prevWordNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // prevSentence, when the first function, should not ever trigger stuff listed above
		// if ( debug ) { console.log( '11', prevSentenceNot.test(label) ); }
		// if ( prevSentenceNot.test(label) ) { return defaultAsserts.not( result, label ); }



		// if ( debug ) { console.log( 'x', rewindFromPause.test(label) ); }
		// if ( rewindFromPause.test(label) ) { return defaultAsserts.not( result, label ); }




		// // ==========================================
		// // SAME FUNCTION, REPEATED
		// // ==========================================
		// if ( debug ) { console.log( 'repeated functions' ); }

		// // Nothing except `rewind(null)` and `fastForward(null)` should trigger their own events
		// if ( debug ) { console.log( '1', onlyRewind.test(label), onlyFfwd.test(label) ); }
		// if ( onlyRewind.test(label) || onlyFfwd.test(label) ) { return defaultAsserts.not( result, label ); }

		// // --- play(null) ---
		// if ( debug ) { console.log( '2', playNot.test(label) ); }
		// if ( playNot.test(label) ) { return defaultAsserts.not( result, label ); }
		// if ( debug ) { console.log( '2.5', playNotRestart.test(label) ); }
		// if ( playNotRestart.test(label) ) { return defaultAsserts.not( result, label ); }
		// // no alternate:
		// // ( if second `play` at loop begin, new fragment not collected yet, so regular output )
		// // play(null) + loopBegin > play(null) + all

		// // --- reset(null) ---
		// if ( debug ) { console.log( '3', resetNot.test(label) ); }
		// if ( resetNot.test(label) ) { return defaultAsserts.not( result, label ); }
		// // no alternate:
		// // ( happen after newFragment loop is completed, so regular output )
		// // reset(null) + resetFinish > reset(null) + all
		// // reset(null) + onceFinish > reset(null) + all
		// // reset(null) + revertBegin > reset(null) + all
		// // reset(null) + revertFinish > reset(null) + all
		// // reset(null) + loopFinish > reset(null) + all

		// // --- restart(null) ---
		// if ( debug ) { console.log( '4', restartNot.test(label) ); }
		// if ( restartNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // --- pause(null), stop(null), close(null) ---
		// // no loop events
		// if ( debug ) { console.log( '5', regNoLoop.test(label) ); }
		// if ( regNoLoop.test(label) ) { return defaultAsserts.not( result, label ); }
		// // No other variants
		// if ( debug ) { console.log( '6', pauseNot.test(label) || stopNot.test(label) || closeNot.test(label) ); }
		// if ( pauseNot.test(label) || stopNot.test(label) || closeNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // --- togglePlayPause(null) ---
		// if ( debug ) { console.log( '7', toggleNot.test(label) ); }
		// if ( toggleNot.test(label) ) { return defaultAsserts.not( result, label ); }

		// // --- rewind(null) ---
		// if ( debug ) { console.log( '8', rewindNot.test(label) ); }
		// if ( rewindNot.test(label) ) { return defaultAsserts.not( result, label ); }
		// if ( debug ) { console.log( '8.5', rewindStarts.test(label) ); }
		// if ( rewindStarts.test(label) ) { return defaultAsserts.not( result, label ); }

		// // --- fastForward(null) ---
		// if ( debug ) { console.log( '9', fastForwardNot.test(label) ); }
		// if ( fastForwardNot.test(label) ) { return defaultAsserts.not( result, label ); }
		// if ( debug ) { console.log( '9.5', fastForwardStarts.test(label) ); }
		// if ( fastForwardStarts.test(label) ) { return defaultAsserts.not( result, label ); }







		// // More unique cases below
		// if ( debug ) { console.log( 'unimported' ); }
		// if ( asts[label] ) {
		// 	return asts[label]( {} );
		// }

		// if ( debug ) { console.log( 'imported' ); }
		// if ( allExpectedFailures[label] !== undefined ) {
		// 	return expectFailure;
		// }

		if ( debug ) { console.log( 'end' ); }

		// If none of these match, return the original assertion
		return assert( result, label );
	};  // End getAssertion() ( func from label)



	// =============================================================================
	// =============================================================================
	// ======= play() + n > play() + all =======
	// =============================================================================
	// =============================================================================

	// // ------------ play() + playBegin ------------
	// // Second play is after first loop
	// asts[ 'doubles: play(null) + playBegin > play(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsNoFirst( plyb );
	// };
	// asts[ 'doubles: play(null) + playBegin > play(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgNoFirst( plyb );
	// };
	// // ------------ play() + playFinish ------------
	// // Triggers after loop has run, so missing the first word
	// asts[ 'doubles: play(null) + playFinish > play(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsNoFirst( plyb );
	// };
	// asts[ 'doubles: play(null) + playFinish > play(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgNoFirst( plyb );
	// };
	// // ------------ play() + stopBegin ------------
	// // After done, restart instead
	// asts[ 'doubles: play(null) + stopBegin > play(null) + playBegin' ] =
	// asts[ 'doubles: play(null) + stopBegin > play(null) + playFinish' ] = not;
	// asts[ 'doubles: play(null) + stopBegin > play(null) + restartBegin' ] =
	// asts[ 'doubles: play(null) + stopBegin > play(null) + restartFinish' ] = triggered;
	// // ------------ play() + stopFinish ------------
	// // After done, restart instead
	// asts[ 'doubles: play(null) + stopFinish > play(null) + playBegin' ] =
	// asts[ 'doubles: play(null) + stopFinish > play(null) + playFinish' ] = not;
	// asts[ 'doubles: play(null) + stopFinish > play(null) + restartBegin' ] =
	// asts[ 'doubles: play(null) + stopFinish > play(null) + restartFinish' ] = triggered;
	// // ------------ play() + loopBegin ------------
	// // ------------ play() + loopFinish ------------
	// asts[ 'doubles: play(null) + loopBegin > play(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsNoFirst( plyb );
	// };
	// asts[ 'doubles: play(null) + loopBegin > play(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgNoFirst( plyb );
	// };
	// asts[ 'doubles: play(null) + loopFinish > play(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsNoFirst( plyb );
	// };
	// asts[ 'doubles: play(null) + loopFinish > play(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgNoFirst( plyb );
	// };
	// // ------------ play() + newWordFragment ------------
	// asts[ 'doubles: play(null) + newWordFragment > play(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsNoFirst( plyb );
	// };
	// // ------------ play() + progress ------------
	// asts[ 'doubles: play(null) + progress > play(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsNoFirst( plyb );
	// };
	// asts[ 'doubles: play(null) + progress > play(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgNoFirst( plyb );
	// };
	// // ------------ play() + newWordFragment ------------
	// asts[ 'doubles: play(null) + newWordFragment > play(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgNoFirst( plyb );
	// };
	// // ------------ play() + done ------------
	// // After done, restart instead
	// asts[ 'doubles: play(null) + done > play(null) + playBegin' ] =
	// asts[ 'doubles: play(null) + done > play(null) + playFinish' ] = not;
	// asts[ 'doubles: play(null) + done > play(null) + restartBegin' ] =
	// asts[ 'doubles: play(null) + done > play(null) + restartFinish' ] = triggered;



	// // =============================================================================
	// // =============================================================================
	// // ======= reset() + n > reset() + all =======
	// // =============================================================================
	// // =============================================================================

	// // These happen after queue is cleared, so the new function gets added to the queue

	// // ------------ reset() + onceBegin ------------
	// // Listener in the middle of loop (before 'newWordFragment') will pick up double
	// asts[ 'doubles: reset(null) + onceBegin > reset(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	// console.log( '1 reset' );
	// 	return getAssertFragsDoubleFirst( plyb );
	// };
	// asts[ 'doubles: reset(null) + onceBegin > reset(null) + progress' ] = function ( assertsOverride ) {
	// 	// console.log( '2 reset' );
	// 	return getAssertProgDoubleFirst( plyb );
	// };
	// // ------------ reset() + loopeBegin ------------
	// // Listener in the middle of loop (before 'newWordFragment') will pick up double
	// asts[ 'doubles: reset(null) + loopBegin > reset(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	// console.log( '3 reset' );
	// 	return getAssertFragsDoubleFirst( plyb );
	// };
	// asts[ 'doubles: reset(null) + loopBegin > reset(null) + progress' ] = function ( assertsOverride ) {
	// 	// console.log( '4 reset' );
	// 	return getAssertProgDoubleFirst( plyb );
	// };
	// // ------------ reset() + newWordFragment ------------
	// // Listener in the middle of loop (after 'newWordFragment', but before) will pick up double
	// asts[ 'doubles: reset(null) + newWordFragment > reset(null) + progress' ] = function ( assertsOverride ) {
	// 	// console.log( '5 reset' );
	// 	return getAssertProgDoubleFirst( plyb );
	// };



	// // =============================================================================
	// // =============================================================================
	// // ======= restart() + n > restart() + all =======
	// // =============================================================================
	// // =============================================================================

	// // // ------------ restart() + restartBegin ------------
	// // // Listener in the middle of loop (before 'newWordFragment') will pick up double
	// // asts[ 'doubles: restart(null) + restartBegin > restart(null) + newWordFragment' ] = function ( assertsOverride ) {
	// // 	return getAssertFragsDoubleFirstAndOn( plyb );
	// // };
	// // asts[ 'doubles: restart(null) + restartBegin > restart(null) + progress' ] = function ( assertsOverride ) {
	// // 	return getAssertProgDoubleFirstAndOn( plyb );
	// // };
	// // // ------------ restart() + loopBegin ------------
	// // // Listener in the middle of loop (before 'newWordFragment') will pick up double
	// // asts[ 'doubles: restart(null) + loopBegin > restart(null) + newWordFragment' ] = function ( assertsOverride ) {
	// // 	return getAssertFragsDoubleFirstAndOn( plyb );
	// // };
	// // asts[ 'doubles: restart(null) + loopBegin > restart(null) + progress' ] = function ( assertsOverride ) {
	// // 	return getAssertProgDoubleFirstAndOn( plyb );
	// // };
	// // // ------------ restart() + newWordFragment ------------
	// // // Listener in the middle of loop (after 'newWordFragment', but before) will pick up double
	// // asts[ 'doubles: restart(null) + newWordFragment > restart(null) + progress' ] = function ( assertsOverride ) {
	// // 	return getAssertProgDoubleFirstAndOn( plyb );
	// // };



	// // =============================================================================
	// // =============================================================================
	// // ======= togglePlayPause() + n > togglePlayPause() + all =======
	// // ======= some play() + n > pause() + all =======
	// // =============================================================================
	// // =============================================================================

	// // ------------ togglePlayPause() + playBegin ------------
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: play(null) + playBegin > pause(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsFirst( plyb );
	// };
	// // play then pause doesn't trigger 'playBegin'
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + playBegin' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + pauseBegin' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + pauseFinish' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + done' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + playBegin > togglePlayPause(null) + progress' ] =
	// asts[ 'doubles: play(null) + playBegin > pause(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgFirst( plyb );
	// };
	// // ------------ togglePlayPause() + playFinish ------------
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + playFinish' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + pauseBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + pauseFinish' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + done' ] =
	// asts[ 'doubles: togglePlayPause(null) + playFinish > togglePlayPause(null) + progress' ] = not;
	// // ------------ togglePlayPause() + restartBegin ------------
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + playFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + done' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartBegin > togglePlayPause(null) + progress' ] =
	// // ------------ togglePlayPause() + restartFinish ------------
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + playFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + done' ] =
	// asts[ 'doubles: togglePlayPause(null) + restartFinish > togglePlayPause(null) + progress' ] = not;
	// // ------------ togglePlayPause() + pauseBegin ------------
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + playFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + done' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseBegin > togglePlayPause(null) + progress' ] =
	// // ------------ togglePlayPause() + pauseFinish ------------
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + playFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + done' ] =
	// asts[ 'doubles: togglePlayPause(null) + pauseFinish > togglePlayPause(null) + progress' ] = not;
	// // ------------ togglePlayPause() + stopBegin ------------
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsAll( plyb );
	// };  // Already happens to `pause(null)`
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + playFinish' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + restartBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + restartFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + done' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + stopBegin > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgAll( plyb );
	// };  // Already happens to `pause(null)`
	// // ------------ togglePlayPause() + stopFinish ------------
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsAll( plyb );
	// };  // Already happens to `pause(null)`
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + playFinish' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + restartBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + restartFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + done' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + stopFinish > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgAll( plyb );
	// };  // Already happens to `pause(null)`
	// // ------------ togglePlayPause() + loopBegin ------------
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsFirst( plyb );
	// };
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + playBegin' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + pauseBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + pauseFinish' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + done' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgFirst( plyb );
	// };
	// // ------------ togglePlayPause() + loopFinish ------------
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + playBegin' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + pauseBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + pauseFinish' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + loopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + done' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopFinish > togglePlayPause(null) + progress' ] = not;
	// // ------------ togglePlayPause() + newWordFragment ------------
	// // Will get progress data, but not fragment data
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + playBegin' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + pauseBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + pauseFinish' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + done' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + newWordFragment > togglePlayPause(null) + progress' ] =
	// asts[ 'doubles: togglePlayPause(null) + loopBegin > togglePlayPause(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgFirst( plyb );
	// };
	// // ------------ togglePlayPause() + progress ------------
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + newWordFragment' ] =
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + playBegin' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + pauseBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + pauseFinish' ] = triggered;
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + stopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + stopFinish' ] =
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + loopBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + done' ] =
	// asts[ 'doubles: togglePlayPause(null) + progress > togglePlayPause(null) + progress' ] = not;
	// // ------------ togglePlayPause() + done ------------
	// asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + playBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + playFinish' ] = not;
	// asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + restartBegin' ] =
	// asts[ 'doubles: togglePlayPause(null) + done > togglePlayPause(null) + restartFinish' ] = triggered;



	// // =============================================================================
	// // =============================================================================
	// // ======= rewind() + n > rewind() + all =======
	// // =============================================================================
	// // =============================================================================

	// // Why has second rewind() + rewindBegin > rewind() anything been getting triggered? There's an `if` preventing that.
	// // Ah, because it stops before the next rewind is called from the queue, so it's `currentAction` is paused

	// // // ------------ rewind() + rewindBegin ------------
	// // // rewindBegin can trigger rewindBegin again because when it rewinds at the start it also finishes
	// // // TODO: How to test rewinding twice in a row not at the start? (combos of 3 sounds crazy)
	// // asts[ 'doubles: rewind(null) + rewindBegin > rewind(null) + newWordFragment' ] = function ( assertsOverride ) {
	// // 	return getAssertFragsDoubleFirst( plyb );
	// // };
	// // asts[ 'doubles: rewind(null) + rewindBegin > rewind(null) + progress' ] = function ( assertsOverride ) {
	// // 	return getAssertProgDoubleFirst( plyb );
	// // };
	// // // ------------ rewind() + loopBegin ------------
	// // asts[ 'doubles: rewind(null) + loopBegin > rewind(null) + newWordFragment' ] = function ( assertsOverride ) {
	// // 	return getAssertFragsDoubleFirst( plyb );
	// // };
	// // asts[ 'doubles: rewind(null) + loopBegin > rewind(null) + progress' ] =
	// // // ------------ rewind() + newWordFragment ------------
	// // asts[ 'doubles: rewind(null) + newWordFragment > rewind(null) + progress' ] = function ( assertsOverride ) {
	// // 	return getAssertProgDoubleFirst( plyb );
	// // };



	// // // =============================================================================
	// // // =============================================================================
	// // // ======= fastForward() + n > fastForward() + all =======
	// // // =============================================================================
	// // // =============================================================================

	// // ffwd + ffwdBegin > ffwd + someThings are triggered because, unlike rewind, the value
	// // of `currentAction` doesn't change before the new ffwd() is called from the queue, so
	// // it can't repeat itself. This may change.

	// // ------------ fastForward() + stopBegin ------------
	// asts[ 'doubles: fastForward(null) + stopBegin > fastForward(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsLast( plyb );
	// };
	// asts[ 'doubles: fastForward(null) + stopBegin > fastForward(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgLast( plyb );
	// };
	// // ------------ fastForward() + stopFinish ------------
	// asts[ 'doubles: fastForward(null) + stopFinish > fastForward(null) + newWordFragment' ] = function ( assertsOverride ) {
	// 	return getAssertFragsLast( plyb );
	// };
	// asts[ 'doubles: fastForward(null) + stopFinish > fastForward(null) + progress' ] = function ( assertsOverride ) {
	// 	return getAssertProgLast( plyb );
	// };



	// // =============================================================================
	// // =============================================================================
	// // ======= GETTING DESPARATE NOW (there are a lot more to go) =======
	// // =============================================================================
	// // =============================================================================
	// // I checked these over and they look like they get legit output

	// // --- fastForward(null) ---
	// asts[ 'doubles: fastForward(null) + fastForwardBegin > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + fastForwardBegin > fastForward(null) + newWordFragment' ] =  // frags expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// asts[ 'doubles: fastForward(null) + fastForwardBegin > fastForward(null) + fastForwardFinish' ] =  // event should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + fastForwardBegin > fastForward(null) + progress' ] =  // 'progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + fastForwardFinish' ] = // should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + fastForwardFinish > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// asts[ 'doubles: fastForward(null) + loopBegin > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + loopBegin > fastForward(null) + newWordFragment' ] =  // frags expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// asts[ 'doubles: fastForward(null) + loopBegin > fastForward(null) + fastForwardFinish' ] =  // event should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + loopBegin > fastForward(null) + progress' ] =  // 'progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// asts[ 'doubles: fastForward(null) + loopFinish > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// asts[ 'doubles: fastForward(null) + loopFinish > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + loopFinish > fastForward(null) + fastForwardFinish' ] =  // event should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + loopFinish > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// asts[ 'doubles: fastForward(null) + newWordFragment > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// asts[ 'doubles: fastForward(null) + newWordFragment > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + newWordFragment > fastForward(null) + fastForwardFinish' ] =  // event should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + newWordFragment > fastForward(null) + progress' ] =  // 'progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// asts[ 'doubles: fastForward(null) + progress > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// asts[ 'doubles: fastForward(null) + progress > fastForward(null) + fastForwardBegin' ] = // should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + progress > fastForward(null) + fastForwardFinish' ] =  // event should have been triggerd but was NOT
	// asts[ 'doubles: fastForward(null) + progress > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// asts[ 'doubles: fastForward(null) + done > fastForward(null) + newWordFragment' ] = // expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["wattlebird?"]
	// asts[ 'doubles: fastForward(null) + done > fastForward(null) + progress' ] = // progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [1]
	// asts[ 'doubles: fastForward(null) + stopBegin > fastForward(null) + newWordFragment' ] =  // frags expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["wattlebird?"]
	// asts[ 'doubles: fastForward(null) + stopBegin > fastForward(null) + progress' ] =  // 'progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [1]
	// asts[ 'doubles: fastForward(null) + stopFinish > fastForward(null) + newWordFragment' ] =  // frags expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["wattlebird?"]
	// asts[ 'doubles: fastForward(null) + stopFinish > fastForward(null) + progress' ] =  // 'progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [1]
	// function () { return getExpectFailure() };




	return asts;

};  // End MakeAltAsserts()

