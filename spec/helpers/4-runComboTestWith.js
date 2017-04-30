
jasmine.runComboTestWith = function ( bigs, opsWith, eventAsserts, checks, msTillAssert, assert, reset, testText ) {
/* (
* 	{playback: {}, state: {}},
* 	{op1: str, arg1: any, op2: str, arg2: any},
* 	{one: str, two: str},
* 	{op2: func, collect: func},
* 	int,
* 	func,
* 	bool,
* 	str
*  )
*/
	var plbk 	= bigs.playback,
		state 	= bigs.state;

	var op1  = opsWith.op1,
		arg1 = opsWith.arg1,
		op2  = opsWith.op2,
		arg2 = opsWith.arg2;

	// var event1 = events.one,
	// 	event2 = events.two;
	var event1 = eventAsserts.event1,
		event2 = eventAsserts.event2,
		assert = eventAsserts.assertion

	var op2Check 	 = checks.op2,
		collectCheck = checks.collect;

	var thisText = "`." + op1 + "()` with " + arg1 + " then, on '" + event1 + "', calls " + op2 + "()` with " + arg2 + " and listens for '" + event2 + "'";
	describe( thisText, function () {

		testText = testText + ' ' + thisText;

		var arg2s, args, result;
		msTillAssert = msTillAssert || 0;

		var currentEvent = event1;



		beforeEach(function ( done ) {
			arg2s = [], args = [], result = { arg2s: arg2s, args: args };

			this.currentEvent = event1;
			this.result = result;
			this.testText = testText;

			// Called after the first operation using the first event
			var run1 = function ( one, two, three, four ) {

				// console.log( '====== outside 1:', two, three, four );

				var canOp2 = op2Check( plbk, result, event1 );

				if ( canOp2 ) {

					// console.log( '====== inside 1:', two, three, four );

					// Stop listening for this event
					state.emitter.off( event1, run1 );
					// Start of the second listener and then the second function
					state.emitter.on( event2, run2 );
					plbk[ op2 ]( arg2 );
				}

			};

			var run2 = function ( one, two, three, four ) {

				// console.log( '====== outside 2:', two, three, four );

				var canCollect = collectCheck( plbk, result, this.currentEvent );

				if ( canCollect ) {
					// I happen to know this will be the fragment some of the time
					// and, most of the time it'll be the argument I'm interested in.
					arg2s.push( arg2 );
					args.push( [ one, two, three, four ] );

					// console.log( '====== inside 2:', two, three, four );
				}

			};

			if ( reset ) { plbk.reset(); }

			state.emitter.removeAllListeners();
			state.emitter.on( event1, run1 );

			plbk[ op1 ]( arg1 );

			setTimeout( done, (msTillAssert - (msTillAssert/4)) )

		}, msTillAssert );


		afterEach(function () {
			// Just doing current event and `run2` in here wasn't working because
			// sometimes the first event does fire, leaving that listener hanging on
			// state.emitter.off( event1, run1 );
			// state.emitter.off( event2, run2 );
			state.emitter.removeAllListeners();
		});


		// This is here just to trigger the "before thing"
		it("it should...", function () {
			if ( assert ) { assert( plbk, this.result, (this.testText + "it should..."), this.currentEvent ) }
		});

	});  // End describe
};  // End jasmine.runComboTestWith()

