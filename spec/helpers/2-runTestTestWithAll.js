
jasmine.detectUnusualResultsWith = function ( bigs, opsWith, events, checks, msTillAssert, assert, reset, testText ) {
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
* 
* TODO:
* - ??: How to test if first test is never triggered? Doesn't that mean the assert
* 		never gets triggered? Why is the assert being triggered?
*/

	// describe( "`." + op1 + "()` with " + arg1 + " then, on '" + event1 + "', calls `." + op2 + "()` with " + arg2 + " and listens for '" + event2 + "'", function () {
	describe( ", for a test-test, `." + opsWith.op1 + "()` with " + opsWith.arg1 + " then, on '" + events.one + "', calls", function () {


		beforeEach(function () {

			console.log(plbk._currentAction)

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

			testText = testText + ", for a test-test, `." + op1 + "()` with " + arg1 + " then, on '" + event1 + "', calls";
			// console.log(testText);

			var frags, args, result;
			msTillAssert = msTillAssert || 0;

			// Called after the first operation using the first event
			var run1 = function ( one, two, three, four ) {

				// console.log( '====== outside 1:', two, three, four )
				// if ( event1 === 'resetBegin' ) { console.log( "what?" ) }  // never fires on 'play'
				var canOp2 = op2Check( plbk, result, event1 );

				if ( canOp2 ) {

					// console.log( '====== inside 1:', two, three, four )

					// Stop listening for this event
					state.emitter.off( event1, run1 );
					// // Start of the second listener and then the second function
					// currentEvent = event2;
					// state.emitter.on( currentEvent, run2 );
					// plbk[ op2 ]( arg2 );
					jasmine[ op2 ]( { playback: plbk, state: state }, null, false, testText, { event: event1, func: run1 } );
				}

			};


			// var run2 = function ( one, two, three, four ) {

			// 	// console.log( '====== outside 2:', two, three, four )

			// 	// var canCollect = collectCheck( plbk, result, currentEvent );

			// 	// if ( canCollect ) {
			// 	// 	// I happen to know this will be the fragment some of the time
			// 	// 	// and, most of the time it'll be the argument I'm interested in.
			// 	// 	frags.push( arg2 );
			// 	// 	args.push( [ one, two, three, four ] );

			// 		// console.log( '====== inside 2:', two, three, four )
			// 	// }

			// };


			// beforeEach(function ( done ) {
				frags = [], args = [], result = { frags: frags, args: args };
				this.result = result;

				plbk.reset();

				state.emitter.removeAllListeners();
				state.emitter.on( event1, run1 );

				plbk[ op1 ]( arg1 );

				// setTimeout( done, (msTillAssert - (msTillAssert/4)) )

			// }, msTillAssert );



			// // This is here just to trigger the "before thing"
			// it("it should...", function () {
			// 	state.emitter.off( currentEvent, run2 );
			// 	if ( assert ) { assert( plbk, result, currentEvent ) }
			// });
		});

		it("getting stuff to run", function () {
			console.log('anything')
			expect(5).toEqual(3);
		});

	});  // End describe

};  // End jasmine.detectUnusualResultsWith()




// // For browser test
// // Works just fine. Problem is with the jasmine tests
// state.stepper = { maxNumCharacters: 20 };
// state.delayer = { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
// state.playback.transformFragment = function ( frag ) { 	return frag; }
// state.playback.accelerate = function ( frag ) { 	return 1; };

// var run2 = function ( one, two, three, four ) {
// 	console.log( '~~~~2:', 'playing a second time' );
// 	state.emitter.removeAllListeners();
// }

// var run1 = function ( one, two, three, four ) {
// 	console.log( '~~~~1:', one._currentAction );
// 	state.emitter.removeAllListeners();
// 	state.emitter.on( 'playBegin', run2 );
// 	one.play( 'y', true );
// }

// state.emitter.removeAllListeners();
// plab.reset()
// state.emitter.on( 'playBegin', run1 );
// plab.play( 'x', true )
