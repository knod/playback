/* combos-runner.js
* 
* Rake testing at start of development to discover behavior
* other than single behavior and to reveal bugs, then later
* just regular tests.
* 
* TODO:
* - Allow setting for picking ranges of tests
* 	example desired result: run test #3 to test #100
*/

'use strict';

var runCombosFor = module.exports = function ( typeName, consoleArg, setUp, singleAssertionsFunc, altAssertionaterFunc, iterables ) {

	var allFailures = [];

	// Using fake clock now. Much faster;
	const realTimeout = setTimeout;
	const waitTime = 30;


	var count = 0;
	const runTests = function ( tester, funcsWithArg1, name, clock, originalResolve ) {

		const debugTests = false;

		const bigObjects 	= setUp(),
			plab 			= bigObjects.playback,
			emitter 		= bigObjects.emitter;

		// To help debugging when needed
		plab.id = count;
		count++;

		const singleAssertions 	= singleAssertionsFunc( plab ),
			altAssertionater 	= altAssertionaterFunc( plab );

		const runLastEvent  = require( './last-event.js' );
		const runFirstEvent = require( './first-event.js' );


		var increment = function ( indices ) {

			var two = indices.two, one = indices.one;

			// Loop 2
			let event2i = two.event + 1;
			let func2i 	= two.func;

			// Loop 1
			let event1i = one.event;
			let func1i 	= one.func;

			if (event2i >= two.events.length) {
				event2i = 0;  // reset
				func2i++;  // increment the next array
			}

			if (func2i >= two.funcs.length) {  // num functions
				func2i = 0;  // reset
				event1i++;  // increment the next array
			}

			if (event1i >= one.events.length) {
				event1i = 0;  // reset
				func1i++;  // increment the next array
			}

			var finished = false;
			// If top most level is done, all done
			if ( func1i >= one.funcs.length ) {  // num functions
				finished = true;
			} else {
				iterate( typeName + ':', func1i, event1i, func2i, event2i );  // iterate
			}  // end maybe repeat

			return finished;
		};  // End increment()



		function iterate ( label = '', func1Indx = 0, event1Indx = 0, func2Indx = 0, event2Indx = 0 ) {
			emitter.removeAllListeners();

			var assert1Obj, assert2Obj;

			// Loop 1
			const funcWArg1 = funcsWithArg1[ func1Indx ];

			const func1Name = funcWArg1.func;
			const arg1		= funcWArg1.arg;
			const evnt1 	= iterables.one.events[ event1Indx ];

			label = label + ' ' + func1Name + '(' + JSON.stringify( arg1 ) + ')' + ' + ' + evnt1
			// The single assertion for this combo. May end up matching up just fine.
			// Not currently checking if the match up is a false positive
			assert1Obj = singleAssertions[ func1Name ][ JSON.stringify( arg1 ) ][ evnt1 ];
			
			// Loop 2
			const funcWArg2 = iterables.two.funcs[ func2Indx ];

			const func2Name = funcWArg2.func;
			const arg2		= funcWArg2.arg;
			const evnt2 	= iterables.two.events[ event2Indx ];
			// The single assertion for this combo. May end up matching up just fine.
			// Not currently checking if the match up is a false positive
			assert2Obj 		= singleAssertions[ func2Name ][ JSON.stringify( arg2 ) ][ evnt2 ];

			label = label + ' > ' + func2Name + '(' + JSON.stringify( arg2 ) + ')' + ' + ' + evnt2 ;

			var runAssert = function ( result, assertNum, shouldSkip ) {
			// console.log('called');
			// `result`: First test is pre-asserted, so this could be just
			// the outcome being sent here
					
				// Run a test
				// tester.store? tester.complete? No, it's running a function
				tester.run( label, function tests ( done, skip ) {

					if ( !shouldSkip ) {

						// do stuff
						try {

							var outcome;

							if ( assertNum === 1 ) { outcome = assert1Obj.assertion( result ); }
							else {
								/* label, originalAssertion, result, debug */
								outcome = altAssertionater.assert( label, assert2Obj, result, debugTests );
							}

							if ( outcome.passed ) { done(); }
							else {
								// All return undefined currently
								var finalMsg = done( outcome.message );
								allFailures.push( label + ': ' + outcome.message );
							}

						} catch (err) {
							done( err, label );
						}  // end try

						if ( tester.report.total > 0 && tester.report.total % 676 === 0 ) {  // should get on switch to new test
							console.log('\n======== ' + label + ': ' + tester.report.total + ' tests done, ' + (Date.now() - startTime) + 'ms elapsed' );
						}

					} else {
						skip();
					}  // end if !shouldSkip

				})  // End tester.run()
				// Then increment and run this function again, testing again
				// or finish
				.then(() => {

					var finished = increment({
						one: {
							func: func1Indx, event: event1Indx,
							// funcs: funcsWithArg1, events: events1
							funcs: funcsWithArg1, events: iterables.one.events
						},
						two: {
							func: func2Indx, event: event2Indx,
							// funcs: funcsWithArg2, events: events2
							funcs: iterables.two.funcs, events: iterables.two.events
						}
					});

					if ( finished ) {
						tester.finish();

						var time = (new Date()).toString().split(' ')[4];
						var msg = 'End';
						if ( name ) { msg = msg + ' ' + name; }
						msg = msg + ': ' + time;
						console.log( msg );
						console.log( (Date.now() - startTime)/1000 + 's' );

						if ( originalResolve ) { originalResolve( tester.report ); }
					}

				});  // End .then()

			};  // End runAssert()


			// This should be mutated in `runLastEvent()`
			var result = { playback: null, arg2s: [] };

			var firstCalled = false;
			var afterFirstEvent = function () {
			// Need it in here for the variables. Called from first event as a callback.
				firstCalled = true;

				/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, bool ) */
				runLastEvent(
					result, bigObjects,
					{ op: func2Name, arg: arg2, event: evnt2 },
					false  // don't reset
				);
				// Once result has had a chance to fill up, run the test on it
				setTimeout( function () { runAssert( result, 2, false ); }, waitTime);	
			
			};  // End afterFirstEvent()

			// Trigger first event that will trigger the next event
			/* ( {playback: none, arg2s: []}, {playback, emitter}, {op, arg, event}, func, bool ) */
			runFirstEvent(
				{ playback: null, arg2s: [] }, bigObjects,
				{ op: func1Name, arg: arg1, event: evnt1 },
				afterFirstEvent,
				true  // reset
			);

			// In case the first event was never triggered
			setTimeout(function() {
				if ( !firstCalled ) { runAssert( result, 1, false ); }
			}, waitTime );  // the first one should have been triggered sooner

			if ( clock ) { clock.runAll(); }

		};  // End iterate()

		iterate( typeName + ':' );
	};  // End runTests()



	var fs 		= require('fs'),
		path 	= require('path');
	var pathToTestCore 	= '../testing-core.js';

	var startTime = 0;
	// Get the variables we need and start the ball rolling
	const start = function () {

		var ultimatePromise = null;

		// Useful for console and for file dirs and names
		startTime = Date.now();
		const timeID = new Date();
		const timeList = timeID.toString().split(' ');
		const time = timeList[4];
		console.log( 'Start:', time );
		const timePath = [ timeList[0], timeList[1], timeList[2], timeList[3], timeList[4] ].join('-') + '-' + typeName;

		// control `setTimeout`
		let lolex 	= require( 'lolex' );
		let clock 	= lolex.install( 0, ['setTimeout', 'clearTimeout'], 1000000000000 );

		// When `node tests/skip-combos.js` is called in the terminal it needs one
		// argument in order to run. An index number or 'all'.
		if ( typeof consoleArg === 'string' ) {

			const arg = consoleArg;

			// If we're supposed to run all combo tests that skip words
			if ( arg === 'all' ) {

				let dirPath = path.join( 'tests', 'results', timePath );
				fs.mkdirSync( dirPath );

				var promises = [];

				for (let funci = 0; funci < iterables.one.funcs.length; funci++) {

					promises.push(new Promise(function ( resolve, reject ) {
						// Do them async so they can all run in parallel
						realTimeout( function () {

							let funcObj  = iterables.one.funcs[ funci ];
							let name 	 = funcObj.func + '(' + JSON.stringify( funcObj.arg ) + ')';

							let filePath = path.join( 'tests', 'results', timePath, name ) + '.txt';
							let tester 	 = new require( pathToTestCore )( filePath );

							runTests( tester, [ funcObj ], name, clock, resolve );

						}, 0);
					}));
				}  // end for every function

				ultimatePromise = Promise.all( promises ).then( function resolveAll() {
					console.log( '\nTotal failures:', allFailures.length );
					for ( var faili = 0; faili < allFailures.length; faili++ ) {
						console.log( allFailures[faili] )
					}
				}, function rejectAll() {
					console.log('\nxxxxxxxxxxx\nxxxxxxxxxxx\nxxxxxxxxxxx\nPromise.all() Failed\nxxxxxxxxxxx\nxxxxxxxxxxx\nxxxxxxxxxxx\n')
				});

			} else {

				ultimatePromise = new Promise(function ( resolve, reject ) {

					const indx = parseInt( arg );
					const obj = iterables.one.funcs[ indx ];

					// If we've got a valid first argument, run with that argument
					if ( indx < iterables.one.funcs.length && obj ) {
						
						const tester = require( pathToTestCore )();

						const name = obj.func + '(' + JSON.stringify( obj.arg ) + ')';
						console.log( 'Testing with:', name );
						runTests( tester, [ obj ], name, clock, resolve );

					}

				});

				// If it wasn't 'all' and wasn't a valid first argument, don't do anything
			}  // end if 'all'
		} else {

			ultimatePromise = new Promise(function ( resolve, reject ) {
				// if no argument, just run all tests sequentially with output to the console
				const tester = require( pathToTestCore )();
				runTests( tester, iterables.one.funcs, ' ' + typeName + ' all sequentially', clock, resolve );
			});

		}  // end if called with an argument

		return ultimatePromise;
	};  // End start()

	return start();

};  // End runCombosFor()
