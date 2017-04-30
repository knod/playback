
jasmine.runSimpleTestWith = function ( bigs, opWith, evntAssertion, mayCollectCheck, msTillAssert, reset, testText ) {
/* ( {playback, state}, {op, arg}, {event, assertion}, func, int, func, bool, str )
* 
*/
	describe( "`." + opWith.op + "()` with " + opWith.arg + " and we collect data on '" + evntAssertion.event + "'", function () {

		msTillAssert = msTillAssert || 0;

		beforeEach(function ( done ) {

			this.testText = testText + ' ' + "`." + opWith.op + "()` with " + opWith.arg + " and we collect data on '" + evntAssertion.event + "'";
			this.lastText = "it should return..."

			var result = this.result = { arg2s: [], args: [] };
		
			this.whenRun = function ( one, two, three, four ) {

				// if ( evntAssertion.event === 'newWordFragment' ) { console.log(two, plbk.getIndex(), three); }
			
				if ( mayCollectCheck && mayCollectCheck( bigs.playback, result, evntAssertion.event ) ) {
					// I happen to know this will be the fragment some of the time
					// and, most of the time it'll be the argument I'm interested in.
					result.arg2s.push( two );
					result.args.push( [ one, two, three, four ] );
				}

			};

			// !!! WARNING !!!
			if ( reset ) { bigs.playback.reset(); }  // This is what's causing combo tests to pass when they shouldn't!
			// !!! WARNING !!!

			bigs.state.emitter.removeAllListeners();
			bigs.state.emitter.on( evntAssertion.event, this.whenRun );

			bigs.playback[ opWith.op ]( opWith.arg );

			setTimeout( done, (msTillAssert - (msTillAssert/4)) )
			// setTimeout( done, 275 )

		}, msTillAssert );
		// }, 300 );


		

		it( "it should return...", function () {
			console.log( this.result );
			bigs.state.emitter.off( evntAssertion.event, this.whenRun );
			this.testText = this.testText + ' ' + this.lastText;

			if ( evntAssertion.assertion ) { evntAssertion.assertion( bigs.playback, this.result, this.testText ) }

		});

	});  // End describe

};  // End jasmine.runSimpleTestWith()
