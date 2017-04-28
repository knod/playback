// jasmine.runSimpleTestWith = function ( bigs, opWith, evnt, mayCollectCheck, msTillAssert, assert, reset, testText ) {
/* ( {playback, state}, {op, arg}, str, func, int, func, bool )
* 
*/
jasmine.runSimpleTestWith = function ( bigs, opWith, evntAssertion, mayCollectCheck, msTillAssert, reset, testText ) {
/* ( {playback, state}, {op, arg}, {event, assertion}, func, int, func, bool )
* 
*/
	var plbk 	= bigs.playback,
		state 	= bigs.state;

	var op 	= opWith.op,
		arg = opWith.arg;

	var evnt 	= evntAssertion.event,
		assert 	= evntAssertion.assertion;

	var thisText = "`." + op + "()` with " + arg + " and we collect data on '" + evnt + "'"
	describe( thisText, function () {

		testText = testText + ' ' + thisText;

		var arg2s, args, result;
		msTillAssert = msTillAssert || 0;

		
		var whenRun = function ( one, two, three, four ) {

//			if ( evnt === 'newWordFragment' ) { console.log(two, plbk.getIndex(), three); }
		
			if ( mayCollectCheck && mayCollectCheck( plbk, result, evnt ) ) {
				// I happen to know this will be the fragment some of the time
				// and, most of the time it'll be the argument I'm interested in.
				arg2s.push( two );
				args.push( [ one, two, three, four ] );
			}

		};


		beforeEach(function ( done ) {
			arg2s = [], args = [], result = { arg2s: arg2s, args: args };

			// !!! WARNING !!!
			if ( reset ) { plbk.reset(); }  // This is what's causing combo tests to pass when they shouldn't!
			// !!! WARNING !!!

			state.emitter.on( evnt, whenRun );

			plbk[ op ]( arg );

			setTimeout( done, (msTillAssert - (msTillAssert/4)) )

		}, msTillAssert );


		var lastText = "it should return..."

		it( lastText, function () {
			testText = testText + ' ' + lastText;

			state.emitter.off( evnt, whenRun );
			if ( assert ) { assert( plbk, result, testText ) }
		});

	});  // End describe

};  // End jasmine.runSimpleTestWith()
