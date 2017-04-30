
'use strict';

// ------------ setup ------------

// Will be calling:
// jasmine.runSimpleTestWith = function ( bigs, opWith, evntAssertion, mayCollectCheck, msTillAssert, reset, testText ) {
/* ( {playback, state}, {op, arg}, {event, assertion}, func, int, func, bool, str ) */
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


var getAlwaysTrue = function ( playback, result, evnt ) {
	// console.log( evnt, result.arg2s )
	return true;
};  // TODO: Not needed anymore?


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

var simplify = require('../helpers/0_115-utils.js').simplifyTestName;
var checkExpectedToFail = function ( testText ) {

	var shouldFail = false;
	if ( supressExpectedFailures ) {

		var simplified 	= simplify( testText );
		shouldFail 		= jasmine.playbackExpectedFailures.indexOf( simplified ) !== -1;

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
		expect( result.arg2s ).toEqual( [] );
	}

	shouldFail = null;  // ??: Needed?
};

defaultAsserts.triggered = function( plbk, result, testText ) {

	var shouldFail = checkExpectedToFail( testText );
	if ( shouldFail ) {
		// Nothing is expected, it's failing for good reasons
	} else {
		// No frags if not 'newWordFragment'
		expect( result.args[0][0] ).toBe( plbk );
	}

	shouldFail = null;  // ??: Needed?
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

		shouldFail = null;  // ??: Needed?
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

		// console.log( result.arg2s );

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.arg2s ).toEqual( frags );
		}

		shouldFail = null;  // ??: Needed?
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
	bigs.state.emitter.removeAllListeners();
	for ( let evi = 0; evi < eventAssertions.length; evi++ ) {
		// console.log( eventAssertions[ evi ] === null );
		runSimple( bigs, opWith, eventAssertions[ evi ], whenToCollect, waitTime, reset, testText );
	}
};


var eventAssertions;  // ??: Needed?
var opWith;  // ??: Needed?


// =========== SINGLES ===========
// Don't make any vars in here?

// ----------- play() -----------
jasmine.testPlay = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'play', arg: null };


	defaultAsserts.frags 	= getAssertFragsAll( this.plyb );
	defaultAsserts.progress = getAssertProgAll( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.triggered }, 	{ event: 'playFinish', assertion: this.asserts.triggered },

		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 	{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },
		{ event: 'onceBegin', assertion: this.asserts.not }, 		{ event: 'onceFinish', assertion: this.asserts.not },
		{ event: 'resumeBegin', assertion: this.asserts.not }, 		{ event: 'resumeFinish', assertion: this.asserts.not },
		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, { event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testPlay()


// ----------- restart() -----------
jasmine.testRestart = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'restart', arg: null };


	defaultAsserts.frags 	= getAssertFragsAll( this.plyb );
	defaultAsserts.progress = getAssertProgAll( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;


	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },

		{ event: 'restartBegin', assertion: this.asserts.triggered },{ event: 'restartFinish', assertion: this.asserts.triggered },

		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },
		{ event: 'onceBegin', assertion: this.asserts.not }, 		{ event: 'onceFinish', assertion: this.asserts.not },
		{ event: 'resumeBegin', assertion: this.asserts.not }, 		{ event: 'resumeFinish', assertion: this.asserts.not },
		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testRestart()


// ----------- reset() -----------

jasmine.testReset = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'reset', arg: null };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, ['Victorious,'] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 1/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },

		{ event: 'resetBegin', assertion: this.asserts.triggered }, 	{ event: 'resetFinish', assertion: this.asserts.triggered },

		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testReset()


// ----------- pause() -----------

jasmine.testPause = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'pause', arg: null };

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.not },
		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },

		{ event: 'pauseBegin', assertion: this.asserts.triggered }, 	{ event: 'pauseFinish', assertion: this.asserts.triggered },

		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },
		{ event: 'onceBegin', assertion: this.asserts.not }, 		{ event: 'onceFinish', assertion: this.asserts.not },
		{ event: 'resumeBegin', assertion: this.asserts.not }, 		{ event: 'resumeFinish', assertion: this.asserts.not },
		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },
		{ event: 'loopBegin', assertion: this.asserts.not }, 		{ event: 'loopFinish', assertion: this.asserts.not },
		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.not }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testPause()


// ----------- stop() -----------
// Variant of `.pause()`

jasmine.testStop = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'stop', arg: null };


	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.not },
		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },
		{ event: 'onceBegin', assertion: this.asserts.not }, 		{ event: 'onceFinish', assertion: this.asserts.not },
		{ event: 'resumeBegin', assertion: this.asserts.not }, 		{ event: 'resumeFinish', assertion: this.asserts.not },
		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },
		{ event: 'loopBegin', assertion: this.asserts.not }, 		{ event: 'loopFinish', assertion: this.asserts.not },
		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.not }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testStop()


