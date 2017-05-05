// alt-assertions.js

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


var makeProgressAsserter = function ( plyb, numFrags, vals ) {
/* ( Playback, int, [ floats ] ) -> func
* 
* `vals` should include all the progress vals that will come up
* 
* Basically here to abstract away the expected failures check.
* 
* Returns a progress assertion function with the given values
* which asserts that the correct progress was made at
* the 0, 2, 5, 8, and 11th triggereing of the 'progress' event.
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

				if ( !result.arg2s.length === numFrags ) {
					passes 	= false;
					msg 	= 'event was ' + colors.red + 'NOT' + colors.none + ' called the right number of times';
				} else {
					passes = arraysEqual( result.arg2s, vals );
					if ( !passes ) { msg = 'progress expected ' + JSON.stringify( frags ) + ', but got ' + colors.red + JSON.stringify( result.arg2s ) + colors.none }
				}
			}

		// }
		return { message: msg, passed: passes };
	};
};  // End makeProgressAsserter()




// ------------ common assertions ------------
// ('Delerious,' is also a popular one, but less so)

// All 12 words
var getAssertFragsAll = function ( plyb ) {
	return makeFragAsserter( plyb, forward );
};
// Progress for all of them
var getAssertProgAll = function ( plyb ) {
	return makeProgressAsserter( plyb, 12, [ 1/12, 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 1 ] );
};

// Missing first word
var getAssertFragsNoFirst = function ( plyb ) {
	var less = forward.slice(0);
	less.shift();
	return makeFragAsserter( plyb, less );
};
// Progress for all except first word
var getAssertProgNoFirst = function ( plyb ) {
	return makeProgressAsserter( plyb, 11, [ 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 1 ] );
};

// First word
var getAssertFragsFirst = function ( plyb ) {
	return makeFragAsserter( plyb, [ 'Victorious,' ] );
};
// Progress for first word
var getAssertProgFirst = function ( plyb ) {
	return makeProgressAsserter( plyb, 1, [ 1/12 ] );
};

// Last word
var getAssertFragsLast = function ( plyb ) {
	return makeFragAsserter( plyb, [ 'wattlebird?' ] );
};
// Progress for last word
var getAssertProgLast = function ( plyb ) {
	return makeProgressAsserter( plyb, 1, [ 12/12 ] );
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

	plab = plyb;

	var asts = {};


	// ======= play() + n > play() + all =======


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


	// Beginning events that don't happen at all, so should trigger nothing
	// ------------ play() + resetBegin ------------
	asts[ 'doubles: play(null) + resetBegin > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + done' ] =
	asts[ 'doubles: play(null) + resetBegin > play(null) + progress' ] =
	// ------------ play() + resetFinish ------------
	asts[ 'doubles: play(null) + resetFinish > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + done' ] =
	asts[ 'doubles: play(null) + resetFinish > play(null) + progress' ] =
	// ------------ play() + restartBegin ------------
	asts[ 'doubles: play(null) + restartBegin > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + done' ] =
	asts[ 'doubles: play(null) + restartBegin > play(null) + progress' ] =
	// ------------ play() + restartFinish ------------
	asts[ 'doubles: play(null) + restartFinish > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + done' ] =
	asts[ 'doubles: play(null) + restartFinish > play(null) + progress' ] =
	// ------------ play() + pauseBegin ------------
	asts[ 'doubles: play(null) + pauseBegin > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + done' ] =
	asts[ 'doubles: play(null) + pauseBegin > play(null) + progress' ] =
	// ------------ play() + pauseFinish ------------
	asts[ 'doubles: play(null) + pauseFinish > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + done' ] =
	asts[ 'doubles: play(null) + pauseFinish > play(null) + progress' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};


	// ------------ play() + stopBegin ------------
	asts[ 'doubles: play(null) + stopBegin > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + stopBegin > play(null) + playFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};
	asts[ 'doubles: play(null) + stopBegin > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + stopBegin > play(null) + restartFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.triggered;
	};
	// ------------ play() + stopFinish ------------
	asts[ 'doubles: play(null) + stopFinish > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + stopFinish > play(null) + playFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};
	asts[ 'doubles: play(null) + stopFinish > play(null) + restartBegin' ] =
	asts[ 'doubles: play(null) + stopFinish > play(null) + restartFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.triggered;
	};

	// // Failure on test 2:  doubles: play(null) + stopBegin > play(null) + playBegin
	// // - Error: doubles: play(null) + stopBegin > play(null) + playBegin: event should have been triggerd but was NOT

	// // Failure on test 3:  doubles: play(null) + stopBegin > play(null) + playFinish
	// // - Error: doubles: play(null) + stopBegin > play(null) + playFinish: event should have been triggerd but was NOT
	// // ..
	// Failure on test 6:  doubles: play(null) + stopBegin > play(null) + restartBegin
	// - Error: doubles: play(null) + stopBegin > play(null) + restartBegin: event should not have been triggerd but WAS

	// Failure on test 7:  doubles: play(null) + stopBegin > play(null) + restartFinish
	// - Error: doubles: play(null) + stopBegin > play(null) + restartFinish: event should not have been triggerd but WAS
	// // ....................
	// // Failure on test 28:  doubles: play(null) + stopFinish > play(null) + playBegin
	// // - Error: doubles: play(null) + stopFinish > play(null) + playBegin: event should have been triggerd but was NOT

	// // Failure on test 29:  doubles: play(null) + stopFinish > play(null) + playFinish
	// // - Error: doubles: play(null) + stopFinish > play(null) + playFinish: event should have been triggerd but was NOT
	// // ..
	// Failure on test 32:  doubles: play(null) + stopFinish > play(null) + restartBegin
	// - Error: doubles: play(null) + stopFinish > play(null) + restartBegin: event should not have been triggerd but WAS

	// Failure on test 33:  doubles: play(null) + stopFinish > play(null) + restartFinish
	// - Error: doubles: play(null) + stopFinish > play(null) + restartFinish: event should not have been triggerd but WAS


	// ------------ play() + closeBegin ------------
	asts[ 'doubles: play(null) + closeBegin > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + done' ] =
	asts[ 'doubles: play(null) + closeBegin > play(null) + progress' ] =
	// ------------ play() + closeFinish ------------
	asts[ 'doubles: play(null) + closeFinish > play(null) + newWordFragment' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + playBegin' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + playFinish' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + stopBegin' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + stopFinish' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + loopBegin' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + loopFinish' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + done' ] =
	asts[ 'doubles: play(null) + closeFinish > play(null) + progress' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};





	// When we get there

	// ------------ play() + done ------------
	asts[ 'doubles: play(null) + done > play(null) + playBegin' ] = function ( assertsOverride ) {
		// Example of other ways to do make asserts
		var asserts = cloneAsserts( defaultAsserts, assertsOverride );
		// asserts.frags 	 = getAssertFragsAll( plyb );
		// asserts.progress = getAssertProgAll( plyb );
		// asserts.frags 	 = makeFragAsserter( plyb, ['Victorious,'] );
		// asserts.progress = makeProgressAsserter( plyb, 1, [ 1/12 ] );
		return asserts.not;
	};

	asts[ 'doubles: play(null) + done > play(null) + playFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.not;
	};

	asts[ 'doubles: play(null) + done > play(null) + restartBegin' ] = function ( assertsOverride ) {
		return defaultAsserts.triggered;

	};

	asts[ 'doubles: play(null) + done > play(null) + restartFinish' ] = function ( assertsOverride ) {
		return defaultAsserts.triggered;
	};

	// ------------ reset() + done ------------


	return asts;

};  // End MakeAltAsserts()

