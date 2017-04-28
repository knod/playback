// var Playback = require( '../../dist/Playback.js' );
// var EventEmitter = require( '../../node_modules/wolfy87-eventemitter/EventEmitter.js' );
var runSimple = jasmine.runSimpleTestWith;

var shortTime = 30,
	longTime  = 60;

var	parsedText = [
		[ 'Victorious,', 'you','brave', 'flag.' ],
		[ 'Delirious,', 'I', 'come', 'back.' ],
		[ '\n' ],
		[ 'Why,', 'oh', 'wattlebird?' ]
	];

var	forward = parsedText[0].concat(parsedText[1].concat(parsedText[2]).concat(parsedText[3]));


// j.runSimpleTestWith = function ( bigs, opWith, evnt, mayCollectCheck, msTillAssert, assert, debug ) {
// /* ( {playback, state}, {op, arg}, str, func, int, func, bool ) */
// };


// ------------ setup ------------

var opWith;

var getSingleOpWith = function ( opName ) {
	return { op: opName, arg: null }
};

var getOpWithOneArg = function ( opName, arg ) {
	return { op: opName, arg: arg }
};


var getAlwaysTrue = function () {
	return true;
};


// ------------ expected failures ------------
/* Accumulates failures and tests them agains expected failures
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

var axssertFrags, axssertProgress;

var axssertNOTtriggered = function( plbk, result, testText ) {

	var shouldFail = checkExpectedToFail( testText );
	if ( shouldFail ) {
		// Nothing is expected, it's failing for good reasons
	} else {
		expect( result.args ).toEqual( [] );
		expect( result.frags ).toEqual( [] );
	}
};

var axssertTriggered = function( plbk, result, testText ) {

	var shouldFail = checkExpectedToFail( testText );
	if ( shouldFail ) {
		// Nothing is expected, it's failing for good reasons
	} else {
		// No frags if not 'newWordFragment'
		expect( result.args[0][0] ).toBe( plbk );
	}
};

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



// var makeProgressAsserter = function ( numFrags, indexesAndValues ) {
var makeProgressAsserter = function ( plyb, numFrags, vals ) {
/* ( Playback, int, [ floats ] ) -> func
* 
* `vals` should have 5 floats
*/

	return function assertProgress ( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( numFrags );

			// for ( var indexi = 0; indexi < indexesAndValues.length; indexi++ ) {

			// 	var obj = indexesAndValues[ indexi ];
			// 	expect( result.args[ obj.index ][1] ).toEqual( obj.fraction );

			// }

			// expect( result.args[0][1] ).toEqual( 1/12 );
			// expect( result.args[2][1] ).toEqual( 0.25 );
			// expect( result.args[5][1] ).toEqual( 0.5 );
			// expect( result.args[8][1] ).toEqual( 0.75 );
			// expect( result.args[11][1] ).toEqual( 1 );

			// possibly:
			// expect( result.args[0][1] ).toEqual( val1 );
			// expect( result.args[2][1] ).toEqual( val2 );
			// expect( result.args[5][1] ).toEqual( val3 );
			// expect( result.args[8][1] ).toEqual( val4 );
			// expect( result.args[11][1] ).toEqual( val5 );  // where this could be `undefined`

			// possibly:
			if ( vals[0] ) { expect( result.args[0][1] ).toEqual( vals[0] ); }
			if ( vals[1] ) { expect( result.args[2][1] ).toEqual( vals[1] ); }
			if ( vals[2] ) { expect( result.args[5][1] ).toEqual( vals[2] ); }
			if ( vals[3] ) { expect( result.args[8][1] ).toEqual( vals[3] ); }
			if ( vals[4] ) { expect( result.args[11][1] ).toEqual( vals[4] ); }

		}

	};

};


var makeFragAsserter = function ( plyb, frags ) {
	return function assertFrags( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {

			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( frags );

		}
	};
};


// All 12 words
var getDefaultAssertFrags = function ( plyb ) {
	return makeFragAsserter( plyb, forward );
};
// Progress for all of them
var getDefaultAssertProgress = function ( plyb ) {
	return makeProgressAsserter( plyb, 12, [ 1/12, 3/12, 6/12, 9/12, 1 ] );
};



