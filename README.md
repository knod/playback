<!-- lang js -->
# PLAYBACK

An event-based tool that allows control of the playback of parsed text. Sends out word fragments at intervals, pauses, rewinds, jumps by sentences, and does other playback jazz.

---------------------

## About

---------------------

A module for an RSVP (rapid serial visual presentation) reader, mainly for the purpose of displaying the text of a website's article in an accessible way. It has the potential to help people with visual impairment and some kinds of reading difficulties. It can also be an aide to speed reading. The final product will do something like this: http://the-digital-reader.com/wp-content/uploads/2015/09/word-runner-gif.gif

---------------------

## This Module

---------------------

An event-based tool that allows control of the playback of parsed text.

Given an array of arrays of strings (which represents sentences made up of words), will send out various events with relevant data. The main event is 'newWordFragment' which, among other things, delivers a string of the word <span>fragment*</span> that should be displayed. Using a `state` object or defaults, calculates a delay between each fragment transmission based on the characteristics of that fragment. It can move forward, backward, and jump to positions. It can move by sentence, word, or fragment.

<span>*</span> When needed, a word gets broken into fragments so it can fit in an element. Some people, for example, have a limited field of vision, so they'll need to set the options of the tool so that words are broken up into smaller fragments.

---------------------

## Getting Started

---------------------

### Downloading
------------

