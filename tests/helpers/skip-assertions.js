// skip-assertions.js
// For asserting when state skips stuff

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
// What it looks like when skipping around. Does not give good indication of progress values.
// Skips 'Victorious,', 'flag.', 'Delirious,', 'come', '\n', 'wattlebird?'
forward = [ 'you', 'brave', 'I', 'back.', 'Why,', 'oh' ];
// 'v y b f. d i c b. w o w'  // (the original)
var skipped = [ 'Victorious,', 'flag.', 'Delirious,', 'come', '\n', 'wattlebird?' ];

var plab = null;


// ------------ helpers ------------

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
	var msg 	= 'event ' + colors.green + 'NOT' + colors.none + ' triggered';

	if ( result.arg2s.length !== 0 ) {
		passes = false;
		msg = 'event should not have been triggerd but ' + colors.red + 'WAS' + colors.none;
	}

	return { message: msg, passed: passes };

};

defaultAsserts.triggered = function ( result, testText, evnt ) {

	var passes 	= true,
		msg 	= 'event ' + colors.green + 'WAS' + colors.none + ' triggered';

	if ( result.arg2s.length === 0 ) {
		passes 	= false;
		msg 	= 'event should have been triggerd but was ' + colors.red + 'NOT' + colors.none;
	} else if ( result.playback !== plab ) {
		passes 	= false;
		msg 	= 'object recieved was ' + colors.red + 'NOT' + colors.none + ' the expected Playback instance';
	}

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
		
		var arg2sStr = JSON.stringify( result.arg2s )

		var passes 	= true,
			msg 	= 'expected and ' + colors.green + 'GOT' + colors.none + ' ' + arg2sStr;

		var triggeredVals = defaultAsserts.triggered( result, testText, evnt );
		if ( !triggeredVals.passed ) { return triggeredVals; }
		else {
			passes = arraysEqual( result.arg2s, frags );
			if ( !passes ) {
				msg = 'frags expected ' + JSON.stringify( frags ) + ', but got ' + colors.red + arg2sStr + colors.none
			}
		}

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

		var arg2sStr = JSON.stringify( result.arg2s )

		var passes 	= true,
			msg 	= 'expected and ' + colors.green + 'GOT' + colors.none + ' ' + arg2sStr;

		// var shouldFail = checkExpectedToFail( testText );
		// if ( supressExpectedFailures && shouldFail ) {
		// 	// Nothing is expected, it's failing for good reasons
		// } else {

			var triggeredVals = defaultAsserts.triggered( result, testText, evnt );
			if ( !triggeredVals.passed ) { return triggeredVals; }
			else {
				passes = arraysEqual( result.arg2s, vals );
				if ( !passes ) {
					msg = '\'progress\' expected ' + JSON.stringify( vals ) + ', but got ' + colors.red + arg2sStr + colors.none
				}
			}

		// }
		return { message: msg, passed: passes };
	};
};  // End makeProgressAsserter()




// ------------ common assertions ------------
// ('Delirious,' is also a popular one, but less so)

// All 12 words
var getAssertFragsAll = function ( plyb ) {
	return makeFragAsserter( plyb, forward );
};
// Progress for all of them
var getAssertProgAll = function ( plyb ) {
	return makeProgressAsserter( plyb, 12, [ 1/12, 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 1 ] );
};
// All frags collected when skipping if play forward through all
var getAssertSkipAll = function ( plyb ) {
	return makeFragAsserter( plyb, ['Victorious,', 'flag.', 'Delirious,', 'come', '\n', 'wattlebird?'] );
}

// First word when moving forward and skipping
var getAssertFragsFirstForward = function ( plyb ) {
	// Skips 'Victorious,' and goes to 'you'
	return makeFragAsserter( plyb, [forward[0]] );
};
// First word moving backwards and skipping
var getAssertFragsFirstBack = function ( plyb ) {
	// Skips 'Victorious,' and then stops
	return makeFragAsserter( plyb, [undefined] );
};
// Progress for first word when moving forward and skipping
var getAssertProgFirstForward = function ( plyb ) {
	// Skips 'Victorious,', but records the progress
	return makeProgressAsserter( plyb, 2, [ 1/12, 2/12 ] );
};
// Progress for first word when moving back and skipping
var getAssertProgFirstBack = function ( plyb ) {
	// Skips 'Victorious,', but records the progress
	return makeProgressAsserter( plyb, 1, [ 1/12 ] );
};
// Words skipped until the first word is reached
var getAssertSkipFirst = function ( plyb ) {
	// TODO: ??: Different when going forward as opposed to when going back (2 when going back?)
	// TODO: ??: Different when going back multiple times? e.g. `rewind()` followed by `rewind`
	return makeFragAsserter( plyb, ['Victorious,'] );
}