// =========== SINGLES ===========

// ----------- play() -----------
jasmine.testPlay = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'play' );

	// defaultAsserts.frags = function( plbk, result, testText ) {

	// 	var shouldFail = checkExpectedToFail( testText );
	// 	if ( supressExpectedFailures && shouldFail ) {
	// 		// Nothing is expected, it's failing for good reasons
	// 	} else {
	// 		expect( result.args[0][0] ).toBe( plyb );
	// 		expect( result.frags ).toEqual( forward );
	// 	}
	// };

	// defaultAsserts.progress = function( plbk, result, testText ) {

	// 	var shouldFail = checkExpectedToFail( testText );
	// 	if ( supressExpectedFailures && shouldFail ) {
	// 		// Nothing is expected, it's failing for good reasons
	// 	} else {
	// 		expect( result.args[0][0] ).toBe( plyb );

	// 		expect( result.args.length ).toEqual( 12 );

	// 		expect( result.args[0][1] ).toEqual( 1/12 );
	// 		expect( result.args[2][1] ).toEqual( 0.25 );
	// 		expect( result.args[5][1] ).toEqual( 0.5 );
	// 		expect( result.args[8][1] ).toEqual( 0.75 );
	// 		expect( result.args[11][1] ).toEqual( 1 );
	// 	}
	// };

	defaultAsserts.frags 	= getDefaultAssertFrags( plyb );
	defaultAsserts.progress = getDefaultAssertProgress( plyb );

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, longTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'done', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, longTime, asserts.progress, reset, testText );

};  // End jasmine.testPlay()


// ----------- restart() -----------
jasmine.testRestart = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'restart' );

	defaultAsserts.frags 	= getDefaultAssertFrags( plyb );
	defaultAsserts.progress = getDefaultAssertProgress( plyb );

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, longTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );  // Why no infinite loop
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'done', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, longTime, asserts.progress, reset, testText );

};  // End jasmine.testRestart()


// ----------- reset() -----------

jasmine.testReset = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'reset' );

	// defaultAsserts.frags = function( plbk, result, testText ) {

	// 	var shouldFail = checkExpectedToFail( testText );
	// 	if ( supressExpectedFailures && shouldFail ) {
	// 		// Nothing is expected, it's failing for good reasons
	// 	} else {
	// 		expect( result.args[0][0] ).toBe( plyb );
	// 		expect( result.frags ).toEqual( ['Victorious,'] );
	// 	}
	// };

	// defaultAsserts.progress = function( plbk, result, testText ) {

	// 	var shouldFail = checkExpectedToFail( testText );
	// 	if ( supressExpectedFailures && shouldFail ) {
	// 		// Nothing is expected, it's failing for good reasons
	// 	} else {
	// 		expect( result.args[0][0] ).toBe( plyb );

	// 		expect( result.args.length ).toEqual( 1 );

	// 		expect( result.args[0][1] ).toEqual( 1/12 );
	// 	}
	// };


	defaultAsserts.frags 	= makeFragAsserter( plyb, ['Victorious,'] );
	defaultAsserts.progress = makeProgressAsserter( plyb, 1, [ 1/12 ] );

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, longTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'done', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, longTime, asserts.progress, reset, testText );

};  // End jasmine.testReset()


// ----------- pause() -----------

jasmine.testPause = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	asserts = assertsOverride || defaultAsserts;


	opWith = getSingleOpWith( 'pause' );

	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.not, reset, testText );

};  // End jasmine.testPause()


// ----------- stop() -----------
// Variant of `.pause()`

jasmine.testStop = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	asserts = assertsOverride || defaultAsserts;


	opWith = getSingleOpWith( 'stop' );

	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, shortTime, asserts.not, reset, testText );
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
	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.not, reset, testText );

};  // End jasmine.testStop()


// ----------- close() -----------
// Variant of `.pause()`

