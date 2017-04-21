# Specs


## Single function calls
- At start
  - .process

- At runtime
  - [partly done] .restart
  - [partly done] .play
  - [partly done] .pause, .stop, .close (proxies/variants for each other)
  - [partly done] .rewind
  - .fastForward
  - .togglePlayPause
  - .jumpWords
  - .jumpSentences
  - .nextWord
  - .nextSentence
  - .prevWord
  - .prevSentence
  - .jumpTo
  - .getProgress
  - .getLength
  - .getIndex


## Events

- 'restartBegin', 'restartFinish'
- 'playBegin', 'playFinish'
- 'pauseBegin', 'pauseFinish'
- 'stopBegin', 'stopFinish'
- 'closeBegin', 'closeFinish'
- 'resumeBegin', 'resumeFinish'
- 'onceBegin', 'onceFinish'
- 'rewindBegin', 'rewindFinish'
- 'fastForwardBegin', 'fastForwardFinish'
- 'loopBegin', 'loopFinish'
- 'newWordFragment'
- 'done'
- 'progress'
- 'loopSkip'


## State Properties

- At start
  - state.stepper
  - state.delayer

- At runtime
  - state.emitter
  - state.emitter.trigger()
  - state.playback
  - state.playback.accelerate()
  - state.playback.transformFragment()
  - state.playback.calcDelay()
  - state.playback.checkRepeat()


## Functions once (at very start, no events)

- .restart
- .play
- .pause, .stop, .close (proxies/variants for each other)
- .rewind
- .fastForward
- .togglePlayPause
- .jumpWords
- .jumpSentences
- .nextWord
- .nextSentence
- .prevWord
- .prevSentence
- .jumpTo
- .getProgress
- .getLength
- .getIndex


## Function self-combos (at different events)

- .restart(), .restart() again at 'restartBegin'
- .restart(), .restart() again at 'restartFinish'
- .restart(), .restart() again at 'playBegin'
- .restart(), .restart() again at 'playFinish'
- .restart(), .restart() again at 'loopBegin'
- .restart(), .restart() again at 'loopFinish'
- .restart(), .restart() again at 'loopSkip'
- .restart(), .restart() again at 'newWordFragment'
- .restart(), .restart() again at 'done'

- .play(), .play() again at 'playBegin'
- .play(), .play() again at 'playFinish'
- .play(), .play() again at 'loopBegin'
- .play(), .play() again at 'loopFinish'
- .play(), .play() again at 'loopSkip'
- .play(), .play() again at 'newWordFragment'
- .play(), .play() again at 'done'

- .rewind(), .rewind() again at 'rewindBegin'
- .rewind(), .rewind() again at 'rewindFinish'
- .rewind(), .rewind() again at 'loopBegin'
- .rewind(), .rewind() again at 'loopFinish'
- .rewind(), .rewind() again at 'loopSkip'
- .rewind(), .rewind() again at 'newWordFragment'
- .rewind(), .rewind() again at 'done'

- .fastForward(), .fastForward() again at 'fastForwardBegin'
- .fastForward(), .fastForward() again at 'fastForwardFinish'
- .fastForward(), .fastForward() again at 'loopBegin'
- .fastForward(), .fastForward() again at 'loopFinish'
- .fastForward(), .fastForward() again at 'loopSkip'
- .fastForward(), .fastForward() again at 'newWordFragment'
- .fastForward(), .fastForward() again at 'done'

- .togglePlayPause(), .togglePlayPause() again at 'playBegin'
- .togglePlayPause(), .togglePlayPause() again at 'playFinish'
- .togglePlayPause(), .togglePlayPause() again at 'pauseBegin'
- .togglePlayPause(), .togglePlayPause() again at 'pauseFinish'
- .togglePlayPause(), .togglePlayPause() again at 'loopBegin'
- .togglePlayPause(), .togglePlayPause() again at 'loopFinish'
- .togglePlayPause(), .togglePlayPause() again at 'loopSkip'
- .togglePlayPause(), .togglePlayPause() again at 'newWordFragment'
- .togglePlayPause(), .togglePlayPause() again at 'done'

- .jumpWords(), .jumpWords() again at 'onceBegin'
- .jumpWords(), .jumpWords() again at 'onceFinish'
- .jumpWords(), .jumpWords() again at 'loopBegin'
- .jumpWords(), .jumpWords() again at 'loopFinish'
- .jumpWords(), .jumpWords() again at 'loopSkip'
- .jumpWords(), .jumpWords() again at 'newWordFragment'
- .jumpWords(), .jumpWords() again at 'done'

