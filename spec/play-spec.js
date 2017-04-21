
xit("`.play()` and similar after `.pause()` and similar")
xit("stopped at the start and end - and in the middle is ___ed")
xit("jump, at 'startOnce', jump again, see what happens, esp if was playing before")

/* Functions to test
.process
.getProgress
.getLength
.getIndex
.restart
.play
.pause
.stop
.close
.togglePlayPause
.jumpWords
.jumpSentences
.nextWord
.nextSentence
.prevWord
.prevSentence
.jumpTo
.rewind
.fastForward
*/

/* Events to test
'restartBegin', 'restartFinish'
'playBegin', 'playFinish'
'pauseBegin', 'pauseFinish'
'stopBegin', 'stopFinish'
'closeBegin', 'closeFinish'
'resumeBegin', 'resumeFinish'
'onceBegin', 'onceFinish'
'rewindBegin', 'rewindFinish'
'fastForwardBegin', 'fastForwardFinish'
'loopBegin', 'loopFinish'
'done'
'progress'
'loopSkip'
'newWordFragment'
*/

/* State properties to test
At start
state.stepper
state.delayer

At runtime
state.emitter
state.emitter.trigger()
state.playback
state.playback.accelerate()
state.playback.transformFragment()
state.playback.calcDelay()
state.playback.checkRepeat()
*/


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

				var all, instance1, instance2, instance3, instance4;
				beforeEach(function ( done ) {

					all 	  = [];
					instance1 = null;
					instance2 = null;
					instance3 = null;
					instance4 = null;

					state.emitter.on('playBegin', function (playback) { instance1 = playback; });
					state.emitter.on('playFinish', function (playback) { instance2 = playback; });

					state.emitter.on('newWordFragment', function (playback, frag) {
						all.push( frag );
						instance3 = playback;
					});

					state.emitter.on('done', function (playback) {
						instance4 = playback;
						done();
					});

					plab.play();

				}, 1000);


				it("should send the 'playBegin' event with the Playback instance as an argument.", function() {
					expect( instance1 ).toBe( plab );
				});

				it("should send the 'playFinish' event with the Playback instance as an argument.", function() {
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
					expect( all ).toEqual( forward );
				});

			});  // End play while already playing

			describe("after jumping to the middle of a sentence", function () {

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

			});  // End play in the middle of a sentence

			describe("after jumping to the end of a sentence", function () {

				var all = [];
				beforeEach(function ( done ) {

					plab.jumpTo( 7 );  // before listener

					state.emitter.on('newWordFragment', function (playback, frag) {
						all.push( frag );
					});

					state.emitter.on('done', function () { done(); });

					plab.play();

				}, 1000);


				it("should send each remaining word in the collection.", function() {
					var result = [ 'back.' ].concat(parsedText[2]).concat(parsedText[3]);
					expect( all ).toEqual( result );
				});

			});  // End play in the end of sentence

			describe("after jumping to the last word", function () {

				describe("should, if last word was one fragment long,", function () {

					var all = [];
					beforeEach(function ( done ) {

						plab.jumpTo( 50 );  // before listener

						state.emitter.on('newWordFragment', function ( playback, frag ) {
							all.push( frag );
						});

						state.emitter.on('done', function () { done(); });

						plab.play();

					}, 1000);


					it("start from beginning", function () {
						var result = forward;
						expect( all ).toEqual( result );
					});
				});

				describe("should, if last word was multiple fragments,", function () {

					var all = [];
					beforeEach(function ( done ) {

						state.stepper.maxNumCharacters = 5

						plab.jumpTo( 50 );  // before listener

						state.emitter.on('newWordFragment', function ( playback, frag ) {
							all.push( frag );
						});

						state.emitter.on('done', function () { done(); });

						plab.play();

					}, 1000);


					it("finish the last word.", function() {
						var result = ['watt-', 'lebi-', 'rd?'];
						expect( all ).toEqual( result );
					});

				});

			});  // End after jump to last word

			describe("after playing to the end", function () {

				var all = [];
				beforeEach(function ( done ) {

					var doneOnce = false;

					state.emitter.on('newWordFragment', function (playback, frag) {
						if ( doneOnce ) { all.push( frag ); }
					});

					state.emitter.on('done', function () {
						if ( !doneOnce ) {
							doneOnce = true;
							plab.play();
						}
						else { done(); }
					});

					plab.play();

				}, 1000);


				it("it should start again from the beginning.", function() {
					expect( all ).toEqual( forward );
				});

			});  // End play after play to end

		});  // End `.play()`

		// // Add back in if added back in to module
		// describe("and `.start()` is called", function() {

		// 	var all, instance1, instance2;
		// 	beforeEach(function ( done ) {

		// 		all = [];

		// 		state.emitter.on('startBegin', function (playback) { instance1  = playback; });
		// 		state.emitter.on('startFinish', function (playback) { instance2  = playback; });

		// 		state.emitter.on('newWordFragment', function (playback, frag) {
		// 			all.push( frag );
		// 			if ( frag === 'wattlebird?' ) { done(); }
		// 		});

		// 		plab.start();

		// 	}, 1000);


		// 	it("should send the 'startBegin' event with the Playback instance as an argument.", function() {
		// 		expect( instance1 ).toBe( plab );
		// 	});

		// 	it("should send the 'startFinish' event with the Playback instance as an argument.", function() {
		// 		expect( instance2 ).toBe( plab );
		// 	});

		// 	it("should send each word in the collection, one at a time through the 'newWordFragmet' event.", function() {
		// 		expect( all ).toEqual( forward );
		// 	});

		// });  // End `.start()`

		// describe("and `.restart()` is called after already getting to the end", function() {

		// 	var all, instance1, instance2;
		// 	beforeEach(function ( done ) {

		// 		all = [];

		// 		state.emitter.on('restartBegin', function (playback) { instance1  = playback; });
		// 		state.emitter.on('restartFinish', function (playback) { instance2  = playback; });

		// 		state.emitter.on('newWordFragment', function (playback, frag) {
		// 			all.push( frag );
		// 		});

		// 		var doneOnce = false;
		// 		state.emitter.on( 'done', function (playback) {
		// 			if ( !doneOnce ) {
		// 				doneOnce = true;
		// 				plab.restart();
		// 			} else {
		// 				done();
		// 			}
		// 		});

		// 		plab.play();
		// 	});  // End beforeEach()


		// 	it("should send the 'restartBegin' event with the Playback instance as an argument.", function() {
		// 		expect( instance1 ).toBe( plab );
		// 	});

		// 	it("should send the 'restartFinish' event with the Playback instance as an argument.", function() {
		// 		expect( instance2 ).toBe( plab );
		// 	});

		// 	it("should send each word in the collection, one at a time through the 'newWordFragmet' event TWICE.", function() {
		// 		var result = forward.slice(0).concat( forward.slice(0) );
		// 		expect( all ).toEqual( result );
		// 	});

		// });  // End `.restart()`

		// describe("and it's `.pause()`d in the middle", function () {

		// 	var all, instance1, instance2;
		// 	beforeEach(function ( done ) {

		// 		all = [];

		// 		state.emitter.on('pauseBegin', function (playback) { instance1  = playback; });
		// 		state.emitter.on('pauseFinish', function (playback) { instance2  = playback; });

		// 		state.emitter.on('newWordFragment', function (playback, frag) {
		// 			all.push( frag );
		// 			if ( frag === 'Delirious,' ) { plab.pause(); }
		// 		});

		// 		state.emitter.on( 'pauseFinish', function (playback) {
		// 			// Give time for other weird things to happen
		// 			setTimeout(function () { done() }, 100);
		// 		});

		// 		plab.play();

		// 	}, 200);


		// 	it("should send the 'pauseBegin' event with the Playback instance as an argument.", function() {
		// 		expect( instance1 ).toBe( plab );
		// 	});

		// 	it("should send the 'pauseFinish' event with the Playback instance as an argument.", function() {
		// 		expect( instance2 ).toBe( plab );
		// 	});

		// 	it("should only have sent some of the words.", function () {
		// 		var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
		// 		expect( all ).toEqual( result );
		// 	});

		// });  // End `.pause()`

		// describe("and it's `.stop()`d in the middle", function () {

		// 	var all, instance1, instance2;
		// 	beforeEach(function ( done ) {

		// 		all = [];

		// 		state.emitter.on('stopBegin', function (playback) { instance1  = playback; });
		// 		state.emitter.on('stopFinish', function (playback) { instance2  = playback; });

		// 		state.emitter.on('newWordFragment', function (playback, frag) {
		// 			all.push( frag );
		// 			if ( frag === 'Delirious,' ) { plab.stop(); }
		// 		});

		// 		state.emitter.on( 'stopFinish', function (playback) {
		// 			// Give time for other weird things to happen
		// 			setTimeout(function () { done() }, 100);
		// 		});

		// 		plab.play();

		// 	}, 200);


		// 	it("should send the 'stopBegin' event with the Playback instance as an argument.", function() {
		// 		expect( instance1 ).toBe( plab );
		// 	});

		// 	it("should send the 'stopFinish' event with the Playback instance as an argument.", function() {
		// 		expect( instance2 ).toBe( plab );
		// 	});

		// 	it("should only have sent some of the words.", function () {
		// 		var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
		// 		expect( all ).toEqual( result );
		// 	});

		// });  // End `.stop()`

		// describe("and it's `.close()`d in the middle", function () {

		// 	var all, instance1, instance2;
		// 	beforeEach(function ( done ) {

		// 		all = [];

		// 		state.emitter.on('closeBegin', function (playback) { instance1  = playback; });
		// 		state.emitter.on('closeFinish', function (playback) { instance2  = playback; });

		// 		state.emitter.on('newWordFragment', function (playback, frag) {
		// 			all.push( frag );
		// 			if ( frag === 'Delirious,' ) { plab.close(); }
		// 		});

		// 		state.emitter.on( 'closeFinish', function (playback) {
		// 			// Give time for other weird things to happen
		// 			setTimeout(function () { done() }, 100);
		// 		});

		// 		plab.play();

		// 	}, 200);


		// 	it("should send the 'closeBegin' event with the Playback instance as an argument.", function() {
		// 		expect( instance1 ).toBe( plab );
		// 	});

		// 	it("should send the 'closeFinish' event with the Playback instance as an argument.", function() {
		// 		expect( instance2 ).toBe( plab );
		// 	});

		// 	it("should only have sent some of the words.", function () {
		// 		var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
		// 		expect( all ).toEqual( result );
		// 	});

		// });  // End `.close()`

	});  // End "expected types"

});  // End Playback
