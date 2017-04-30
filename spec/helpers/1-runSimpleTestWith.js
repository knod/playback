
'use strict';

// ---- Before all so it won't accumulate in `describe` ---- \\
var thisText;
var lastText = "it should return...";

var count = 1;
var result, whenRun;

var prevThis, currentThis;

// ---- inner `describe` ---- \\
jasmine.runSimpleTestWith = function ( bigs, opWith, eventAssertion, mayCollectCheck, msTillAssert, reset, testText ) {
/* ( {playback, state}, {op, arg}, {event, assertion}, func, int, func, bool, str )
* 
*/
	thisText = "`." + opWith.op + "()` with " + opWith.arg + " and we collect data on '" + eventAssertion.event + "'";

	describe( thisText, function () {

		testText 	 = testText + ' ' + thisText;
		msTillAssert = msTillAssert || 0;


		it( lastText, function inIt( done ) {

			// if ( eventAssertion !== null ) { console.log( 'event in "it()":', count, eventAssertion.event ); }
			// else { console.log( 'event in "it()":', count, null ); }

			bigs.state.emitter.removeAllListeners();



			result = { arg2s: [], args: [] };
			console.log( 'first:', count, result.arg2s );
			count++;

			whenRun = function ( one, two, three, four ) {

				// if ( eventAssertion !== null ) { console.log( eventAssertion.event ) }
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

				// console.log( 'second:', count, result.arg2s );
				// Not async
				// try {
					if ( eventAssertion.assertion ) { eventAssertion.assertion( bigs.playback, result, testText ) }
				// } catch ( err ) {
				// 	done( err );
				// 	return;
				// }

				// Can't do any of these. It's not matter of time because the same
				// exact pattern happens no matter the amount of time I delay. Is it
				// a matter of execustion order.

				// !!! This inidicates a serious problem somewhere, but I don't know how to find it

				// // ??: Needed?
				// thisText = null;
				// lastText = "it should return...";

				// // ??: Needed?
				// result 	= null;
				// whenRun = null;

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

	});  // End describe

};  // End jasmine.runSimpleTestWith()
