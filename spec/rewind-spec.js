
xit("`.rewind()` at start, middle, end, then other stuff is called, then rewind is called again")

describe("When Playback is", function() {
// Includes `.play()`, `.start()`, `.restart()`, `.pause()`, `.stop()`, `.close()`

	var Playback = require( '../dist/Playback.js' );
	var EventEmitter = require( '../node_modules/wolfy87-eventemitter/EventEmitter.js' );

	var plab, state, parsedText, forward;


	beforeEach(function () {

		state = {};

		state.emitter = new EventEmitter();  // Now has events
		state.stepper = { maxNumCharacters: 20 };
		state.delayer = { slowStartDelay: 0, _baseDelay: 1 };  // Speed it up a bit for testing
		state.playback = {};
		// state.playback.transformFragment = function ( frag ) {
		// 	var changed = frag.replace(/[\n\r]+/g, '$@skip@$');
		// 	return changed;
		// }
		state.playback.transformFragment = function ( frag ) {
			return frag;
		}

		parsedText = [
			[ 'Victorious,', 'you','brave', 'flag.' ],
			[ 'Delirious,', 'I', 'come', 'back.' ],
			[ '\n' ],
			[ 'Why,', 'oh', 'wattlebird?' ]
		];

		forward = parsedText[0].concat(parsedText[1].concat(parsedText[2]).concat(parsedText[3]));

		plab = Playback( state );
		plab.process( parsedText );
	});


	describe("created with valid values", function() {

		describe("and `.rewind()` is called", function () {

			describe("at the start having just", function() {

				describe("`.play()`ed", function() {

					var all = [];
					var rewinding = false;
					beforeEach(function ( done ) {

						state.emitter.on('newWordFragment', function (playback, frag) {
							all.push( frag );
						})

						plab.play();
						plab.rewind();

						setTimeout(done, 500);

					}, 2000);

					it("should send the first word three times (play, rewind, play again), then send words, moving forwards, till the end.", function() {
						var result = ['Victorious,', 'Victorious,'].concat( forward );
						expect( all ).toEqual( result );
					});

				});  // End while playing
				
				xdescribe("paused/stopped", function() {

				});  // End while paused

			});  // End at start

			describe("in the middle while", function() {
				
				describe("`.play()`ing", function() {

					var all = [];
					var rewinding = false;
					beforeEach(function ( done ) {

						state.emitter.on('newWordFragment', function (playback, frag) {
							// Before so we don't catch 'come' in here
							if ( rewinding ) { all.push( frag ); }
							else if ( frag === 'come' ) {
								rewinding = true;
								plab.rewind();
							}
						});

						plab.play();

						// Keep going so we can see if we do start playing from the start again
						setTimeout(done, 3000);

					}, 3500);


					it("should send some words in the collection, going backwards, one at a time through the 'newWordFragmet' event, then forwards till the end.", function() {
						var result = ['I', 'Delirious,'].concat(parsedText[0].slice(0).reverse()).concat(forward);
						expect( all ).toEqual( result );
					});

				});  // End while playing
				
				describe("paused", function() {

					var all = [];
					var rewinding = false;
					beforeEach(function ( done ) {

						state.emitter.on('newWordFragment', function (playback, frag) {
							// Before so we don't catch 'come' in here
							if ( rewinding ) { all.push( frag ); }
							else if ( frag === 'come' ) {
								plab.pause();
								rewinding = true;
								plab.rewind();
							}
						});

						plab.play();

						// Keep going so we can see if we do start playing from the start again
						setTimeout(done, 3000);

					}, 3500);


					it("should send some words in the collection, going backwards, one at a time through the 'newWordFragmet' event and stop when it gets to the beginning.", function() {
						var result = ['I', 'Delirious,'].concat(parsedText[0].slice(0).reverse());
						expect( all ).toEqual( result );
					});

				});  // End while paused

			});  // End at middle

			describe("at the end", function() {

				describe("after `.play()`ing completes ('stops' when done)", function() {

					var all = [];
					var rewinding = false;
					beforeEach(function ( done ) {

						state.emitter.on('done', function () {
							// Don't stop when done after rewinding to make sure that it doesn't keep going
							if ( !rewinding ) {
								rewinding = true;
								plab.rewind();
							}
						});

						state.emitter.on('newWordFragment', function (playback, frag) {
							if ( rewinding ) { all.push( frag ); }
						});

						plab.play( true );

						// Keep going so we can see if we do start playing from the start again
						setTimeout(done, 3000);

					}, 3500);


					it("should send each word in the collection, going backwards, one at a time through the 'newWordFragmet' event and stop when it gets to the beginning.", function() {
						var result = ['oh', 'Why,'].concat(parsedText[2].slice(0).reverse().concat(parsedText[1].slice(0).reverse()).concat(parsedText[0].slice(0).reverse()));
						expect( all ).toEqual( result );
					});

				});  // End after finished

			});  // End at end

		});  // End `.rewind()`

	});  // End "expected types"

});  // End Playback


// describe("a NON-STRING value for a first argument,", function() {
// 	it("should throw a TYPE error", function() {
// 	// expect( function() {plab( undefined, 2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( null,      2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( true,      2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( false,     2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( {},        2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( [],        2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( 0,         2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( 1,         2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( 3,         2 )} ).toThrowError( TypeError, /The first argument/ );
// 	// expect( function() {plab( -3,        2 )} ).toThrowError( TypeError, /The first argument/ );
// 	});
// });