jasmine.testClose = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	asserts = assertsOverride || defaultAsserts;


	opWith = getSingleOpWith( 'close' );

	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, shortTime, asserts.not, reset, testText );
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

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.not, reset, testText );

};  // End jasmine.testClose()


// ----------- togglePlayPause() -----------

jasmine.testTogglePlayPause = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'togglePlayPause' );

	// defaultAsserts.frags = function( plbk, result, testText ) {

	// 	var shouldFail = checkExpectedToFail( testText );
	// 	if ( supressExpectedFailures && shouldFail ) {
	// 		// Nothing is expected, it's failing for good reasons
	// 	} else {
	// 		expect( result.args[0][0] ).toBe( plyb );
	// 		expect( result.frags ).toEqual( forward );
	// 	}
	// };

	// defaultAsserts.progress = function( plbk, result, testText ) {

	// 	var shouldFail = checkExpectedToFail( testText );
	// 	if ( supressExpectedFailures && shouldFail ) {
	// 		// Nothing is expected, it's failing for good reasons
	// 	} else {
	// 		expect( result.args[0][0] ).toBe( plyb );

	// 		expect( result.args.length ).toEqual( 12 );

	// 		expect( result.args[0][1] ).toEqual( 1/12 );
	// 		expect( result.args[2][1] ).toEqual( 0.25 );
	// 		expect( result.args[5][1] ).toEqual( 0.5 );
	// 		expect( result.args[8][1] ).toEqual( 0.75 );
	// 		expect( result.args[11][1] ).toEqual( 1 );
	// 	}
	// };

	defaultAsserts.frags 	= getDefaultAssertFrags( plyb );
	defaultAsserts.progress = getDefaultAssertProgress( plyb );

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, longTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'done', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, longTime, asserts.progress, reset, testText );

};  // End jasmine.testTogglePlayPause()


// ----------- rewind() -----------

jasmine.testRewind = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'rewind' );

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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
	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, shortTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, shortTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'done', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, shortTime, asserts.progress, reset, testText );

};  // End jasmine.testRewind()


// ----------- fastForward() -----------

jasmine.testFastForward = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'fastForward' );

	// One less word - first word not re-played
	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			var ffwd = [ 'you','brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ];
			expect( result.frags ).toEqual( ffwd );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 11 );

			expect( result.args[0][1] ).toEqual( 2/12 );
			expect( result.args[1][1] ).toEqual( 3/12 );
			expect( result.args[4][1] ).toEqual( 0.5 );
			expect( result.args[7][1] ).toEqual( 0.75 );
			expect( result.args[10][1] ).toEqual( 1 );
		}
	};

	asserts = assertsOverride || defaultAsserts;


	runSimple( bigs, opWith, 'newWordFragment', getAlwaysTrue, longTime, asserts.frags, reset, testText );

	runSimple( bigs, opWith, 'playBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'playFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resetFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'restartFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'pauseFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'stopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'stopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'closeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'closeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'onceFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'resumeFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindBegin', getAlwaysTrue, longTime, asserts.not, reset, testText );
	runSimple( bigs, opWith, 'rewindFinish', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'fastForwardBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'fastForwardFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopBegin', getAlwaysTrue, longTime, asserts.triggered, reset, testText );
	runSimple( bigs, opWith, 'loopFinish', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'loopSkip', getAlwaysTrue, longTime, asserts.not, reset, testText );

	runSimple( bigs, opWith, 'done', getAlwaysTrue, longTime, asserts.triggered, reset, testText );

	runSimple( bigs, opWith, 'progress', getAlwaysTrue, longTime, asserts.progress, reset, testText );

};  // End jasmine.testFastForward()


// ----------- jumpWords( -1 ) -----------

jasmine.testJumpWordsNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpWords', -1 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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

};  // End jasmine.testJumpWordsNegative1()


// ----------- jumpWords( 0 ) -----------

jasmine.testJumpWords0 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpWords', 0 )

	// TODO: ??: Add abilit to get start of current word or current sentence?

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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

};  // End jasmine.testJumpWords0()


// ----------- jumpWords( 3 ) -----------
// End of sentence

