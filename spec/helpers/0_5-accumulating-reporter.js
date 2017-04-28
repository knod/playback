/* !!! WARNING: May need to handle this a different way -
* jasmine will print event the expected failure results. There
* may be a way to fix this, but I'm not sure the research is
* worth it. There may be other ways to deal with this.
*
* Previously:
* Accumulates testTestFailures and tests them against expected failures
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
*/

var unexpectedFailures = [];

var testTestFailures = [];
// Test equality at end
testTestFailures.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
};


// Test if failure was because there wasn't a sufficient amount of time, which
// just means I need to increase the time.
var timeouts = [];
var timeoutMessage = 'Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.';


// Is this the set of tests for which we need to check output?
var doCheck = false;

var myReporter = {

	specDone: function( result ) {

		var failed = result.failedExpectations;

		if ( failed.length > 0 ) {

			for(var faili = 0; faili < failed.length; faili++) {

				var message = failed[ faili ].message

				if ( message === timeoutMessage ) {
					timeouts.push( result.fullName )
				}

				// Is this one of the tests that /should/
				// be compared to the set of testTestFailures? Or
				// Is this a normal test that's just failing?
				// (I have encluded the text in the description)
				if ( /test-test/.test( result.fullName ) ) {
					testTestFailures.push( result.fullName );

					// If the failure isn't an expected failure
					if ( jasmine.playbackExpectedFailures.indexOf( result.fullName ) === -1 ) {
						unexpectedFailures.push( result.fullName );

					// This cannot work! Jasmine has already recorded the testTestFailures
					// by this time! May need to handle this a different way.
					// Don't actually fail an expected failure
					} else {
						// result.failedExpectations.splice( faili, 1 );
						// result.status = 'passed';
						// console.log( result.failedExpectations );
					}

				}

			}

		}

	},  // End specDone()

	jasmineDone: function( result ) {

		// // Use this to copy/paste expected testTestFailures into 0_15-expected-testTestFailures.js
		// console.log( 'All "test-test" testTestFailures:', testTestFailures.slice(0) );

		if ( testTestFailures.length > 0 ) {

			// var wasGood = testTestFailures.equals( jasmine.playbackExpectedFailures );
			var wasGood = unexpectedFailures.length <= 0;

			if ( wasGood ) {
				console.log( '\x1B[32mTest-testing testTestFailures are as they should be!\x1B[0m')
			} else {
				// console.log( '\x1B[31mTest-testing testTestFailures are failing in the wrong ways!\x1B[0m Actual testTestFailures:' )
				console.log( '\x1B[31mTest-testing testTestFailures are failing in the wrong ways!\x1B[0m Unexpected testTestFailures:' )
				// console.log( testTestFailures.slice(0) )
				console.log( unexpectedFailures );
			}

		}

		if ( timeouts.length > 0 ) {
			console.log( '\x1B[31mTimed out on some tests!\x1B[0m Timed-out tests:' );
			console.log( timeouts );
		}

	}  // End jasmineDone()

};  // End myReporter


jasmine.getEnv().addReporter(myReporter);

