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
		/* ( Str, Str ) -> PlaybackManager
		* 
		* For all 'play'-like activities
		*/
			// "play" will always be forward. "rewind" can be play, but with "prev".
			plab._incrementors = [0, 0, 1];

			if ( eventName ) plab.trigger( eventName + 'Begin', [plab] );
			if ( !plab._isPlaying ) {
				plab._isPlaying = true;
				plab._loop( [0, 0, 0], false );  // Show the current word first, then it will move on
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
		/* ( Str, Str, Func ) -> PlaybackManager
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



		// ========== FF and REWIND (arrow keys and other) ========== \\

		plab._oneJumpNoDelay = function ( changes ) {
			plab._wasPlaying = plab._isPlaying;
			plab._pause( null );

			plab._skipWhitespace = true;
			plab.once( changes );
			plab._skipWhitespace = false;

			if ( plab._wasPlaying ) { plab._play( null ); }
			return plab;
		};  // End plab._oneJumpNoDelay()

		plab.jumpWords = function ( numToJump ) {
			numToJump = numToJump || 1;
			plab._oneJumpNoDelay( [0, numToJump, 0] );
			return plab;
		};
		plab.jumpSentences = function ( numToJump ) {
			numToJump = numToJump || 1;
			plab._oneJumpNoDelay( [numToJump, 0, 0] );
			return plab;
		};

		// plab.nextWord = function () {
		// 	plab._oneJumpNoDelay( [0, 1, 0] );
		// 	return plab;
		// };
		// plab.nextSentence = function() {
		// 	plab._oneJumpNoDelay( [1, 0, 0] );
		// 	return plab;
		// };

		// plab.prevWord = function () {
		// 	plab._oneJumpNoDelay( [0, -1, 0] );
		// 	return plab;
		// };
		// plab.prevSentence = function() {
		// 	plab._oneJumpNoDelay( [-1, 0, 0] );
		// 	return plab;
		// };


		// var oldFastTime;
		// var notStartedYet = true;
		// plab.rewind = function ( increaseSpeedFunc ) {
		// 	// affect number of words jumped, or affect amount of delay

		// 	if (notStartedYet) {
				
		// 	}

		// 	plab.trigger( 'rewindLoopBegin', [plab] );

		// 	plab._pause( null );

		// 	if () {
		// 		increaseSpeedFunc = increaseSpeedFunc || defaultSpeedFunc;
		// 		var num = increaseSpeedFunc( plab._incrementors[1] );
		// 		plab.jumpWords( num )
		// 		setTimeout( plab.rewind( increaseSpeedFunc ), 200 );
		// 	}

		// 	plab.trigger( 'rewindLoopFinish', [plab] );

		// 	return plab;
		// };  // end Plab.rewind()
		// plab.fastForward = function ( increaseSpeedFunc ) {};  // end plab.fastForward()



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



		// ========== ONCE ========== \\

		plab.once = function ( incrementors ) {

			plab.trigger( 'onceBegin', [plab] );
			plab._loop( incrementors, true);
			plab.trigger( 'onceFinish', [plab] );

			return plab;
		};  // End plab.once()



		// ================================
		// LOOPS
		// ================================

        plab._signOf = function ( num ) {
            return typeof num === 'number' ? num ? num < 0 ? -1 : 1 : num === num ? num : NaN : NaN;
        }

        plab._sendProgress = function () {
        /* () -> Playback
        * 
        * Just trigger the progress event with the right progress
        */
	        plab.trigger( 'progress', [plab, plab.getProgress()] );
	        return plab;
        };  // End plab._sendProgress()

        plab._finishIfDone = function () {
        /* () -> Bool
		* 
		* If done, trigger 'done' event, stop the loop, and
		* prepare for a possible restart. Otherwise save not
		* done.
        */
        	// Stop if we've reached the end
        	if ( plab.getProgress() === 1 ) {
        		plab.done = true;
        		plab.trigger( 'done', [plab] );
        		plab.stop();
        	} else {
        		plab.done = false;
        	}

        	return plab.done;
        };  // End plab._finishIfDone()

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


        plab._loop = function( incrementors, noDelay ) {
        // https://jsfiddle.net/d1mgadeo/2/

			plab.trigger( 'loopBegin', [plab] );
    	    
			// If, for example, calling the loop from the loop, just keep
			// going in the same global direction. Allows for stuff like
			// `._play()` to show current word, then keep going
			incrementors = incrementors || plab._incrementors;  // ??: Too indirect?
			var frag 	 = plab._stepper.getFragment( incrementors ),
				// "$@skip@$" will be skipped. Can use transform for that and
				// other stuff (like paragraph or space symbols)
				frag 	 = state.playback.transformFragment( frag );

			// Skip 1 word in the right direction if needed
			var skipVector = plab._skipDirection( incrementors, frag );  // [int, int, int] of -1, 0, or 1

    	    if ( skipVector !== null ) {

				plab.trigger( 'loopSkip', [plab, frag] );
    	    	plab._loop( skipVector, noDelay );
    	    
    	    } else {

				if ( !noDelay ) {
					// How long this word will remain on the screen before changing
					var delay = plab._delayer.calcDelay( frag );  // TODO: for fastforward, modify speed
					plab._timeoutID = setTimeout( plab._loop, delay );
				}

				// Send fragment after setTimeout so that you can easily
				// pause on "newWordFragment". Feels weird, though.
				plab.trigger( 'newWordFragment', [plab, frag] );
				plab.trigger( 'loopFinish', [plab] );

    	    }  // end if skip fragment or not skip fragment

			plab._sendProgress();
			plab._finishIfDone();

			return plab;  // Return timeout id instead?
        };  // End plab._loop()



        // ============== DO IT ============== \\
		plab._init()

		return plab;
	};  // End Playback() -> {}

    return Playback;
}));
