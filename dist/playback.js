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
* - NO 'reverting' to revertable state internally. Module user
* 	should handle that.
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

			plab._revertableState 	= 'pause';  // either 'play' or 'pause'
			// currentGoal? as in 'rewind', even when pause is being called in `.rewind()`?
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

		// ----- Synchronous queue -----
		// This is the only place that should be calling `._queueNext()`
		plab._queueCurrent = null;

		var idNum = 1;
		plab._queueAdd = function ( funcName, args ) {
			var item = { name: funcName, arguments: args, id: idNum }
			idNum++;

			plab._queue.push( item );

			plab._trigger( 'queued', [plab, item, plab._queue] );
			// console.log( 'queued:', item ); //plab._queue.slice(0) );

			// if ( !plab._queueRunning && !plab._queueSuspended ) { plab._queueNext(); }
			if ( !plab._queueCurrent && !plab._queueSuspended ) { plab._queueNext(); }

			return item;
		};  // End plab._queueAdd()

		plab._queueNext = function () {

			// plab._queueRunning = true;

			// // if ( plab._queue.length === 0 ) {
			// if ( plab._queueCurrent === null ) {

			// 	// THIS SHOULD BE THE ONLY PLACE WHERE `._queueRunning` GETS RESET TO FALSE.
			// 	// IT IS THE ONLY PLACE THAT WAITS UNTIL THE PREVIOUS FUNCTION HAS FINISHED
			// 	// RUNNING.
			// 	plab._queueRunning = false;

			// } else {

			// THIS SHOULD BE THE ONLY PLACE WHERE `._queueCurrent` GETS GIVEN A VALUE
			// OTHER THAN `null`. IT IS THE ONLY PLACE THAT WAITS UNTIL THE PREVIOUS
			// FUNCTION HAS FINISHED RUNNING.
			if ( plab._queueCurrent === null && plab._queue.length > 0 ) {

				var item = plab._queueCurrent = plab._queue.shift();
				// Before func runs so it can be listened for
				plab._trigger( 'dequeued', [plab, item, plab._queue] );
				// console.log( 'dequeueing', item );

				var func = plab[ item.name ];
				var returned = func.apply( this, item.arguments );

				plab._queueCurrent = null;

				plab._queueNext();
			}

			return plab;
		};  // End plab._queueNext()

		plab._queueSuspend = function () {
			plab._queueSuspended = true;
		};

		plab._queueResume = function () {
			plab._queueCurrent = null;
			plab._queueSuspended = false;
			plab._queueNext();
		};

		// plab._queueFinish = function () {
		// 	plab._queueRunning = false;
		// 	if ( plab._queue.length !== 0 ) {
		// 		plab._queueNext();
		// 	}
		// };  // End plab._queueFinish()

		plab._queueClear = function () {
			plab._queue.splice(0, plab._queue.length)
			// CANNOT SET `._queueRunning` TO `false`. A PREVIOUSLY QUEUED FUNCTION
			// MAY STILL BE RUNNING AND ONE COULD BE PLACED ON TOP OF THAT
		};  // End plab._queueClear()

		// ??: _queuePause?


		// ----- Actions -----

		plab._reset = function () {
		/* () -> Playback
		* 
		* Internal reset. No events, no sending fragments
		* Returns to initial values
		*/
			// if ( plab._currentAction === 'reset' ) { return plab; }  // ??: needed?

			plab._currentAction  = 'reset';  // ??: needed? ^
			plab._killLoop();  // Does not change state of `._currentAction`
			plab._revertableState = 'pause';  // either 'play' or 'pause'

			plab.done 		= false;
			plab._timeoutID = null;

			plab._direction 		= 'forward';
			plab._incrementors 		= [0, 0, 1];  // This is a regular 1 step forward move

			// // TODO: ??: Should this clear the queue?
			// // Would happen on `restart()`, too
			// plab._queueClear();

			// Just put the index at the right place
			plab._stepper.restart();

			return plab;
		};  // End plab._reset()


		plab._resetProxy = function () {
		/* () -> Playback
		* 
		* Returns to initial values and pauses
		*/
			plab._queueSuspend();

			plab._trigger( 'resetBegin', [plab] );

			// Nothing gets put onto queue
			plab._reset();

			// TODO: ??: Should this clear the queue?
			// Clear last so it does the most resetting possible
			// Has to be before `_onceProxy()` so it lets `_loop()` get on the queue and play once
			// Otherwise `_onceProxy()` has to use `_loopProxy`, which would give inconsistent
			// behavior for functions that use `_onceProxy()`
			plab._queueClear();

			// plab._onceProxy( 0 );  // Send first fragment (now that revertable state is 'pause')
			// // change current and revertable state back (??: seems out of place?)
			// reset state to allow `toggle` to go to play next from `_currentAction`
			// This seems squirrely
			plab._freeze();  // to stop reversion to play. Not needed anymore?

			plab._trigger( 'resetFinish', [plab] );
			// console.log( 'reset finished' );

			plab._queueResume();

			return plab;
		};

		plab.reset = function () {
		/* () -> Playback
		* 
		* Returns to initial values and pauses
		*/
			plab._queueAdd( '_resetProxy', arguments );
			return plab;
		};

		plab.forceReset = function () {
		/* () -> Playback
		* 
		* Returns to initial values and pauses
		* Bypasses queue and empties it immediately
		*/
			plab._resetProxy( arguments );
			return plab;
		};


		plab._restart = function ( eventName ) {

			if ( eventName ) { plab._trigger( eventName + 'Begin', [plab] ); }
			plab._reset();  // no restart events
			plab._play();  // no play events
			if ( eventName ) { plab._trigger( eventName + 'Finish', [plab] ); }

			return plab;
		};  // End plab._restart()
		
		// // Bring back if it becomes useful again
		// plab.start = function () {
		// 	plab._revertableState = 'play';
		// 	plab._restart( 'start' );
		// 	return plab;
		// };  // End plab.start()

		plab._restartProxy = function () {
			plab._revertableState = 'play';
			plab._restart( 'restart' );
			return plab;
		};

		plab.restart = function () {
			plab._queueAdd( '_restartProxy', arguments );
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
		* TODO: ??: Reset delay on `._play()` instead?
		*/
			// // if ( debug ) {
			// 	console.log('playing count:', count, eventName);
			// // }  // DEBUGGING
			count++;  // DEBUGGING

			// "play" will always be forward
			// ??: Here so can be changed no matter the event?
			plab._incrementors = [0, 0, 1];

			if ( eventName ) { plab._trigger( eventName + 'Begin', [plab] ); }
			// console.log( 'began playing eventName:', eventName );  // DEBUGGING

			// plab._delayer.resetSlowStart();  // ??: In here instead of in `._freeze()`?

			plab._revertableState = 'play';  // In `._play()` instead?
			plab._direction = 'forward';

			if ( plab._currentAction !== 'play' ) {  // ??: could possibly just pause first instead
				plab._currentAction = 'play';  // ??: eventName || 'play'?
				// Get current word first time, then get following fragments forever after
				plab._loopProxy( [0, 0, 0], null, null );  // Show the current word first, then it will move on
			}

			if ( eventName ) { plab._trigger( eventName + 'Finish', [plab] ); }

			return plab;
		};  // End plab._play()


		var debug;  // DEBUGGING
		plab._playProxy = function ( frag, d ) {
			debug = d;  // DEBUGGING
			if ( debug ) { console.log( 'playing. done?:', plab.done ); }  // DEBUGGING

			if ( plab.done ) { plab.restart(); }  // Comes back here after restarted
			else { plab._play( 'play' ); }
			return plab;
		};  // End plab.play()

		// ??: Include `.open()` as a proxy for `.play()`?
		// ??: Also `.start()`?

		plab.play = function ( frag, d ) {
			plab._queueAdd( '_playProxy', arguments );
			return plab;
		};



		plab._killLoop = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* Kills the loop and resets some variables
		* Does not change any state variables (currentAction, revertableState)
		*/
			// console.trace( 'killing loop' );
			clearTimeout( plab._timeoutID );
			// Start slow when next go through loop (restore countdown)
			plab._delayer.resetSlowStart();
			return plab;
		};  // End plab._killLoop()

		plab._freeze = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'pause'-like activities
		*/
			// console.log( 'pausing' );
			if ( eventName ) { plab._trigger( eventName + 'Begin', [plab] ); }

			// Switch order?
			plab._killLoop();
			plab._revertableState = 'pause';  // ??: 'pause'? or 'stop'? or 'stopped' (and 'playing')
			plab._currentAction = eventName || 'pause';

			if ( eventName ) { plab._trigger( eventName + 'Finish', [plab] ); }

			return plab;
		};  // End plab._freeze()


		// Names for "pause":
		plab._pauseProxy = function () {
			plab._freeze( 'pause' );
			return plab;
		};
		plab.pause = function () {
			plab._queueAdd( '_pauseProxy', arguments );
			return plab;
		};

		plab._stopProxy = function () {  // ??: plab._revertableState = 'pause';
			plab._freeze( 'stop' );
			return plab;
		};
		plab.stop = function () {
			plab._queueAdd( '_stopProxy', arguments );
			return plab;
		};

		plab._closeProxy = function () {  // ??: plab._revertableState = 'pause';
			plab._freeze( 'close' );
			return plab;
		};
		plab.close = function () {
			plab._queueAdd( '_closeProxy', arguments );
			return plab;
		};



		// TODO: ??: Add a 'toggle' event?
		plab._togglePlayPauseProxy = function () {
			// Use `._revertableState` instead?

			// if ( plab._currentAction !== 'pause' ) { plab.pause(); }
			// else { plab.play(); }

			// if === pause, play
			// if === play, pause
			// else revert
			if (  /pause|stop|close/.test( plab._currentAction ) ) { plab.play(); }
			else if ( plab._currentAction === 'play' ) { plab.pause(); }
			else { plab.revert(); }

			return plab;
		};
		plab.togglePlayPause = function () {
			plab._queueAdd( '_togglePlayPauseProxy', arguments );
			return plab;
		};



		// ========== RESUME ========== \\

		plab._revertProxy = function () {
		/* () -> Bool
		* 
		* Returns true if revertd playing, false if stopped
		* completely
		* TODO: ??: Should this set of the 'play' and 'pause' events?
		*/
			plab._trigger( 'revertBegin', [plab] );

			// notStartedAccYet = true;  // Not accelerating currently

			// plab._currentAction = 'revert';
			plab._killLoop( null );

			var wasPlaying = plab._revertableState === 'play';
			// ??: run .play/.pause instead to trigger the events and to
			// restart if done? Wait, do we want to restart on `jump`s?

			// Want events to be triggered, but don't want to put in queue
			if ( wasPlaying ) { plab._playProxy(); }
			else { plab._pauseProxy(); }

			plab._trigger( 'revertFinish', [plab] );

			return wasPlaying;
		};  // End plab._revertProxy()

		// We need an external `.revert()` if `.rewind()`,
		// etc. is a hold-and-release situation
		plab.revert = function () {
			plab._queueAdd( '_revertProxy', arguments );
			return plab;
		};



		// ========== ONCE ========== \\

		// plab._onceProxy = function ( incrementors, revertToRevertableState ) {
		plab._onceProxy = function ( incrementors ) {
		// If this is .once and can be called from the outside,
		// it can get added to the queue, but then weird stuff
		// can happen. Basically, mostly don't call non `._` stuff
		// internally.

			plab._trigger( 'onceBegin', [plab] );  // ??: 'jumpBegin'?

			// if ( plab._currentAction !== 'jump' ) {
				plab._killLoop( null );
				plab._direction = plab._getDirection( incrementors );
				plab._currentAction = 'jump';
			// }

			// ??: Have `.jumpTo` logic in here instead?

			var shouldRepeat = function () { return false; },
				calcDelay 	 = function () { return 0; };
			plab._loopProxy( incrementors, shouldRepeat, calcDelay );

			plab._trigger( 'onceFinish', [plab] );  // ??: 'jumpFinish'?

			// // ??: NOOOOOOO
			// // ??: Should not happen here? If called externally, would this
			// // be expected behavior?
			// // ??: After event sent or before?
			// // ??: Now that there's a queue, maybe at the start
			// if (revertToRevertableState) { plab._revertProxy(); }
			// // `once()` should not assume anything about resuming, right?

			return plab;
		};  // End plab._onceProxy()

		// TODO: ??: Possible alternative so we can have an external
		// `.once()`? Implement if needed.
		plab.once = function ( incrementors ) {
			plab._queueAdd( '_onceProxy', arguments );
			return plab;
		};



		// ========== NAVIGATE (arrow keys and other) ========== \\

		plab._currentProxy = function () {
			plab._onceProxy( [0, 0, 0] );
			return plab;
		};
		plab.current = function () {
			plab._queueAdd( '_currentProxy', arguments );
			return plab;
		};

		plab._jumpWordsProxy = function ( numToJump ) {
		// Moves forward or back relative to the current position
			// TODO: Should probably give beginning of current word on 0
			plab._onceProxy( [0, numToJump, 0] );
			return plab;
		};
		plab.jumpWords = function ( numToJump ) {
			plab._queueAdd( '_jumpWordsProxy', arguments );
			return plab;
		};

		plab._jumpSentencesProxy = function ( numToJump ) {
		// Moves forward or back relative to the current position
			// TODO: Should probably give beginning of current sentence on 0
			plab._onceProxy( [numToJump, 0, 0] );
			return plab;
		};
		plab.jumpSentences = function ( numToJump ) {
			plab._queueAdd( '_jumpSentencesProxy', arguments );
			return plab;
		};

		// TODO: ??: Do these need proxies too?
		plab.nextWord 	  = function () { return plab.jumpWords( 1 ); };
		plab.nextSentence = function() { return plab.jumpSentences( 1 ); };
		plab.prevWord 	  = function () { return plab.jumpWords( -1 ); };
		plab.prevSentence = function() { return plab.jumpSentences( -1 ); };

		// Can't see a reason for `nextFragment()`



		// =================== SCRUBBER BAR (probably, and maybe scrolling) =================== \\

		plab._jumpToProxy = function ( indx ) {
		/* ( int ) -> Playback
		* 
		* Moves to an absolute word position (not relative)
		* Does not allow any values below 0
		*/
			// Theoretically it can loop around to the end, but here
			// I don't see a reason to complicate things
			if ( indx < 0 ) { indx = [ 0, indx, 0 ]; }
			plab._onceProxy( indx );

			return plab;
		};  // End plab.jumpTo()

		plab.jumpTo = function ( indx ) {
			plab._queueAdd( '_jumpToProxy', arguments );
			return plab;
		};



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

		plab._rewindProxy = function ( accelerateOverride ) {
		/* ( [ func ] ) -> Playback
		* 
		* Goes backward, acceleration controled by `accelerateOverride()` or
		* `state` or internal equivalent. (`accelerateOverride()` takes precedent,
		* with next fallback being `state.playback.accelerate()`, then internal
		* `.accelerate()`)
		* Default currently just a steady speed.
		* 
		* TODO: Spec: What happens when rewind and then `.jumpWord()` in the middle?
		*/
			// No need to prevent new `rewind()` calls since this kills
			// the old loop before starting the new loop
				plab._currentAction = 'rewind';

				plab._trigger( 'rewindBegin', [plab] );

				plab._killLoop( null );
				plab._currentAction = 'rewind';

				plab._incrementors 	= [0, -1, 0];
				plab._direction 	= 'back';

				var accelerate = accelerateOverride || state.playback.accelerate || plab._accelerate;

				plab._loopProxy( null, null, accelerate );  // Show the current word first, then it will move on

				plab._trigger( 'rewindFinish', [plab] );

			return plab;
		};  // end plab.rewind()

		plab.rewind = function ( accelerateOverride ) {
			plab._queueAdd( '_rewindProxy', arguments );
			return plab;
		};


		plab._fastForwardProxy = function ( accelerateOverride ) {
		/* ( [ func ] ) -> Playback
		* 
		* Goes forward, acceleration controled by `accelerateOverride()` or
		* `state` or internal equivalent. (`accelerateOverride()` takes precedent,
		* with next fallback being `state.playback.accelerate()`, then internal
		* `.accelerate()`)
		* 
		* Default currently just a steady speed.
		*/
			// No need to prevent new `fastForward()` calls since this kills
			// the old loop before starting the new loop
			plab._trigger( 'fastForwardBegin', [plab] );

			plab._killLoop( null );
			plab._currentAction = 'fastForward';

			plab._incrementors 	= [0, 1, 0];
			plab._direction 	= 'forward';

			var accelerate = accelerateOverride || state.playback.accelerate || plab._accelerate;

			plab._loopProxy( null, null, accelerate );  // Show the current word first, then it will move on

			plab._trigger( 'fastForwardFinish', [plab] );

			return plab;
		};  // end plab.fastForward()

		plab.fastForward = function ( accelerateOverride ) {
			plab._queueAdd( '_fastForwardProxy', arguments );
			return plab;
		};



		// =================== DONE =================== \\

		plab._finishIfDone = function () {
        /* () -> Bool
		* 
		* If done, trigger 'done' event, stop the loop, and
		* prepare for a possible restart. Otherwise save not
		* done.
        */
        	// console.log( 'checking for stop. progress:', plab.getProgress(), '; queue:', plab._queue );
        	var isDone = false;

        	// Stop if we've reached the end (if `fastForward`ing, no revert)
        	if ( plab._direction !== 'back' && plab.getProgress() === 1 ) {
        		isDone = true;
        	} else if ( plab._direction === 'back' && plab.getIndex() === 0 ) {
        		// // Check if revertd playing. If not revertd, done.
        		// // ??: Is this expected behavior?
        		// plab._revertProxy();
        		// if ( plab._revertableState !== 'play' ) { isDone = true; }
        		isDone = true;
	    	}

	    	// console.log( 'isDone:', isDone, '; direction:', plab._direction, '; index:', plab.getIndex() );

	    	// TODO: ??: Add 'finishBegin' and 'finishFinish'? 'doneBegin', 'doneFinish'?
	        if ( isDone ) {
	        	// console.log( 'stopping' );
				plab.done = true;
				// plab.stop();  // has to be on queue. Otherwise stuff can interject here.
				plab._stopProxy();

				plab._trigger( 'done', [plab] );
	        } else {
	        	plab.done = false;
	        }

	        // console.log( 'finish check finished' );

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

        plab._getDirection = function ( incrementors ) {

        	var direction = 'forward';

        	if ( typeof incrementors === 'number' ) {
        		if ( plab._signOf( incrementors ) === -1 ) { direction = 'back'; }
        	} else {

        		for ( var inci = 0; inci < incrementors.length; inci++ ) {
        			if ( plab._signOf( incrementors[inci] ) === -1 ) {
        				direction = 'back';
        				break;
        			}
        		}  // end for incrementor
        	}  // end if number

        	return direction;
        };  // End plab._getDirection()

        plab._skipDirection = function ( incrementors, frag ) {
        /* ( [ int, int, int ], str ) -> [ int, int, int ] of 0, 1, or -1
        * 
        * "$@skip@$" will be skipped. If you want fragments of certain
        * types to be skipped, detect and transform them with
        * `state.playback.transformFragment()` into "$@skip@$".
        * 
        * TODO: Problem - if end or beginning needs to be skipped and
        * we're traveling in that direction, will this repeat infinitely?
        * We can't just stop on repeated skips because there may be a bunch
        * of whitespace to skip.
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

				var direction = plab._getDirection( incrementors );
				if ( direction === 'forward' ) { vector = [0, 0, 1] }
				else { vector = [0, 0, -1] }

				// // ??: This model would go back or forward one sentence, one
				// // word, or one fragment. Is that what we want?
				// vector = [0, 0, 0];  // Need to be able to manipulate an array

				// if ( incrementors[0] !== 0 ) {
				// 	vector[0] = plab._signOf(incrementors[0]);

				// } else if( incrementors[1] !== 0 ) {
				// 	vector[1] = plab._signOf(incrementors[1]);

				// } else if( incrementors[2] !== 0 ) {
				// 	vector[2] = plab._signOf(incrementors[2]);

				// // For when play passes in [0, 0, 0]. ??: Does anything else ever do this?
				// // We're going to have to skip in some direction or we'll never get anywhere
				// } else {
				// 	// This is going to be a problem if we ever to [0, 0, 0] on whitespace
				// 	// while rewinding
				// 	vector = [0, 0, 1];  // ??: Always true?
				// }
			}

			return vector;
        };  // End plab._skipDirection()


        plab._loopProxy = function( incrementors, checkRepeatOverride, calcDelayOverride ) {
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
			// // if ( debug ) { 
			// 	console.log('loop begins', incrementors)
			// 	 // }

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
    	    	plab._loopProxy( skipVector, checkRepeatOverride, calcDelayOverride );  // Don't decrease repeats
    	    
    	    } else {

    	    	// How long this word fragment will remain on the screen before changing
    	    	var calcDelay = calcDelayOverride || state.playback.calcDelay || plab._delayer.calcDelay,
    	    		delay 	  = calcDelay( frag );
    	    	// TODO: change string-time library - parameters for `.calcDelay()`
    	    	// so that can pass in `frag` and `plab`, or `plab` and `frag`

    	    	// ??: Could do `if ( delay !== 0 )`, but does that conflate?
    	    	var checkRepeat = checkRepeatOverride || state.playback.checkRepeat || function () { return true; };

    	    	// console.log( 'repeat?', checkRepeat( plab, frag ), delay );
				// Don't loop again if 0 repeats desired
				if ( checkRepeat && checkRepeat( plab, frag ) ) {

					plab._timeoutID = setTimeout( function () {
						plab._loop( null, checkRepeat, calcDelay );
					}, delay );

					// console.log( 'timeoutID:', plab._timeoutID );

				}

				// Send fragment after setTimeout so that you can easily
				// pause on "newWordFragment" - pause kills the current
				// `._timeoutID`. Feels weird, though.
				plab._trigger( 'newWordFragment', [plab, frag, incrementors] );

    	    }  // end if skip fragment or not skip fragment

			plab._emitProgress();

			plab._trigger( 'loopFinish', [plab] );

			// infinite repeat - to solve, put this after loopSkip too
			// ??: Should this be before 'loopFinish' too?
			plab._finishIfDone();

			return plab;  // Return timeout id instead?
        };  // End plab._loopProxy()

		plab._loop = function ( incrementors, checkRepeatOverride, calcDelayOverride ) {
			plab._queueAdd( '_loopProxy', arguments );
			return plab;
		};



        // ============== DO IT ============== \\
		plab._init()

		return plab;
	};  // End Playback() -> {}

    return Playback;
}));