// Last word
var getAssertFragsLast = function ( plyb ) {
	// The last fragment is skipped
	return makeFragAsserter( plyb, [undefined] );
};
// Progress for last word
var getAssertProgLast = function ( plyb ) {
	return makeProgressAsserter( plyb, 1, [ 12/12 ] );
};
// Frags collected by 'skip' when triggering the last word
var getAssertSkipLast = function ( plyb ) {
	return makeFragAsserter( plyb, ['wattlebird?'] );
}


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

	plab 	= plyb;
	asserts = cloneAsserts( defaultAsserts, {} );

	var asts = {};

	// ----------- play(null) -----------
	asts.play 		 = {};
	var play 		 = asts.play[ 'null' ] = {};
	asserts.frags 	 = getAssertFragsAll( plyb );
	asserts.progress = getAssertProgAll( plyb );
	asserts.skip 	 = getAssertSkipAll( plyb );

	play['playBegin'] 	 	 = play['playFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	play['resetBegin']   	 = play['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	play['restartBegin'] 	 = play['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	play['pauseBegin']   	 = play['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	play['stopBegin'] 	 	 = play['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	play['closeBegin']   	 = play['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	play['onceBegin'] 	 	 = play['onceFinish'] 		 = { assertion: asserts.not, type: 'not' };
	play['revertBegin']  	 = play['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	play['rewindBegin']  	 = play['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	play['fastForwardBegin'] = play['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	play['loopBegin'] 	 	 = play['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	play['newWordFragment']  = { assertion: asserts.frags, type: 'frags' };
	play['progress'] 	 	 = { assertion: asserts.progress, type: 'progress' };
	play['done'] 		 	 = { assertion: asserts.triggered, type: 'triggered' };
	play['loopSkip'] 	 	 = { assertion: asserts.skip, type: 'skip' };


	// ----------- togglePlayPause(null) -----------
	asts.togglePlayPause = {};
	var toggle 			 = asts.togglePlayPause["null"] = {};
	asserts.frags 		 = getAssertFragsAll( plyb );
	asserts.progress 	 = getAssertProgAll( plyb );
	asserts.skip 	 	 = getAssertSkipAll( plyb );

	toggle['playBegin'] 		= toggle['playFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	toggle['resetBegin'] 		= toggle['resetFinish'] 	= { assertion: asserts.not, type: 'not' };
	toggle['restartBegin'] 		= toggle['restartFinish'] 	= { assertion: asserts.not, type: 'not' };
	toggle['pauseBegin'] 		= toggle['pauseFinish'] 	= { assertion: asserts.not, type: 'not' };
	toggle['stopBegin'] 		= toggle['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	toggle['closeBegin'] 		= toggle['closeFinish'] 	= { assertion: asserts.not, type: 'not' };
	toggle['onceBegin'] 		= toggle['onceFinish'] 		= { assertion: asserts.not, type: 'not' };
	toggle['revertBegin'] 		= toggle['revertFinish'] 	= { assertion: asserts.not, type: 'not' };
	toggle['rewindBegin'] 		= toggle['rewindFinish'] 	= { assertion: asserts.not, type: 'not' };
	toggle['fastForwardBegin'] 	= toggle['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	toggle['loopBegin'] 		= toggle['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	toggle['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	toggle['progress'] 			= { assertion: asserts.progress, type: 'progress' };
	toggle['done'] 				= { assertion: asserts.triggered, type: 'triggered' };
	toggle['loopSkip'] 			= { assertion: asserts.skip, type: 'skip' };


	// ----------- restart(null) -----------
	asts.restart 	 = {};
	var restart 	 = asts.restart["null"] = {};
	asserts.frags 	 = getAssertFragsAll( plyb );
	asserts.progress = getAssertProgAll( plyb );
	asserts.skip 	 = getAssertSkipAll( plyb );

	restart['playBegin'] 	 	= restart['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	restart['resetBegin'] 	 	= restart['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	restart['restartBegin']  	= restart['restartFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	restart['pauseBegin'] 	 	= restart['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	restart['stopBegin'] 	 	= restart['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	restart['closeBegin'] 	 	= restart['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	restart['onceBegin'] 	 	= restart['onceFinish'] 		= { assertion: asserts.not, type: 'not' };
	restart['revertBegin']   	= restart['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	restart['rewindBegin']   	= restart['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	restart['fastForwardBegin'] = restart['fastForwardFinish']  = { assertion: asserts.not, type: 'not' };
	restart['loopBegin'] 	 	= restart['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	restart['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	restart['progress'] 	 	= { assertion: asserts.progress, type: 'progress' };
	restart['done'] 		 	= { assertion: asserts.triggered, type: 'triggered' };
	restart['loopSkip'] 	 	= { assertion: asserts.skip, type: 'skip' };


	// ----------- reset(null) -----------
	asts.reset 		 = {};
	var reset 		 = asts.reset["null"] = {};

	reset['playBegin'] 			= reset['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	reset['resetBegin'] 		= reset['resetFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	reset['restartBegin'] 		= reset['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	reset['pauseBegin'] 		= reset['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	reset['stopBegin'] 			= reset['stopFinish'] 		 = { assertion: asserts.not, type: 'not' };
	reset['closeBegin'] 		= reset['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	reset['onceBegin'] 			= reset['onceFinish'] 		 = { assertion: asserts.not, type: 'not' };
	reset['revertBegin'] 		= reset['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	reset['rewindBegin'] 		= reset['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	reset['fastForwardBegin'] 	= reset['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	reset['loopBegin'] 			= reset['loopFinish'] 		 = { assertion: asserts.not, type: 'not' };
	reset['newWordFragment'] 	= { assertion: asserts.not, type: 'not' };
	reset['progress'] 			= { assertion: asserts.not, type: 'not' };
	reset['done'] 				= { assertion: asserts.not, type: 'not' };
	reset['loopSkip'] 			= { assertion: asserts.not, type: 'not' };


	// ----------- forceReset(null) -----------
	asts.forceReset  = {};
	var fReset 		 = asts.forceReset["null"] = {};

	fReset['playBegin'] 		= fReset['playFinish'] 		  = { assertion: asserts.not, type: 'not' };
	fReset['resetBegin'] 		= fReset['resetFinish'] 	  = { assertion: asserts.triggered, type: 'triggered' };
	fReset['restartBegin'] 		= fReset['restartFinish'] 	  = { assertion: asserts.not, type: 'not' };
	fReset['pauseBegin'] 		= fReset['pauseFinish'] 	  = { assertion: asserts.not, type: 'not' };
	fReset['stopBegin'] 		= fReset['stopFinish'] 		  = { assertion: asserts.not, type: 'not' };
	fReset['closeBegin'] 		= fReset['closeFinish'] 	  = { assertion: asserts.not, type: 'not' };
	fReset['onceBegin'] 		= fReset['onceFinish'] 		  = { assertion: asserts.not, type: 'not' };
	fReset['revertBegin'] 		= fReset['revertFinish'] 	  = { assertion: asserts.not, type: 'not' };
	fReset['rewindBegin'] 		= fReset['rewindFinish'] 	  = { assertion: asserts.not, type: 'not' };
	fReset['fastForwardBegin'] 	= fReset['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	fReset['loopBegin'] 		= fReset['loopFinish'] 		  = { assertion: asserts.not, type: 'not' };
	fReset['newWordFragment'] 	= { assertion: asserts.not, type: 'not' };
	fReset['progress'] 			= { assertion: asserts.not, type: 'not' };
	fReset['done'] 				= { assertion: asserts.not, type: 'not' };
	fReset['loopSkip'] 			= { assertion: asserts.not, type: 'not' };


	// ----------- pause(null) -----------
	asts.pause 	= {};
	var pause 	= asts.pause["null"] = {};

	pause['playBegin'] 		  = pause['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['resetBegin'] 	  = pause['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['restartBegin'] 	  = pause['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['pauseBegin'] 	  = pause['pauseFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	pause['stopBegin'] 		  = pause['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['closeBegin'] 	  = pause['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['onceBegin'] 		  = pause['onceFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['revertBegin'] 	  = pause['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['rewindBegin'] 	  = pause['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['fastForwardBegin'] = pause['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	pause['loopBegin'] 		  = pause['loopFinish'] 		= { assertion: asserts.not, type: 'not' };
	pause['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	pause['progress'] 		  = { assertion: asserts.not, type: 'not' };
	pause['done'] 			  = { assertion: asserts.not, type: 'not' };
	pause['loopSkip'] 		  = { assertion: asserts.not, type: 'not' };


	// ----------- stop(null) -----------
	// Variant of `.pause()`
	asts.stop = {};
	var stop  = asts.stop["null"] = {};

	stop['playBegin'] 		 = stop['playFinish'] 			= { assertion: asserts.not, type: 'not' };
	stop['resetBegin'] 		 = stop['resetFinish'] 			= { assertion: asserts.not, type: 'not' };
	stop['restartBegin'] 	 = stop['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	stop['pauseBegin'] 		 = stop['pauseFinish'] 			= { assertion: asserts.not, type: 'not' };
	stop['stopBegin'] 		 = stop['stopFinish'] 			= { assertion: asserts.triggered, type: 'triggered' };
	stop['closeBegin'] 		 = stop['closeFinish'] 			= { assertion: asserts.not, type: 'not' };
	stop['onceBegin'] 		 = stop['onceFinish'] 			= { assertion: asserts.not, type: 'not' };
	stop['revertBegin'] 	 = stop['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	stop['rewindBegin'] 	 = stop['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	stop['fastForwardBegin'] = stop['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	stop['loopBegin'] 		 = stop['loopFinish'] 			= { assertion: asserts.not, type: 'not' };
	stop['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	stop['progress'] 		 = { assertion: asserts.not, type: 'not' };
	stop['done'] 			 = { assertion: asserts.not, type: 'not' };
	stop['loopSkip'] 		 = { assertion: asserts.not, type: 'not' };


	// ----------- close(null) -----------
	// Variant of `.pause()`
	asts.close = {};
	var close  = asts.close["null"] = {};
	close['playBegin'] 			= close['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	close['resetBegin'] 		= close['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	close['restartBegin'] 		= close['restartFinish'] 	= { assertion: asserts.not, type: 'not' };
	close['pauseBegin'] 		= close['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	close['stopBegin'] 			= close['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	close['closeBegin'] 		= close['closeFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	close['onceBegin'] 			= close['onceFinish'] 		= { assertion: asserts.not, type: 'not' };
	close['revertBegin'] 		= close['revertFinish'] 	= { assertion: asserts.not, type: 'not' };
	close['rewindBegin'] 		= close['rewindFinish'] 	= { assertion: asserts.not, type: 'not' };
	close['fastForwardBegin'] 	= close['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	close['loopBegin'] 			= close['loopFinish'] 		= { assertion: asserts.not, type: 'not' };
	close['newWordFragment'] 	= { assertion: asserts.not, type: 'not' };
	close['progress'] 			= { assertion: asserts.not, type: 'not' };
	close['done'] 				= { assertion: asserts.not, type: 'not' };
	close['loopSkip'] 			= { assertion: asserts.not, type: 'not' };


	// ----------- rewind(null) -----------
	asts.rewind 	 = {};
	var rew 		 = asts.rewind["null"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );
	// 'pause' triggered here because when going backwards, `revert()` is
	// called and that pauses if it was paused. Forward doesn't have the same
	// issue. That triggers just 'stop'

	rew['playBegin'] 		= rew['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	rew['resetBegin'] 		= rew['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	rew['restartBegin'] 	= rew['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	rew['pauseBegin'] 		= rew['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	rew['stopBegin'] 		= rew['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	rew['closeBegin'] 		= rew['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	rew['onceBegin'] 		= rew['onceFinish'] 		= { assertion: asserts.not, type: 'not' };
	rew['revertBegin'] 		= rew['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	rew['rewindBegin'] 		= rew['rewindFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	rew['fastForwardBegin'] = rew['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	rew['loopBegin'] 		= rew['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	rew['newWordFragment'] 	= { assertion: asserts.not, type: 'not' };
	rew['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	rew['done'] 			= { assertion: asserts.triggered, type: 'triggered' };
	rew['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- fastForward(null) -----------
	asts.fastForward = {};  // TODO: Change ffwd and rewind behavior to get the current word first?
	var fast 		 = asts.fastForward["null"] = {};
	var ffwd 		 = forward;  // .slice(1);  // Gets till end (not sure of this since ffwd starts on the second word anyway)
	asserts.frags 	 = makeFragAsserter( plyb, ffwd );
	asserts.progress = makeProgressAsserter( plyb, 11, [ 2/12, 3/12, 4/12, 5/12, 6/12, 7/12, 8/12, 9/12, 10/12, 11/12, 12/12 ] );
	asserts.skip 	 = makeFragAsserter( plyb, skipped.slice(1) );  // ffwd doesn't even try for the first word

	fast['playBegin'] 		 = fast['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	fast['resetBegin'] 		 = fast['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	fast['restartBegin'] 	 = fast['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	fast['pauseBegin'] 		 = fast['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	fast['stopBegin'] 		 = fast['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	fast['closeBegin'] 		 = fast['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	fast['onceBegin'] 		 = fast['onceFinish'] 		 = { assertion: asserts.not, type: 'not' };
	fast['revertBegin'] 	 = fast['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	fast['rewindBegin'] 	 = fast['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	fast['fastForwardBegin'] = fast['fastForwardFinish'] = { assertion: asserts.triggered, type: 'triggered' };
	fast['loopBegin'] 		 = fast['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	fast['newWordFragment']  = { assertion: asserts.frags, type: 'frags' };
	fast['progress'] 		 = { assertion: asserts.progress, type: 'progress' };
	fast['done'] 			 = { assertion: asserts.triggered, type: 'triggered' };
	fast['loopSkip'] 		 = { assertion: asserts.skip, type: 'skip' };


	// ----------- once() -----------
	asts.once = {};

	// ----------- once([0,0,-2]) -----------
	var onceNeg 	 = asts.once["[0,0,-2]"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	onceNeg['playBegin'] 		= onceNeg['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	onceNeg['resetBegin'] 		= onceNeg['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	onceNeg['restartBegin'] 	= onceNeg['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	onceNeg['pauseBegin'] 		= onceNeg['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	onceNeg['stopBegin'] 		= onceNeg['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	onceNeg['closeBegin'] 		= onceNeg['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	onceNeg['onceBegin'] 		= onceNeg['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	onceNeg['revertBegin'] 		= onceNeg['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	onceNeg['rewindBegin'] 		= onceNeg['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	onceNeg['fastForwardBegin'] = onceNeg['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	onceNeg['loopBegin'] 		= onceNeg['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	onceNeg['newWordFragment'] 	= { assertion: asserts.not, type: 'not' };
	onceNeg['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	onceNeg['done'] 			= { assertion: asserts.triggered, type: 'triggered' };
	onceNeg['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- once([0,0,2]) -----------
	var once2 		 = asts.once["[0,0,2]"] = {};
	asserts.frags 	 = makeFragAsserter( plyb, [ forward[0] ] );  // 'you'
	asserts.progress = makeProgressAsserter( plyb, 1, [ 2/12 ] );
	// no skipping

	once2['playBegin'] 		  = once2['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	once2['resetBegin'] 	  = once2['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	once2['restartBegin'] 	  = once2['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	once2['pauseBegin'] 	  = once2['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	once2['stopBegin'] 		  = once2['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	once2['closeBegin'] 	  = once2['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	once2['onceBegin'] 		  = once2['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	once2['revertBegin'] 	  = once2['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	once2['rewindBegin'] 	  = once2['rewindFinish']		= { assertion: asserts.not, type: 'not' };
	once2['fastForwardBegin'] = once2['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	once2['loopBegin'] 		  = once2['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	once2['newWordFragment']  = { assertion: asserts.frags, type: 'frags' };
	once2['progress'] 		  = { assertion: asserts.progress, type: 'progress' };
	once2['done'] 			  = { assertion: asserts.not, type: 'not' };
	once2['loopSkip'] 		  = { assertion: asserts.not, type: 'not' };


	// ----------- current() -----------
	asts.current = {};

	// ----------- current(null) -----------
	var current 	 = asts.current["null"] = {};
	asserts.frags 	 = getAssertFragsFirstForward( plyb );
	asserts.progress = getAssertProgFirstForward( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	current['playBegin'] 		= current['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['resetBegin'] 		= current['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['restartBegin'] 	= current['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['pauseBegin'] 		= current['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['stopBegin'] 		= current['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['closeBegin'] 		= current['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['onceBegin'] 		= current['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	current['revertBegin'] 		= current['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['rewindBegin'] 		= current['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	current['fastForwardBegin'] = current['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	current['loopBegin'] 		= current['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	current['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	current['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	current['done'] 			= { assertion: asserts.not, type: 'not' };
	current['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };



	// ----------- jumpTo -----------
	asts.jumpTo = {};
	// Needed? Basically the same as `jumpWords()`
	// Changed -1 behavior to match `jumpWords(-1)`. See no need for looping bak around


	// ----------- jumpTo( -3 ) -----------
	// Loops around to the end
	var jumpToNeg3 	 = asts.jumpTo["-3"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jumpToNeg3['playBegin'] 	   = jumpToNeg3['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['resetBegin'] 	   = jumpToNeg3['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['restartBegin'] 	   = jumpToNeg3['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['pauseBegin'] 	   = jumpToNeg3['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['stopBegin'] 	   = jumpToNeg3['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg3['closeBegin'] 	   = jumpToNeg3['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['onceBegin'] 	   = jumpToNeg3['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg3['revertBegin'] 	   = jumpToNeg3['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['rewindBegin'] 	   = jumpToNeg3['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['fastForwardBegin'] = jumpToNeg3['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['loopBegin'] 	   = jumpToNeg3['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg3['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jumpToNeg3['progress'] 		   = { assertion: asserts.progress, type: 'progress' };
	jumpToNeg3['done'] 			   = { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg3['loopSkip'] 		   = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpTo( -1 ) -----------
	// Loops around to the end
	var jumpToNeg 	 = asts.jumpTo["-1"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jumpToNeg['playBegin'] 		  = jumpToNeg['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jumpToNeg['resetBegin'] 	  = jumpToNeg['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jumpToNeg['restartBegin'] 	  = jumpToNeg['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jumpToNeg['pauseBegin'] 	  = jumpToNeg['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jumpToNeg['stopBegin'] 		  = jumpToNeg['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg['closeBegin'] 	  = jumpToNeg['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jumpToNeg['onceBegin'] 		  = jumpToNeg['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg['revertBegin'] 	  = jumpToNeg['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jumpToNeg['rewindBegin'] 	  = jumpToNeg['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jumpToNeg['fastForwardBegin'] = jumpToNeg['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jumpToNeg['loopBegin'] 		  = jumpToNeg['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jumpToNeg['progress'] 		  = { assertion: asserts.progress, type: 'progress' };
	jumpToNeg['done'] 			  = { assertion: asserts.triggered, type: 'triggered' };
	jumpToNeg['loopSkip'] 		  = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpTo( 0 ) -----------
	var jt0 	 	 = asts.jumpTo["0"] = {};
	asserts.frags 	 = getAssertFragsFirstForward( plyb );
	asserts.progress = getAssertProgFirstForward( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jt0['playBegin'] 		= jt0['playFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['resetBegin'] 		= jt0['resetFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['restartBegin'] 	= jt0['restartFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['pauseBegin'] 		= jt0['pauseFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['stopBegin'] 		= jt0['stopFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['closeBegin'] 		= jt0['closeFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['onceBegin'] 		= jt0['onceFinish'] 	   = { assertion: asserts.triggered, type: 'triggered' };
	jt0['revertBegin'] 		= jt0['revertFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['rewindBegin'] 		= jt0['rewindFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jt0['fastForwardBegin'] = jt0['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	jt0['loopBegin'] 		= jt0['loopFinish'] 	   = { assertion: asserts.triggered, type: 'triggered' };
	jt0['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	jt0['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	jt0['done'] 			= { assertion: asserts.not, type: 'not' };
	jt0['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpTo( 4 ) -----------
	var jt4 		 = asts.jumpTo["4"] = {};
	// Skips 'Delirious,', but records the progress for it
	asserts.frags 	 = makeFragAsserter( plyb, [ 'I' ] );
	asserts.progress = makeProgressAsserter( plyb, 2, [ 5/12, 6/12 ] );
	asserts.skip 	 = makeFragAsserter( plyb, [ 'Delirious,' ] );

	jt4['playBegin'] 		= jt4['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['resetBegin'] 		= jt4['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['restartBegin'] 	= jt4['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['pauseBegin'] 		= jt4['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['stopBegin'] 		= jt4['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['closeBegin'] 		= jt4['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['onceBegin'] 		= jt4['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jt4['revertBegin'] 		= jt4['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['rewindBegin'] 		= jt4['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt4['fastForwardBegin'] = jt4['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jt4['loopBegin'] 		= jt4['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jt4['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	jt4['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	jt4['done'] 			= { assertion: asserts.not, type: 'not' };
	jt4['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpTo( 11 ) -----------
	var jt11 		 = asts.jumpTo["11"] = {};
	// asserts.frags 	 = getAssertFragsLast( plyb );
	asserts.progress = getAssertProgLast( plyb );
	asserts.skip 	 = getAssertSkipLast( plyb );

	jt11['playBegin'] 		 = jt11['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jt11['resetBegin'] 		 = jt11['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jt11['restartBegin'] 	 = jt11['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jt11['pauseBegin'] 		 = jt11['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jt11['stopBegin'] 		 = jt11['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jt11['closeBegin'] 		 = jt11['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jt11['onceBegin'] 		 = jt11['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jt11['revertBegin'] 	 = jt11['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jt11['rewindBegin'] 	 = jt11['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jt11['fastForwardBegin'] = jt11['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	jt11['loopBegin'] 		 = jt11['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jt11['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jt11['progress'] 		 = { assertion: asserts.progress, type: 'progress' };
	jt11['done'] 			 = { assertion: asserts.triggered, type: 'triggered' };
	jt11['loopSkip'] 		 = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpTo( 100 ) -----------
	var jt100 		 = asts.jumpTo["100"] = {};
	// asserts.frags 	 = getAssertFragsLast( plyb );
	asserts.progress = getAssertProgLast( plyb );
	asserts.skip 	 = getAssertSkipLast( plyb );


	jt100['playBegin'] 		  = jt100['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt100['resetBegin'] 	  = jt100['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt100['restartBegin'] 	  = jt100['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt100['pauseBegin'] 	  = jt100['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt100['stopBegin'] 		  = jt100['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jt100['closeBegin'] 	  = jt100['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt100['onceBegin'] 		  = jt100['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jt100['revertBegin'] 	  = jt100['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt100['rewindBegin'] 	  = jt100['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jt100['fastForwardBegin'] = jt100['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jt100['loopBegin'] 		  = jt100['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jt100['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jt100['progress'] 		  = { assertion: asserts.progress, type: 'progress' };
	jt100['done'] 			  = { assertion: asserts.triggered, type: 'triggered' };
	jt100['loopSkip'] 		  = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpWords -----------
	asts.jumpWords = {};

	// ----------- jumpWords( -1 ) -----------
	var jwNeg3 		 = asts.jumpWords["-3"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jwNeg3['playBegin'] 	   = jwNeg3['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jwNeg3['resetBegin'] 	   = jwNeg3['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jwNeg3['restartBegin'] 	   = jwNeg3['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jwNeg3['pauseBegin'] 	   = jwNeg3['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jwNeg3['stopBegin'] 	   = jwNeg3['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jwNeg3['closeBegin'] 	   = jwNeg3['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jwNeg3['onceBegin'] 	   = jwNeg3['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jwNeg3['revertBegin'] 	   = jwNeg3['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jwNeg3['rewindBegin'] 	   = jwNeg3['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jwNeg3['fastForwardBegin'] = jwNeg3['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	jwNeg3['loopBegin'] 	   = jwNeg3['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jwNeg3['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jwNeg3['progress'] 		   = { assertion: asserts.progress, type: 'progress' };
	jwNeg3['done'] 			   = { assertion: asserts.triggered, type: 'triggered' };
	jwNeg3['loopSkip'] 		   = { assertion: asserts.skip, type: 'skip' };

	// ----------- jumpWords( -1 ) -----------
	var jwNeg 		 = asts.jumpWords["-1"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jwNeg['playBegin'] 		  = jwNeg['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jwNeg['resetBegin'] 	  = jwNeg['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jwNeg['restartBegin'] 	  = jwNeg['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jwNeg['pauseBegin'] 	  = jwNeg['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jwNeg['stopBegin'] 		  = jwNeg['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jwNeg['closeBegin'] 	  = jwNeg['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jwNeg['onceBegin'] 		  = jwNeg['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jwNeg['revertBegin'] 	  = jwNeg['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jwNeg['rewindBegin'] 	  = jwNeg['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jwNeg['fastForwardBegin'] = jwNeg['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jwNeg['loopBegin'] 		  = jwNeg['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jwNeg['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jwNeg['progress'] 		  = { assertion: asserts.progress, type: 'progress' };
	jwNeg['done'] 			  = { assertion: asserts.triggered, type: 'triggered' };
	jwNeg['loopSkip'] 		  = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpWords( 0 ) -----------
	var jw0 		 = asts.jumpWords["0"] = {};
	asserts.frags 	 = getAssertFragsFirstForward( plyb );
	asserts.progress = getAssertProgFirstForward( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jw0['playBegin'] 		= jw0['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['resetBegin'] 		= jw0['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['restartBegin'] 	= jw0['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['pauseBegin'] 		= jw0['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['stopBegin'] 		= jw0['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['closeBegin'] 		= jw0['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['onceBegin'] 		= jw0['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jw0['revertBegin'] 		= jw0['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['rewindBegin'] 		= jw0['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw0['fastForwardBegin'] = jw0['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jw0['loopBegin'] 		= jw0['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jw0['newWordFragment']  = { assertion: asserts.frags, type: 'frags' };
	jw0['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	jw0['done'] 			= { assertion: asserts.not, type: 'not' };
	jw0['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpWords( 3 ) -----------
	// End of sentence
	var jw3 		 = asts.jumpWords["3"] = {};
	// Skips 'flag.' and 'Delirious,', but records their progress
	asserts.frags 	 = makeFragAsserter( plyb, [ 'I' ] );
	asserts.progress = makeProgressAsserter( plyb, 3, [ 4/12, 5/12, 6/12 ] );
	asserts.skip 	 = makeFragAsserter( plyb, [ 'flag.', 'Delirious,' ] );

	jw3['playBegin'] 		= jw3['playFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['resetBegin'] 		= jw3['resetFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['restartBegin'] 	= jw3['restartFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['pauseBegin'] 		= jw3['pauseFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['stopBegin'] 		= jw3['stopFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['closeBegin'] 		= jw3['closeFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['onceBegin'] 		= jw3['onceFinish'] 	   = { assertion: asserts.triggered, type: 'triggered' };
	jw3['revertBegin'] 		= jw3['revertFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['rewindBegin'] 		= jw3['rewindFinish'] 	   = { assertion: asserts.not, type: 'not' };
	jw3['fastForwardBegin'] = jw3['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	jw3['loopBegin'] 		= jw3['loopFinish'] 	   = { assertion: asserts.triggered, type: 'triggered' };
	jw3['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	jw3['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	jw3['done'] 			= { assertion: asserts.not, type: 'not' };
	jw3['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpWords( 4 ) -----------
	// Jump over sentence
	var jw4 		 = asts.jumpWords["4"] = {};
	// Skips 'Delirious,', but records its progress
	asserts.frags 	 = makeFragAsserter( plyb, [ 'I' ] );
	asserts.progress = makeProgressAsserter( plyb, 2, [ 5/12, 6/12 ] );
	asserts.skip 	 = makeFragAsserter( plyb, [ 'Delirious,' ] );

	jw4['playBegin'] 		= jw4['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['resetBegin'] 		= jw4['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['restartBegin'] 	= jw4['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['pauseBegin'] 		= jw4['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['stopBegin'] 		= jw4['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['closeBegin'] 		= jw4['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['onceBegin'] 		= jw4['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jw4['revertBegin'] 		= jw4['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['rewindBegin'] 		= jw4['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw4['fastForwardBegin'] = jw4['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jw4['loopBegin'] 		= jw4['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jw4['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	jw4['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	jw4['done'] 			= { assertion: asserts.not, type: 'not' };
	jw4['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpWords( 11 ) -----------
	// End of collection
	var jw11 		 = asts.jumpWords["11"] = {};
	// asserts.frags 	 = getAssertFragsLast( plyb );
	asserts.progress = getAssertProgLast( plyb );
	asserts.skip 	 = getAssertSkipLast( plyb );

	jw11['playBegin'] 		 = jw11['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jw11['resetBegin'] 		 = jw11['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jw11['restartBegin'] 	 = jw11['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jw11['pauseBegin'] 		 = jw11['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jw11['stopBegin'] 		 = jw11['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jw11['closeBegin'] 		 = jw11['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jw11['onceBegin'] 		 = jw11['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jw11['revertBegin'] 	 = jw11['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jw11['rewindBegin'] 	 = jw11['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jw11['fastForwardBegin'] = jw11['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	jw11['loopBegin'] 		 = jw11['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jw11['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jw11['progress'] 		 = { assertion: asserts.progress, type: 'progress' };
	jw11['done'] 			 = { assertion: asserts.triggered, type: 'triggered' };
	jw11['loopSkip'] 		 = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpWords( 100 ) -----------
	// Past end of collection
	var jw100 = asts.jumpWords["100"] = {};
	// asserts.frags 	 = getAssertFragsLast( plyb );
	asserts.progress = getAssertProgLast( plyb );
	asserts.skip 	 = getAssertSkipLast( plyb );

	jw100['playBegin'] 		  = jw100['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw100['resetBegin'] 	  = jw100['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw100['restartBegin'] 	  = jw100['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw100['pauseBegin'] 	  = jw100['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw100['stopBegin'] 		  = jw100['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jw100['closeBegin'] 	  = jw100['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw100['onceBegin'] 		  = jw100['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jw100['revertBegin'] 	  = jw100['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw100['rewindBegin'] 	  = jw100['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jw100['fastForwardBegin'] = jw100['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jw100['loopBegin'] 		  = jw100['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jw100['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jw100['progress'] 		  = { assertion: asserts.progress, type: 'progress' };
	jw100['done'] 			  = { assertion: asserts.triggered, type: 'triggered' };
	jw100['loopSkip'] 		  = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpSentences -----------
	asts.jumpSentences = {};

	// ----------- jumpSentences( -1 ) -----------
	var jsNeg3 		 = asts.jumpSentences["-3"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jsNeg3['playBegin'] 	   = jsNeg3['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jsNeg3['resetBegin'] 	   = jsNeg3['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jsNeg3['restartBegin'] 	   = jsNeg3['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jsNeg3['pauseBegin'] 	   = jsNeg3['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jsNeg3['stopBegin'] 	   = jsNeg3['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jsNeg3['closeBegin'] 	   = jsNeg3['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	jsNeg3['onceBegin'] 	   = jsNeg3['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jsNeg3['revertBegin'] 	   = jsNeg3['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jsNeg3['rewindBegin'] 	   = jsNeg3['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	jsNeg3['fastForwardBegin'] = jsNeg3['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	jsNeg3['loopBegin'] 	   = jsNeg3['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	jsNeg3['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jsNeg3['progress'] 		   = { assertion: asserts.progress, type: 'progress' };
	jsNeg3['done'] 			   = { assertion: asserts.triggered, type: 'triggered' };
	jsNeg3['loopSkip'] 		   = { assertion: asserts.skip, type: 'skip' };

	// ----------- jumpSentences( -1 ) -----------
	var jsNeg 		 = asts.jumpSentences["-1"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	jsNeg['playBegin'] 		  = jsNeg['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	jsNeg['resetBegin'] 	  = jsNeg['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	jsNeg['restartBegin'] 	  = jsNeg['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	jsNeg['pauseBegin'] 	  = jsNeg['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	jsNeg['stopBegin'] 		  = jsNeg['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jsNeg['closeBegin'] 	  = jsNeg['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	jsNeg['onceBegin'] 		  = jsNeg['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jsNeg['revertBegin'] 	  = jsNeg['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	jsNeg['rewindBegin'] 	  = jsNeg['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	jsNeg['fastForwardBegin'] = jsNeg['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	jsNeg['loopBegin'] 		  = jsNeg['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	jsNeg['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	jsNeg['progress'] 		  = { assertion: asserts.progress, type: 'progress' };
	jsNeg['done'] 			  = { assertion: asserts.triggered, type: 'triggered' };
	jsNeg['loopSkip'] 		  = { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpSentences( 0 ) -----------
	var js0 		 = asts.jumpSentences["0"] = {};
	asserts.frags 	 = getAssertFragsFirstForward( plyb );
	asserts.progress = getAssertProgFirstForward( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	js0['playBegin'] 		= js0['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['resetBegin'] 		= js0['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['restartBegin'] 	= js0['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['pauseBegin'] 		= js0['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['stopBegin'] 		= js0['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['closeBegin'] 		= js0['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['onceBegin'] 		= js0['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js0['revertBegin'] 		= js0['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['rewindBegin'] 		= js0['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	js0['fastForwardBegin'] = js0['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	js0['loopBegin'] 		= js0['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js0['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	js0['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	js0['done'] 			= { assertion: asserts.not, type: 'not' };
	js0['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpSentences( 1 ) -----------
	var js1 		 = asts.jumpSentences["1"] = {};
	// Skips 'Delirious', but records its progress
	asserts.frags 	 = makeFragAsserter( plyb, [ 'I' ] );
	asserts.progress = makeProgressAsserter( plyb, 2, [ 5/12, 6/12 ] );
	asserts.skip 	 = makeFragAsserter( plyb, [ 'Delirious,' ] );

	js1['playBegin'] 		= js1['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['resetBegin'] 		= js1['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['restartBegin'] 	= js1['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['pauseBegin'] 		= js1['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['stopBegin'] 		= js1['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['closeBegin'] 		= js1['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['onceBegin'] 		= js1['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js1['revertBegin'] 		= js1['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['rewindBegin'] 		= js1['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	js1['fastForwardBegin'] = js1['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	js1['loopBegin'] 		= js1['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js1['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	js1['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	js1['done'] 			= { assertion: asserts.not, type: 'not' };
	js1['loopSkip'] 		= { assertion: asserts.skip, type: 'skip' };


	// ----------- jumpSentences( 3 ) -----------
	var js3 		 = asts.jumpSentences["3"] = {};
	asserts.frags 	 = makeFragAsserter( plyb, [ 'Why,' ] );
	asserts.progress = makeProgressAsserter( plyb, 1, [ 10/12 ] );
	// no skip

	js3['playBegin'] 		= js3['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['resetBegin'] 		= js3['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['restartBegin'] 	= js3['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['pauseBegin'] 		= js3['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['stopBegin'] 		= js3['stopFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['closeBegin'] 		= js3['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['onceBegin'] 		= js3['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js3['revertBegin'] 		= js3['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['rewindBegin'] 		= js3['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	js3['fastForwardBegin'] = js3['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	js3['loopBegin'] 		= js3['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js3['newWordFragment'] 	= { assertion: asserts.frags, type: 'frags' };
	js3['progress'] 		= { assertion: asserts.progress, type: 'progress' };
	js3['done'] 			= { assertion: asserts.not, type: 'not' };
	js3['loopSkip'] 		= { assertion: asserts.not, type: 'not' };


	// ----------- jumpSentences( 100 ) -----------
	// Past end of collection
	var js100 		 = asts.jumpSentences["100"] = {};
	// asserts.frags 	 = getAssertFragsLast( plyb );
	asserts.progress = getAssertProgLast( plyb );
	asserts.skip 	 = getAssertSkipLast( plyb );

	js100['playBegin'] 		  = js100['playFinish'] 		= { assertion: asserts.not, type: 'not' };
	js100['resetBegin'] 	  = js100['resetFinish'] 		= { assertion: asserts.not, type: 'not' };
	js100['restartBegin'] 	  = js100['restartFinish'] 		= { assertion: asserts.not, type: 'not' };
	js100['pauseBegin'] 	  = js100['pauseFinish'] 		= { assertion: asserts.not, type: 'not' };
	js100['stopBegin'] 		  = js100['stopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js100['closeBegin'] 	  = js100['closeFinish'] 		= { assertion: asserts.not, type: 'not' };
	js100['onceBegin'] 		  = js100['onceFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js100['revertBegin'] 	  = js100['revertFinish'] 		= { assertion: asserts.not, type: 'not' };
	js100['rewindBegin'] 	  = js100['rewindFinish'] 		= { assertion: asserts.not, type: 'not' };
	js100['fastForwardBegin'] = js100['fastForwardFinish'] 	= { assertion: asserts.not, type: 'not' };
	js100['loopBegin'] 		  = js100['loopFinish'] 		= { assertion: asserts.triggered, type: 'triggered' };
	js100['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	js100['progress'] 		  = { assertion: asserts.progress, type: 'progress' };
	js100['done'] 			  = { assertion: asserts.triggered, type: 'triggered' };
	js100['loopSkip'] 		  = { assertion: asserts.skip, type: 'skip' };


	// ----------- nextWord() -----------
	asts.nextWord 	 = {};
	var nextWord 	 = asts.nextWord["null"] = {};
	asserts.frags 	 = makeFragAsserter( plyb, [ 'you' ] );
	asserts.progress = makeProgressAsserter( plyb, 1, [ 2/12 ] );
	// no skip

	nextWord['playBegin'] 		 = nextWord['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextWord['resetBegin'] 		 = nextWord['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextWord['restartBegin'] 	 = nextWord['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	nextWord['pauseBegin'] 		 = nextWord['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextWord['stopBegin'] 		 = nextWord['stopFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextWord['closeBegin'] 		 = nextWord['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextWord['onceBegin'] 		 = nextWord['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	nextWord['revertBegin'] 	 = nextWord['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	nextWord['rewindBegin'] 	 = nextWord['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	nextWord['fastForwardBegin'] = nextWord['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	nextWord['loopBegin'] 		 = nextWord['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	nextWord['newWordFragment']  = { assertion: asserts.frags, type: 'frags' };
	nextWord['progress'] 		 = { assertion: asserts.progress, type: 'progress' };
	nextWord['done'] 			 = { assertion: asserts.not, type: 'not' };
	nextWord['loopSkip'] 		 = { assertion: asserts.not, type: 'not' };


	// ----------- nextSentence() -----------
	asts.nextSentence = {};
	var nextSent 	  = asts.nextSentence["null"] = {};
	// Skips 'Delirious,', but gets its progress
	asserts.frags 	  = makeFragAsserter( plyb, [ 'I' ] );
	asserts.progress  = makeProgressAsserter( plyb, 2, [ 5/12, 6/12 ] );
	asserts.skip 	  = makeFragAsserter( plyb, [ 'Delirious,' ] );

	nextSent['playBegin'] 		 = nextSent['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextSent['resetBegin'] 		 = nextSent['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextSent['restartBegin'] 	 = nextSent['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	nextSent['pauseBegin'] 		 = nextSent['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextSent['stopBegin'] 		 = nextSent['stopFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextSent['closeBegin'] 		 = nextSent['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	nextSent['onceBegin'] 		 = nextSent['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	nextSent['revertBegin'] 	 = nextSent['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	nextSent['rewindBegin'] 	 = nextSent['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	nextSent['fastForwardBegin'] = nextSent['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	nextSent['loopBegin'] 		 = nextSent['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	nextSent['newWordFragment']  = { assertion: asserts.frags, type: 'frags' };
	nextSent['progress'] 		 = { assertion: asserts.progress, type: 'progress' };
	nextSent['done'] 			 = { assertion: asserts.not, type: 'not' };
	nextSent['loopSkip'] 		 = { assertion: asserts.skip, type: 'skip' };


	// ----------- prevWord() -----------
	asts.prevWord 	 = {};
	var prevWord 	 = asts.prevWord["null"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	prevWord['playBegin'] 		 = prevWord['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevWord['resetBegin'] 		 = prevWord['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevWord['restartBegin'] 	 = prevWord['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	prevWord['pauseBegin'] 		 = prevWord['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevWord['stopBegin'] 		 = prevWord['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	prevWord['closeBegin'] 		 = prevWord['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevWord['onceBegin'] 		 = prevWord['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	prevWord['revertBegin'] 	 = prevWord['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	prevWord['rewindBegin'] 	 = prevWord['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	prevWord['fastForwardBegin'] = prevWord['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	prevWord['loopBegin'] 		 = prevWord['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	prevWord['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	prevWord['progress'] 		 = { assertion: asserts.progress, type: 'progress' };
	prevWord['done'] 			 = { assertion: asserts.triggered, type: 'triggered' };
	prevWord['loopSkip'] 		 = { assertion: asserts.skip, type: 'skip' };


	// ----------- prevSentence() -----------
	asts.prevSentence = {};
	var prevSent 	  = asts.prevSentence["null"] = {};
	// asserts.frags 	 = getAssertFragsFirstBack( plyb );
	asserts.progress = getAssertProgFirstBack( plyb );
	asserts.skip 	 = getAssertSkipFirst( plyb );

	prevSent['playBegin'] 		 = prevSent['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevSent['resetBegin'] 		 = prevSent['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevSent['restartBegin'] 	 = prevSent['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	prevSent['pauseBegin'] 		 = prevSent['pauseFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevSent['stopBegin'] 		 = prevSent['stopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	prevSent['closeBegin'] 		 = prevSent['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	prevSent['onceBegin'] 		 = prevSent['onceFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	prevSent['revertBegin'] 	 = prevSent['revertFinish'] 	 = { assertion: asserts.not, type: 'not' };
	prevSent['rewindBegin'] 	 = prevSent['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	prevSent['fastForwardBegin'] = prevSent['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	prevSent['loopBegin'] 		 = prevSent['loopFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	prevSent['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	prevSent['progress'] 		 = { assertion: asserts.progress, type: 'progress' };
	prevSent['done'] 			 = { assertion: asserts.triggered, type: 'triggered' };
	prevSent['loopSkip'] 		 = { assertion: asserts.skip, type: 'skip' };


	// ----------- revert() -----------
	asts.revert = {};
	var revert = asts.revert["null"] = {};

	revert['playBegin'] 	   = revert['playFinish'] 		 = { assertion: asserts.not, type: 'not' };
	revert['resetBegin'] 	   = revert['resetFinish'] 		 = { assertion: asserts.not, type: 'not' };
	revert['restartBegin'] 	   = revert['restartFinish'] 	 = { assertion: asserts.not, type: 'not' };
	revert['pauseBegin'] 	   = revert['pauseFinish'] 		 = { assertion: asserts.triggered, type: 'triggered' };
	revert['stopBegin'] 	   = revert['stopFinish'] 		 = { assertion: asserts.not, type: 'not' };
	revert['closeBegin'] 	   = revert['closeFinish'] 		 = { assertion: asserts.not, type: 'not' };
	revert['onceBegin'] 	   = revert['onceFinish'] 		 = { assertion: asserts.not, type: 'not' };
	revert['revertBegin'] 	   = revert['revertFinish'] 	 = { assertion: asserts.triggered, type: 'triggered' };
	revert['rewindBegin'] 	   = revert['rewindFinish'] 	 = { assertion: asserts.not, type: 'not' };
	revert['fastForwardBegin'] = revert['fastForwardFinish'] = { assertion: asserts.not, type: 'not' };
	revert['loopBegin'] 	   = revert['loopFinish'] 		 = { assertion: asserts.not, type: 'not' };
	revert['newWordFragment']  = { assertion: asserts.not, type: 'not' };
	revert['progress'] 		   = { assertion: asserts.not, type: 'not' };
	revert['done'] 			   = { assertion: asserts.not, type: 'not' };
	revert['loopSkip'] 		   = { assertion: asserts.not, type: 'not' };


	return asts;
};
