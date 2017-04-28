
// ------------ setup ------------

// Will be calling:
// j.runSimpleTestWith = function ( bigs, opWith, evntAssertion, mayCollectCheck, msTillAssert, reset, testText ) {
/* ( {playback, state}, {op, arg}, {event, assertion}, func, int, func, bool ) */
var runSimple = jasmine.runSimpleTestWith;

var shortTime = 30,
	longTime  = 60;

var	parsedText = [
		[ 'Victorious,', 'you','brave', 'flag.' ],
		[ 'Delirious,', 'I', 'come', 'back.' ],
		[ '\n' ],
		[ 'Why,', 'oh', 'wattlebird?' ]
	];

var	forward = parsedText[0].concat(parsedText[1]).concat(parsedText[2]).concat(parsedText[3]);



var opWith;
var getAlwaysTrue = function () { return true; };  // TODO: Not needed anymore?


// ------------ expected failures ------------
/* Accumulates failures and tests them against expected failures
* 
* Since I have so many possible combinations to test for, I can't
* write all those tests - writing the correct output for each single
* one would take forever. On the other hand, I can run all the
* /standard/ tests on all the possible input combinations with
* some simple `for` loops. The errors brought up in those tests
* can tell me which tests have unique output that doesn't match
* the regular output. That's a much smaller number of tests to
* write and I can probably do those.
* 
* It won't tell me /all/ the tests I need to write, but it'll tell
* me some.
* 
* It can also help me in the future - I can record which tests fail/
* have unusual results and, when I change my code in the future,
* I can check that 1) no new tests are failing and 2) no old failing
* tests are now unexpectedly succeeding.
* 
* These looped tests are run from 'find-unusual-tests-spec.js'
* 
* Unexpected failures should also be caught by the reporter... I think...
*/
var supressExpectedFailures = false;  // So we can turn this on and off easily

var checkExpectedToFail = function ( testText ) {
	var shouldFail = false;
	if ( supressExpectedFailures ) {
		shouldFail = jasmine.playbackExpectedFailures.indexOf( testText ) !== -1
	}
	return shouldFail;
};  // End checkExpectedToFail()


// ------------ asserts ------------

var defaultAsserts = {
	triggered: null,
	not: null,
	frags: null,
	progress: null
}

defaultAsserts.not = function( plbk, result, testText ) {

	var shouldFail = checkExpectedToFail( testText );
	if ( shouldFail ) {
		// Nothing is expected, it's failing for good reasons
	} else {
		expect( result.args ).toEqual( [] );
		expect( result.frags ).toEqual( [] );
	}
};

defaultAsserts.triggered = function( plbk, result, testText ) {

	var shouldFail = checkExpectedToFail( testText );
	if ( shouldFail ) {
		// Nothing is expected, it's failing for good reasons
	} else {
		// No frags if not 'newWordFragment'
		expect( result.args[0][0] ).toBe( plbk );
	}
};


var makeProgressAsserter = function ( plyb, numFrags, vals ) {
/* ( Playback, int, [ floats ] ) -> func
* 
* `vals` should have a maximum of 5 floats. Any number of the
* items can be undefined.
* 
* Basically here to abstract away the expected failures check.
* 
* Returns a progress assertion function with the given values
* which asserts that the correct progress was made at
* the 0, 2, 5, 8, and 11th triggereing of the 'progress' event.
*/
	return function assertProgress ( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( numFrags );

			if ( vals[0] ) { expect( result.arg2s[0] ).toEqual( vals[0] ); }
			if ( vals[1] ) { expect( result.arg2s[2] ).toEqual( vals[1] ); }
			if ( vals[2] ) { expect( result.arg2s[5] ).toEqual( vals[2] ); }
			if ( vals[3] ) { expect( result.arg2s[8] ).toEqual( vals[3] ); }
			if ( vals[4] ) { expect( result.arg2s[11] ).toEqual( vals[4] ); }
		}
	};
};


var makeFragAsserter = function ( plyb, frags ) {
/* ( Playback, [ strs ] ) -> func
* 
* Basically here to abstract away the expected failures check.
* 
* Returns a fragment assertion function with the given values
* which asserts that the given fragments are the ones that
* were collected.
*/
	return function assertFrags( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.arg2s ).toEqual( frags );
		}
	};
};


