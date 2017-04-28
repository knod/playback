
jasmine.runCombinationTestWith = function ( bigs, opsWith, events, checks, msTillAssert, assert, debug ) {
/* (
* 	{playback: {}, state: {}},
* 	{op1: str, arg1: any, op2: str, arg2: any},
* 	{one: str, two: str},
* 	{op2: func, collect: func},
* 	int,
* 	func,
* 	bool
*  )
*/

	var plbk 	= bigs.playback,
		state 	= bigs.state;

	var op1  = opsWith.op1,
		arg1 = opsWith.arg1,
		op2  = opsWith.op2,
		arg2 = opsWith.arg2;

	var event1 = events.one,
		event2 = events.two;

	var op2Check 	 = checks.op2,
		collectCheck = checks.collect;

	describe( "`." + op1 + "()` with " + arg1 + " then, on '" + event1 + "', calls `." + op2 + "()` with " + arg2 + " and listens for '" + event2 + "'", function () {

		var frags, args, result;
		msTillAssert = msTillAssert || 0;

		var currentEvent = event1;

		// Called after the first operation using the first event
		var run1 = function ( one, two, three, four ) {

			if ( debug ) { console.log( '====== outside 1:', two, three, four ) }

			var canOp2 = op2Check( plbk, result, currentEvent );

			if ( canOp2 ) {

				if ( debug ) { console.log( '====== inside 1:', two, three, four ) }

				// Stop listening for this event
				state.emitter.off( currentEvent, run1 );
				// Start of the second listener and then the second function
				currentEvent = event2;
				state.emitter.on( currentEvent, run2 );
				plbk[ op2 ]( arg2, debug );
			}

		};

		var run2 = function ( one, two, three, four ) {

			if ( debug ) { console.log( '====== outside 2:', two, three, four ) }

			var canCollect = collectCheck( plbk, result, currentEvent );

			if ( canCollect ) {
				// I happen to know this will be the fragment some of the time
				// and, most of the time it'll be the argument I'm interested in.
				frags.push( arg2 );
				args.push( [ one, two, three, four ] );

				if ( debug ) { console.log( '====== inside 2:', two, three, four ) }
			}

		};


		beforeEach(function ( done ) {
			frags = [], args = [], result = { frags: frags, args: args };

			plbk.reset();

			state.emitter.on( event1, run1 );

			plbk[ op1 ]( arg1, debug );

			setTimeout( done, (msTillAssert - (msTillAssert/4)) )

		}, msTillAssert );


		it("it should...", function () {
			state.emitter.off( currentEvent, run2 );
			if ( assert ) { assert( plbk, result, currentEvent ) }
		});

	});  // End describe

};  // End jasmine.runCombinationTestWith()
