
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

		describe("and it's `.pause()`d in the middle", function () {

			var all, instance1, instance2;
			beforeEach(function ( done ) {

				all = [];

				state.emitter.on('pauseBegin', function (playback) { instance1  = playback; });
				state.emitter.on('pauseFinish', function (playback) { instance2  = playback; });

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'Delirious,' ) { plab.pause(); }
				});

				state.emitter.on( 'pauseFinish', function (playback) {
					// Give time for other weird things to happen
					setTimeout(function () { done() }, 100);
				});

				plab.play();

			}, 200);


			it("should send the 'pauseBegin' event with the Playback instance as an argument.", function() {
				expect( instance1 ).toBe( plab );
			});

			it("should send the 'pauseFinish' event with the Playback instance as an argument.", function() {
				expect( instance2 ).toBe( plab );
			});

			it("should only have sent some of the words.", function () {
				var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
				expect( all ).toEqual( result );
			});

		});  // End `.pause()`

		describe("and it's `.stop()`d in the middle", function () {

			var all, instance1, instance2;
			beforeEach(function ( done ) {

				all = [];

				state.emitter.on('stopBegin', function (playback) { instance1  = playback; });
				state.emitter.on('stopFinish', function (playback) { instance2  = playback; });

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'Delirious,' ) { plab.stop(); }
				});

				state.emitter.on( 'stopFinish', function (playback) {
					// Give time for other weird things to happen
					setTimeout(function () { done() }, 100);
				});

				plab.play();

			}, 200);


			it("should send the 'stopBegin' event with the Playback instance as an argument.", function() {
				expect( instance1 ).toBe( plab );
			});

			it("should send the 'stopFinish' event with the Playback instance as an argument.", function() {
				expect( instance2 ).toBe( plab );
			});

			it("should only have sent some of the words.", function () {
				var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
				expect( all ).toEqual( result );
			});

		});  // End `.stop()`

		describe("and it's `.close()`d in the middle", function () {

			var all, instance1, instance2;
			beforeEach(function ( done ) {

				all = [];

				state.emitter.on('closeBegin', function (playback) { instance1  = playback; });
				state.emitter.on('closeFinish', function (playback) { instance2  = playback; });

				state.emitter.on('newWordFragment', function (playback, frag) {
					all.push( frag );
					if ( frag === 'Delirious,' ) { plab.close(); }
				});

				state.emitter.on( 'closeFinish', function (playback) {
					// Give time for other weird things to happen
					setTimeout(function () { done() }, 100);
				});

				plab.play();

			}, 200);


			it("should send the 'closeBegin' event with the Playback instance as an argument.", function() {
				expect( instance1 ).toBe( plab );
			});

			it("should send the 'closeFinish' event with the Playback instance as an argument.", function() {
				expect( instance2 ).toBe( plab );
			});

			it("should only have sent some of the words.", function () {
				var result = [ 'Victorious,', 'you','brave', 'flag.', 'Delirious,' ];
				expect( all ).toEqual( result );
			});

		});  // End `.close()`

	});  // End "expected types"

});  // End Playback
