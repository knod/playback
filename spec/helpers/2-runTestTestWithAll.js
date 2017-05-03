
var handler, thisText;
var result, whenRun;
var evnt1, evnt2;

var lastText = "it should return...";

var count = 1;

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
	thisText = ", for a test-test, `." + opsWith.op1 + "()` with " + opsWith.arg1 + " then, on '" + events.one + "', calls";

	// describe( "`." + op1 + "()` with " + arg1 + " then, on '" + events.one + "', calls `." + op2 + "()` with " + arg2 + " and listens for '" + events.two + "'", function () {
	describe( thisText, function () {

		testText 	 = testText + ' ' + thisText;
		msTillAssert = msTillAssert || 0;

		evnt1 = events.one;

		// console.log(testText);

		// Called after the first operation using the first event
		handler = function ( one, two, three, four ) {

			if ( events.one === 'newWordFragment' ) { console.log( '1:', count, one.getIndex(), two, opsWith.op1, events.one ); }
			count++;

			var canOp2 = checks.op1( bigs.playback, null, events.one );  // !!! No `result` here

			if ( canOp2 ) {

				// console.log( '====== inside 1:', two, three, four )

				// Stop listening for this event
				// bigs.state.emitter.off( events.one, handler );
				bigs.state.emitter.removeAllListeners();  // Just to be sure
				console.log('calling 2')
				// Need: ( bigs, assertsOverride, reset, testText )
				jasmine[ opsWith.op2 ]( bigs, null, reset, testText );
			}

		};


		// move everything into here


		bigs.state.emitter.on( events.one, handler );

		bigs.playback[ opsWith.op1 ]( opsWith.arg1 );





		it( lastText, function inIt( done ) {

			// if ( eventAssertion !== null ) { console.log( 'event in "it()":', count, eventAssertion.event ); }
			// else { console.log( 'event in "it()":', count, null ); }

			bigs.state.emitter.removeAllListeners();

			result = { arg2s: [], args: [] };
			count++;

			whenRun = function ( one, two, three, four ) {

				console.log( '2:', opWith.op );
				if ( evnt1 ) { console.log( '2:', one.getIndex(), two ) }
				// console.log( '2:' )
				// console.trace( count, 'event === null', eventAssertion === null );
				count++;
				// if ( eventAssertion.event === 'newWordFragment' ) { console.log( '2:', one.getIndex() ); }
				if ( mayCollectCheck && mayCollectCheck( bigs.playback, result, eventAssertion.event ) ) {
					// I happen to know this will be the fragment some of the time
					// and, most of the time it'll be the argument I'm interested in.
					result.arg2s.push( two );
					result.args.push( [ one, two, three, four ] );
				}

			};

			// playback reset and events removed in `beforeEach()` in originating script
			// Can't include `beforeEach()` in loop

			if ( reset ) { bigs.playback._reset(); }  // ??: Needed?
			// console.log( eventAssertion );
			bigs.state.emitter.on( eventAssertion.event, whenRun );

			bigs.playback[ opWith.op ]( opWith.arg );

			setTimeout( function () {

				// bigs.state.emitter.off( eventAssertion.event, whenRun );
				testText = testText + ' ' + lastText;
				// console.log( 'count:', count, '; result:', result)

					if ( eventAssertion.assertion ) { eventAssertion.assertion( bigs.playback, result, testText, eventAssertion.event ) }

				// Can't do any of these. It's not matter of time because the same
				// exact pattern happens no matter the amount of time I delay. Is it
				// a matter of execustion order.

				// !!! This inidicates a serious problem somewhere, but I don't know how to find it

				// ??: Needed?
				thisText = null;
				lastText = "it should return...";

				// ??: Needed?
				result 	= null;
				handler = null;
				whenRun = null;
				evnt1 	= null;
				evnt2 	= null;

				// ??: Needed?
				bigs 			= null;
				opWith 			= null;
				eventAssertion 	= null;
				mayCollectCheck 	= null;
				msTillAssert 	= null;
				reset 			= null;
				testText 		= null;

				done();

			}, msTillAssert - (msTillAssert/4) )

		}, msTillAssert );



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
