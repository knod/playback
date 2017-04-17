/* playback.js
* 
* Transmits (or passes back) fragments from a 'stepper' object. Uses a 'delayer'
* to determine time between each transmition/call. Can be
* started (`play()`), move forward, backward, pause, and
* jump to positions. Can move by sentence, fragment, and word.
* 
* Started with
* https://github.com/jamestomasino/read_plugin/blob/master/Read.js
* 
* TODO;
* - Speed up with long duration of ff or rewind
* - `.rewind()` base speed as state property
* 
* DEVELOPMENT NOTES/GUIDES:
* - Where possible, return Playback so functions can be chained
* - Always send Playback as the first argument to events to
* 	stay consistent.
*/

(function (root, playbackFactory) {  // root is usually `window`
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define( ['@knod/prose-stepper', '@knod/string-time'], function (stepper, delayer) {
        	return root.Playback = playbackFactory( stepper, delayer );
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but only CommonJS-like
        // environments that support module.exports, like Node.
        module.exports = playbackFactory( require('@knod/prose-stepper'), require('@knod/string-time') );
    } else {
        // Browser globals
        root.Playback = playbackFactory( root.ProseStepper, root.StringTime );
    }
}(this, function ( DefaultStepper, DefaultDelayer ) {

	"use strict";

	var Playback = function ( state, StepperConstr, DelayerConstr ) {
	/* ( {}, [ {}, {} ] ) -> Playback
	* 
	*/
		var plab = {};


		// ============== SET UP VALUES ============== \\

		plab._init = function () {

			var RealStepperConstr = StepperConstr || DefaultStepper,
				RealDelayerConstr = DelayerConstr || DefaultDelayer;

			plab._stepper = RealStepperConstr( state.stepper );
			plab._delayer = RealDelayerConstr( state.delayer );

			plab.done 		  = false;

			plab._timeoutID   = null;
			plab._isPlaying   = false;
			plab._wasPlaying  = false;

			// // For rewinding, ffding, resuming
			// plab._direction  	= 'forward';
			// plab._prevDirection = 'backward';

			// Moving around
			plab._jumping 	 	= false;
			plab._incrementors 	= [0, 0, 1];  // This is a regular 1 step forward move

			return plab;
		};  // End plab._init()


		plab.process = function ( sentenceArray ) {
			plab._stepper.process( sentenceArray );
			return plab;
		};


		// plab.setState = function ( newState ) { stepper.setState( newState.stepper ) };



		// ============== PASSED ON DIRECTLY FROM STEPPER ============== \\

		plab.getProgress = function () {
			return plab._stepper.getProgress();
		};  // End plab.gesProgress()

		plab.getLength = function () {
			return plab._stepper.getLength();
		};  // End plab.gesLength()

		plab.getIndex = function () {
			return plab._stepper.getIndex();
		};  // End plab.getIndex()



		// ============== EVENT EMITTING ============== \\

		plab.trigger = function ( eventName, argsArray ) {
			state.emitter.trigger( eventName, argsArray );
		};



		// ============== FLOW CONTROL ============== \\

		plab._restart = function ( eventName ) {

			if ( eventName ) plab.trigger( eventName + 'Begin', [plab] );

			plab._pause(null);

			plab.done = false;
			// Just put the index at the right place
			plab._stepper.restart();
			plab.play();  // Also sends "play" events

			if ( eventName ) plab.trigger( eventName + 'Finish', [plab] );

			return plab;
		};  // End plab._restart()
		
		plab.start = function () {
			plab._restart( 'start' );
			return plab;
		};  // End plab.start()

		plab.restart = function () {
			plab._restart( 'restart' );
			return plab;
		};



		// ??: 'playing' event should go off every time, but if we're
		// restarting without pausing first (pausing would trigger visual
		// feedback about pausing), then should the event not happen? That
		// means the "play" image won't fire off on restarts, even though
		// it feels like it should always fire on play.
		plab._play = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'play'-like activities
		*/
			// "play" will always be forward
			// ??: Here so can be changed ever event?
			plab._incrementors = [0, 0, 1];
			// notStartedAccYet = true;  // Temp

			if ( eventName ) plab.trigger( eventName + 'Begin', [plab] );
			
			plab._direction = 'forward';

			if ( !plab._isPlaying ) {
				plab._isPlaying = true;
				// plab._loop( [0, 0, 0], null, null );  // Show the current word first, then it will move on
				plab._loop( [0, 0, 0], null, function () { return 1; } );  // Show the current word first, then it will move on
			}
			if ( eventName ) plab.trigger( eventName + 'Finish', [plab] );

			return plab;
		};  // End plab._play()

		plab.play = function () {
			if ( plab.done ) { plab.restart(); }  // Comes back here after restarted
			else { plab._play( 'play' ); }
			return plab;
		};  // End plab.play()




		plab._pause = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'pause'-like activities
		*/ 
			if ( eventName ) plab.trigger( eventName + 'Begin', [plab] );

			clearTimeout( plab._timeoutID );  // Needed? Maybe more immediate.
			plab._isPlaying = false;
			// Start slow when next go through loop (restore countdown)
			plab._delayer.resetSlowStart();

			if ( eventName ) plab.trigger( eventName + 'Finish', [plab] );

			return plab;
		};  // End plab._pause()

		// Names for "pause":
		plab.pause = function () {
			plab._pause( 'pause' );
			return plab;
		};
		plab.stop = function () {
			plab._pause( 'stop' );
			return plab;
		};
		plab.close = function () {
			plab._pause( 'close' );
			return plab;
		};

		plab.togglePlayPause = function () {
			if (plab._isPlaying) { plab.pause(); }
			else { plab.play(); }
			return plab;
		};



		// ========== RESUME ========== \\

		plab._resumeIfWasPlaying = function () {
		/* () -> Bool
		* 
		* Returns true if resumed playing, false if stopped
		* completely
		*/
			plab.trigger( 'resumeBegin', [plab] );

			// notStartedAccYet = true;  // Not accelerating currently

			plab._pause( null );

			if ( plab._wasPlaying ) { plab._play(); }  // this is the key difference from _pause()

			plab.trigger( 'resumeFinish', [plab] );

			return plab._wasPlaying;
		};  // End plab._resumeIfWasPlaying()



		// ========== NAVIGATE (arrow keys and other) ========== \\

		plab._oneJumpNoDelay = function ( changes ) {
			plab._wasPlaying = plab._isPlaying;
			plab._pause( null );

			plab._skipWhitespace = true;
			plab.once( changes );
			plab._skipWhitespace = false;

			plab._resumeIfWasPlaying();
			return plab;
		};  // End plab._oneJumpNoDelay()

		plab.jumpWords = function ( numToJump ) {
			numToJump = numToJump || 1;
			
			if ( numToJump < 0 ) { plab._direction = 'back'; }
			else { plab._direction = 'forward'; }

			plab._oneJumpNoDelay( [0, numToJump, 0] );
			return plab;
		};
		plab.jumpSentences = function ( numToJump ) {
			numToJump = numToJump || 1;
			
			if ( numToJump < 0 ) { plab._direction = 'back'; }
			else { plab._direction = 'forward'; }

			plab._oneJumpNoDelay( [numToJump, 0, 0] );
			return plab;
		};

		plab.nextWord = function () { return plab.jumpWords( 1 ); };
		plab.nextSentence = function() { return plab.jumpSentences( 1 ); };
		plab.prevWord = function () { return plab.jumpWords( -1 ); };
		plab.prevSentence = function() { return plab.jumpSentences( -1 ); };



		// =================== SCRUBBER BAR (probably) =================== \\

		plab.jumpTo = function ( jumpToObj ) {
		// Argument to pass in? 'previous sentence'? 'next sentence'?
		// 'section of document'? An index number?
		// ??: How to give useful feedback from this?
			if ( !plab._jumping ) {
				plab._wasPlaying = plab._isPlaying;
				plab._pause( null );
				plab._jumping = true;
			}

			var oldIndex = plab.getIndex(),
				newIndex = jumpToObj.index;
			plab.once( [0, newIndex - oldIndex, 0] );

			return plab;
		};  // End plab.jumpTo()

		plab.disengageJumpTo = function () {
			if ( plab._wasPlaying ) { plab._play( null ); }
			plab._jumping = false;
			return plab;
		};



		// ========== FF and REWIND (arrow keys and other) ========== \\

		// var oldAccTime, notStartedAccYet = true, defaultDelay = 300;
		plab.accelerate = function ( frag ) {

		// // Less delay as time goes on
		// 	// When first run
		// 	if ( notStartedAccYet ) {
		// 		oldAccTime 		 = Date.now();
		// 		notStartedAccYet = false;
		// 	}

		// 	var elapsed = Date.now() - oldAccTime,
		// 		elapsedIterations = elapsed/defaultDelay;
		// 	elapsedIterations = Math.max( 1, elapsed );
		// 	elapsedIterations = Math.max( 60, elapsed );

		// 	// (1/x) + 200

		// 	// var delay = defaultDelay - elapsed;
		// 	// console.log(delay, elapsed, elapsed/20, (elapsed - elapsed/20))
		// 	// xxx(15 - 0)/(60 - 10) = 0.3
		// 	// iteration 1: 0, iteration last: 15
		// 	// delay start 1: 60, delay end: 10

		// 	// TODO: Actually check if state delay is 0 or above
		// 	var baseDelay;
		// 	if ( state._baseAccelerationDelay >= 0 ) {
		// 		baseDelay = state._baseAccelerationDelay;
		// 	} else {
		// 		baseDelay = defaultDelay;
		// 	}

		// 	var delay = baseDelay + (elapsedIterations * -0.15);
		// 	delay = Math.max( 5, delay )

		// 	// return delay;

			return 20;
		};

		plab.rewind = function ( accelerateFunc ) {
		/* ( [ func ] ) -> Playback
		* 
		* Goes backward, acceleration controled by `accelerateFunc()` or
		* `state` or internal equivalent. (`accelerateFunc()` takes precedent,
		* with next fallback being `state.playback.accelerate()`, then internal
		* `.accelerate()`)
		* Default currently just a steady speed.
		* 
		* TODO: What happens when rewind and then `.jumpWord()` in the middle?
		*/
			plab.trigger( 'rewindBegin', [plab] );

			plab._wasPlaying = plab._isPlaying;
			plab._pause( null );

			plab._incrementors = [0, -1, 0];
			plab._direction = 'back';

			var accelerateFunc = accelerateFunc || state.playback.accelerate || plab.accelerate;

			plab._loop( null, null, accelerateFunc );  // Show the current word first, then it will move on

			plab.trigger( 'rewindFinish', [plab] );

			return plab;
		};  // end plab.rewind()


		plab.fastForward = function ( accelerateFunc ) {
		/* ( [ func ] ) -> Playback
		* 
		* Goes forward, acceleration controled by `accelerateFunc()` or
		* `state` or internal equivalent. (`accelerateFunc()` takes precedent,
		* with next fallback being `state.playback.accelerate()`, then internal
		* `.accelerate()`)
		* 
		* Default currently just a steady speed.
		*/
			plab.trigger( 'fastForwardBegin', [plab] );

			plab._wasPlaying = plab._isPlaying;
			plab._pause( null );

			plab._incrementors = [0, 1, 0];
			plab._direction = 'forward';

			var accelerateFunc = accelerateFunc || state.playback.accelerate || plab.accelerate;

			plab._loop( null, null, accelerateFunc );  // Show the current word first, then it will move on

			plab.trigger( 'fastForwardFinish', [plab] );

			return plab;
		};  // end plab.fastForward()



		// ========== ONCE ========== \\

		plab.once = function ( incrementors ) {

			plab.trigger( 'onceBegin', [plab] );
			plab._loop( incrementors, 0, function () { return 0; });
			plab.trigger( 'onceFinish', [plab] );

			return plab;
		};  // End plab.once()



		// =================== DONE =================== \\

		plab._finishIfDone = function () {
        /* () -> Bool
		* 
		* If done, trigger 'done' event, stop the loop, and
		* prepare for a possible restart. Otherwise save not
		* done.
        */
        	var isDone;

        	// Stop if we've reached the end
        	if ( plab._direction !== 'back' && plab.getProgress() === 1 ) {
        		isDone = true;
        	} else if ( plab._direction === 'back' && plab.getIndex() === 0 ) {
        		// Check if resumed playing. If not resumed, done.
        		isDone = !plab._resumeIfWasPlaying();  
	    	}

	        if ( isDone ) {
				plab.done = true;
				plab.stop();
				plab.trigger( 'done', [plab] );
	        } else {
	        	plab.done = false;
	        }

        	return plab.done;
		};  // End plab._finishIfDone()

		// state.emitter.on( 'done', function () { plab._finish(); });



		// ================================
		// LOOPS
		// ================================

        plab._signOf = function ( num ) {
            return typeof num === 'number' ? num ? num < 0 ? -1 : 1 : num === num ? num : NaN : NaN;
        }

        plab._emitProgress = function () {
        /* () -> Playback
        * 
        * Just trigger the progress event with the right progress
        */
	        plab.trigger( 'progress', [plab, plab.getProgress()] );
	        return plab;
        };  // End plab._emitProgress()

        plab._skipDirection = function ( incrementors, frag ) {
        /* ( [ int, int, int ], str ) -> [ int, int, int ] of 0, 1, or -1
        * 
        * "$@skip@$" will be skipped. If you want fragments of certain
        * types to be skipped, detect and transform them with
        * `state.playback.transform()` into "$@skip@$".
        */
			var vector = null;

			// // DEBUGGING
			// // Bug crops up when switching word lengths. Moreso at short lengths
			// // May be to do with reseting the word to its start when word length is changed
			// if( !chars ) { console.log('frag:', frag, '; chars:', chars, '; position:', plab._stepper.position); }
			// var noWhitespace = chars.replace( plab._whitespaceRegex, '' );

			// Skip our special symbols ( "$@skip@$" )
			if ( frag === '$@skip@$' ) {

				vector = [0, 0, 0];  // Need to be able to manipulate an array

				if ( incrementors[0] !== 0 ) {
					vector[0] = plab._signOf(incrementors[0]);

				} else if( incrementors[1] !== 0 ) {
					vector[1] = plab._signOf(incrementors[1]);

				} else if( incrementors[2] !== 0 ) {
					vector[2] = plab._signOf(incrementors[2]);

				// For when play passes in [0, 0, 0]. ??: Does anything else ever do this?
				// We're going to have to skip in some direction or we'll never get anywhere
				} else {
					// This is going to be a problem if we ever to [0, 0, 0] on whitespace
					// while rewinding
					vector = [0, 0, 1];  // ??: Always true?
				}
			}

			return vector;
        };  // End plab._skipDirection()


        plab._loop = function( incrementors, numRepeats, delayFunc ) {
		/* ( [ [int, int, int], int, func ] )
		* 
		* `incrementors` will only be used for the first loop. loop calls itself
		* with `null` as the first argument. Used with `._play()` and `skipVector`.
		* `numRepeats`: `null` or `undefined` means "until done".
		* `delayFunc`: Arguments give are the new fragment and the Playback instance.
		* 
		* All three arguments are optional
		* 
		* Uses the `stepper` to get a new fragment based on `incrementors`, then
		* sends out an event with the fragment. Calls itself `numRepeats` number
		* of times, pausing between each fragment for an amount of time returned
		* by `delayFunc` or its default delay calculations
		*/
			plab.trigger( 'loopBegin', [plab] );

			var done = plab._finishIfDone();
			if ( done ) { return plab; }
    	    
			// Allows for stuff like `._play()` to show current word, then keep going
			incrementors = incrementors || plab._incrementors;

			var frag = plab._stepper.getFragment( incrementors ),
				// "$@skip@$" will be returned to skip the fragment
				frag = state.playback.transformFragment( frag );

			// Skip 1 word in the right direction if needed
			var skipVector = plab._skipDirection( incrementors, frag );  // [int, int, int] of -1, 0, or 1

    	    if ( skipVector !== null ) {

				plab.trigger( 'loopSkip', [plab, frag] );
    	    	plab._loop( skipVector, numRepeats, delayFunc );  // Don't decrease repeats
    	    
    	    } else {

    	    	// How long this word fragment will remain on the screen before changing
    	    	var delayFunc = delayFunc || plab._delayer.calcDelay,
    	    		delay 	  = delayFunc( frag );
    	    	// TODO: change string-time library - parameters for `.calcDelay()`
    	    	// so that can pass in `frag` and `plab`

    	    	// ??: Could do `if ( delay !== 0 )`, but does that conflate?

				// Don't loop again if 0 repeats desired
				if ( numRepeats !== 0 ) {

					if ( numRepeats !== null && numRepeats !== undefined ) {
						numRepeats -= 1;  // Count down the number of loops left
					}

					plab._timeoutID = setTimeout( function () {
						plab._loop( null, numRepeats, delayFunc );
					}, delay );

				}

				// Send fragment after setTimeout so that you can easily
				// pause on "newWordFragment" - pause kills the current
				// `._timeoutID`. Feels weird, though.
				plab.trigger( 'newWordFragment', [plab, frag] );
				plab.trigger( 'loopFinish', [plab] );

    	    }  // end if skip fragment or not skip fragment

			plab._emitProgress();

			// Need one at the end too?
			// plab._finishIfDone();

			return plab;  // Return timeout id instead?
        };  // End plab._loop()



        // ============== DO IT ============== \\
		plab._init()

		return plab;
	};  // End Playback() -> {}

    return Playback;
}));
