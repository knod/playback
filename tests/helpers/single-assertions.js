// single-assertions.js

// ------------ default assertions ------------

var defaultAsserts = {
	triggered: null,
	not: null,
	frags: null,
	progress: null
}

defaultAsserts.not = function ( plbk, result, testText, evnt ) {

	var passes 	= true;
	// var msg 	= 'no arguments accumulated';
	var msg 	= 'event NOT triggered';

	// var shouldFail = checkExpectedToFail( testText );
	// if ( shouldFail ) {
	// 	// Nothing is expected, it's failing for good reasons
	// } else {
		if ( result.args.length !== 0 ) { passes = false; }
	// }

	// shouldFail = null;  // ??: Needed?

	return { message: msg, passed: passes };

};

defaultAsserts.triggered = function ( plbk, result, testText, evnt ) {

	// var shouldFail = checkExpectedToFail( testText );
	// if ( shouldFail ) {
	// 	// Nothing is expected, it's failing for good reasons
	// } else {
		// // No frags if not 'newWordFragment'
		// expect( result.args[0] ).not.toEqual( undefined );
		// if ( !result.args[0] ) {
		// 	fail( '`result.args[0]` was falsy in `triggered` assertion:', result.args[0] )
		// } else {
		// 	expect( result.args[0][0] ).toBe( plbk );
		// }
	// }

	// shouldFail = null;  // ??: Needed?

	var passes 	= true,
		msg 	= 'event was triggered';

	if ( result.args.length === 0 ) {
		msg 	= 'no arguments accumulated';
		passes 	= false;
	} else if ( plbk !== plab ) {
		msg 	= 'object recieved was not the expected Playback instance';
		passes 	= false;
	}

	return { message: msg, passed: passes };
};



// ------------ common assertions ------------






// ------------ standard assertions for functions with events ------------