// ----------- close() -----------
// Variant of `.pause()`

jasmine.testClose = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'close', arg: null };


	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.not },
		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },

		{ event: 'closeBegin', assertion: this.asserts.triggered }, 	{ event: 'closeFinish', assertion: this.asserts.triggered },

		{ event: 'onceBegin', assertion: this.asserts.not }, 		{ event: 'onceFinish', assertion: this.asserts.not },
		{ event: 'resumeBegin', assertion: this.asserts.not }, 		{ event: 'resumeFinish', assertion: this.asserts.not },
		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },
		{ event: 'loopBegin', assertion: this.asserts.not }, 		{ event: 'loopFinish', assertion: this.asserts.not },
		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.not }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testClose()


// ----------- togglePlayPause() -----------

jasmine.testTogglePlayPause = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'togglePlayPause', arg: null };


	defaultAsserts.frags 	= getAssertFragsAll( this.plyb );
	defaultAsserts.progress = getAssertProgAll( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.triggered }, 	{ event: 'playFinish', assertion: this.asserts.triggered },

		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },
		{ event: 'onceBegin', assertion: this.asserts.not }, 		{ event: 'onceFinish', assertion: this.asserts.not },
		{ event: 'resumeBegin', assertion: this.asserts.not }, 		{ event: 'resumeFinish', assertion: this.asserts.not },
		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testTogglePlayPause()


// ----------- rewind() -----------

jasmine.testRewind = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'rewind', arg: null };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },
		{ event: 'onceBegin', assertion: this.asserts.not }, 		{ event: 'onceFinish', assertion: this.asserts.not },

		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },
		{ event: 'rewindBegin', assertion: this.asserts.triggered }, { event: 'rewindFinish', assertion: this.asserts.triggered },

		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testRewind()


// ----------- fastForward() -----------

