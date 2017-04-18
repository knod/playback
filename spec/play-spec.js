
xit("`.play()` and similar after end")
xit("`.play()` and similar in middle")
xit("`.pause()` and similar after end")
xit("`.play()` and similar after `.pause()` and similar")
xit("`.restart() from middle")
xit("stopped at the start and end - and in the middle is ___ed")

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

		describe("and `.play()` is called", function() {

			describe("at the start", function () {

				var all = [];
				beforeEach(function ( done ) {

					state.emitter.on('newWordFragment', function (playback, frag) {
						all.push( frag );
					});

					state.emitter.on('done', function () { done(); });

					plab.play();

				}, 1000);


				it("should send each word in the collection, one at a time through the 'newWordFragmet' event.", function() {
					var result = forward;
					expect( all ).toEqual( result );
				});

			});  // End play at start

			describe("while already playing", function () {

				var all = [];
				beforeEach(function ( done ) {

					state.emitter.on('newWordFragment', function (playback, frag) {
						all.push( frag );
						plab.play();
					});

					state.emitter.on('done', function () { done(); });

					plab.play();

				}, 1000);


				it("should just continue playing as per usual.", function() {
					var result = forward;
					expect( all ).toEqual( result );
				});

			});  // End play at end

			describe("in the middle", function () {

				var all = [];
				beforeEach(function ( done ) {

					plab.jumpTo( 9 );  // before listener

					state.emitter.on('newWordFragment', function (playback, frag) {
						all.push( frag );
					});

					state.emitter.on('done', function () { done(); });

					plab.play();

				}, 1000);


				it("should send each remaining word in the collection.", function() {
					var result = parsedText[3];
					expect( all ).toEqual( result );
				});

			});  // End play in the middle

			describe("in the middle of a sentence", function () {

				var all = [];
				beforeEach(function ( done ) {

					plab.jumpTo( 6 );  // before listener

					state.emitter.on('newWordFragment', function (playback, frag) {
						all.push( frag );
					});

					state.emitter.on('done', function () { done(); });

					plab.play();

				}, 1000);


				it("should send each remaining word in the collection.", function() {
					var result = [ 'come', 'back.' ].concat(parsedText[2]).concat(parsedText[3]);
					expect( all ).toEqual( result );
				});

			});  // End play in the middle of sentence

			describe("after jumpint to the last word", function () {

				var all = [];
				beforeEach(function ( done ) {

					plab.jumpTo( 50 );  // before listener

					state.emitter.on('newWordFragment', function ( playback, frag ) {
						all.push( frag );
					});

					state.emitter.on('done', function () { done(); });

					plab.play( true );

				}, 1000);

				xdescribe("should, if last word was one fragment long,", function () {
					xit("start from beginning", function () {
						var result = forward;
						expect( all ).toEqual( result );
					});
				});

				xdescribe("should, if last word was multiple fragments,", function () {

					beforeEach(function () { state.maxNumCharacters = 5 });

					it("finish the last word.", function() {
						var result = ['watt-', 'lebi-', 'rd?'];
						expect( all ).toEqual( result );
					});

				});

				// xit("should either start again from the beginning (i).", function() {
				// 	var result = [];
				// 	expect( all ).toEqual( result );
				// });

			});  // End play at the last word

			describe("after playing to the end", function () {

				var all = [];
				beforeEach(function ( done ) {

					var doneOnce = false;

					state.emitter.on('newWordFragment', function (playback, frag) {
						if ( doneOnce ) { all.push( frag ); }
					});

					state.emitter.on('done', function () {
						if ( !doneOnce ) { plab.play() }
						else { done(); }
					});

					plab.play();

				}, 1000);


				it("should not start again from the beginning.", function() {
					var result = [];
					expect( all ).toEqual( result );
				});

			});  // End play after play to end

		});  // End `.play()`

		describe("and `.start()` is called", function() {

			var all = [];
			beforeEach(function ( done ) {

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'wattlebird?' ) { done(); }
				});

				plab.start();

			}, 1000);


			it("should send each word in the collection, one at a time through the 'newWordFragmet' event.", function() {
				var result = forward;
				expect( all ).toEqual( result );
			});

		});  // End `.start()`

		describe("and `.restart()` is called after already getting to the end", function() {

			var all = [];
			var count = 0;
			beforeEach(function ( done ) {

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'wattlebird?' ) {
						if ( count >= 1 ) {
							done();
						} else {
							count++;
						}
					}
				});

				plab.play();
				setTimeout(plab.restart, 500)

			}, 1000);


			it("should send each word in the collection, one at a time through the 'newWordFragmet' event TWICE.", function() {
				var result = forward.slice(0).concat( forward.slice(0) );
				expect( all ).toEqual( result );
			});

		});  // End `.restart()`

		describe("and it's `.pause()`d in the middle", function () {

			var all = [];
			beforeEach(function ( done ) {

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'Delirious,' ) { plab.pause(); }
				});

				plab.play();

				setTimeout(function () { done() }, 500);

			}, 1000);


			it("should only have sent some of the words.", function () {
				var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
				expect( all ).toEqual( result );
			});

		});  // End `.pause()`

		describe("and it's `.stop()`d in the middle", function () {

			var all = [];
			beforeEach(function ( done ) {

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'Delirious,' ) { plab.stop(); }
				});

				plab.play();

				setTimeout(function () { done() }, 500);

			}, 1000);


			it("should only have sent some of the words.", function () {
				var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
				expect( all ).toEqual( result );
			});

		});  // End `.stop()`

		describe("and it's `.close()`d in the middle", function () {

			var all = [];
			beforeEach(function ( done ) {

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'Delirious,' ) { plab.close(); }
				});

				plab.play();

				setTimeout(function () { done() }, 500);

			}, 1000);


			it("should only have sent some of the words.", function () {
				var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
				expect( all ).toEqual( result );
			});

		});  // End `.close()`

	});  // End "expected types"

});  // End Playback
