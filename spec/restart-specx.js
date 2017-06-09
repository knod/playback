
describe("When Playback is", function() {

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

		describe("and `." + 'restart' + "()` is called", function() {

			describe("at the start", function () {

				var all, instance1, instance2, instance3, instance4;
				beforeEach(function ( done ) {

					all 	  = [];
					instance1 = null;
					instance2 = null;
					instance3 = null;
					instance4 = null;

					state.emitter.on( 'restart' + 'Begin', function (plbk) { instance1 = plbk; });
					state.emitter.on( 'restart' + 'Finish', function (plbk) { instance2 = plbk; });

					state.emitter.on('newWordFragment', function (plbk, frag) {
						all.push( frag );
						instance3 = plbk;
					});

					state.emitter.on('done', function (plbk) {
						instance4 = plbk;
						done();
					});

					plab.restart();

				}, 1000);


				it("should send the " + 'restart' + " 'Begin' event with the Playback instance as an argument.", function() {
					expect( instance1 ).toBe( plab );
				});

				it("should send the " + 'restart' + " 'Finish' event with the Playback instance as an argument.", function() {
					expect( instance2 ).toBe( plab );
				});

				it("should send each word in the collection, one at a time through the 'newWordFragmet' event.", function() {
					expect( all ).toEqual( forward );
				});

				it("should send the Playback instance as the first argument of the 'newWordFragmet' event.", function() {
					expect( instance3 ).toBe( plab );
				});

				it("should fire 'done' at the end with the argument being the Playback instance.", function () {
					expect( instance4 ).toBe( plab );
				});

			});  // End 'restart' at start

			describe("while already playing", function () {

				var all;
				beforeEach(function ( done ) {

					all = [];
					var restarted = false;

					state.emitter.on('newWordFragment', function (plbk, frag) {
						all.push( frag );
						if ( !restarted ) {
							restarted = true;
							plab.restart();
						}
					});

					state.emitter.on('done', function () { done(); });

					plab.play();

				}, 1000);


				it("should start from the beginning and go to the end.", function() {
					var result = ['Victorious,'].concat(forward)
					expect( all ).toEqual( result );
				});

			});  // End 'restart' while already playing

			describe("after jumping to the middle of a sentence", function () {

				var all = [];
				beforeEach(function ( done ) {

					plab.jumpTo( 9 );  // before listener

					state.emitter.on('newWordFragment', function (plbk, frag) {
						all.push( frag );
					});

					state.emitter.on('done', function () { done(); });

					plab.restart();

				}, 1000);


				it("should get each word from the start.", function() {
					var result = forward;
					expect( all ).toEqual( result );
				});

			});  // End 'restart' in the middle of a sentence

			describe("after jumping to the end of a sentence", function () {

				var all = [];
				beforeEach(function ( done ) {

					plab.jumpTo( 7 );  // before listener

					state.emitter.on('newWordFragment', function (plbk, frag) {
						all.push( frag );
					});

					state.emitter.on('done', function () { done(); });

					plab.restart();

				}, 1000);


				it("should get each word from the start.", function() {
					var result = forward;
					expect( all ).toEqual( result );
				});

			});  // End 'restart' in the end of sentence

			describe("after jumping to the last word", function () {

				describe("should, if last word was one fragment long,", function () {

					var all = [];
					beforeEach(function ( done ) {

						plab.jumpTo( 50 );  // before listener

						state.emitter.on('newWordFragment', function ( plbk, frag ) {
							all.push( frag );
						});

						state.emitter.on('done', function () { done(); });

						plab.restart();

					}, 1000);

					it("start from beginning.", function () {
						var result = forward;
						expect( all ).toEqual( result );
					});
				});

				describe("should, if last word was multiple fragments,", function () {

					var all = [];
					beforeEach(function ( done ) {

						state.stepper.maxNumCharacters = 5

						plab.jumpTo( 50 );  // before listener

						state.emitter.on('newWordFragment', function ( plbk, frag ) {
							all.push( frag );
						});

						state.emitter.on('done', function () { done(); });

						plab.restart();

					}, 1000);


					it("should get each word/fragment from the start.", function() {
						var result = [ 'Vict-', 'orio-', 'us,', 'you', 'brave', 'flag.', 'Del-', 'irio-', 'us,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'watt-', 'lebi-', 'rd?' ];
						expect( all ).toEqual( result );
					});

				});

			});  // End after jump to last word

			describe("after playing to the end", function () {

				var all = [];
				beforeEach(function ( done ) {

					var doneOnce = false;

					state.emitter.on('newWordFragment', function (plbk, frag) {
						if ( doneOnce ) { all.push( frag ); }
					});

					state.emitter.on('done', function () {
						if ( !doneOnce ) {
							doneOnce = true;
							plab.restart();
						}
						else { done(); }
					});

					plab.restart();

				}, 1000);


				it("it should start again from the beginning and go all the way to the end.", function() {
					expect( all ).toEqual( forward );
				});

			});  // End 'restart' after play to end

		});  // End `.'restart'()`

	});  // End "expected 'restart's"

});  // End Playback