// Commonly used assertions
// ('Delerious,' is also a popular one, but less so)

// All 12 words
var getAssertFragsAll = function ( plyb ) {
	return makeFragAsserter( plyb, forward );
};
// Progress for all of them
var getAssertProgAll = function ( plyb ) {
	return makeProgressAsserter( plyb, 12, [ 1/12, 3/12, 6/12, 9/12, 1 ] );
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



// ------------ all events loop ------------

var callAll = function ( bigs, opWith, eventAssertions, whenToCollect, waitTime, reset, testText ) {
	for ( var evi = 0; evi < eventAssertions.length; evi++ ) {
		runSimple ( bigs, opWith, eventAssertions, whenToCollect, waitTime, reset, testText );
	}
};



// =========== SINGLES ===========

// ----------- play() -----------
jasmine.testPlay = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'play', arg: null };


	defaultAsserts.frags 	= getAssertFragsAll( plyb );
	defaultAsserts.progress = getAssertProgAll( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
		{ event: 'newWordFragment', assertion: asserts.frags },

		{ event: 'playBegin', assertion: asserts.triggered }, 	{ event: 'playFinish', assertion: asserts.triggered },

		{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
		{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

};  // End jasmine.testPlay()


// ----------- restart() -----------
jasmine.testRestart = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'restart', arg: null };


	defaultAsserts.frags 	= getAssertFragsAll( plyb );
	defaultAsserts.progress = getAssertProgAll( plyb );

	asserts = assertsOverride || defaultAsserts;


	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

};  // End jasmine.testRestart()


// ----------- reset() -----------

jasmine.testReset = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'reset', arg: null };


	defaultAsserts.frags 	= makeFragAsserter( plyb, ['Victorious,'] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 1/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testReset()


// ----------- pause() -----------

jasmine.testPause = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'pause', arg: null };

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testPause()


// ----------- stop() -----------
// Variant of `.pause()`

jasmine.testStop = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'stop', arg: null };


	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testStop()


// ----------- close() -----------
// Variant of `.pause()`

jasmine.testClose = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'close', arg: null };


	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testClose()


// ----------- togglePlayPause() -----------

jasmine.testTogglePlayPause = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'togglePlayPause', arg: null };


	defaultAsserts.frags 	= getAssertFragsAll( plyb );
	defaultAsserts.progress = getAssertProgAll( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
		{ event: 'newWordFragment', assertion: asserts.frags },

		{ event: 'playBegin', assertion: asserts.triggered }, 	{ event: 'playFinish', assertion: asserts.triggered },

		{ event: 'resetBegin', assertion: asserts.not }, 		{ event: 'resetFinish', assertion: asserts.not },
		{ event: 'restartBegin', assertion: asserts.not }, 		{ event: 'restartFinish', assertion: asserts.not },
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

};  // End jasmine.testTogglePlayPause()


// ----------- rewind() -----------

jasmine.testRewind = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'rewind', arg: null };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testRewind()


// ----------- fastForward() -----------

