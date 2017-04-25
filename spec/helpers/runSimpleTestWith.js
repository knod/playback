
// jasmine.runSimpleTestWith = function ( stuff, opsWith, toListenFor, checks, msTillAssert, assert, debug ) {
// /*
// * 
// * `op1()` - initial function called at start
// * `op2()` - function called later in the `toListenFor` event
// * `toListenFor` - String name of event that will be listened for
// * 	and in which `op2Check()` and `op2()` will be run
// * `op2Check()` - should return Bool, ready to trigger opt2 or not,
// * 	will be given the `Playback` instance and the current result
// * `msTillAssert` - how long to let the events run before running the
// * 	assertion
// * `assert()` - will be given the `Playback` instance and an object
// * 	containing 1) all fragments collected 2) lists of all lists of
// * 	arguments collected
// * `debug` - option to trigger debug logs (in here or in `op`s)
// * 
// * ??: Add 'doneCheck' for an optional function to check if it's time
// * 	to call done early?
// * 
// * TODO:
// * - Some way to record answers only after second argument is called (
// * 	if there is one)
// */
// 	var plbk 	= stuff.playback,
// 		state 	= stuff.state;

// 	var op1  = opsWith.op1,
// 		arg1 = opsWith.arg1,
// 		op2  = opsWith.op2,
// 		arg2 = opsWith.arg2;

// 	var op2Check 	 = checks.op2,
// 		collectCheck = checks.collect;

// 	describe( "`." + op1 + "()` with " + arg1 + " then, on '" + toListenFor + "', calls `." + op2 + "()` with " + arg2, function () {

// 		var frags, args, result;
// 		msTillAssert = msTillAssert || 0;

// 		var whenRun = function ( arg1, arg2, arg3, arg4 ) {

// 			if ( debug ) { console.log( '====== outside:', arg2, arg3, arg4 ) }

// 			var doOp2 = false;
// 			if ( op2Check ) { doOp2 = op2Check( plbk, result ) }

// 			if ( !op2 || collectCheck( plbk, result ) ) {
// 				// I happen to know this will be the fragment some of the time
// 				// and, most of the time it'll be the argument I'm interested in.
// 				frags.push( arg2 );
// 				args.push( [ arg1, arg2, arg3, arg4 ] );

// 				if ( debug ) { console.log( '====== inside:', arg2, arg3, arg4 ) }
// 			}

// 			if ( doOp2 ) {
// 				if ( op2 ) { plbk[ op2 ]( arg2, debug ); }
// 			}

// 		};  // End whenRun


// 		beforeEach(function ( done ) {
// 			frags = [], args = [], result = { frags: frags, args: args };

// 			plbk.reset();

// 			state.emitter.on( toListenFor, whenRun );

// 			plbk[ op1 ]( arg1, debug );

// 			setTimeout( done, (msTillAssert - (msTillAssert/4)) )

// 		}, msTillAssert );


// 		it("it should...", function () {
// 			state.emitter.off( toListenFor, whenRun );
// 			if ( assert ) { assert( plbk, result, toListenFor ) }
// 		});

// 	});  // End describe

// };  // End jasmine.runSimpleTestWith()



jasmine.runSimpleTestWith = function ( bigs, opWith, evnt, mayCollectCheck, msTillAssert, assert, debug ) {
/* ( {playback, state}, {op, arg}, str, func, int, func, bool )
* 
*/

	var plbk 	= bigs.playback,
		state 	= bigs.state;

	var op 	= opWith.op,
		arg = opWith.arg;


	describe( "`." + op + "()` with " + arg + " and we collect data on '" + evnt + "'", function () {

		var frags, args, result;
		msTillAssert = msTillAssert || 0;

		var whenRun = function ( arg1, arg2, arg3, arg4 ) {

			if ( mayCollectCheck && mayCollectCheck( plbk, result, evnt ) ) {
				// I happen to know this will be the fragment some of the time
				// and, most of the time it'll be the argument I'm interested in.
				frags.push( arg2 );
				args.push( [ arg1, arg2, arg3, arg4 ] );
			}

		};


		beforeEach(function ( done ) {
			frags = [], args = [], result = { frags: frags, args: args };

			plbk.reset();

			state.emitter.on( evnt, whenRun );

			plbk[ op ]( arg, debug );

			setTimeout( done, (msTillAssert - (msTillAssert/4)) )

		}, msTillAssert );


		it("it should return...", function () {
			state.emitter.off( evnt, whenRun );
			if ( assert ) { assert( plbk, result ) }
		});

	});  // End describe

};
