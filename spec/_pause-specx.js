
var runPauseTests = function ( type ) {

	describe("When Playback is", function() {

		// !!! WARNING: using `.restart()` instead of `.play()` because
		// of conflicts with beforeEach() calls

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
			// 	var changed = frag.replace(/[\n\r]+/g, '$$skip$$');
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

			describe("and it's `." + type + "()`d", function () {
				
				describe("at the start", function () {

					var all, instance1, instance2;
					beforeEach(function ( done ) {

						all = [];

						state.emitter.on( type + 'Begin', function ( plbk ) { instance1 = plbk; });
						state.emitter.on( type + 'Finish', function ( plbk ) { instance2 = plbk; });

						state.emitter.on( type + 'Finish', function ( plbk ) {
							// Give time for other weird things to happen
							setTimeout(function () { done() }, 100);
						});

						plab[ type ]();

					}, 150);


					it("should send the " + type + "'Begin' event with the Playback instance as an argument.", function() {
						expect( instance1 ).toBe( plab );
					});

					it("should send the " + type + "'Finish' event with the Playback instance as an argument.", function() {
						expect( instance2 ).toBe( plab );
					});

					it("should have sent 0 words.", function () {
						var result = [];
						expect( all ).toEqual( result );
					});

					describe("repeatedly", function () {

						var all, instance1, instance2;
						beforeEach(function ( done ) {

							all = [];

							state.emitter.on( type + 'Begin', function ( plbk ) { instance1 = plbk; });
							state.emitter.on( type + 'Finish', function ( plbk ) { instance2 = plbk; });

							state.emitter.on( type + 'Finish', function ( plbk ) {
								// Give time for other weird things to happen
								setTimeout(function () { done() }, 100);
							});

							plab[ type ]();
							plab[ type ]();

						}, 150);


						it("should have sent 0 words.", function () {
							var result = [];
							expect( all ).toEqual( result );
						});

					});  // end repeatedly

				});  // end at the start
				
				describe("in the middle", function () {

					describe("while already playing", function () {

						var all, instance1, instance2;
						beforeEach(function ( done ) {

							all = [];

							state.emitter.on( type + 'Begin', function ( plbk ) { instance1 = plbk; });
							state.emitter.on( type + 'Finish', function ( plbk ) { instance2 = plbk; });

							state.emitter.on('newWordFragment', function ( plbk, frag ) {
								all.push( frag );
								if ( frag === 'Delirious,' ) { plab[ type ](); }
							});

							state.emitter.on( type + 'Finish', function ( plbk ) {
								// Give time for other weird things to happen
								setTimeout(function () { done() }, 100);
							});

							plab.restart();

						}, 150);


						it("should send the " + type + "'Begin' event with the Playback instance as an argument.", function() {
							expect( instance1 ).toBe( plab );
						});

						it("should send the " + type + "'Finish' event with the Playback instance as an argument.", function() {
							expect( instance2 ).toBe( plab );
						});

						it("should only have sent some of the words.", function () {
							var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
							expect( all ).toEqual( result );
						});

						describe("repeatedly", function () {

							var all, instance1, instance2;
							beforeEach(function ( done ) {

								all = [];

								state.emitter.on( type + 'Begin', function ( plbk ) { instance1 = plbk; });
								state.emitter.on( type + 'Finish', function ( plbk ) { instance2 = plbk; });

								state.emitter.on('newWordFragment', function ( plbk, frag ) {
									all.push( frag );
									if ( frag === 'Delirious,' ) {
										plab[ type ]();
										plab[ type ]();
									}
								});

								state.emitter.on( type + 'Finish', function ( plbk ) {
									// Give time for other weird things to happen
									setTimeout(function () { done() }, 100);
								});

								plab.restart();

							}, 150);


							it("should only have sent some of the words.", function () {
								var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
								expect( all ).toEqual( result );
							});

						});  // end repeatedly

					});  // end while already playing

				});  // end in the middle

				describe("at the end", function () {

					describe("while already playing", function () {

						var all, instance1, instance2;
						beforeEach(function ( done ) {

							all = [];

							state.emitter.on( type + 'Begin', function ( plbk ) { instance1 = plbk; });
							state.emitter.on( type + 'Finish', function ( plbk ) { instance2 = plbk; });

							state.emitter.on( type + 'Finish', function ( plbk ) {
								// Give time for other weird things to happen
								setTimeout(function () { done() }, 100);
							});

							state.emitter.on('newWordFragment', function ( plbk, frag) {
								all.push( frag );
							});

							state.emitter.on( 'done', function () {
								plab[ type ]();
							});

							plab.restart();

						}, 150);


						it("should send the " + type + "'Begin' event with the Playback instance as an argument.", function() {
							expect( instance1 ).toBe( plab );
						});

						it("should send the " + type + "'Finish' event with the Playback instance as an argument.", function() {
							expect( instance2 ).toBe( plab );
						});

						it("should just send all the words.", function () {
							var result = forward;
							expect( all ).toEqual( result );
						});

						describe("repeatedly", function () {

							var all, instance1, instance2;
							beforeEach(function ( done ) {

								all = [];

								state.emitter.on( type + 'Begin', function ( plbk ) { instance1 = plbk; });
								state.emitter.on( type + 'Finish', function ( plbk ) { instance2 = plbk; });

								state.emitter.on( type + 'Finish', function ( plbk ) {
									// Give time for other weird things to happen
									setTimeout(function () { done() }, 100);
								});

								state.emitter.on('newWordFragment', function ( plbk, frag) {
									all.push( frag );
								});

								state.emitter.on( 'done', function () {
									plab[ type ]();
									plab[ type ]();
								});

								plab.restart();

							}, 150);


							it("should just send all the words.", function () {
								var result = forward;
								expect( all ).toEqual( result );
							});

						});  // end repeatedly

					});  // end while already playing

				});  // end at the end

			});  // End `.type()`

		});  // End "expected types"

	});  // End Playback

};  // End runPauseTests()

runPauseTests('pause');
runPauseTests('stop');
runPauseTests('close');
