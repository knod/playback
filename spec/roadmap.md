# Specs


## Single function calls

- [partly done] .restart
- [partly done] .play
- [partly done] .pause, .stop, .close
- [partly done] .rewind
- .process
- .getProgress
- .getLength
- .getIndex
- .togglePlayPause
- .jumpWords
- .jumpSentences
- .nextWord
- .nextSentence
- .prevWord
- .prevSentence
- .jumpTo
- .fastForward


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
- 'done'
- 'progress'
- 'loopSkip'
- 'newWordFragment'


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


## Function self-combos (at different events)

- .play(), .play() again at 'playBegin'
- .play(), .play() again at 'playFinish'
- .play(), .play() again at 'loopBegin'
- .play(), .play() again at 'loopFinish'
- .play(), .play() again at 'loopSkip'
- .play(), .play() again at 'newWordFragment'


## Function combos (at different events)
_(`.pause()` counts for `.stop()` and `.close()` too. Should `.rewind()` stand for `.ffwd()` too?)_

- .play(), .pause() at 'playBegin'
- .play(), .pause() at 'playFinish'
- .play(), .pause() at 'loopBegin'
- .play(), .pause() at 'loopFinish'
- .play(), .pause() at 'loopSkip'
- .play(), .pause() at 'newWordFragment'

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