jasmine.testFastForward = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'fastForward', arg: null };


	var ffwd = [ 'you','brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ];
	defaultAsserts.frags 	= makeFragAsserter( plyb, ffwd );
	defaultAsserts.progress = makeProgressAsserter( plyb, 11, [ 2/12, 4/12, 7/12, 10/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

};  // End jasmine.testFastForward()


// ----------- jumpWords( -1 ) -----------

jasmine.testJumpWordsNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpWords', arg: -1 };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpWordsNegative1()


// ----------- jumpWords( 0 ) -----------

jasmine.testJumpWords0 = function ( bigs, assertsOverride, reset, testText ) {
// TODO: ??: Add ability to get start of current word or current sentence?

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpWords', arg: 0 };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpWords0()


// ----------- jumpWords( 3 ) -----------
// End of sentence

jasmine.testJumpWords3 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpWords', arg: 3 };


	defaultAsserts.frags 	= makeFragAsserter( plyb, [ 'flag.' ] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 4/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpWords3()


// ----------- jumpWords( 4 ) -----------

jasmine.testJumpWords4 = function ( bigs, assertsOverride, reset, testText ) {  // Start of next sentence

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpWords', arg: 4 };


	defaultAsserts.frags 	= makeFragAsserter( plyb, [ 'Delirious,' ] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 5/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpWords4()



// ----------- jumpWords( 11 ) -----------

jasmine.testJumpWords11 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpWords', arg: 11 };


	defaultAsserts.frags 	= getAssertFragsLast( plyb );
	defaultAsserts.progress = getAssertProgLast( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpWords11()


// ----------- jumpWords( 100 ) -----------

jasmine.testJumpWords100 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpWords', arg: 100 };


	defaultAsserts.frags 	= getAssertFragsLast( plyb );
	defaultAsserts.progress = getAssertProgLast( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpWords100()


// ----------- jumpSentences( -1 ) -----------

jasmine.testJumpSentencesNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpSentences', arg: -1 };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpSentencesNegative1()



// ----------- jumpSentences( 0 ) -----------

jasmine.testJumpSentences0 = function ( bigs, assertsOverride, reset, testText ) {
// TODO: ??: Add ability to get start of current word or current sentence?

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 0 };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpSentences0()



// ----------- jumpSentences( 1 ) -----------

jasmine.testJumpSentences1 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 1 };


	defaultAsserts.frags 	= makeFragAsserter( plyb, [ 'Delirious,' ] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 5/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpSentences1()



// ----------- jumpSentences( 3 ) -----------

jasmine.testJumpSentences3 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 3 };


	defaultAsserts.frags 	= makeFragAsserter( plyb, [ 'Why,' ] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 10/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpSentences3()



// ----------- jumpSentences( 100 ) -----------

jasmine.testJumpSentences100 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 100 };


	defaultAsserts.frags 	= getAssertFragsLast( plyb );
	defaultAsserts.progress = getAssertProgLast( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpSentences100()



// ----------- nextWord() -----------

jasmine.testNextWord = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'nextWord', arg: null };


	defaultAsserts.frags 	= makeFragAsserter( plyb, [ 'you' ] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 2/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, shortTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.progress, reset, testText );

};  // End jasmine.testNextWord()



// ----------- nextSentence() -----------

jasmine.testNextSentence = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'nextSentence', arg: null };


	defaultAsserts.frags 	= makeFragAsserter( plyb, [ 'Delirious,' ] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 5/12 ] );

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, shortTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.progress, reset, testText );

};  // End jasmine.testNextSentence()



// ----------- prevWord() -----------

jasmine.testPrevWord = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'prevWord', arg: null };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, shortTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.progress, reset, testText );

};  // End jasmine.testPrevWord()



// ----------- prevSentence() -----------

jasmine.testPrevSentence = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'prevSentence', arg: null };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, shortTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.progress, reset, testText );

};  // End jasmine.testPrevSentence()



// ----------- jumpTo( -1 ) -----------
// Loops around to the end
// ??: Should this really trigger 'done', etc.?
// ??: Is `.jumpToWord()` needed? They do the same thing

jasmine.testJumpToNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpTo', arg: -1 };


	defaultAsserts.frags 	= getAssertFragsLast( plyb );
	defaultAsserts.progress = getAssertProgLast( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpToNegative1()



// ----------- jumpTo( 0 ) -----------

jasmine.testJumpTo0 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpTo', arg: 0 };


	defaultAsserts.frags 	= getAssertFragsFirst( plyb );
	defaultAsserts.progress = getAssertProgFirst( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpTo0()



// ----------- jumpTo( 6 ) -----------

jasmine.testJumpTo6 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpTo', arg: 6 };


	defaultAsserts.frags 	= makeFragAsserter( plyb, [ 'come' ] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 7/12 ] );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpTo6()



// ----------- jumpTo( 11 ) -----------

jasmine.testJumpTo11 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpTo', arg: 11 };


	defaultAsserts.frags 	= getAssertFragsLast( plyb );
	defaultAsserts.progress = getAssertProgLast( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpTo11()



// ----------- jumpTo( 100 ) -----------

jasmine.testJumpTo100 = function ( bigs, assertsOverride, reset, testText ) {

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = { op: 'jumpTo', arg: 100 };


	defaultAsserts.frags 	= getAssertFragsLast( plyb );
	defaultAsserts.progress = getAssertProgLast( plyb );

	asserts = assertsOverride || defaultAsserts;

	var eventAssertions = [
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

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

};  // End jasmine.testJumpTo100()
