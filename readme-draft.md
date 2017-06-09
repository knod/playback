
# Broader Project

The final project is similar to this: http://the-digital-reader.com/wp-content/uploads/2015/09/word-runner-gif.gif



## Customization

The user will be able to customize things like:

- Maximum number of characters shown at a time (for some users with visual impairments), results in word fragments sometimes
- Amount of time a word will be displayed (based on the characteristics of the word)
- Font size
- Colors



## Playback

The user will have playback controls that can do things like:

- Currently
  - Play
  - Pause
  - Go back or forward one word at a time
  - Go back or forward one sentence at a time
  - Plain old rewind
  - Plain old fast forward
  - Drag a slider to get to a different parts of the text
- Planned
  - Go back or forward one paragraph at a time
  - Scroll horizontally through words
  - Scroll vertically through sentences



## Feedback to User

- Current
  - A progress bar showing the user how far they've gotten in the text
  - A quickly fading image and sound queue to show when they have pressed play or pause
- Planned
  - Audio feedback



# Playback Logic Specifically

The current module we're troubleshooting - https://github.com/knod/playback/tree/tests

When the `Playback` instance is created it is given a `state` object that needs to remain un-destroyed and relevant. This is how it will be able to change its behavior if things like "maximum number of characters allowed at one time" are changed during runtime. Details about this will have to come at a later date because there are many and I can't see how they're relevant to the current issue. If it becomes apparent that they are relevant, I will add them in.

Before using the `Playback` instance, you must call its `.process()` with an argument of `[ [ String ] ]` (array of arrays of strings - array of sentences which are themselves arrays of words). This is the text it will navigate through.

During runtime, the instance will send out events (through `state.emitter`). The one that tends to be the most important is 'newWordFragment' which delivers a string in its payload that is the string that should be displayed.



### Important Internal States

There are two main internal state variables that keep hold of what action the `Playback` instance should be doing at any given time:

- `._persistentAction` - either 'play' or 'pause', the action to come back to after a temporary action, like rewinding, is finished (only changed in specific functions)
- `._currentAction` - 'play', 'pause', 'jump', 'rewind', or 'fastForward', the current (temporary) action going on. Used to toggle play/pause and to make sure temporary actions, like rewinding, can't be called while in the middle of doing that same action.

Others:

- `.done` - `true` or `false`, tells `.play()` whether to restart or not
- `._timeoutID` - an `int`, allows pausing, stopping whatever loop is currently active
- `._direction` - 'forward' or 'back', when the code checks whether the end has been reached, it needs to know whether to check against the end of the array or the beginning of the array (when traveling backwards)
- `._incrementors` - `[0, 0, 1]` is one step forward, an array of positive or negative ints that represent deltas - the first int represents the delta of the current sentence change, the second is for words, and the third is for word fragments. This argument can also be a number, in which case the code pretends that the array of arrays is just a 1-dimentional array of words and the number represents the index of that word within the 1D array.

Most actions (all?) are paused before they they start on their own procedures.



### Important Internal Variables

- `._loop()` - an asynchronous update loop. The intervals that Can be called many ways. Is able to skip forward or back if certain conditions are met.
- Add more later



### Functions that manipulate your navigation through the text:

- `.play()`
- `.reset()` - sets variables and properites back to their starting value and sends the first fragment
- `.restart()` - resets and plays
- `.resume()` - resumes either playing or pausing depending on what's appropriate (could be used, for example, for disengaging rewind)
- `.pause()`, `.stop()`, `.close()` (proxies/variants for each other)
- `.rewind()`
- `.fastForward()`
- `.toggle()`
- `.jumpWords()` - move forward or backward a certain number of words
- `.jumpSentences()` - move forward or backward a certain number of sentences
- `.nextWord()`
- `.nextSentence()`
- `.prevWord()`
- `.prevSentence()`
- `.jumpTo()` - jump to a specific word index (as described above with `._incrementors`)



### Other functions:

- `.getProgress()`
- `.getLength()`
- `.getIndex()`



### Events (all contain, at the very least, the `Playback` instance itself):

Events allow their listeners to do things like change UI when appropriate (changing button icons, pulsing a symbol, etc.). They can also theoretically be used to change something if necessary.

- Once when external function called
  - 'playBegin', 'playFinish'
  - 'resetBegin', 'resetFinish'
  - 'restartBegin', 'restartFinish'
  - 'pauseBegin', 'pauseFinish'
  - 'stopBegin', 'stopFinish'
  - 'closeBegin', 'closeFinish'
  - 'onceBegin', 'onceFinish' (occurs with all the 'jump' functions - name currently being debated)
  - 'resumeBegin', 'resumeFinish'
  - 'rewindBegin', 'rewindFinish'
  - 'fastForwardBegin', 'fastForwardFinish'
- Once per loop
  - 'loopBegin', 'loopFinish'
  - 'loopSkip'
  - 'newWordFragment' (near the end of loop)
  - 'progress' (near the end of loop)
  - 'done' (at the end of loop, when appropriate)



### Other Features

- `state.transformFragment()` can be used to skip fragments (sometimes whitespace is skipped) or to temporarily replace characters (sometimes whitespaces are shown as symbols) by returning '$$skip$$'.
- Has many default values that can be used instead of `state` values. Debating making it possible to override the internal values temporarily in other ways, like through function calls.



### Dependencies

- `prose-stepper` - makes a map of the sentences and words that allows navigation through them through `incrementors` (described earlier)
- `string-time` - determines how long of a delay to give to each word based on the characteristics of the word. For example, a word with symbols will usually remain on screen for longer than one without symbols. The user can adjust these delays.



## Tests

The problem with testing all these functions is that they need to be tested (calling them here 'x', 'y', and 'z'):

- By themselves (x)
- In simple combinations (x then y, x then z, y then z)
- In complex combinations (x then y then x again, x then y then z, y then x then y again)
- Directly after different events

Each of those factors could trigger bugs. First off, there's no practical way I can think of to test every single combination that could ever happen. Secondly, it's probable that not _all_ of these configurations are ones that need to be tested, but I don't know how to identify which ones are the key combinations.

My preliminary thoughts for tests: https://github.com/knod/playback/blob/tests/spec/roadmap.md

Is there a way to automate this? Certainly there's a way to automate calling different combinations at different events, but the expected outputs can't be automated.



_Example of acceleration function_

``` js
var oldAccTime, notStartedAccYet = true, defaultDelay = 300;
plab._accelerate = function ( frag ) {

// Less delay as time goes on
// When first run
  if ( notStartedAccYet ) {
   oldAccTime       = Date.now();
   notStartedAccYet = false;
  }

  var elapsed = Date.now() - oldAccTime,
      elapsedIterations = elapsed/defaultDelay;
      elapsedIterations = Math.max( 1, elapsed );
      elapsedIterations = Math.max( 60, elapsed );

  // var delay = defaultDelay - elapsed;
  // console.log(delay, elapsed, elapsed/20, (elapsed - elapsed/20))
  // xxx(15 - 0)/(10 - 60) = -0.3 (slope)
  // iteration 1: 0, iteration last: 15
  // delay start 1: 60, delay end: 10

  // TODO: Actually check if state delay is 0 or above
  var baseDelay;
  if ( state._baseAccelerationDelay >= 0 ) {
   baseDelay = state._baseAccelerationDelay;
  } else {
   baseDelay = defaultDelay;
  }

  var delay = baseDelay + (elapsedIterations * -0.15);
  delay = Math.max( 5, delay )

  // return delay;

  return 20;
};
```


https://gist.github.com/knod/f0d90da58b4837c74ff83a296b07c6f7
