/* playback.js
* 
* Transmits fragments from a 'stepper' object. Uses a 'delayer'
* to determine time between each transmition/call. Can be
* started (`play`), move forward, backward, pause, and jump to
* positions. Can move by sentence, fragment, and word.
* 
* Started with
* https://github.com/jamestomasino/read_plugin/blob/master/Read.js
* 
* TODO;
* - ??: Still vulnerable to race conditions? Pausing function
* 	called in middle of loop or while loop is in the queue?
* - ??: Should `.restart` trigger 'playBegin' and 'playFinish'
* - ??: Implement override functions can be passed in from external
* 	function calls?
* - ??: Should 'restart' after done from going backwards?
* - ??: Useful to have `.next/prevFragment()` too?
* - ??: Make the state optional? Also make each state propert optional?
* - Add a `.next()` and a `.prev()` that can increment by a fragment. How
* 	the heck did I leave those out?
* - Change the `.jump`s so they just put `.once()` on the queue
* - ??: Change fragment travel behavior so it won't stop at word boundry?
* - ??: Add `.skip()`?
* - ??: Change `.jumpTo()` to have it's old negative values action back?
* - ??: Fix negative action values if negative numbers go past the start?
* - Fix `.once(-int)` not working as expected - put `.jumpTo()` negative
* 	calculations in `.once()`.
* - ??: `.jumpWords(0)` to go to start of current word?
* - ??: `.forceFreeze()`/`.forceStop()`/? for clearing the queue and
* 	pausing without reseting to start? Maybe if a need shows itself.
* 
* DEVELOPMENT NOTES/GUIDES:
* - Where possible, return Playback so functions can be chained
* - Always send event name as the first argument to events and
* 	Playback as the second argument for consistency.
* - NO 'reverting' to revertable state internally. Module user
* 	should handle that. Except maybe in `.toggle()`.
* - Other than loops called from inside `._loopProxy`, no function put
* 	on the queue should put another function on the queue. Otherwise
* 	vulnerable to interruptions.
* - Functions not starting with '._' are almost always only called
* 	externally. Anytime one is called internally it will be noted (I hope).
* 
* API NOTES:
* - All events send the event name as the first argument and the
* 	`Playback` instance as the second argument. Some events send further
* 	data. In those cases, it will be noted (that's the plan, anyway).
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
	/* ( {}, {} || none, {} || none ) -> Playback
	* 
	* - `state` must have a `.emitter`, `.stepper` (state for the stepper),
	* 	`.delayer` (state for the delayer), `.playback` (state for this
	* 	`Playback` instance). `state.playback` can, but isn't required to,
	* 	have a `.accelerate`, `.transformFragment`, `.calcDelay`, and a
	* 	`.checkRepeat`.
	* - `StepperConstr` and `DelayerConstr` will be handed their `state`
	* 	objects.
	*/
		var plab = {};


		// ============== SET UP VALUES ============== \\

		plab._init = function () {

			var RealStepperConstr = StepperConstr || DefaultStepper,
				RealDelayerConstr = DelayerConstr || DefaultDelayer;

			plab._state   = state;
			plab._stepper = RealStepperConstr( state.stepper );
			plab._delayer = RealDelayerConstr( state.delayer );

			plab.done 		= false;
			plab._timeoutID = null;

			plab._revertableState 	= 'pause';  // either 'play' or 'pause'
			// currentGoal? as in 'rewind', even when pause is being called in `.rewind`?
			plab._currentAction 	= 'pause';
			plab._direction 		= 'forward';
			plab._incrementors 		= [0, 0, 1];  // This is a regular 1 step forward move

			plab._queue 		 = [];
			plab._queueSuspended = false;
			plab._queueCurrent 	 = null;

			return plab;
		};  // End plab._init()


		plab.process = function ( sentenceArray ) {
		/* ( [[str]] ) -> Playback :: Turns input into format that `._stepper` can manipulate */
			plab._stepper.process( sentenceArray );
			return plab;
		};


		plab.setState = function ( newState ) {
		/* Destructively sets state. Not sure how best to do it non-destructively. */
			// Validation needed?
			state = plab._state = newState;
			stepper.setState( newState.stepper )
		};


		// ============== PASSED ON DIRECTLY FROM STEPPER ============== \\

		plab.getProgress = function () { return plab._stepper.getProgress(); };
		plab.getLength 	 = function () { return plab._stepper.getLength(); };
		plab.getIndex 	 = function () { return plab._stepper.getIndex(); };


		// ============== EVENT EMITTING ============== \\

		plab._trigger = function ( eventName, argsArray ) {
		/* ( str, {} ) -> Playback :: Uses `state`s emitter to trigger a give event */
			state.emitter.trigger( eventName, argsArray );
		};


		// ============== FLOW CONTROL ============== \\

		// ----- Queue for synchronizing (for internal use) -----
		var queueIDnum = 1;
		plab._queueAdd = function ( methodName, args ) {
		/* ( str, {} ) -> {}
		* 
		* Takes a `Playback` instance method name and a set of arguments,
		* turns them into an object, gives that an id and it to the
		* `._queue` Array. Triggers an event containing the item and the queue,
		* then triggers the calling of the next method on the queue (dequeueing).
		* Returns the created item.
		*/
			var item = { name: methodName, arguments: args, id: queueIDnum }
			queueIDnum++;

			plab._queue.push( item );

			var eventName = '_queued';
			plab._trigger( eventName, [eventName, plab, item, plab._queue] );
			// console.log( 'queued:', item ); //plab._queue.slice(0) );

			plab._queueNext();

			return item;
		};  // End plab._queueAdd()

		plab._queueNext = function () {
		/* ( str, {} ) -> Playback
		* 
		* If appropriate, calls the next item (method) in the front of
		* the `._queue`. Triggers an event containing the item and the queue,
		* then, if possible, triggers the calling of the next function on the
		* queue (dequeueing).
		* 
		* TODO: ??: Return `item` instead?
		*/
			// THIS SHOULD BE THE ONLY PLACE WHERE `._queueCurrent` GETS GIVEN A VALUE
			// OTHER THAN `null`. IT IS THE ONLY PLACE THAT WAITS UNTIL THE PREVIOUS
			// FUNCTION HAS FINISHED RUNNING.
			if ( plab._queueCurrent === null && plab._queue.length > 0 && !plab._queueSuspended ) {

				var item = plab._queueCurrent = plab._queue.shift();
				// Before func runs so it can be listened for
				var eventName = '_dequeued';
				plab._trigger( eventName, [eventName, plab, item, plab._queue] );
				// console.log( 'dequeueing', item );

				var func 	 = plab[ item.name ],
					returned = func.apply( this, item.arguments );

				// Lets us know the function just called has finished so this can't
				// be triggered in the middle of a running function.
				plab._queueCurrent = null;

				plab._queueNext();
			}

			return plab;
		};  // End plab._queueNext()

		plab._queueSuspend = function () {
		/* () -> Playback :: Makes sure the next item on the queue won't be called */
			plab._queueSuspended = true;
			return plab;
		};

		plab._queueResume = function () {
		/* () -> Playback :: Starts the queue up again (un-suspends it and triggers further calls) */
			// plab._queueCurrent = null;  // ??: Should do this here?
			plab._queueSuspended = false;
			plab._queueNext();
			return plab;
		};

		plab._queueClear = function () {
		/* () -> Playback :: Empties the current `._queue` array without destroying it */
			plab._queue.splice(0, plab._queue.length);
			return plab;
		};


		// ----- Actions (includes methods for external use) -----

		plab._reset = function () {
		/* () -> Playback
		* 
		* Sets most to initial values (other than things like `state`).
		* --Changes `._currentAction`--. No events. Only called internally.
		* Doesn't clear queue (because restart uses it).
		* Can be called by `._resetProxy` and `._restart`
		*/
			plab._currentAction  	= 'reset';  // ??: needed?
			plab._killLoop();  // Does not change state of `._currentAction`
			plab._revertableState 	= 'pause';  // either 'play' or 'pause'. Lower down?

			plab.done 		= false;
			plab._timeoutID = null;

			plab._direction 		= 'forward';
			plab._incrementors 		= [0, 0, 1];  // This is a regular 1 step forward move

			// // TODO: ??: Should this clear the queue?
			// // If so, it would happen on `restart`, too
			// plab._queueClear();

			// // ??: Useful? Less confusing? More confusing?
			// plab._currentAction = 'pause';

			// Just put the index at the right place
			plab._stepper.restart();

			return plab;
		};  // End plab._reset()


		plab._resetProxy = function () {
		/* () -> Playback
		* 
		* Actually resets, always called from queue.
		* Returns to initial values, clears queue, and changes `._currentAction`
		* to 'pause'. Triggers event that sends event name and `Playback` instance
		*/
			plab._queueSuspend();

			var eventName = 'resetBegin';
			plab._trigger( eventName, [eventName, plab] );

			// ??: If reset before freezing, values may change?
			plab._pauseLoop();
			plab._queueClear();
			plab._reset();

			// Set `_currentAction` to 'pause' so we can toggle without reverting, etc.
			// Shame to do it this way, but `._pauseLoop` needs to happen before
			// `._reset` (which changes `._currentAction` to 'reset') and it would
			// be overkill to freeze again.
			// ??: Should this be in `._reset`? Would that be better?
			plab._currentAction = 'pause';

			eventName = 'resetFinish';
			plab._trigger( eventName, [eventName, plab] );

			// Un-suspends queue
			plab._queueResume();

			return plab;
		};

		plab.reset = function () {
		/* () -> Playback :: Puts reseting on queue */
			plab._queueAdd( '_resetProxy', arguments );
			return plab;
		};

		plab.forceReset = function () {
		/* () -> Playback :: Resets, but bypasses and empties queue immediately */
			plab._resetProxy( arguments );
			return plab;
		};


		plab._restart = function ( eventName ) {
		/* ( str ) -> Playback
		* 
		* Resets properties except queue, going back to start, triggers
		* events using 'restart' or eventName (used to be for `.start`,
		* and keeping it till more use-case testing is done), passing the
		* event name and the `Playback` instance. Starts `._play`ing
		* without triggering those events.
		* Called by `._restartProxy`
		*/
			var begin = eventName + 'Begin';
			if ( eventName ) { plab._trigger( begin, [begin, plab] ); }
			plab._reset();  // no reset events
			plab._play();  // no play events
			var finish = eventName + 'Finish';
			if ( eventName ) { plab._trigger( finish, [finish, plab] ); }

			return plab;
		};  // End plab._restart()
		
		// // Bring back if it becomes useful again
		// plab.start = function () {
		// 	plab._revertableState = 'play';
		// 	plab._restart( 'start' );
		// 	return plab;
		// };  // End plab.start()

		// ??: `.open()`?

		plab._restartProxy = function () {
		/* () -> Playback
		* 
		* Actually restarts. Called by queue and, sometimes, by `._playProxy`.
		*/
			plab._revertableState = 'play';
			plab._restart( 'restart' );
			return plab;
		};

		plab.restart = function () {
		/* () -> Playback :: Puts restarting on queue */
			plab._queueAdd( '_restartProxy', arguments );
			return plab;
		};


		plab._play = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'play'-like activities. Changes action states, direction,
		* sends standard event data, and triggers the loop to start calling
		* itself, first with the current fragment and then with further fragments.
		* Can be called by `._restart` and `._playProxy`
		* 
		* TODO: ??: Reset delay in here instead of in `._pauseLoop` or whatever?
		* TODO: write a better description
		*/
			// ??: after event or before event?
			plab._incrementors = [0, 0, 1];

			var begin = eventName + 'Begin';
			if ( eventName ) { plab._trigger( begin, [begin, plab] ); }

			// plab._delayer.resetSlowStart();  // ??: In here instead of in `._pauseLoop`?

			plab._revertableState = 'play';
			plab._direction = 'forward';

			if ( plab._currentAction !== 'play' ) {  // ??: could possibly just pause first instead
				plab._currentAction = 'play';  // ??: eventName || 'play'?
				// Get current fragment first time, then get following fragments forever after
				plab._loopProxy( [0, 0, 0], null, null );
			}

			var finish = eventName + 'Finish';
			if ( eventName ) { plab._trigger( finish, [finish, plab] ); }

			return plab;
		};  // End plab._play()


		plab._playProxy = function () {
		/* () -> Playback
		* 
		* Actually plays. Called by queue and, sometimes, by
		* `._toggleProxy` and `._revertProxy`.
		*/
			if ( plab.done ) { plab._restartProxy(); }
			else { plab._play( 'play' ); }
			return plab;
		};  // End plab.play()

		// ??: Include `.open` as a proxy for `.play`?
		// ??: Also `.start`?

		plab.play = function () {
		/* () -> Playback :: Puts playing on queue */
			plab._queueAdd( '_playProxy', arguments );
			return plab;
		};



		plab._killLoop = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* Kills the loop timeout and resets some variables (delay warmup)
		* Does not change any state variables (`._currentAction`, `._revertableState`)
		*/
			clearTimeout( plab._timeoutID );
			// Start slow when next go through loop (restore speed to pre-warmup speed)
			// ??: Is this really the best place for this?
			plab._delayer.resetSlowStart();
			return plab;
		};  // End plab._killLoop()

		plab._pauseLoop = function ( eventName ) {
		/* ( Str ) -> PlaybackManager
		* 
		* For all 'pause'-like activities. Affects action states and
		* triggers events with usual data.
		*/
			var begin = eventName + 'Begin';
			if ( eventName ) { plab._trigger( begin, [begin, plab] ); }

			// Switch order?
			plab._killLoop();
			plab._revertableState = 'pause';
			plab._currentAction = eventName || 'pause';

			var finish = eventName + 'Finish';
			if ( eventName ) { plab._trigger( finish, [finish, plab] ); }

			return plab;
		};  // End plab._pauseLoop()


		// Names for "pause":
		plab._pauseProxy = function () {
		/* () -> Playback
		* 
		* Actually pauses. Called by queue and, sometimes, by
		* `._toggleProxy` and `._revertProxy`.
		*/
			plab._pauseLoop( 'pause' );
			return plab;
		};
		plab.pause = function () {
		/* () -> Playback :: Puts pausing on queue */
			plab._queueAdd( '_pauseProxy', arguments );
			return plab;
		};

		plab._stopProxy = function () {
		/* () -> Playback
		* 
		* Actually stops (a type of pausing). Called by queue and,
		* sometimes, by `._finishIfDone`.
		*/
			plab._pauseLoop( 'stop' );
			return plab;
		};
		plab.stop = function () {
		/* () -> Playback :: Puts stopping on queue */
			plab._queueAdd( '_stopProxy', arguments );
			return plab;
		};

		plab._closeProxy = function () {
		/* () -> Playback :: Actually closes (a type of pausing). Only called from queue. */
			plab._pauseLoop( 'close' );
			return plab;
		};
		plab.close = function () {
		/* () -> Playback :: Puts closing on queue */
			plab._queueAdd( '_closeProxy', arguments );
			return plab;
		};



		plab._toggleProxy = function () {
		/* () -> Playback
		* 
		* If currently paused, stopped, or closed, will start playing.
		* If currently playing, will pause.
		* If currently something else, revert to revertable state, though really
		* you shouldn't be calling `.toggle` in that case, just `.revert`,
		* but I can definitely see people unwittingly using it this way.
		* Only called from queue.
		* 
		* Tests `._currentAction` (`ca`) not `._revertableState` (`rs`). Why?
		* Basically, `.toggle` needs to detect if not currently either paused
		* or playing and then act in some useful way. atm it's reverting. It
		* can't use `rs` to tell if a non-pause or play action is going on.
		* 
		* TODO: ??: Add a 'toggle' events?
		*/
			if ( /pause|stop|close/.test( plab._currentAction ) ) { plab._playProxy(); }
			else if ( plab._currentAction === 'play' ) { plab._pauseProxy(); }
			else { plab._revertProxy(); }

			return plab;
		};

		plab.toggle = function () {
		/* () -> Playback :: Puts toggling on queue */
			plab._queueAdd( '_toggleProxy', arguments );
			return plab;
		};



		// ========== REVERT ========== \\

		plab._revertProxy = function () {
		/* () -> Bool
		* 
		* Actually reverts. Called by queue and, sometimes, by `._toggleProxy`.
		* Considering calling from `._onceProxy`.
		* Returns true if revertd to 'play', false if reverts to 'pause'.
		* 
		* TODO: ??: Should this set off the 'play' and 'pause' events?
		*/
			var eventName = 'revertBegin';
			plab._trigger( eventName, [eventName, plab] );

			// plab._currentAction = 'revert';  // TODO: Would this be useful?
			plab._killLoop( null );

			var wasPlaying = plab._revertableState === 'play';
			// Trigger events, but don't put in queue
			if ( wasPlaying ) { plab._playProxy(); }
			else { plab._pauseProxy(); }

			eventName = 'revertFinish';
			plab._trigger( eventName, [eventName, plab] );

			return wasPlaying;  // I think this is here for `._finishIfDone`
		};  // End plab._revertProxy()

		plab.revert = function () {
		/* () -> Playback
		* 
		* Puts reverting on queue. We need an external `.revert` if
		* `.rewind`, etc. is a hold-and-release situation
		*/
			plab._queueAdd( '_revertProxy', arguments );
			return plab;
		};



		// ========== ONCE ========== \\

		plab._onceProxy = function ( incrementors ) {
		/* ( [ int, int, int ] || int ) -> Playback
		* 
		* Actually jumps. Called by queue and by `._jump`ing proxies
		* Does all kinds of jumping, next, and prev stuff. Changes
		* `._direction` and `_currentAction`. Never repeats, never
		* has a delay.
		* 
		* TODO: ??: restart on `jump`s when at end?
		*/

			var eventName = 'onceBegin';
			plab._trigger( eventName, [eventName, plab] );  // ??: 'jumpBegin'? Other stuff? Pass `eventName`?

			plab._killLoop( null );

			// ??: Have `.jumpTo` logic in here instead so a number can be passed
			// in? That may be more confusing as to what that number means when 
			// calling `.once()`. e.g. would `0` mean the current fragment or
			// mean the very first fragment in the collection?
			if ( typeof incrementors === 'number' && incrementors < 0 ) {
				// Go to beginning and then some (to trigger 'done')
				var beforeStart = (-1 * plab.getIndex()) -1;
				incrementors = [ 0, beforeStart, 0 ];
			}

			plab._direction = plab._getDirection( incrementors );
			plab._currentAction = 'jump';

			var shouldRepeat = function () { return false; },
				calcDelay 	 = function () { return 0; };
			plab._loopProxy( incrementors, shouldRepeat, calcDelay );

			eventName = 'onceFinish';
			plab._trigger( eventName, [eventName, plab] );  // ??: 'jumpFinish'?

			// // TODO: ??: Should this ever have the ability to/automatically revert?
			// if (revertToRevertableState) { plab._revertProxy(); }

			return plab;
		};  // End plab._onceProxy()

		plab.once = function ( incrementors ) {
		/* ( [ int, int, int ] || int ) -> Playback :: Puts 'once' (jumping-type) actions on queue */
			plab._queueAdd( '_onceProxy', arguments );
			return plab;
		};



		// ========== NAVIGATE (arrow keys and other) ========== \\

		plab._currentProxy = function () {
		/* () -> Playback
		* 
		* Actually gets current fragment. Only called from queue.
		* Maybe should use this in `._play`. Maybe in rewind and ffwd too.
		*/
			plab._onceProxy( [0, 0, 0] );
			return plab;
		};
		plab.current = function () {
		/* () -> Playback :: Puts getting current fragment on queue */
			plab._queueAdd( '_currentProxy', arguments );
			return plab;
		};

		plab._jumpWordsProxy = function ( numToJump ) {
		/* ( int ) -> Playback
		* 
		* Moves forward or back numToJump number of words relative to the
		* current position. Called by queue, `.nextWord`, and `.prevWord`.
		*/
			// TODO: ??: If in middle of current word, go to beginning of
			// word on 0?
			plab._onceProxy( [0, numToJump, 0] );
			return plab;
		};
		plab.jumpWords = function ( numToJump ) {
		/* ( int ) -> Playback :: Puts jumping words on queue */
			plab._queueAdd( '_jumpWordsProxy', arguments );
			return plab;
		};

		plab._jumpSentencesProxy = function ( numToJump ) {
		/* ( int ) -> Playback
		* 
		* Moves forward or back numToJump number of sentences relative to
		* the current position. Called by queue, `.nextSentence`, and
		* `.prevSentence`.
		*/
			// TODO: ??: If in middle of current sentence, go to beginning
			// of sentence on 0?
			plab._onceProxy( [numToJump, 0, 0] );
			return plab;
		};
		plab.jumpSentences = function ( numToJump ) {
		/* ( int ) -> Playback :: Puts jumping sentences on queue */
			plab._queueAdd( '_jumpSentencesProxy', arguments );
			return plab;
		};

		plab.nextWord 	  = function () { return plab.jumpWords( 1 ); };
		plab.nextSentence = function() { return plab.jumpSentences( 1 ); };
		plab.prevWord 	  = function () { return plab.jumpWords( -1 ); };
		plab.prevSentence = function() { return plab.jumpSentences( -1 ); };
		// Can't see a reason for `nextFragment` etc.


		// =================== SCRUBBER BAR (probably, and maybe scrolling) =================== \\

		plab._jumpToProxy = function ( indx ) {
		/* ( int ) -> Playback
		* 
		* Moves to an absolute word position (not relative). Any
		* positions below 0 hit the beginning as if moving backwards.
		* ??: Makes sense as expected behavior?
		* Called by queue, `.nextWord`, and `.prevWord`.
		* 
		* Theoretically `._stepper` can loop around to the end when
		* negative, but I don't see a reason to complicate things here.
		* Any use cases?
		*/
			plab._onceProxy( indx );
			return plab;
		};  // End plab.jumpTo()

		plab.jumpTo = function ( indx ) {
		/* () -> Playback :: Puts 'jumping to particular spot' on queue */
			plab._queueAdd( '_jumpToProxy', arguments );
			return plab;
		};



		// ========== FF and REWIND (arrow keys and other) ========== \\

		plab._accelerate = function ( frag ) {
		/* ( str ) -> Float :: Default rewind/ffwd acceleration just stays the same */
			// TODO: Change name - this is actually just speed or delay or something.
			return 20;
		};

		plab._rewindProxy = function ( accelerateOverride ) {
		/* ( none || func ) -> Playback
		* 
		* Goes backwards at a speed determined by, in order of precedent,
		* `accelerateOverride`, `state`, or default internal function. In
		* this way, caller can do fancy stuff like move faster the longer
		* a user rewinds, or can just give a different rewinding speed.
		* Default currently just a steady speed.
		* Only called from queue.
		* 
		* TODO:
		* - ??: What happens when rewind, etc. and then `.jumpWord` in
		* 	the middle (not at the start or end)? Doesn't revert, just stops?
		* 	Remember that reverting is to be handled externally now except in
		* 	`.toggle`.
		* - ??: Show current word first before moving on, like `._play`?
		*/
			plab._currentAction = 'rewind';  // ??: After event?

			var eventName = 'rewindBegin';
			plab._trigger( eventName, [eventName, plab] );

			plab._killLoop( null );
			plab._currentAction = 'rewind';

			plab._incrementors 	= [0, -1, 0];
			plab._direction 	= 'back';

			var accelerate = accelerateOverride || state.playback.accelerate || plab._accelerate;
			plab._loopProxy( null, null, accelerate );

			eventName = 'rewindFinish';
			plab._trigger( eventName, [eventName, plab] );

			return plab;
		};  // end plab.rewind()

		plab.rewind = function ( accelerateOverride ) {
		/* ( none || func ) -> Playback :: Puts rewinding on queue */
			plab._queueAdd( '_rewindProxy', arguments );
			return plab;
		};


		plab._fastForwardProxy = function ( accelerateOverride ) {
		/* ( none || func ) -> Playback
		* 
		* Goes forwards at a speed determined by, in order of precedent,
		* `accelerateOverride`, `state`, or default internal function. In
		* this way, caller can do fancy stuff like move faster the longer
		* a user fast-forwards, or can just give a different ffwding speed.
		* Default currently just a steady speed.
		* Only called from queue.
		* 
		* TODO: ??: Show current word first before moving on, like `._play`?
		*/
			var eventName = 'fastForwardBegin';
			plab._trigger( eventName, [eventName, plab] );

			plab._killLoop( null );
			plab._currentAction = 'fastForward';

			plab._incrementors 	= [0, 1, 0];
			plab._direction 	= 'forward';

			var accelerate = accelerateOverride || state.playback.accelerate || plab._accelerate;
			plab._loopProxy( null, null, accelerate );

			eventName = 'fastForwardFinish';
			plab._trigger( eventName, [eventName, plab] );

			return plab;
		};  // end plab.fastForward()

		plab.fastForward = function ( accelerateOverride ) {
		/* ( none || func ) -> Playback :: Puts fast-forwarding on queue */
			plab._queueAdd( '_fastForwardProxy', arguments );
			return plab;
		};



		// =================== DONE =================== \\

		plab._finishIfDone = function () {
        /* () -> Bool
		* 
		* If done, trigger 'done' event, stop the loop, change state
		* and prepare for a possible restart. Otherwise save not done.
		* Return true if done, false if not done.
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
				plab._stopProxy();
				var eventName = 'done';
				plab._trigger( eventName, [eventName, plab] );
	        } else {
	        	plab.done = false;
	        }

        	return plab.done;
		};  // End plab._finishIfDone()



		// ================================
		// LOOPS
		// ================================

        plab._signOf = function ( num ) {
        /* ( num ) -> -1 || 1 :: 0 counts as a positive number */
            return typeof num === 'number' ? num ? num < 0 ? -1 : 1 : num === num ? num : NaN : NaN;
        }

        plab._emitProgress = function () {
        /* () -> Playback :: Emit progress */
	        var eventName = 'progress';
	        plab._trigger( eventName, [eventName, plab, plab.getProgress()] );
	        return plab;
        };  // End plab._emitProgress()

        plab._getDirection = function ( incrementors ) {
        /* ( [ int, int, int ] || int ) -> 'forward' || 'back'
        * 
        * Returns direction of incrementors, either 'forward' or
        * 'back'. 0 counts as forward.
        */
        	var direction = 'forward';

        	if ( typeof incrementors === 'number' ) {
        		if ( plab._signOf( incrementors ) === -1 ) { direction = 'back'; }
        	} else {

        		for ( var inci = 0; inci < incrementors.length; inci++ ) {
        			if ( plab._signOf( incrementors[inci] ) === -1 ) {
        				direction = 'back';
        				break;
        			}
        		}  // end for incrementor item
        	}  // end if number

        	return direction;
        };  // End plab._getDirection()

        plab._skipVector = function ( incrementors, frag ) {
        /* ( [ int, int, int ], str ) -> [ int, int, int ] of 0, 1, or -1 || null
        * 
        * If part of the text should be skipped, returns a vector (-1 or 1)
        * and magnitude (fragment, word, or sentence) to increment in the
        * right direction past the skipped section. Otherwise returns null.
        * 
        * '$$skip$$' will be skipped. If you want fragments of certain
        * types to be skipped, use `state.playback.transformFragment` to
        * detect them and and return '$$skip$$'.
        * 
        * TODO:
        * - Change name of `.transformFragment` to something that doesn't
        * 	imply the fragment is going to be changed. Maybe even make it an
        * 	object with a bool, or just a bool || string.
        * - Actually, don't really need frag, could just get bool in here.
        * 	The only thing is that `transformFragment` could be used to
        * 	return something else to be used in place of the frag (would
        * 	need to change current code for that)
        */
			var vector = null;

			// Skip our special symbols ('$$skip$$')
			// TODO: ??: use state property with a fallback instead?
			// TODO: change to '$$skip$$'
			if ( frag === '$$skip$$' ) {
				var direction = plab._getDirection( incrementors );
				if ( direction === 'forward' ) { vector = [0, 0, 1] }
				else { vector = [0, 0, -1] }
			}

			return vector;
        };  // End plab._skipVector()

        plab._finishLoop = function () {
        /* () -> Playback :: Emit events, detect if done */
        	plab._emitProgress();
        	var eventName = 'loopFinish';
        	plab._trigger( eventName, [eventName, plab] );
        	// ??: Should this be before 'loopFinish'?
        	plab._finishIfDone();

        	return plab;
        };  // End plab._finishLoop()


        plab._loopProxy = function( incrementors, checkRepeatOverride, calcDelayOverride ) {
		/* ( [ [int, int, int] || int, func, func ] ) -> Playback
		* 
		* TODO: ??: Remove `checkRepeatOverride`? None use it atm.
		* TODO: Change `test` to `frag` again - that way the frag
		* can, if desired, be altered before it's displayed.
		* 
		* Uses the `stepper` to get a new fragment based on `incrementors`, then
		* sends out an event with the fragment. Calls itself until `checkRepeat`
		* returns false, pausing between each fragment for an amount of time returned
		* by `calcDelayOverride`, `state.playback.calcDelay`, or `._delayer.calcDelay`.
		* 
		* All three arguments are optional
		* `incrementors`: will only be used for the first loop, then loop
		* calls itself with `null` as the first argument (unless skipping).
		* `._play` and skipping loop both take advantage of this. Maybe in
		* future rewind and ffwd will as well.
		* `checkRepeatOverride`: `null` or `undefined` means "until
		* done". Given `Playback` instance and fragment.
		* `calcDelayOverride`: Argument given is the new fragment. Future
		* may include `Playback` instance (module needs adjustment).
		* 
		* Called by queue, `._play`, `._onceProxy`, `._rewindProxy`, and
		* `._fastFowardProxy`.
		*/
			var eventName = 'loopBegin';
			plab._trigger( eventName, [eventName, plab] );

			// Allows for stuff like `._play` to show current word, then keep going
			// If incrementors is an index number
			if ( typeof incrementors === 'number' && incrementors >= 0 ) {
				// Do nothing, `incrementors` is good as it is
				// This allows `incrementors` to be 0
				// TODO: wtf, why aren't negative incrementors accounted for here?
				// Conversly, why do positive incrementors have to be accounted for?
			} else {
				incrementors = incrementors || plab._incrementors;
			}

			var frag   		= plab._stepper.getFragment( incrementors ),
				tester 		= null,  // TODO: find better name
				skipVector 	= null;

			if ( state.playback.transformFragment ) {
				// Shoudl return "$$skip$$" to skip the fragment
				tester = state.playback.transformFragment( frag );
			}

			if ( tester !== null ) {
				// Skip 1 word in the right direction if needed
				// [int, int, int] of -1, 0, or 1
				skipVector = plab._skipVector( incrementors, tester );
			}

    	    if ( skipVector !== null ) {

    	    	// TODO: ??: Also add 'loopSkipBegin/Finish'?
				eventName = 'loopSkip';
				plab._trigger( eventName, [eventName, plab, frag] );

	    		plab._timeoutID = setTimeout( function nextLoopFromSkipping() {
    	    		plab._loop( skipVector, checkRepeatOverride, calcDelayOverride );  // Put on queue
    	    	}, 0);

    	    } else {

    	    	// How long this word fragment will remain on the screen before changing
    	    	var calcDelay = calcDelayOverride || state.playback.calcDelay || plab._delayer.calcDelay,
    	    		delay 	  = calcDelay( frag );
    	    	// TODO: change string-time library - parameters for `.calcDelay`
    	    	// so that can pass in ( `plab`, `frag` )

    	    	var checkRepeat = checkRepeatOverride || state.playback.checkRepeat || function () { return true; };

				// Don't loop again if no repeats desired
				if ( checkRepeat( plab, frag ) ) {

					plab._timeoutID = setTimeout( function nextLoopNormal() {
						// Put on queue. Solves a bunch of problems.
						plab._loop( null, checkRepeat, calcDelay );
					}, delay );

				}

				// Send fragment after setTimeout so that you can easily
				// pause on "newWordFragment" - pause kills the current
				// `._timeoutID`. Feels weird to put it here, though.
				eventName = 'newWordFragment';
				plab._trigger( eventName, [eventName, plab, frag, incrementors] );

    	    }  // end if skip fragment or not skip fragment

    	    plab._finishLoop();

			return plab;  // Return timeout id instead?
        };  // End plab._loopProxy()

		plab._loop = function ( incrementors, checkRepeatOverride, calcDelayOverride ) {
		/* () -> Playback 
		* 
		* Puts loop on queue. Should only be called internally from `._loopProxy`
		*/
			plab._queueAdd( '_loopProxy', arguments );
			return plab;
		};



        // ============== DO IT ============== \\
		plab._init()

		return plab;
	};  // End Playback() -> {}

    return Playback;
}));
