
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

	// describe( "`." + op1 + "()` with " + arg1 + " then, on '" + events.one + "', calls `." + op2 + "()` with " + arg2 + " and listens for '" + events.two + "'", function () {
	describe( ", for a test-test, `." + opsWith.op1 + "()` with " + opsWith.arg1 + " then, on '" + events.one + "', calls", function () {


		// beforeEach(function () {


			// var plbk = bigs.playback,
			// 	state 	= bigs.state;

			console.log(bigs.playback._currentAction)

			// var op1  = opsWith.op1,
			// 	arg1 = opsWith.arg1,
			// 	op2  = opsWith.op2,
			// 	arg2 = opsWith.arg2;  // not needed

			// var event1 = events.one,
			// 	event2 = events.two;  // not needed

			// var op2Check 	 = checks.op2,
			// 	collectCheck = checks.collect;  // not needed

			testText = testText + ", for a test-test, `." + opsWith.op1 + "()` with " + opsWith.arg1 + " then, on '" + events.one + "', calls";
			// console.log(testText);

			// var frags, args, result;  // not needed
			// msTillAssert = msTillAssert || 0;  // not needed

			// Called after the first operation using the first event
			var handler = function ( one, two, three, four ) {
				if ( events.one === 'newWordFragment' ) { console.log( '1:', one.getIndex() ); }
				// console.log( '====== outside 1:', two, three, four )
				// if ( events.one === 'resetBegin' ) { console.log( "what?" ) }  // never fires on 'play'
				var canOp2 = checks.op1( bigs.playback, null, events.one );  // !!! No `result` here

				if ( canOp2 ) {

					// console.log( '====== inside 1:', two, three, four )

					// Stop listening for this event
					// bigs.state.emitter.off( events.one, handler );
					bigs.state.emitter.removeAllListeners();  // Just to be sure

					// // Start of the second listener and then the second function
					// currentEvent = events.two;
					// bigs.state.emitter.on( currentEvent, handler2 );
					// bigs.playback[ opsWith.op2 ]( opsWith.arg2 );
					

					// Need: ( bigs, assertsOverride, reset, testText )
					jasmine[ opsWith.op2 ]( bigs, null, reset, testText );
				}

			};


			// var handler2 = function ( one, two, three, four ) {

			// 	// console.log( '====== outside 2:', two, three, four )

			// 	// var canCollect = checks.collect( bigs.playback, result, currentEvent );

			// 	// if ( canCollect ) {
			// 	// 	// I happen to know this will be the fragment some of the time
			// 	// 	// and, most of the time it'll be the argument I'm interested in.
			// 	// 	frags.push( opsWith.arg2 );
			// 	// 	args.push( [ one, two, three, four ] );

			// 		// console.log( '====== inside 2:', two, three, four )
			// 	// }

			// };


			// beforeEach(function ( done ) {
				// frags = [], args = [], result = { frags: frags, args: args };
				// this.result = result;

				// bigs.playback.reset();

				// bigs.state.emitter.removeAllListeners();
				bigs.state.emitter.on( events.one, handler );

				bigs.playback[ opsWith.op1 ]( opsWith.arg1 );

				// setTimeout( done, (msTillAssert - (msTillAssert/4)) )

			// }, msTillAssert );



			// // This is here just to trigger the "before thing"
			// it("it should...", function () {
			// 	bigs.state.emitter.off( currentEvent, handler2 );
			// 	if ( assert ) { assert( bigs.playback, result, currentEvent ) }
			// });
		// });  // end beforeEach()

	});  // end describe

};  // End jasmine.detectUnusualResultsWith()




// // For browser test
// // Works just fine. Problem is with the jasmine tests
// state.stepper = { maxNumCharacters: 20 };
// state.delayer = { slowStartDelay: 0, _baseDelay: 1, calcDelay: function () { return 1; } };  // Speed it up a bit for testing
// state.playback.transformFragment = function ( frag ) { 	return frag; }
// state.playback.accelerate = function ( frag ) { 	return 1; };

// var handler2 = function ( one, two, three, four ) {
// 	console.log( '~~~~2:', 'playing a second time' );
// 	state.emitter.removeAllListeners();
// }

// var handler = function ( one, two, three, four ) {
// 	console.log( '~~~~1:', one._currentAction );
// 	state.emitter.removeAllListeners();
// 	state.emitter.on( 'playBegin', handler2 );
// 	one.play( 'y', true );
// }

// state.emitter.removeAllListeners();
// plab.reset()
// state.emitter.on( 'playBegin', handler );
// plab.play( 'x', true )
