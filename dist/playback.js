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
* - Still vulnurable to race conditions? Pausing function called in
* 	middle of loop or while loop is in the queue?
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

			plab._queue 		 = [];
			plab._queueSuspended = false;
			plab._queueCurrent 	 = null;

			return plab;
		};  // End plab._init()


		plab.process = function ( sentenceArray ) {
			plab._stepper.process( sentenceArray );
			return plab;
		};


		plab.setState = function ( newState ) {
			// Validation needed?
			state = newState;
			stepper.setState( newState.stepper )
		};



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
		var queueIDnum = 1;
		plab._queueAdd = function ( funcName, args ) {
			var item = { name: funcName, arguments: args, id: queueIDnum }
			queueIDnum++;

			plab._queue.push( item );

			plab._trigger( '_queued', [plab, item, plab._queue] );
			// console.log( 'queued:', item ); //plab._queue.slice(0) );

			if ( !plab._queueCurrent && !plab._queueSuspended ) { plab._queueNext(); }

			return item;
		};  // End plab._queueAdd()

		plab._queueNext = function () {

			// THIS SHOULD BE THE ONLY PLACE WHERE `._queueCurrent` GETS GIVEN A VALUE
			// OTHER THAN `null`. IT IS THE ONLY PLACE THAT WAITS UNTIL THE PREVIOUS
			// FUNCTION HAS FINISHED RUNNING.
			// TODO: ??: Add `&& !plab._queueSuspended`?
			if ( plab._queueCurrent === null && plab._queue.length > 0 ) {

				var item = plab._queueCurrent = plab._queue.shift();
				// Before func runs so it can be listened for
				plab._trigger( '_dequeued', [plab, item, plab._queue] );
				// console.log( 'dequeueing', item );

				var func 	 = plab[ item.name ],
					returned = func.apply( this, item.arguments );

				plab._queueCurrent = null;

				plab._queueNext();
			}

			return plab;
		};  // End plab._queueNext()

		plab._queueSuspend = function () {
			plab._queueSuspended = true;
			// ??: plab._queueCurrent = null; 
		};

		plab._queueResume = function () {
			plab._queueCurrent = null;
			plab._queueSuspended = false;
			plab._queueNext();
		};

		plab._queueClear = function () {
			plab._queue.splice(0, plab._queue.length)
		};  // End plab._queueClear()


		// ----- Actions -----

		plab._reset = function () {
		/* () -> Playback
		* 
		* Internal reset. No events, no sending fragments
		* Returns to initial values
		*/
			plab._currentAction  = 'reset';  // ??: needed? ^
			plab._killLoop();  // Does not change state of `._currentAction`
			plab._revertableState = 'pause';  // either 'play' or 'pause'

			plab.done 		= false;
			plab._timeoutID = null;

			plab._direction 		= 'forward';
			plab._incrementors 		= [0, 0, 1];  // This is a regular 1 step forward move

			// // TODO: ??: Should this clear the queue?
			// // If so, it would happen on `restart()`, too
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

			plab._reset();
			// TODO: ??: Should this clear the queue?
			plab._queueClear();
			// TODO: ??: freeze before reseting values?
			// Set `_currentAction` to 'pause'
			plab._freeze();

			plab._trigger( 'resetFinish', [plab] );

			// If we implement using `_queueSuspended` as check in `._queueNext` then this
			// would do something important. Right now it doesn't do anything.
			plab._queueResume();

			return plab;
		};

		plab.reset = function () {
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


		// ??: 'playing' event should go off every time, but if we're
		// restarting without pausing first (pausing would trigger visual
		// feedback about pausing), then should the event not happen? That
		// means the "play" image won't fire off on restarts, even though
		// it feels like it should always fire on play.
		// `restart()` now fires its own event. That can be listened for.
		plab._play = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'play'-like activities
		* TODO: ??: Reset delay in here instead of in ._freeze or whatever?
		*/
			// "play" will always be forward
			plab._incrementors = [0, 0, 1];

			if ( eventName ) { plab._trigger( eventName + 'Begin', [plab] ); }

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


		plab._playProxy = function () {  // Why is `frag` here?
			if ( plab.done ) { plab.restart(); }
			else { plab._play( 'play' ); }
			return plab;
		};  // End plab.play()

		// ??: Include `.open()` as a proxy for `.play()`?
		// ??: Also `.start()`?

		plab.play = function () {
			plab._queueAdd( '_playProxy', arguments );
			return plab;
		};



		plab._killLoop = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* Kills the loop and resets some variables
		* Does not change any state variables (currentAction, revertableState)
		*/
			clearTimeout( plab._timeoutID );
			// Start slow when next go through loop (restore speed to pre-warmup speed)
			plab._delayer.resetSlowStart();
			return plab;
		};  // End plab._killLoop()

		plab._freeze = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'pause'-like activities
		*/
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

		plab._stopProxy = function () {
			plab._freeze( 'stop' );
			return plab;
		};
		plab.stop = function () {
			plab._queueAdd( '_stopProxy', arguments );
			return plab;
		};

		plab._closeProxy = function () {
			plab._freeze( 'close' );
			return plab;
		};
		plab.close = function () {
			plab._queueAdd( '_closeProxy', arguments );
			return plab;
		};



		plab._toggleProxy = function () {
		// TODO: ??: Add a 'toggle' event? Change this name?
			// Test `currentAction` not `revertableState` so that, for example, if was paused
			// then rewound, will revert to 'pause' instead of toggling to 'play', since
			// `rewind()` doesn't change revertableState to 'play'

			// TODO: ??: Should these be non-queued? Straight to proxies?
			if ( /pause|stop|close/.test( plab._currentAction ) ) { plab.play(); }
			else if ( plab._currentAction === 'play' ) { plab.pause(); }
			else { plab.revert(); }

			return plab;
		};
		// TODO: ??: Change name to just 'toggle'?
		plab.toggle = function () {
			plab._queueAdd( '_toggleProxy', arguments );
			return plab;
		};



		// ========== RESUME ========== \\

		plab._revertProxy = function () {
		/* () -> Bool
		* 
		* Returns true if revertd playing, false if stopped
		* completely
		* TODO: ??: Should this set off the 'play' and 'pause' events?
		*/
			plab._trigger( 'revertBegin', [plab] );

			// plab._currentAction = 'revert';  // TODO: Would this be useful?
			plab._killLoop( null );

			var wasPlaying = plab._revertableState === 'play';
			// ??: run .play/.pause instead to trigger the events and to
			// restart if done? Wait, do we want to restart on `jump`s?

			// Want events to be triggered, but don't want to put in queue
			if ( wasPlaying ) { plab._playProxy(); }
			else { plab._pauseProxy(); }

			plab._trigger( 'revertFinish', [plab] );

			return wasPlaying;  // I think this is here for `finishIfDone()`
		};  // End plab._revertProxy()

		// We need an external `.revert()` if `.rewind()`,
		// etc. is a hold-and-release situation
		plab.revert = function () {
			plab._queueAdd( '_revertProxy', arguments );
			return plab;
		};



		// ========== ONCE ========== \\

		plab._onceProxy = function ( incrementors ) {
		// If this is `.once` and can be called from the outside,
		// it can get added to the queue, but then weird stuff
		// can happen. Basically, mostly call `._` stuff internally.

			plab._trigger( 'onceBegin', [plab] );  // ??: 'jumpBegin'? Other stuff? Pass `eventName`?

			plab._killLoop( null );
			plab._direction = plab._getDirection( incrementors );
			plab._currentAction = 'jump';

			// ??: Have `.jumpTo` logic in here instead so a number can be passed
			// in? That may be more confusing as to what that number means. e.g. would `0`
			// mean current or mean the very first fragment?

			var shouldRepeat = function () { return false; },
				calcDelay 	 = function () { return 0; };
			plab._loopProxy( incrementors, shouldRepeat, calcDelay );

			plab._trigger( 'onceFinish', [plab] );  // ??: 'jumpFinish'?

			// // TODO: ??: Should this ever have the ability to revert?
			// // `once()` should not assume anything about reverting, right?
			// if (revertToRevertableState) { plab._revertProxy(); }

			return plab;
		};  // End plab._onceProxy()

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

		// Can't see a reason for `nextFragment()` etc.



		// =================== SCRUBBER BAR (probably, and maybe scrolling) =================== \\

		plab._jumpToProxy = function ( indx ) {
		/* ( int ) -> Playback
		* 
		* Moves to an absolute word position (not relative)
		* Does not allow any values below 0
		* 
		* TODO: !!!: This is very wrong. Negatives should be allowed,
		* they just need to go to the minimum of 0. But then how do they
		* trigger 'done'?
		*/
			// Theoretically it can loop around to the end when negative, but
			// I don't see a reason to complicate things here. Not sure why it would be needed.
			if ( indx < 0 ) {
				// Go to beginning and then some (to trigger 'done') (1 before 0)
				// Not sure about whether this should be expected behavior or not
				var beforeStart = (-1 * plab.getIndex()) -1;
				indx = [ 0, beforeStart, 0 ];
			}

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
		/*
		* A delay calculation function that returns a smaller and smaller
		* value as time goes on. Except this default one just returns the
		* same delay each time.
		*/
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
		* That's a good question... I still don't know that...
		* I think it just stops, which is not really what I want...
		* Is this actually tested with the current tests? I think not.
		* Maybe new tests are needed - ones that jump to the middle first.
		* Also, remember that reverting is to be handled externally now.
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
			// ??: Also here: Show the current word first, then it will move on?
			plab._loopProxy( null, null, accelerate );

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
			// TODO: ??: Also here: Show the current word first, then it will move on?
			plab._loopProxy( null, null, accelerate );

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
        	var isDone = false;

        	// Stop if we've reached the end (if `fastForward`ing, no revert)
        	if ( plab._direction !== 'back' && plab.getProgress() === 1 ) {
        		isDone = true;
        	} else if ( plab._direction === 'back' && plab.getIndex() === 0 ) {
        		isDone = true;
	    	}

	    	// TODO: ??: Add 'finishBegin' and 'finishFinish'? 'doneBegin', 'doneFinish'?
	        if ( isDone ) {
				plab.done = true;
				plab._stopProxy();  // Can't be added to queue or vulnerable to interruptions
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

			// Skip our special symbols ( "$@skip@$" )
			// TODO: ??: use state property with a fallback?
			if ( frag === '$@skip@$' ) {
				var direction = plab._getDirection( incrementors );
				if ( direction === 'forward' ) { vector = [0, 0, 1] }
				else { vector = [0, 0, -1] }
			}

			return vector;
        };  // End plab._skipDirection()

        plab._finishLoop = function () {
        	plab._emitProgress();
        	plab._trigger( 'loopFinish', [plab] );
        	// ??: Should this be before 'loopFinish'?
        	plab._finishIfDone();

        	return plab;
        };  // End plab._finishLoop()


        plab._loopProxy = function( incrementors, checkRepeatOverride, calcDelayOverride ) {
		/* ( [ [int, int, int], int, func ] )
		* 
		* `incrementors` will only be used for the first loop. loop calls itself
		* with `null` as the first argument. Used with `._play()` and `skipVector`.
		* `checkRepeatOverride`: `null` or `undefined` means "until done". Given fragment and instance.
		* `calcDelayOverride`: Argument given is the new fragment. Future may include Playback instance.
		* 
		* All three arguments are optional
		* TODO: Remove the last two? There are no functions that currently use them
		* 
		* Uses the `stepper` to get a new fragment based on `incrementors`, then
		* sends out an event with the fragment. Calls itself until `checkRepeat`
		* returns false, pausing between each fragment for an amount of time returned
		* by `calcDelayOverride`, `state.clacDelay()`, or its own default.
		*/
			plab._trigger( 'loopBegin', [plab] );

			// Allows for stuff like `._play()` to show current word, then keep going
			// If incrementors is an index number
			if ( typeof incrementors === 'number' && incrementors >= 0 ) {
				// Do nothing, `incrementors` is good as it is
				// This allows `incrementors` to be 0
				// TODO: wtf, why aren't negative incrementors accounted for here? Conversly
				// why do positive incrementors have to be accounted for?
			} else {
				incrementors = incrementors || plab._incrementors;
			}

			var frag   = plab._stepper.getFragment( incrementors ),
				// "$@skip@$" will be returned to skip the fragment
				tester = state.playback.transformFragment( frag );  // TODO: ??: optional?

			// Skip 1 word in the right direction if needed
			var skipVector = plab._skipDirection( incrementors, tester );  // [int, int, int] of -1, 0, or 1

    	    if ( skipVector !== null ) {

    	    	// TODO: ??: Also add 'loopSkipFinish'? (with 'loopSkipBegin')
				plab._trigger( 'loopSkip', [plab, frag] );

	    		plab._timeoutID = setTimeout( function() {
    	    		plab._loop( skipVector, checkRepeatOverride, calcDelayOverride );  // Put on queue
    	    	}, 0);

    	    } else {

    	    	// How long this word fragment will remain on the screen before changing
    	    	var calcDelay = calcDelayOverride || state.playback.calcDelay || plab._delayer.calcDelay,
    	    		delay 	  = calcDelay( frag );
    	    	// TODO: change string-time library - parameters for `.calcDelay()`
    	    	// so that can pass in `frag` and `plab`, or `plab` and `frag`

    	    	var checkRepeat = checkRepeatOverride || state.playback.checkRepeat || function () { return true; };

				// Don't loop again if no repeats desired
				if ( checkRepeat( plab, frag ) ) {

					plab._timeoutID = setTimeout( function () {
						// Put on queue. Solves a bunch of problems
						plab._loop( null, checkRepeat, calcDelay );
					}, delay );

				}

				// Send fragment after setTimeout so that you can easily
				// pause on "newWordFragment" - pause kills the current
				// `._timeoutID`. Feels weird, though.
				plab._trigger( 'newWordFragment', [plab, frag, incrementors] );

    	    }  // end if skip fragment or not skip fragment

    	    plab._finishLoop();

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
