// single-assertions.js

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
// console.log('checked not triggered:', evnt)
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

// console.log('checked triggered', evnt)

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
// console.log('frags triggered')
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

// All 12 words
var getAssertFragsAll = function ( plyb ) {
	return makeFragAsserter( plyb, forward );
};
// Progress for all of them
var getAssertProgAll = function ( plyb ) {
	return makeProgressAsserter( plyb, 12, [ 1/12, 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 1 ] );
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




// ------------ standard assertions for functions with events ------------

module.exports = gets = function ( plyb ) {

	plab = plyb;

	var asts = {};

	// ----------- play(null) -----------
	asts.play = {};
	asts.play[ 'null' ] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsAll( plyb );
		asserts.progress = getAssertProgAll( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.triggered }, 	{ event: 'playFinish', assertion: asserts.triggered },

			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 	{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },
			{ event: 'onceBegin', assertion: asserts.not }, 		{ event: 'onceFinish', assertion: asserts.not },
			{ event: 'resumeBegin', assertion: asserts.not }, 		{ event: 'resumeFinish', assertion: asserts.not },
			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, { event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get play(null)


	// ----------- restart(null) -----------
	asts.restart = {};
	asts.restart["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsAll( plyb );
		asserts.progress = getAssertProgAll( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },

			{ event: 'restartBegin', assertion: asserts.triggered },{ event: 'restartFinish', assertion: asserts.triggered },

			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },
			{ event: 'onceBegin', assertion: asserts.not }, 		{ event: 'onceFinish', assertion: asserts.not },
			{ event: 'resumeBegin', assertion: asserts.not }, 		{ event: 'resumeFinish', assertion: asserts.not },
			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get restart(null)


	// ----------- reset(null) -----------
	asts.reset = {};
	asts.reset["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, ['Victorious,'] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 1/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },

			{ event: 'resetBegin', assertion: asserts.triggered }, 	{ event: 'resetFinish', assertion: asserts.triggered },

			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get reset(null)


	// ----------- pause(null) -----------
	asts.pause = {};
	asts.pause["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		return [
			{ event: 'newWordFragment', assertion: asserts.not },
			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },

			{ event: 'pauseBegin', assertion: asserts.triggered }, 	{ event: 'pauseFinish', assertion: asserts.triggered },

			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },
			{ event: 'onceBegin', assertion: asserts.not }, 		{ event: 'onceFinish', assertion: asserts.not },
			{ event: 'resumeBegin', assertion: asserts.not }, 		{ event: 'resumeFinish', assertion: asserts.not },
			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },
			{ event: 'loopBegin', assertion: asserts.not }, 		{ event: 'loopFinish', assertion: asserts.not },
			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.not }
		];

	};  // End get pause(null)


	// ----------- stop(null) -----------
	// Variant of `.pause()`
	asts.stop = {};
	asts.stop["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		return [
			{ event: 'newWordFragment', assertion: asserts.not },
			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },
			{ event: 'onceBegin', assertion: asserts.not }, 		{ event: 'onceFinish', assertion: asserts.not },
			{ event: 'resumeBegin', assertion: asserts.not }, 		{ event: 'resumeFinish', assertion: asserts.not },
			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },
			{ event: 'loopBegin', assertion: asserts.not }, 		{ event: 'loopFinish', assertion: asserts.not },
			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.not }
		];

	};  // End get stop(null)


	// ----------- close(null) -----------
	// Variant of `.pause()`
	asts.close = {};
	asts.close["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		return [
			{ event: 'newWordFragment', assertion: asserts.not },
			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },

			{ event: 'closeBegin', assertion: asserts.triggered }, 	{ event: 'closeFinish', assertion: asserts.triggered },

			{ event: 'onceBegin', assertion: asserts.not }, 		{ event: 'onceFinish', assertion: asserts.not },
			{ event: 'resumeBegin', assertion: asserts.not }, 		{ event: 'resumeFinish', assertion: asserts.not },
			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },
			{ event: 'loopBegin', assertion: asserts.not }, 		{ event: 'loopFinish', assertion: asserts.not },
			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.not }
		];

	};  // End get close(null)


	// ----------- togglePlayPause(null) -----------
	asts.togglePlayPause = {};
	asts.togglePlayPause["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	= getAssertFragsAll( plyb );
		asserts.progress = getAssertProgAll( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.triggered }, 	{ event: 'playFinish', assertion: asserts.triggered },

			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 	{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },
			{ event: 'onceBegin', assertion: asserts.not }, 		{ event: 'onceFinish', assertion: asserts.not },
			{ event: 'resumeBegin', assertion: asserts.not }, 		{ event: 'resumeFinish', assertion: asserts.not },
			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, { event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get togglePlayPause(null)


	// ----------- rewind(null) -----------
	asts.rewind = {};
	asts.rewind["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },
			{ event: 'onceBegin', assertion: asserts.not }, 		{ event: 'onceFinish', assertion: asserts.not },

			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },
			{ event: 'rewindBegin', assertion: asserts.triggered }, { event: 'rewindFinish', assertion: asserts.triggered },

			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get rewind(null)


	// ----------- fastForward(null) -----------
	asts.fastForward = {};
	asts.fastForward["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		var ffwd = [ 'you','brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ];
		asserts.frags 	 = makeFragAsserter( plyb, ffwd );
		asserts.progress = makeProgressAsserter( plyb, 11, [ 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 12/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 			 { event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 			 { event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 			 { event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 			 { event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 		 { event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 			 { event: 'closeFinish', assertion: asserts.not },
			{ event: 'onceBegin', assertion: asserts.not }, 			 { event: 'onceFinish', assertion: asserts.not },
			{ event: 'resumeBegin', assertion: asserts.not }, 			 { event: 'resumeFinish', assertion: asserts.not },
			{ event: 'rewindBegin', assertion: asserts.not }, 			 { event: 'rewindFinish', assertion: asserts.not },

			{ event: 'fastForwardBegin', assertion: asserts.triggered }, { event: 'fastForwardFinish', assertion: asserts.triggered },
			{ event: 'loopBegin', assertion: asserts.triggered }, 		 { event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get fastForward(null)



	// ----------- jumpWords -----------
	asts.jumpWords = {};

	// ----------- jumpWords( -1 ) -----------
	asts.jumpWords["-1"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			// Expected behavior? Not moving forwards, so maybe not
			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpWords( -1 )


	// ----------- jumpWords( 0 ) -----------
	asts.jumpWords["0"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpWords( 0 )


	// ----------- jumpWords( 3 ) -----------
	// End of sentence
	asts.jumpWords["3"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, [ 'flag.' ] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 4/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpWords( 3 )


	// ----------- jumpWords( 4 ) -----------
	// Jump over sentence
	asts.jumpWords["4"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, [ 'Delirious,' ] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 5/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpWords( 4 )



	// ----------- jumpWords( 11 ) -----------
	// End of collection
	asts.jumpWords["11"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsLast( plyb );
		asserts.progress = getAssertProgLast( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpWords( 11 )


	// ----------- jumpWords( 100 ) -----------
	// Past end of collection
	asts.jumpWords["100"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsLast( plyb );
		asserts.progress = getAssertProgLast( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpWords( 100 )


	// ----------- jumpSentences -----------
	asts.jumpSentences = {};

	// ----------- jumpSentences( -1 ) -----------
	asts.jumpSentences["-1"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			// Expected behavior? Not moving forward, so maybe not
			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpSentences( -1 )


	// ----------- jumpSentences( 0 ) -----------
	asts.jumpSentences["0"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpSentences( 0 )



	// ----------- jumpSentences( 1 ) -----------
	asts.jumpSentences["1"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, [ 'Delirious,' ] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 5/12 ] );
		// TODO: Function for building different patterns of assertions given frag and progress input
		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpSentences( 1 )



	// ----------- jumpSentences( 3 ) -----------
	asts.jumpSentences["3"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, [ 'Why,' ] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 10/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpSentences( 3 )



	// ----------- jumpSentences( 100 ) -----------
	// Past end of collection
	asts.jumpSentences["100"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsLast( plyb );
		asserts.progress = getAssertProgLast( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpSentences( 100 )



	// ----------- nextWord() -----------
	asts.nextWord = {};
	asts.nextWord["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, [ 'you' ] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 2/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get nextWord()



	// ----------- nextSentence() -----------
	asts.nextSentence = {};
	asts.nextSentence["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, [ 'Delirious,' ] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 5/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get nextSentence()



	// ----------- prevWord() -----------
	asts.prevWord = {};
	asts.prevWord["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get prevWord()



	// ----------- prevSentence() -----------
	asts.prevSentence = {};
	asts.prevSentence["null"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get prevSentence()



	// ----------- jumpTo -----------
	asts.jumpTo = {};
	// Needed? Basically the same as `jumpWords()`, though -1 seems to behave differently for some reason
	// TODO: look into why -1 behaves differently here than at `jumpWords()`


	// ----------- jumpTo( -1 ) -----------
	// Loops around to the end
	// ??: Should this really trigger 'done', etc.?
	// ??: Is `.jumpToWord()` needed? They do the same thing
	asts.jumpTo["-1"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsLast( plyb );
		asserts.progress = getAssertProgLast( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpTo( -1 )



	// ----------- jumpTo( 0 ) -----------
	asts.jumpTo["0"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsFirst( plyb );
		asserts.progress = getAssertProgFirst( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpTo( 0 )



	// ----------- jumpTo( 6 ) -----------
	asts.jumpTo["6"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = makeFragAsserter( plyb, [ 'come' ] );
		asserts.progress = makeProgressAsserter( plyb, 1, [ 7/12 ] );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },
			{ event: 'stopBegin', assertion: asserts.not }, 		{ event: 'stopFinish', assertion: asserts.not },
			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.not },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpTo( 6 )



	// ----------- jumpTo( 11 ) -----------
	asts.jumpTo["11"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsLast( plyb );
		asserts.progress = getAssertProgLast( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpTo( 11 )



	// ----------- jumpTo( 100 ) -----------
	asts.jumpTo["100"] = function ( assertsOverride ) {

		var asserts = cloneAsserts( defaultAsserts, assertsOverride );

		asserts.frags 	 = getAssertFragsLast( plyb );
		asserts.progress = getAssertProgLast( plyb );

		return [
			{ event: 'newWordFragment', assertion: asserts.frags },

			{ event: 'playBegin', assertion: asserts.not }, 		{ event: 'playFinish', assertion: asserts.not },
			{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
			{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
			{ event: 'pauseBegin', assertion: asserts.not }, 		{ event: 'pauseFinish', assertion: asserts.not },

			{ event: 'stopBegin', assertion: asserts.triggered }, 	{ event: 'stopFinish', assertion: asserts.triggered },

			{ event: 'closeBegin', assertion: asserts.not }, 		{ event: 'closeFinish', assertion: asserts.not },

			{ event: 'onceBegin', assertion: asserts.triggered }, 	{ event: 'onceFinish', assertion: asserts.triggered },
			{ event: 'resumeBegin', assertion: asserts.triggered }, { event: 'resumeFinish', assertion: asserts.triggered },

			{ event: 'rewindBegin', assertion: asserts.not }, 		{ event: 'rewindFinish', assertion: asserts.not },
			{ event: 'fastForwardBegin', assertion: asserts.not }, 	{ event: 'fastForwardFinish', assertion: asserts.not },

			{ event: 'loopBegin', assertion: asserts.triggered }, 	{ event: 'loopFinish', assertion: asserts.triggered },

			{ event: 'loopSkip', assertion: asserts.not },
			{ event: 'done', assertion: asserts.triggered },
			{ event: 'progress', assertion: asserts.progress }
		];

	};  // End get jumpTo( 100 )


	return asts;
};