jasmine.testJumpWords3 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpWords', 3 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['flag.'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 4/12 );
		}
	};

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

};  // End jasmine.testJumpWords3()


// ----------- jumpWords( 4 ) -----------

jasmine.testJumpWords4 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpWords', 4 )

	// Start of next sentence

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Delirious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 5/12 );
		}
	};

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

};  // End jasmine.testJumpWords4()



// ----------- jumpWords( 11 ) -----------

jasmine.testJumpWords11 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpWords', 11 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['wattlebird?'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 12/12 );
		}
	};

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

};  // End jasmine.testJumpWords11()


// ----------- jumpWords( 100 ) -----------

jasmine.testJumpWords100 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpWords', 100 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['wattlebird?'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 12/12 );
		}
	};

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

};  // End jasmine.testJumpWords100()


// ----------- jumpSentences( -1 ) -----------

jasmine.testJumpSentencesNegative1 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpSentences', -1 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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

};  // End jasmine.testJumpSentencesNegative1()



// ----------- jumpSentences( 0 ) -----------

jasmine.testJumpSentences0 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpSentences', 0 )

	// TODO: ??: Add abilit to get start of current word or current sentence?

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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

};  // End jasmine.testJumpSentences0()



// ----------- jumpSentences( 1 ) -----------

jasmine.testJumpSentences1 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpSentences', 1 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Delirious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 5/12 );
		}
	};

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

};  // End jasmine.testJumpSentences1()



// ----------- jumpSentences( 3 ) -----------

jasmine.testJumpSentences3 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpSentences', 3 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Why,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 10/12 );
		}
	};

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

};  // End jasmine.testJumpSentences3()



// ----------- jumpSentences( 100 ) -----------

jasmine.testJumpSentences100 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpSentences', 100 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['wattlebird?'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 12/12 );
		}
	};

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

};  // End jasmine.testJumpSentences100()



// ----------- nextWord() -----------

jasmine.testNextWord = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'nextWord' );

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['you'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 2/12 );
		}
	};

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

};  // End jasmine.testNextWord()



// ----------- nextSentence() -----------

jasmine.testNextSentence = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'nextSentence' );

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Delirious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 5/12 );
		}
	};

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

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'prevWord' );

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getSingleOpWith( 'prevSentence' );

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpTo', -1 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['wattlebird?'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 12/12 );
		}
	};

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

};  // End jasmine.testJumpToNegative1()



// ----------- jumpTo( 0 ) -----------

jasmine.testJumpTo0 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpTo', 0 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['Victorious,'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1/12 );
		}
	};

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

};  // End jasmine.testJumpTo0()



// ----------- jumpTo( 6 ) -----------

jasmine.testJumpTo6 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpTo', 6 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['come'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 7/12 );
		}
	};

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

};  // End jasmine.testJumpTo6()



// ----------- jumpTo( 11 ) -----------

jasmine.testJumpTo11 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpTo', 11 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['wattlebird?'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1 );
		}
	};

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

};  // End jasmine.testJumpTo11()



// ----------- jumpTo( 100 ) -----------

jasmine.testJumpTo100 = function ( bigs, assertsOverride, reset, testText ) {

	bigs = bigs || stuff;

	var plyb  = bigs.playback,
		state = bigs.state;

	opWith = getOpWithOneArg( 'jumpTo', 100 )

	defaultAsserts.frags = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );
			expect( result.frags ).toEqual( ['wattlebird?'] );
		}
	};

	defaultAsserts.progress = function( plbk, result, testText ) {

		var shouldFail = checkExpectedToFail( testText );
		if ( supressExpectedFailures && shouldFail ) {
			// Nothing is expected, it's failing for good reasons
		} else {
			expect( result.args[0][0] ).toBe( plyb );

			expect( result.args.length ).toEqual( 1 );

			expect( result.args[0][1] ).toEqual( 1 );
		}
	};

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

	runSimple( bigs, opWith, 'onceBegin', getAlwaysTrue, shortTime, asserts.triggered, reset, testText );  // TODO: Why not infinite loop?
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

};  // End jasmine.testJumpTo100()