You can use this module in a browser by linking to it in your html page, but, unless you build custom objects, it means you have to get a couple of other modules too. You'll need the module that organizes and keeps track of the positions in the text (https://github.com/knod/prose-stepper) which uses a second module (https://github.com/knod/hyphenaxe) to split words into fragments. You'll need a script that figures out the delay between each new fragment (https://github.com/knod/string-time) and you'll need a fourth module that can emit events (https://github.com/Olical/EventEmitter). Once you've downloaded all the scripts, you can put this in the `<head>` element of your html page:
``` html
<script src='/filepath-to-script/EventEmitter/EventEmitter.js'></script>
<script src='/filepath-to-script/hyphenaxe/lib/hyphenaxe.js'></script>
<script src='/filepath-to-script/prose-stepper/dist/prose-stepper.js'></script>
<script src='/filepath-to-script/string-time/dist/string-time.js'></script>
<script src='/filepath-to-script/playback/dist/playback.js'></script>
```

If you're using npm then first open your terminal or command prompt, navigate to the right directory (folder), and install the project there with:
```bash
npm install @knod/playback --save
```

<!-- ============================ -->

------------
### Instantiation
------------

Now you're going to need a `state` object and some parsed text.

``` js
var myEmitter = new EventEmitter();

// Instantiate the stuff that state is required to have
var state = {
	emitter: myEmitter,
	stepper: {},
	delayer: {},
	playback: {}
};

// You can get your parsed text from elsewhere as long as it's in
// this format when you hand it to `playback` for processing -
// an array of sentences which are themselves arrays of strings.
var parsedText = [
	[ 'Victorious,', 'you','brave', 'flag.' ],
	[ 'Delirious,', 'I', 'come', 'back.' ],
	[ '\n' ],
	[ 'Why,', 'oh', 'wattlebird?' ]
];

var playback = Playback( state );
// This is a bit annoying, but it makes it possible to give new
// text to `playback` whenever you want.
playback.process( parsedText );
```

<!-- ============================ -->

------------
### What Now?
------------

Now listen carefully before you tip over the first domino:
``` js
var showWord = function ( eventName, playbackInstance, fragment ) {
	console.log( fragment );
};

state.emitter.on( 'newWordFragment', showWord );

playback.play();
```

Those are the basics! More fancy stuff is described below.

---------------------

## Development

---------------------

Issue filing welcome. Pull requests are also welcome, but the tests still have to be set up to run automatically. Currently you'll have to run each test script in the console separately and let each finish before moving onto the next. You can run each test individually:

```bash
node tests/singles
node tests/combos
node tests/skips
node tests/skip-combos
``` 

Or you can run all the tests at once:

```bash
npm test
``` 

Running all the tests at once takes about 3.5min. and willhave some weird "Unhandled promise rejection" errors (maybe my code or may be the fake-clock module I'm using to make the tests faster and more consistent). The weird promise rejection things are fine. Actual failures should be in red.

---------------------

## API

---------------------

### Definitions/Variables
------------

**incrementors**

Either an array of three integers or one single integer. There are two ways that incrementors move in the text. They can either navigate to an absolute position ("go to the third word") or to a relative position ("go three words forwards from here"). An array of integers is for relative movement (see number 1 below) while a single integer is for absolute movement (see number 2 below). The examples use `.once()` because that function uses incrementors most directly, but this is the behavior whenever they are used:

1. **Relative movement:** `.once( [ int, int, int ] )` will move you backwards or forwards relative to your current position in the text. The first integer says how many sentences to move forward or back, the second integer is for words, and the third integer is for fragments. Positive integers will move forward and negative integers will move backwards. So to move back three words you'd do `.once( [ 0, -3, 0 ] ). It only listens to the first non-zero integer. That is, if you send `[ -1, 2, 5 ]`, it'll just move one sentence backwards and ignore the rest. You can also send `[ 0, 0, 0 ]` to get the current fragment. **Note:** If you're in the middle of a sentence or word and you move backwards, the first move is to the beginning of that sentence or word.

2. **Absolute movement:** `.once( int )` will take you to the position/index in the text that the integer indicates. It acts as if the parsed text is a simple array of words and your integer is being used as an index position. If you try to navigate past the end, you'll just get the first fragment of the last word. If you use a negative number you'll get the first fragment of the first word. In both of those cases, you'll set off the 'done' event and its friends.


**progress**

A fraction/float that's > 0 and <= 1 representing how far along in the text the current position is.


**direction**

Negative numbers are treated as going backwards. Positive numbers and 0 are treated as going forwards.


**loop**

The loop is basically the point of this whole thing. It's like the update loop in a game or animation. It fires events that, among other things, will transmit the fragment. It's events are described below.

**queue**

**Don't mess with the queue.** The queue is the way the package lines up functions to be called one after another so they don't interfere with each other.

<!-- TODO: fragment? loop? loop events? -->

------------
### `Playback`
------------

The Playback constructor can take from 1 to 3 arguments:

1. (Required) A `state` object described below
2. (Optional) A constructor for an object that controls navigation through parsed text (see the default here: https://github.com/knod/prose-stepper)
3. (Optional) A constructor for an object that can return a number of milliseconds - the amount of time between the transmission of each new fragment (see the default here: https://github.com/knod/string-time)

<!-- ============================ -->

------------
### `state` Object Properties
------------

_See "Getting Started" above for an example of a state object and instantiation._

The `state` object passed in to `Playback` and its mutable properties **MUST NOT BE DESTROYED**. You can alter its properties non-destructively, but you can't destroy its properties right now. Currently there's no way to set a new `state`.

#### REQUIRED `state` PROPERTIES

**`.emitter`**

An event emitter with a `.trigger` function.

**`.stepper`** 

Can be an empty object. State properties for the stepper object, all of which are optional. See the default stepper and what can use here: https://github.com/knod/prose-stepper.

**`.delayer`**

Can be an empty object. State properties for the delayer object, all of which are optional. See the default delayer and what can use here: https://github.com/knod/string-time.

**`.playback`**

Can be an empty object. State properties for this object, all of which are optional and listed below.



#### OPTIONAL `state.playback` PROPERTIES

_All properties of `state.playback` that this package can use_

**`.calcDelay( str )`**

Will be given a string - the current fragment -  and should return a millisecond values. That value is the delay till the next fragment is transmitted. It can be calculated based on the characteristics of the fragment. A function for an alternative delay calculation if you're into that. It can control delays between new fragments. By default it will use the "delayer" constructed at the start, either the default one or one you hand in on instantiation. _In future this will be given two arguments in instead of one - the `Playback` instance and the word fragment._

**`.accelerate( str )`**

Will be given a string - the current fragment -  and should return a millisecond value. Basically a temporary replacement for `.calcDelay()`. A function that `.rewind()` and `.fastForward()` call. It should return the amount of ms delay until the next non-skipping fragment is transmitted. It can be used to do things like return smaller and smaller values, allowing rewinding and fast-forwarding to speed up over time. 'accelerate' is a terrible name for it and will probably change sometime. _In future this will be given two arguments in instead of one - the `Playback` instance and the word fragment._

**`.transformFragment( str )`**

YOU CAN USE THIS TO SKIP FRAGMENTS. Will be given a string - the current fragment -  and must return a string, either the same one or a different one. Also a terrible name. This won't actually transform the fragment in the array. It'll transform, basically, a copy of the fragment. It is a function that takes a string (the currently calculated fragment) and returns a string. If you return '@@skip@@', that fragment will be skipped. Right now it's just used for skipping, but in future this'll be your last chance to output something different than the current fragment.

**`.checkRepeat( str )`**

Will be given a string - the current fragment - and should return a boolean, true or false. It's a function that returns whether the loop should continue to repeat or if it should stop.

<!-- ============================ -->

------------
### `Playback` Properties For Your Use
------------

**`.done`**

Boolean. An indication of progress in the text. It will be `true` if the text navigation has either reached the end if traveling forward or reached the start if traveling backward. Otherwise, it will be `false`. It's the ony property that can/should be directly accessed from the outside of the package.

------------
### `Playback` Functions/Methods For Your Use
------------

#### SETUP

**`.process( [[str]] )`**

Takes an array of arrays of strings - your text parsed into an array of sentences which are themselves arrays of strings. This method allows the module to navigate your text. It can be called with new text whenever desired.

#### TEXT NAVIGATION/FLOW CONTROL

_Some may say there are too many functions here. I'd have to agree._

**`.play()`**

Starting with the current word fragment, transmit one word fragment at a time at intervals determined by the delay calcuations (see `.calcDelay()`), moving forward until the last fragment is reached. Fires the 'playBegin' and 'playFinish' events.

**`.pause()`**

What it sounds like. Fires the 'pauseBegin' and 'pauseFinish' events.

**`.toggle()`**

If `playback` is paused, stopped, or closed, it'll start it playing. If `playback` is playing, it will pause. It sets off the events of whatever it callse - 'playBegin' and 'playFinish', etc., for play, and so on. <!--If `playback` is doing something else (try not to toggle in the middle of something else - it's just a messy idea - but you can if you're desparate), like rewinding, it'll revert to either 'pause' or 'play', depending on what's appropriate (see `.revert()`). This is the only function that uses `.revert()` internally. Any other time you want to revert, you have to call `.revert()` yourself.-->



**`.fastForward()`**

Go forwards fast. Sets off the 'fastForwardBegin' and 'fastForwardFinish' events. If you define `state.playback.accelerate()`, you can use it to return a ms delay value, so you can adjust the speed, or even increase the speed over time, etc. You can see more about it in the 'OPTIONAL `state` PROPERTIES' section.

**`.rewind()`**

Go backwards fast. Sets off the 'rewindBegin' and 'rewindFinish' events. Otherwise, the same as `.fastForwards()`.

**`.revert()`**

This one's a tricky concept. `playback` can revert to either 'play' or 'pause'. It keeps track of what the last action of that type was and returns to it with this function. For example, if you were paused, then you rewound, then you fast-forwarded, and then called `.revert()`, `playback` would pause. You can use it to resume playing (or pausing) after doing some other action, like jumping forwards a few words. I know it sounds weird, but I've asked around - if a user was playing and then rewound, they'd expect the app to start playing again. Or at least that's what most people said. This lets you do that.



**`.restart()`**

What it sounds like. It fires the 'restartBegin' and 'restartFinish' events. It doesn't fire 'playBegin' or 'playFinish'.

**`.stop()`**

Another name for `.pause()`. It will set off the 'stopBegin' and 'stopFinish' events.

**`.close()`**

Another name for `.pause()`. It will set off the 'closeBegin' and 'closeFinish' events.



**`.once( [int, int, int] || int )`**

Takes either an array of three integers or one integer. Sets off the events 'onceBegin', 'onceFinish', and loop events. If playing and pausing aren't enough for you (they weren't for me), you can have complete control of navigation using incrementors. Look at the definition for 'incrementors' for more details.

`.once()` can do any of the text navigation operations described below. They're there because the arguments for incrementing can annoying and hard to remember. If you're going to use `.once()`, I suggest picking either relative or absolute movement, but not both. Code gets confusing after a while otherwise.



**`.current()`**

Will get the instance to transmit the current non-skipped fragment. Sets off the 'onceBegin', 'onceFinish', and loop events.

**`.nextWord(), .nextSentence(), .prevWord(), .prevSentence()`**

What they sound like. They set off the 'onceBegin', 'onceFinish', and loop events.



**`.jumpWords( int )`**

Takes a positive or negative int and uses it to move forward or back by word relative to the current position. If you're in the middle of a word, `.jumpWords(-1)` will go to the beginning of the word. It fires the 'onceBegin', 'onceFinish', and loop events.

**`.jumpSentences( int )`**

Takes a positive or negative int and uses it to move forward or back by sentence relative to the current position. If you're in the middle of a sentence, `.jumpSentences(-1)` will go to the beginning of the sentence. It fires the 'onceBegin', 'onceFinish', and loop events.

**`.jumpTo( int )`**

Takes a positive or negative int, though a negative int doesn't do much. Moves to an absolute position the the text. See 'Absolute' navigation in the description for `.once()`. It fires the 'onceBegin', 'onceFinish', and loop events.



**`.reset()`**

Reset values to their starting value, including clearing the queue (queue is in the definitions section). It fires the 'resetBegin' and 'resetFinish' events. Plain old `.reset()` does get added to the queue itself, so if you're really desparate, use `.forceReset()` which skips the queue.


**`.forcReset()`**

Like `.reset()` except it fires right away instead of putting itself on the queue and waiting for its turn (queue is in the definitions section). It fires the 'resetBegin' and 'resetFinish' events. <!-- It's possible to write code (in general, not specifically this package's fault) that the queue could keep gaining items until there are way too many. This will clear that queue so you can start doing stuff again. You'll have to figure out how to stop the build-up, though, or you'll keep having problems. -->



#### GETTERS & SETTERS

**`playback.getLength()`**

Returns the number of words in the text. Can be used to set up a scrubber bar that allows jumping to different parts of the text.

**`playback.getProgress()`**

Returns a positive float/fraction that has a maximum value of 1 and that is always greater than 0 (0 < progress <= 1). Can be used to set up a scrubber bar as described above, or can be used to set up a progress bar that shows how far the user has gotten in the text.

**`playback.getIndex()`**

Returns a positive integer representing the index of the current word relative to the other words. It's as if the parsed text had been turned into one array of all the words and you were looking for the index number of the current word.

<!-- **`playback.setState( {} )`**

Takes a `state` object (see '`state` Object Properties' above for what's required). Allows you to switch to a new state object.
 -->

#### FUTURE

Depending on need, may add `.next()` and `.prev()` to move by fragment, and `.skip()` to move one fragment forward without transmitting it through 'newWordFragment'.

<!-- ============================ -->

------------
### Events
------------


Events allow their listeners to do things like change UI when appropriate (changing button icons, pulsing a symbol, etc.).

All events send the same first two arguments - the event name as the first argument and the `Playback` instance as the second argument. Some events send further data:


**`'newWordFragment'`**

Sends: `eventName, playbackInstance, fragmentString, incrementors`. Fired when a loop is triggered and the fragment isn't skipped.


**`'loopSkipped'`**

Sends: `eventName, playbackInstance, skippedFragment`. Fired when a loop is triggered and the fragment _is_ skipped. _To be changed to 'skippedFragment'_.


**`'progress'`**

Sends: `eventName, playbackInstance, progressFraction`. Fired every loop


<!-- [[Before the 'done' event always come the 'stopBegin' and 'stopFinish' events]] -->


**loop events**

Functions that set off a fragment loop - like `.play()`, `.rewind()`, and `.jumpTo()` - can, after transmitting their 'Begin' event, set off a few other events. In the following description, 'foo' is a stand-in for whatever function you called (for `.play()` it would be 'play'). The events are, in order:

- 'fooBegin'
- 'loopBegin'
- 'loopSkip' or 'newWordFragment'
- 'progress'
- 'loopFinish'

Then if the end has been reached when moving forward or the start has been reached when moving backwards:

- 'stopBegin'
- 'stopFinish'
- 'done'

Then always ends with

- 'fooFinish'


**Functions that trigger loops/loop events**
- `.play()`
- `.toggle()` (if internal action state is paused)
- `.fastForward()`
- `.rewind()`
- `.revert()` (if reverts to playing)
- `.restart()`
- `.once()`
- `.current()`
- `.nextWord(), .nextSentence(), .prevWord(), .prevSentence()`
- `.jumpWords()`
- `.jumpSentences()`
- `.jumpTo()`


**Events that only get triggered internally**

- `'loopBegin/Finish'` - Triggered by anything that triggeres a loop
- `'newWordFragment'` - Triggered by anything that triggeres a loop where the fragment is NOT skipped
- `'loopSkip'` - Triggered by anything that triggeres a loop where the fragment IS skipped
- `'progress'` - Triggered by anything that triggeres a loop, skipped or not
- `'done'` - Triggered by anything that triggeres a loop that hits either the start while traveling forwards (`0` counts as forwards) or hits the start when traveling backwards


**Events that can get triggered externally, but are also sometimes triggered internally**

_That is, they have directly associated functions, but other functions that are called externally can also indirectly cause these to be triggered internally_

- `'resetBegin/Finish'` - Triggered by `.reset()` and `.forceReset()`
- `'playBegin/Finish'` - Triggered by `.play()` and, sometimes, `.toggle()`
- `'restartBegin/Finish'` - Triggered by `.restart()` and, when `.done` is `true`, `.play()` and `.toggle()`
- `'pauseBegin/Finish'` - Triggered by `.pause()`, `.revert()`, and someitmes `.toggle()`
- `'onceBegin/Finish'` - Triggered by `.once()`, `.current()`, and anything starting with '.jump', '.next', or '.prev'
- `'revertBegin/Finish'` - Triggered by `.revert()` and sometimes `.toggle()`
- `'stopBegin/Finish'` - Triggered by `.stop()` and anything that causes the playback to finish, either going forward or back

**Events that can only be triggered from external calls of their namesakes:**

- `'closeBegin/Finish'`
- `'rewindBegin/Finish'`
- `'fastForwardBegin/Finish'`

**Dev Events**

If you're wondering about `'_queued'` and `'_dequeued'`, they're events put there for development to simplify testing. Don't mess with the queue. A dequeueing operation will be triggered either when a new function is added to it or when a function called from the queue has finished its synchronous operations.




<!-- * DEVELOPMENT NOTES/GUIDES:
* - Where possible, return Playback so functions can be chained
* - Always send event name as the first argument to events and
* 	Playback as the second argument for consistency.
* - NO 'reverting' to revertable state internally. Module user
* 	should handle that.
* - Other than loops called from inside `._loopProxy`, no function put
* 	on the queue should put another function on the queue. Otherwise
* 	vulnerable to interruptions.
* - Functions not starting with '._' are almost always only called
* 	externally. Anytime one is called internally it will be noted (I hope). -->

