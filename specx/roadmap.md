# Specs


## Other Questions
- Do I need to wait a bit after finishing each test to make sure that nothing unexpected happens after?


## Fragments
- Multi-fragment word at start
- Single fragment word at start
- Multi-fragment word at end
- Single fragment word at end


## Single function calls
- At start
  - .process

- At runtime
  - [partly done] .play
  - .reset
  - [partly done] .restart
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

- 'playBegin', 'playFinish'
- 'resetBegin', 'resetFinish'
- 'restartBegin', 'restartFinish'
- 'pauseBegin', 'pauseFinish'
- 'stopBegin', 'stopFinish'
- 'closeBegin', 'closeFinish'
- 'onceBegin', 'onceFinish'
- 'resumeBegin', 'resumeFinish'
- 'rewindBegin', 'rewindFinish'
- 'fastForwardBegin', 'fastForwardFinish'
- 'loopBegin', 'loopFinish'
- 'newWordFragment'
- 'loopSkip'
- 'progress'
- 'done'


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


## Single Functions (at very start, no events)

- .play
- .reset
- .restart
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


## Function Self-Combos (at different events)
_??: At beginning, middle, and end? At sentence and word boundries?_

- .play(), .play() again at 'playBegin'
- .play(), .play() again at 'playFinish'
- .play(), .play() again at 'loopBegin'
- .play(), .play() again at 'loopFinish'
- .play(), .play() again at 'loopSkip'
- .play(), .play() again at 'newWordFragment'
- .play(), .play() again at 'done'

- .restart(), .restart() again at 'restartBegin'
- .restart(), .restart() again at 'restartFinish'
- .restart(), .restart() again at 'playBegin'
- .restart(), .restart() again at 'playFinish'
- .restart(), .restart() again at 'loopBegin'
- .restart(), .restart() again at 'loopFinish'
- .restart(), .restart() again at 'loopSkip'
- .restart(), .restart() again at 'newWordFragment'
- .restart(), .restart() again at 'done'

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


## Simple Function Combos (at different events)
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





## Diagram of transition to internal/temporary states to resumed state

play > play					>> "play"			>> "play"
play > restart				>> "play"			>> "play"
play > pause/stop/close		>> "pause"			>> "pause"
play > rewind				>> "rewind"			>> "play"
play > fastForward			>> "fastForward"	>> "play"
play > togglePlayPause?		>> "play"/"pause"	>> "same"
play > jumpWords			>> "jump"			>> "play"
play > jumpSentences		>> "jump"			>> "play"
play > nextWord				>> "jump"			>> "play"
play > nextSentence			>> "jump"			>> "play"
play > prevWord				>> "jump"			>> "play"
play > prevSentence			>> "jump"			>> "play"
play > jumpTo				>> "jump"			>> "play"

restart > play				>> "play"			>> "play"
restart > restart			>> "play"			>> "play"
restart > pause/stop/close	>> "pause"			>> "pause"
restart > rewind			>> "rewind"			>> "play"
restart > fastForward		>> "fastForward"	>> "play"
restart > togglePlayPause?	>> "play"/"pause"	>> "same"
restart > jumpWords			>> "jump"			>> "play"
restart > jumpSentences		>> "jump"			>> "play"
restart > nextWord			>> "jump"			>> "play"
restart > nextSentence		>> "jump"			>> "play"
restart > prevWord			>> "jump"			>> "play"
restart > prevSentence		>> "jump"			>> "play"
restart > jumpTo			>> "jump"			>> "play"

pause > play				>> "play"			>> "play"
pause > restart				>> "play"			>> "play"
pause > pause/stop/close	>> "pause"			>> "pause"
pause > rewind				>> "rewind"			>> "pause"
pause > fastForward			>> "fastForward"	>> "pause"
pause > togglePlayPause?	>> "play"/"pause"	>> "same"
pause > jumpWords			>> "jump"			>> "pause"
pause > jumpSentences		>> "jump"			>> "pause"
pause > nextWord			>> "jump"			>> "pause"
pause > nextSentence		>> "jump"			>> "pause"
pause > prevWord			>> "jump"			>> "pause"
pause > prevSentence		>> "jump"			>> "pause"
pause > jumpTo				>> "jump"			>> "pause"

rewind/others > play				>> "play"			>> "play"
rewind/others > restart				>> "play"			>> "play"
rewind/others > pause/stop/close	>> "pause"			>> "pause"
rewind/others > rewind				>> "rewind"			>> "prev"/"pause"
rewind/others > fastForward			>> "fastForward"	>> "prev"/"pause"
rewind/others > togglePlayPause?	>> "play"/"pause"	>> "same"
rewind/others > jumpWords			>> "jump"			>> "prev"/"pause"
rewind/others > jumpSentences		>> "jump"			>> "prev"/"pause"
rewind/others > nextWord			>> "jump"			>> "prev"/"pause"
rewind/others > nextSentence		>> "jump"			>> "prev"/"pause"
rewind/others > prevWord			>> "jump"			>> "prev"/"pause"
rewind/others > prevSentence		>> "jump"			>> "prev"/"pause"
rewind/others > jumpTo				>> "jump"			>> "prev"/"pause"


togglePlayPause is separate?
??: play > togglePlayPause > togglePlayPause

## TODO
.reset
.resume