jasmine.testFastForward = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'fastForward', arg: null };


	var ffwd = [ 'you','brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ];
	defaultAsserts.frags 	= makeFragAsserter( this.plyb, ffwd );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 11, [ 2/12, 4/12, 7/12, 10/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 			 { event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 			 { event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 			 { event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 			 { event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 		 { event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 			 { event: 'closeFinish', assertion: this.asserts.not },
		{ event: 'onceBegin', assertion: this.asserts.not }, 			 { event: 'onceFinish', assertion: this.asserts.not },
		{ event: 'resumeBegin', assertion: this.asserts.not }, 			 { event: 'resumeFinish', assertion: this.asserts.not },
		{ event: 'rewindBegin', assertion: this.asserts.not }, 			 { event: 'rewindFinish', assertion: this.asserts.not },

		{ event: 'fastForwardBegin', assertion: this.asserts.triggered }, { event: 'fastForwardFinish', assertion: this.asserts.triggered },
		{ event: 'loopBegin', assertion: this.asserts.triggered }, 		 { event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, longTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testFastForward()


// ----------- jumpWords( -1 ) -----------

jasmine.testJumpWordsNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpWords', arg: -1 };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpWordsNegative1()


// ----------- jumpWords( 0 ) -----------

jasmine.testJumpWords0 = function ( bigs, assertsOverride, reset, testText ) {
// TODO: ??: Add ability to get start of current word or current sentence?

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpWords', arg: 0 };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpWords0()


// ----------- jumpWords( 3 ) -----------
// End of sentence

jasmine.testJumpWords3 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpWords', arg: 3 };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, [ 'flag.' ] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 4/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpWords3()


// ----------- jumpWords( 4 ) -----------

jasmine.testJumpWords4 = function ( bigs, assertsOverride, reset, testText ) {  // Start of next sentence

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpWords', arg: 4 };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, [ 'Delirious,' ] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 5/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpWords4()



// ----------- jumpWords( 11 ) -----------

jasmine.testJumpWords11 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpWords', arg: 11 };


	defaultAsserts.frags 	= getAssertFragsLast( this.plyb );
	defaultAsserts.progress = getAssertProgLast( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpWords11()


// ----------- jumpWords( 100 ) -----------

jasmine.testJumpWords100 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpWords', arg: 100 };


	defaultAsserts.frags 	= getAssertFragsLast( this.plyb );
	defaultAsserts.progress = getAssertProgLast( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpWords100()


// ----------- jumpSentences( -1 ) -----------

jasmine.testJumpSentencesNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpSentences', arg: -1 };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpSentencesNegative1()



// ----------- jumpSentences( 0 ) -----------

jasmine.testJumpSentences0 = function ( bigs, assertsOverride, reset, testText ) {
// TODO: ??: Add ability to get start of current word or current sentence?

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 0 };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpSentences0()



// ----------- jumpSentences( 1 ) -----------

jasmine.testJumpSentences1 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 1 };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, [ 'Delirious,' ] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 5/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpSentences1()



// ----------- jumpSentences( 3 ) -----------

jasmine.testJumpSentences3 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 3 };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, [ 'Why,' ] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 10/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpSentences3()



// ----------- jumpSentences( 100 ) -----------

jasmine.testJumpSentences100 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpSentences', arg: 100 };


	defaultAsserts.frags 	= getAssertFragsLast( this.plyb );
	defaultAsserts.progress = getAssertProgLast( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpSentences100()



// ----------- nextWord() -----------

jasmine.testNextWord = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'nextWord', arg: null };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, [ 'you' ] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 2/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testNextWord()



// ----------- nextSentence() -----------

jasmine.testNextSentence = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'nextSentence', arg: null };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, [ 'Delirious,' ] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 5/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testNextSentence()



// ----------- prevWord() -----------

jasmine.testPrevWord = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'prevWord', arg: null };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testPrevWord()



// ----------- prevSentence() -----------

jasmine.testPrevSentence = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'prevSentence', arg: null };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testPrevSentence()



// ----------- jumpTo( -1 ) -----------
// Loops around to the end
// ??: Should this really trigger 'done', etc.?
// ??: Is `.jumpToWord()` needed? They do the same thing

jasmine.testJumpToNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpTo', arg: -1 };


	defaultAsserts.frags 	= getAssertFragsLast( this.plyb );
	defaultAsserts.progress = getAssertProgLast( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpToNegative1()



// ----------- jumpTo( 0 ) -----------

jasmine.testJumpTo0 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpTo', arg: 0 };


	defaultAsserts.frags 	= getAssertFragsFirst( this.plyb );
	defaultAsserts.progress = getAssertProgFirst( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpTo0()



// ----------- jumpTo( 6 ) -----------

jasmine.testJumpTo6 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpTo', arg: 6 };


	defaultAsserts.frags 	= makeFragAsserter( this.plyb, [ 'come' ] );
	defaultAsserts.progress = makeProgressAsserter( this.plyb, 1, [ 7/12 ] );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },
		{ event: 'stopBegin', assertion: this.asserts.not }, 		{ event: 'stopFinish', assertion: this.asserts.not },
		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.not },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpTo6()



// ----------- jumpTo( 11 ) -----------

jasmine.testJumpTo11 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpTo', arg: 11 };


	defaultAsserts.frags 	= getAssertFragsLast( this.plyb );
	defaultAsserts.progress = getAssertProgLast( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpTo11()



// ----------- jumpTo( 100 ) -----------

jasmine.testJumpTo100 = function ( bigs, assertsOverride, reset, testText ) {

	this.plyb  = bigs.playback;
	this.state = bigs.state;

	opWith = { op: 'jumpTo', arg: 100 };


	defaultAsserts.frags 	= getAssertFragsLast( this.plyb );
	defaultAsserts.progress = getAssertProgLast( this.plyb );

	this.asserts = assertsOverride || defaultAsserts;

	eventAssertions = [
		{ event: 'newWordFragment', assertion: this.asserts.frags },

		{ event: 'playBegin', assertion: this.asserts.not }, 		{ event: 'playFinish', assertion: this.asserts.not },
		{ event: 'resetBegin', assertion: this.asserts.not }, 		{ event: 'resetFinish', assertion: this.asserts.not },
		{ event: 'restartBegin', assertion: this.asserts.not }, 		{ event: 'restartFinish', assertion: this.asserts.not },
		{ event: 'pauseBegin', assertion: this.asserts.not }, 		{ event: 'pauseFinish', assertion: this.asserts.not },

		{ event: 'stopBegin', assertion: this.asserts.triggered }, 	{ event: 'stopFinish', assertion: this.asserts.triggered },

		{ event: 'closeBegin', assertion: this.asserts.not }, 		{ event: 'closeFinish', assertion: this.asserts.not },

		{ event: 'onceBegin', assertion: this.asserts.triggered }, 	{ event: 'onceFinish', assertion: this.asserts.triggered },
		{ event: 'resumeBegin', assertion: this.asserts.triggered }, { event: 'resumeFinish', assertion: this.asserts.triggered },

		{ event: 'rewindBegin', assertion: this.asserts.not }, 		{ event: 'rewindFinish', assertion: this.asserts.not },
		{ event: 'fastForwardBegin', assertion: this.asserts.not }, 	{ event: 'fastForwardFinish', assertion: this.asserts.not },

		{ event: 'loopBegin', assertion: this.asserts.triggered }, 	{ event: 'loopFinish', assertion: this.asserts.triggered },

		{ event: 'loopSkip', assertion: this.asserts.not },
		{ event: 'done', assertion: this.asserts.triggered },
		{ event: 'progress', assertion: this.asserts.progress }
	];

	callAll( bigs, opWith, eventAssertions, getAlwaysTrue, shortTime, reset, testText );

	// ??: Needed to prevent memory leak?
	opWith = null;
	eventAssertions = null;

};  // End jasmine.testJumpTo100()
