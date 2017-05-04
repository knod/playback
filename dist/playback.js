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
* - ??: Should `.restart()` trigger 'playBegin' and 'playFinish'
* - Send event name with event
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

			plab.done 		= false;
			plab._timeoutID = null;

			plab._persistentAction 	= 'pause';  // either 'play' or 'pause'
			plab._currentAction 	= 'pause';
			plab._direction 		= 'forward';
			plab._incrementors 		= [0, 0, 1];  // This is a regular 1 step forward move

			plab._queue = [];
			plab._queueRunning = false;

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

		plab._trigger = function ( eventName, argsArray ) {
			state.emitter.trigger( eventName, argsArray );
		};



		// ============== FLOW CONTROL ============== \\

		plab._queueAdd = function ( funcName, args ) {
			// in caller: var args = Array.prototype.slice.call( arguments );
			plab._queue.push( { name: funcName, arguments: args } );
			if ( !plab._queueRunning ) { plab._queueNext(); }
			return plab;
		};  // End plab._queueAdd()

		plab._queueNext = function () {
		// Everything that can be put on a queue _must_ call
		// this when it's done
			plab._queueRunning = true;
			if ( plab._queue.length === 0 ) {

				plab._queueRunning = false;

			} else {

				var pair 		= plab._queue.shift(),
					proxyName 	= '_' + pair.name + 'Proxy',
					func 		= plab[ proxyName ];

				func.apply( func, pair.arguments );
			}

		};  // End plab._queueNext()

		plab._queueFinish = function () {
			plab._queueRunning = false;
			if ( plab._queue.length !== 0 ) {
				plab._queueNext();
			}
		};  // End plab._queueFinish()


		plab._reset = function () {
		/* () -> Playback
		* 
		* Returns to initial values
		*/
			plab._pause( null );

			plab.done 		= false;
			plab._timeoutID = null;

			plab._persistentAction 	= 'pause';  // either 'play' or 'pause'
			plab._currentAction 	= 'pause';
			plab._direction 		= 'forward';
			plab._incrementors 		= [0, 0, 1];  // This is a regular 1 step forward move

			// Just put the index at the right place
			plab._stepper.restart();

			return plab;
		};  // End plab._reset()

		plab.reset = function () {
		/* () -> Playback
		* 
		* Returns to initial values, sends first fragment
		*/
			plab._trigger( 'resetBegin', [plab] );
			// console.log( 'reset begins' );
			plab._reset();
			plab.once( 0 );  // Send first fragment
			plab._trigger( 'resetFinish', [plab] );
			// console.log( 'reset finished' );
			return plab;
		};

		plab._restart = function ( eventName ) {

			if ( eventName ) { plab._trigger( eventName + 'Begin', [plab] ); }
			plab._reset();
			plab._play();  // Also sends "play" events
			if ( eventName ) { plab._trigger( eventName + 'Finish', [plab] ); }

			return plab;
		};  // End plab._restart()
		
		// // Bring back if it becomes useful again
		// plab.start = function () {
		// 	plab._persistentAction = 'play';
		// 	plab._restart( 'start' );
		// 	return plab;
		// };  // End plab.start()

		plab.restart = function () {
			plab._persistentAction = 'play';
			plab._restart( 'restart' );
			return plab;
		};


		var count = 1;
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
			if ( debug ) {
				console.log('count:', count, eventName);
			}  // DEBUGGING
			count++;  // DEBUGGING

			// "play" will always be forward
			// ??: Here so can be changed no matter the event?
			plab._incrementors = [0, 0, 1];

			if ( eventName ) { plab._trigger( eventName + 'Begin', [plab] ); }
			// console.log( 'began playing eventName:', eventName );  // DEBUGGING

			plab._direction = 'forward';

			if ( plab._currentAction !== 'play' ) {  // ??: could possibly just pause first instead
				plab._currentAction = 'play';
				// Get current word first time, then get following fragments forever after
				plab._loop( [0, 0, 0], null, null );  // Show the current word first, then it will move on
			}

			if ( eventName ) { plab._trigger( eventName + 'Finish', [plab] ); }

			return plab;
		};  // End plab._play()


		var debug;  // DEBUGGING
		plab.play = function ( frag, d ) {
			
			debug = d;  // DEBUGGING
			if ( debug ) {
				console.log( 'playing. done?:', plab.done );
			}  // DEBUGGING

			plab._persistentAction = 'play';

			if ( plab.done ) { plab.restart(); }  // Comes back here after restarted
			else { plab._play( 'play' ); }
			return plab;
		};  // End plab.play()

		// ??: Include `.open()` as a proxy for `.play()`?
		// ??: Also `.start()`?




		plab._pause = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'pause'-like activities
		*/ 
			if ( eventName ) { plab._trigger( eventName + 'Begin', [plab] ); }

			clearTimeout( plab._timeoutID );  // Needed? Maybe more immediate.
			plab._currentAction = 'pause';
			// Start slow when next go through loop (restore countdown)
			plab._delayer.resetSlowStart();

			if ( eventName ) { plab._trigger( eventName + 'Finish', [plab] ); }

			return plab;
		};  // End plab._pause()

		// Names for "pause":
		plab.pause = function () {
			plab._persistentAction = 'pause';  // ??: 'pause'? or 'stop'? or 'stopped' (and 'playing')
			plab._pause( 'pause' );
			return plab;
		};
		plab.stop = function () {  // ??: plab._persistentAction = 'pause';
			plab._persistentAction = 'pause';
			plab._pause( 'stop' );
			return plab;
		};
		plab.close = function () {  // ??: plab._persistentAction = 'pause';
			plab._persistentAction = 'pause';
			plab._pause( 'close' );
			return plab;
		};


		plab.togglePlayPause = function () {
			// Use `._persistentAction` instead?
			if ( plab._currentAction !== 'pause' ) { plab.pause(); }
			else { plab.play(); }
			return plab;
		};



		// ========== RESUME ========== \\

		plab.resume = function () {
		/* () -> Bool
		* 
		* Returns true if resumed playing, false if stopped
		* completely
		*/
			plab._trigger( 'resumeBegin', [plab] );

			// notStartedAccYet = true;  // Not accelerating currently

			plab._pause( null );

			var wasPlaying = plab._persistentAction === 'play';
			if ( wasPlaying ) { plab._play(); }  // this is the key difference from _pause()

			plab._trigger( 'resumeFinish', [plab] );

			return wasPlaying;
		};  // End plab.resume()



		// ========== ONCE ========== \\

		plab.once = function ( incrementors ) {

			plab._trigger( 'onceBegin', [plab] );  // ??: 'jumpBegin'?

			// if ( plab._currentAction !== 'jump' ) {
				plab._pause( null );
				plab._currentAction = 'jump';
			// }

			// ??: Have `.jumpTo` logic in here instead?

			var shouldRepeat = function () { return false; },
				calcDelay 	 = function () { return 0; };
			plab._loop( incrementors, shouldRepeat, calcDelay );

			plab._trigger( 'onceFinish', [plab] );  // ??: 'jumpFinish'?

			// ??: After event sent or before?
			plab.resume();

			return plab;
		};  // End plab.once()



		// ========== NAVIGATE (arrow keys and other) ========== \\

		plab.jumpWords = function ( numToJump ) {
			// TODO: Should probably give beginning of current word on 0
			
			if ( numToJump < 0 ) { plab._direction = 'back'; }
			else { plab._direction = 'forward'; }

			plab.once( [0, numToJump, 0] );
			return plab;
		};
		plab.jumpSentences = function ( numToJump ) {
			// TODO: Should probably give beginning of current sentence on 0
			
			if ( numToJump < 0 ) { plab._direction = 'back'; }
			else { plab._direction = 'forward'; }

			plab.once( [numToJump, 0, 0] );
			return plab;
		};

		plab.nextWord 	  = function () { return plab.jumpWords( 1 ); };
		plab.nextSentence = function() { return plab.jumpSentences( 1 ); };
		plab.prevWord 	  = function () { return plab.jumpWords( -1 ); };
		plab.prevSentence = function() { return plab.jumpSentences( -1 ); };



		// =================== SCRUBBER BAR (probably, and maybe scrolling) =================== \\

		plab.jumpTo = function ( indx ) {
		/* ( int ) -> Playback
		* 
		*/
			// if ( plab._currentAction !== 'jump' ) {
			// 	// Have to pause first so index doesn't change
			// 	plab._currentAction = 'jump';
			// 	plab._pause( null );
			// }

			// var oldIndex = plab.getIndex(),
			// 	newIndex = indx;

			if ( indx >= 0 ) { plab._direction = 'forward' }
			else { plab._direction = 'back' }

			// plab.once( [0, newIndex - oldIndex, 0] );
			plab.once( indx );

			return plab;
		};  // End plab.jumpTo()



		// ========== FF and REWIND (arrow keys and other) ========== \\

		// var oldAccTime, notStartedAccYet = true, defaultDelay = 300;
		plab._accelerate = function ( frag ) {

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

		// 	// var delay = defaultDelay - elapsed;
		// 	// console.log(delay, elapsed, elapsed/20, (elapsed - elapsed/20))
		// 	// xxx(15 - 0)/(10 - 60) = -0.3 (slope)
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

		plab.rewind = function ( accelerateOverride ) {
		/* ( [ func ] ) -> Playback
		* 
		* Goes backward, acceleration controled by `accelerateOverride()` or
		* `state` or internal equivalent. (`accelerateOverride()` takes precedent,
		* with next fallback being `state.playback.accelerate()`, then internal
		* `.accelerate()`)
		* Default currently just a steady speed.
		* 
		* TODO: What happens when rewind and then `.jumpWord()` in the middle?
		*/
			if ( plab._currentAction !== 'rewind' ) {

				plab._trigger( 'rewindBegin', [plab] );

				plab._pause( null );

				plab._incrementors = [0, -1, 0];
				plab._direction = 'back';
				plab._currentAction = 'rewind';

				var accelerate = accelerateOverride || state.playback.accelerate || plab._accelerate;

				plab._loop( null, null, accelerate );  // Show the current word first, then it will move on

				plab._trigger( 'rewindFinish', [plab] );

			}

			return plab;
		};  // end plab.rewind()


		plab.fastForward = function ( accelerateOverride ) {
		/* ( [ func ] ) -> Playback
		* 
		* Goes forward, acceleration controled by `accelerateOverride()` or
		* `state` or internal equivalent. (`accelerateOverride()` takes precedent,
		* with next fallback being `state.playback.accelerate()`, then internal
		* `.accelerate()`)
		* 
		* Default currently just a steady speed.
		*/
			if ( plab._currentAction !== 'fastForward' ) {

				plab._trigger( 'fastForwardBegin', [plab] );

				plab._pause( null );

				plab._incrementors = [0, 1, 0];
				plab._direction = 'forward';
				plab._currentAction = 'fastForward';

				var accelerate = accelerateOverride || state.playback.accelerate || plab._accelerate;

				plab._loop( null, null, accelerate );  // Show the current word first, then it will move on

				plab._trigger( 'fastForwardFinish', [plab] );

			}

			return plab;
		};  // end plab.fastForward()



		// =================== DONE =================== \\

		plab._finishIfDone = function () {
        /* () -> Bool
		* 
		* If done, trigger 'done' event, stop the loop, and
		* prepare for a possible restart. Otherwise save not
		* done.
        */
        	var isDone = false;

        	// Stop if we've reached the end
        	if ( plab._direction !== 'back' && plab.getProgress() === 1 ) {
        		isDone = true;
        	} else if ( plab._direction === 'back' && plab.getIndex() === 0 ) {
        		// Check if resumed playing. If not resumed, done.
        		plab.resume();  
        		if ( plab._persistentAction !== 'play' ) { isDone = true; }
	    	}

	    	// TODO: ??: Add 'finishBegin' and 'finishFinish'? 'doneBegin', 'doneFinish'?
	        if ( isDone ) {
				plab.done = true;
				plab.stop();

				plab._trigger( 'done', [plab] );
	        } else {
	        	plab.done = false;
	        }

        	return plab.done;
		};  // End plab._finishIfDone()



		// ================================
		// LOOPS
		// ================================

        plab._signOf = function ( num ) {
            return typeof num === 'number' ? num ? num < 0 ? -1 : 1 : num === num ? num : NaN : NaN;
        }

        plab._emitProgress = function () {
        /* () -> Playback
        * 
        * Just trigger the progress event with the right progress fraction
        */
	        plab._trigger( 'progress', [plab, plab.getProgress()] );
	        return plab;
        };  // End plab._emitProgress()

        plab._skipDirection = function ( incrementors, frag ) {
        /* ( [ int, int, int ], str ) -> [ int, int, int ] of 0, 1, or -1
        * 
        * "$@skip@$" will be skipped. If you want fragments of certain
        * types to be skipped, detect and transform them with
        * `state.playback.transformFragment()` into "$@skip@$".
        */
			var vector = null;

			// // DEBUGGING
			// // Bug crops up when switching word lengths. Moreso at short lengths
			// // May be to do with reseting the word to its start when word length is changed
			// if( !chars ) { console.log('frag:', frag, '; chars:', chars, '; position:', plab._stepper.position); }
			// var noWhitespace = chars.replace( plab._whitespaceRegex, '' );

			// Skip our special symbols ( "$@skip@$" )
			// TODO: ??: use state property with a fallback?
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


        plab._loop = function( incrementors, checkRepeatOverride, calcDelayOverride ) {
		/* ( [ [int, int, int], int, func ] )
		* 
		* `incrementors` will only be used for the first loop. loop calls itself
		* with `null` as the first argument. Used with `._play()` and `skipVector`.
		* `checkRepeatOverride`: `null` or `undefined` means "until done". Given fragment and instance.
		* `calcDelayOverride`: Argument given is the new fragment. Future maybe Playback instance.
		* 
		* All three arguments are optional
		* 
		* Uses the `stepper` to get a new fragment based on `incrementors`, then
		* sends out an event with the fragment. Calls itself until `checkRepeat`
		* returns false, pausing between each fragment for an amount of time returned
		* by `calcDelayOverride`, `state.clacDelay()`, or its own default.
		*/
			plab._trigger( 'loopBegin', [plab] );
			if ( debug ) { console.log('loop begins', incrementors) }

			// Allows for stuff like `._play()` to show current word, then keep going
			// If incrementors is an index number
			if ( typeof incrementors === 'number' && incrementors >= 0 ) {
				// Do nothing, `incrementors` is good as it is
				// This allows `incrementors` to be 0
			} else {
				incrementors = incrementors || plab._incrementors;
			}

			var frag = plab._stepper.getFragment( incrementors ),
				// "$@skip@$" will be returned to skip the fragment
				frag = state.playback.transformFragment( frag );  // TODO: ??: optional?

			// Skip 1 word in the right direction if needed
			var skipVector = plab._skipDirection( incrementors, frag );  // [int, int, int] of -1, 0, or 1

    	    if ( skipVector !== null ) {

    	    	// TODO: ??: Also add 'loopSkipFinish'? (with 'loopSkipBegin')
				plab._trigger( 'loopSkip', [plab, frag] );
    	    	plab._loop( skipVector, checkRepeatOverride, calcDelayOverride );  // Don't decrease repeats
    	    
    	    } else {

    	    	// How long this word fragment will remain on the screen before changing
    	    	var calcDelay = calcDelayOverride || state.playback.calcDelay || plab._delayer.calcDelay,
    	    		delay 	  = calcDelay( frag );
    	    	// TODO: change string-time library - parameters for `.calcDelay()`
    	    	// so that can pass in `frag` and `plab`, or `plab` and `frag`

    	    	// ??: Could do `if ( delay !== 0 )`, but does that conflate?
    	    	var checkRepeat = checkRepeatOverride || state.playback.checkRepeat || function () { return true; };
				// Don't loop again if 0 repeats desired
				if ( checkRepeat && checkRepeat( plab, frag ) ) {

					plab._timeoutID = setTimeout( function () {
						plab._loop( null, checkRepeat, calcDelay );
					}, delay );

				}

				// // Send fragment after setTimeout so that you can easily
				// // pause on "newWordFragment" - pause kills the current
				// // `._timeoutID`. Feels weird, though.
				// plab._trigger( 'newWordFragment', [plab, frag] );

				plab._trigger( 'newWordFragment', [plab, frag, incrementors] );


				plab._trigger( 'loopFinish', [plab] );

    	    }  // end if skip fragment or not skip fragment

			plab._emitProgress();

			// Need one at the start too?
			plab._finishIfDone();

			return plab;  // Return timeout id instead?
        };  // End plab._loop()



        // ============== DO IT ============== \\
		plab._init()

		return plab;
	};  // End Playback() -> {}

    return Playback;
}));