- .jumpSentences(), .jumpSentences() again at 'onceBegin'
- .jumpSentences(), .jumpSentences() again at 'onceFinish'
- .jumpSentences(), .jumpSentences() again at 'loopBegin'
- .jumpSentences(), .jumpSentences() again at 'loopFinish'
- .jumpSentences(), .jumpSentences() again at 'loopSkip'
- .jumpSentences(), .jumpSentences() again at 'newWordFragment'
- .jumpSentences(), .jumpSentences() again at 'done'

- .nextWord(), .nextWord() again at 'onceBegin'
- .nextWord(), .nextWord() again at 'onceFinish'
- .nextWord(), .nextWord() again at 'loopBegin'
- .nextWord(), .nextWord() again at 'loopFinish'
- .nextWord(), .nextWord() again at 'loopSkip'
- .nextWord(), .nextWord() again at 'newWordFragment'
- .nextWord(), .nextWord() again at 'done'

- .nextSentence(), .nextSentence() again at 'onceBegin'
- .nextSentence(), .nextSentence() again at 'onceFinish'
- .nextSentence(), .nextSentence() again at 'loopBegin'
- .nextSentence(), .nextSentence() again at 'loopFinish'
- .nextSentence(), .nextSentence() again at 'loopSkip'
- .nextSentence(), .nextSentence() again at 'newWordFragment'
- .nextSentence(), .nextSentence() again at 'done'

- .prevWord(), .prevWord() again at 'onceBegin'
- .prevWord(), .prevWord() again at 'onceFinish'
- .prevWord(), .prevWord() again at 'loopBegin'
- .prevWord(), .prevWord() again at 'loopFinish'
- .prevWord(), .prevWord() again at 'loopSkip'
- .prevWord(), .prevWord() again at 'newWordFragment'
- .prevWord(), .prevWord() again at 'done'

- .prevSentence(), .prevSentence() again at 'onceBegin'
- .prevSentence(), .prevSentence() again at 'onceFinish'
- .prevSentence(), .prevSentence() again at 'loopBegin'
- .prevSentence(), .prevSentence() again at 'loopFinish'
- .prevSentence(), .prevSentence() again at 'loopSkip'
- .prevSentence(), .prevSentence() again at 'newWordFragment'
- .prevSentence(), .prevSentence() again at 'done'

- .jumpTo(), .jumpTo() again at 'onceBegin'
- .jumpTo(), .jumpTo() again at 'onceFinish'
- .jumpTo(), .jumpTo() again at 'loopBegin'
- .jumpTo(), .jumpTo() again at 'loopFinish'
- .jumpTo(), .jumpTo() again at 'loopSkip'
- .jumpTo(), .jumpTo() again at 'newWordFragment'
- .jumpTo(), .jumpTo() again at 'done'


## Function combos (at different events)
_(`.pause()` counts for `.stop()` and `.close()` too. Should `.rewind()` stand for `.ffwd()` too?)_

- .play(), .pause() at 'playBegin'
- .play(), .pause() at 'playFinish'
- .play(), .pause() at 'loopBegin'
- .play(), .pause() at 'loopFinish'
- .play(), .pause() at 'loopSkip'
- .play(), .pause() at 'newWordFragment'
- .play(), .pause() at 'done'

--- outdated below here ---
- .play(), .pause() at 'playBegin', .play() again at 'pauseBegin'
- .play(), .pause() at 'playBegin', .play() again at 'pauseFinish'
- .play(), .pause() at 'playFinish', .play() again at 'pauseBegin'
- .play(), .pause() at 'playFinish', .play() again at 'pauseFinish'

- .play(), .rewind() at 'playBegin'
- .play(), .rewind() at 'playFinish'
- .play(), .rewind() at 'loopBegin'
- .play(), .rewind() at 'loopFinish'
- .play(), .rewind() at 'loopSkip'
- .play(), .rewind() at 'newWordFragment'

- .play(), .rewind() at 'playBegin', .rewind() again immediately
- .play(), .rewind() at 'playFinish', .rewind() again immediately
- .play(), .rewind() at 'loopBegin', .rewind() again immediately
- .play(), .rewind() at 'loopFinish', .rewind() again immediately
- .play(), .rewind() at 'loopSkip', .rewind() again immediately
- .play(), .rewind() at 'newWordFragment', .rewind() again immediately


