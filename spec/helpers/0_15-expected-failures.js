
jasmine.playbackExpectedFailures = [
  // TODO: When one of these is called, call a test from the exceptions file

  // No expected failures until I've dealt with them

  // for each initial function
  // 312 specs each initial event
  // ~15 seconds each initial event
  // 29 events
  // 16 initial functions
  // 16 x 29 x 15 = 6,960 seconds / 60 = 116 min / 60 = 1.93hrs

  // // ------- play > play ------- \\
  // 'play(null) > playBegin > play(null) > newWordFragment',  // [ 'you', 'brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ]
  // 'play(null) > playBegin > play(null) > playBegin',  // NOT triggered (why?)
  // 'play(null) > playBegin > play(null) > playFinish',  // NOT triggered (why?)
  // 'play(null) > playBegin > play(null) > restartBegin',  // triggered (why?)
  // 'play(null) > playBegin > play(null) > restartFinish',  // triggered (why?)
  // 'play(null) > playFinish > play(null) > playBegin',  // NOT triggered (why?)
  // 'play(null) > playFinish > play(null) > playFinish',  // NOT triggered (why?)
  // 'play(null) > playFinish > play(null) > restartBegin',  // triggered (why?)
  // 'play(null) > playFinish > play(null) > restartFinish',  // triggered (why?)
  // 'play(null) > resetFinish > play(null) > playBegin',  // NOT triggered (reset never triggered at start)
  // 'play(null) > resetFinish > play(null) > playFinish',  // NOT triggered (reset never triggered at start)
  // 'play(null) > resetFinish > play(null) > restartBegin',  // triggered (why?)
  // 'play(null) > resetFinish > play(null) > restartFinish',  // triggered (why?)
  // 'play(null) > restartBegin > play(null) > playBegin',
  // 'play(null) > restartBegin > play(null) > playFinish',
  // 'play(null) > restartBegin > play(null) > restartBegin',
  // 'play(null) > restartBegin > play(null) > restartFinish',
  // 'play(null) > onceFinish > play(null) > playBegin',
  // 'play(null) > onceFinish > play(null) > playFinish',
  // 'play(null) > onceFinish > play(null) > restartBegin',
  // 'play(null) > onceFinish > play(null) > restartFinish',
  // 'play(null) > resumeBegin > play(null) > playBegin',
  // 'play(null) > resumeBegin > play(null) > playFinish',
  // 'play(null) > resumeBegin > play(null) > restartBegin',
  // 'play(null) > resumeBegin > play(null) > restartFinish',
  // 'play(null) > resumeFinish > play(null) > playBegin',
  // 'play(null) > resumeFinish > play(null) > playFinish',
  // 'play(null) > resumeFinish > play(null) > restartBegin',
  // 'play(null) > resumeFinish > play(null) > restartFinish',
  // 'play(null) > rewindBegin > play(null) > playBegin',
  // 'play(null) > rewindBegin > play(null) > playFinish',
  // 'play(null) > rewindBegin > play(null) > restartBegin',
  // 'play(null) > rewindBegin > play(null) > restartFinish',
  // 'play(null) > loopBegin > play(null) > playBegin',
  // 'play(null) > loopBegin > play(null) > playFinish',
  // 'play(null) > loopBegin > play(null) > restartBegin',
  // 'play(null) > loopBegin > play(null) > restartFinish',
  // 'play(null) > loopFinish > play(null) > playBegin',
  // 'play(null) > loopFinish > play(null) > playFinish',
  // 'play(null) > loopFinish > play(null) > restartBegin',
  // 'play(null) > loopFinish > play(null) > restartFinish',
  // 'play(null) > newWordFragment > play(null) > playBegin',
  // 'play(null) > newWordFragment > play(null) > playFinish',
  // 'play(null) > newWordFragment > play(null) > restartBegin',
  // 'play(null) > newWordFragment > play(null) > restartFinish',
  // 'play(null) > progress > play(null) > playBegin',
  // 'play(null) > progress > play(null) > playFinish',
  // 'play(null) > progress > play(null) > restartBegin',
  // 'play(null) > progress > play(null) > restartFinish',

  // // time: 14.682

  // // play > restart
  // // play > reset
  // // play > pause
  // // play > stop
  // // play > close

  // // ------- play > toggle ------- \\
  // 'play(null) > playBegin > toggle(null) > newWordFragment',
  // 'play(null) > playBegin > toggle(null) > playFinish',
  // 'play(null) > playBegin > toggle(null) > restartBegin',
  // 'play(null) > playBegin > toggle(null) > restartFinish',
  // 'play(null) > playFinish > toggle(null) > playBegin',
  // 'play(null) > playFinish > toggle(null) > playFinish',
  // 'play(null) > playFinish > toggle(null) > restartBegin',
  // 'play(null) > playFinish > toggle(null) > restartFinish',
  // 'play(null) > resetFinish > toggle(null) > playBegin',
  // 'play(null) > resetFinish > toggle(null) > playFinish',
  // 'play(null) > resetFinish > toggle(null) > restartBegin',
  // 'play(null) > resetFinish > toggle(null) > restartFinish',
  // 'play(null) > restartBegin > toggle(null) > playBegin',
  // 'play(null) > restartBegin > toggle(null) > playFinish',
  // 'play(null) > restartBegin > toggle(null) > restartBegin',
  // 'play(null) > restartBegin > toggle(null) > restartFinish',
  // 'play(null) > onceFinish > toggle(null) > playBegin',
  // 'play(null) > onceFinish > toggle(null) > playFinish',
  // 'play(null) > onceFinish > toggle(null) > restartBegin',
  // 'play(null) > onceFinish > toggle(null) > restartFinish',
  // 'play(null) > resumeBegin > toggle(null) > playBegin',
  // 'play(null) > resumeBegin > toggle(null) > playFinish',
  // 'play(null) > resumeBegin > toggle(null) > restartBegin',
  // 'play(null) > resumeBegin > toggle(null) > restartFinish',
  // 'play(null) > resumeFinish > toggle(null) > playBegin',
  // 'play(null) > resumeFinish > toggle(null) > playFinish',
  // 'play(null) > resumeFinish > toggle(null) > restartBegin',
  // 'play(null) > resumeFinish > toggle(null) > restartFinish',
  // 'play(null) > rewindBegin > toggle(null) > playBegin',
  // 'play(null) > rewindBegin > toggle(null) > playFinish',
  // 'play(null) > rewindBegin > toggle(null) > restartBegin',
  // 'play(null) > rewindBegin > toggle(null) > restartFinish',
  // 'play(null) > loopBegin > toggle(null) > playBegin',
  // 'play(null) > loopBegin > toggle(null) > playFinish',
  // 'play(null) > loopBegin > toggle(null) > restartBegin',
  // 'play(null) > loopBegin > toggle(null) > restartFinish',
  // 'play(null) > loopFinish > toggle(null) > playBegin',
  // 'play(null) > loopFinish > toggle(null) > playFinish',
  // 'play(null) > loopFinish > toggle(null) > restartBegin',
  // 'play(null) > loopFinish > toggle(null) > restartFinish',
  // 'play(null) > newWordFragment > toggle(null) > playBegin',
  // 'play(null) > newWordFragment > toggle(null) > playFinish',
  // 'play(null) > newWordFragment > toggle(null) > restartBegin',
  // 'play(null) > newWordFragment > toggle(null) > restartFinish',
  // 'play(null) > progress > toggle(null) > playBegin',
  // 'play(null) > progress > toggle(null) > playFinish',
  // 'play(null) > progress > toggle(null) > restartBegin',
  // 'play(null) > progress > toggle(null) > restartFinish',

  // // ------- play > rewind ------- \\
  // 'play(null) > playBegin > rewind(null) > newWordFragment',

  // // time: 68.427

  // // ------- play > fastForward ------- \\
  // 'play(null) > playBegin > fastForward(null) > progress',
  // 'play(null) > playFinish > fastForward(null) > newWordFragment',
  // 'play(null) > playFinish > fastForward(null) > progress',
  // 'play(null) > resetFinish > fastForward(null) > newWordFragment',
  // 'play(null) > resetFinish > fastForward(null) > progress',
  // 'play(null) > restartBegin > fastForward(null) > newWordFragment',
  // 'play(null) > restartBegin > fastForward(null) > progress',
  // 'play(null) > onceFinish > fastForward(null) > newWordFragment',
  // 'play(null) > onceFinish > fastForward(null) > progress',
  // 'play(null) > resumeBegin > fastForward(null) > newWordFragment',
  // 'play(null) > resumeBegin > fastForward(null) > progress',
  // 'play(null) > resumeFinish > fastForward(null) > newWordFragment',
  // 'play(null) > resumeFinish > fastForward(null) > progress',
  // 'play(null) > rewindBegin > fastForward(null) > newWordFragment',
  // 'play(null) > rewindBegin > fastForward(null) > progress',
  // 'play(null) > loopBegin > fastForward(null) > newWordFragment',
  // 'play(null) > loopBegin > fastForward(null) > progress',
  // 'play(null) > loopFinish > fastForward(null) > newWordFragment',
  // 'play(null) > loopFinish > fastForward(null) > progress',
  // 'play(null) > newWordFragment > fastForward(null) > newWordFragment',
  // 'play(null) > newWordFragment > fastForward(null) > progress',
  // 'play(null) > progress > fastForward(null) > newWordFragment',
  // 'play(null) > progress > fastForward(null) > progress',
  // // time: 15.476

  // // ------- play > jumpWords(-1) ------- \\
  // 'play(null) > playBegin > jumpWords(-1) > newWordFragment',
  // 'play(null) > playBegin > jumpWords(-1) > stopBegin',
  // 'play(null) > playBegin > jumpWords(-1) > stopFinish',

  // // ------- play > jumpWords(0) ------- \\

  // // ------- play > jumpWords(3) ------- \\
  // 'play(null) > playBegin > jumpWords(3) > newWordFragment',
  // 'play(null) > playBegin > jumpWords(3) > stopBegin',
  // 'play(null) > playBegin > jumpWords(3) > stopFinish',
  // 'play(null) > playBegin > jumpWords(3) > done',
  // 'play(null) > playBegin > jumpWords(3) > progress',
  // 'play(null) > playFinish > jumpWords(3) > newWordFragment',
  // 'play(null) > playFinish > jumpWords(3) > stopBegin',
  // 'play(null) > playFinish > jumpWords(3) > stopFinish',
  // 'play(null) > playFinish > jumpWords(3) > done',
  // 'play(null) > playFinish > jumpWords(3) > progress',
  // 'play(null) > resetFinish > jumpWords(3) > newWordFragment',
  // 'play(null) > resetFinish > jumpWords(3) > stopBegin',
  // 'play(null) > resetFinish > jumpWords(3) > stopFinish',
  // 'play(null) > resetFinish > jumpWords(3) > done',
  // 'play(null) > resetFinish > jumpWords(3) > progress',
  // 'play(null) > restartBegin > jumpWords(3) > newWordFragment',
  // 'play(null) > restartBegin > jumpWords(3) > stopBegin',
  // 'play(null) > restartBegin > jumpWords(3) > stopFinish',
  // 'play(null) > restartBegin > jumpWords(3) > done',
  // 'play(null) > restartBegin > jumpWords(3) > progress',
  // 'play(null) > onceFinish > jumpWords(3) > newWordFragment',
  // 'play(null) > onceFinish > jumpWords(3) > stopBegin',
  // 'play(null) > onceFinish > jumpWords(3) > stopFinish',
  // 'play(null) > onceFinish > jumpWords(3) > done',
  // 'play(null) > onceFinish > jumpWords(3) > progress',
  // 'play(null) > resumeBegin > jumpWords(3) > newWordFragment',
  // 'play(null) > resumeBegin > jumpWords(3) > stopBegin',
  // 'play(null) > resumeBegin > jumpWords(3) > stopFinish',
  // 'play(null) > resumeBegin > jumpWords(3) > done',
  // 'play(null) > resumeBegin > jumpWords(3) > progress',
  // 'play(null) > resumeFinish > jumpWords(3) > newWordFragment',
  // 'play(null) > resumeFinish > jumpWords(3) > stopBegin',
  // 'play(null) > resumeFinish > jumpWords(3) > stopFinish',
  // 'play(null) > resumeFinish > jumpWords(3) > done',
  // 'play(null) > resumeFinish > jumpWords(3) > progress',
  // 'play(null) > rewindBegin > jumpWords(3) > newWordFragment',
  // 'play(null) > rewindBegin > jumpWords(3) > stopBegin',
  // 'play(null) > rewindBegin > jumpWords(3) > stopFinish',
  // 'play(null) > rewindBegin > jumpWords(3) > done',
  // 'play(null) > rewindBegin > jumpWords(3) > progress',
  // 'play(null) > loopBegin > jumpWords(3) > newWordFragment',
  // 'play(null) > loopBegin > jumpWords(3) > stopBegin',
  // 'play(null) > loopBegin > jumpWords(3) > stopFinish',
  // 'play(null) > loopBegin > jumpWords(3) > done',
  // 'play(null) > loopBegin > jumpWords(3) > progress',
  // 'play(null) > loopFinish > jumpWords(3) > newWordFragment',
  // 'play(null) > loopFinish > jumpWords(3) > stopBegin',
  // 'play(null) > loopFinish > jumpWords(3) > stopFinish',
  // 'play(null) > loopFinish > jumpWords(3) > done',
  // 'play(null) > loopFinish > jumpWords(3) > progress',
  // 'play(null) > newWordFragment > jumpWords(3) > newWordFragment',
  // 'play(null) > newWordFragment > jumpWords(3) > stopBegin',
  // 'play(null) > newWordFragment > jumpWords(3) > stopFinish',
  // 'play(null) > newWordFragment > jumpWords(3) > done',
  // 'play(null) > newWordFragment > jumpWords(3) > progress',
  // 'play(null) > progress > jumpWords(3) > newWordFragment',
  // 'play(null) > progress > jumpWords(3) > stopBegin',
  // 'play(null) > progress > jumpWords(3) > stopFinish',
  // 'play(null) > progress > jumpWords(3) > done',
  // 'play(null) > progress > jumpWords(3) > progress',










  // ------- play > playBegin ------- \\
  'play(null) > playBegin > play(null) > newWordFragment',  // [ 'you', 'brave', 'flag.', 'Delirious,', 'I', 'come', 'back.', '\n', 'Why,', 'oh', 'wattlebird?' ]
  'play(null) > playBegin > play(null) > playBegin',  // NOT triggered
  'play(null) > playBegin > play(null) > playFinish',  // NOT triggered
  'play(null) > playBegin > play(null) > restartBegin',  // triggered
  'play(null) > playBegin > play(null) > restartFinish',  // triggered
  'play(null) > playBegin > toggle(null) > playBegin',  // NOT triggered
  'play(null) > playBegin > toggle(null) > playFinish',  // NOT triggered
  'play(null) > playBegin > toggle(null) > restartBegin',  // triggered
  'play(null) > playBegin > toggle(null) > restartFinish',  // triggered
  'play(null) > playBegin > rewind(null) > newWordFragment',  // how is this at the end? [ 'oh', 'Why,', '\n', 'back.', 'come', 'I', 'Delirious,', 'flag.', 'brave', 'you', 'Victorious,' ]
  'play(null) > playBegin > fastForward(null) > progress',  // Expected 1 = 11, 1 = 0.16, undefined = 0.3, undefined = 0.583, undefined = 0.83
  'play(null) > playBegin > jumpWords(-1) > newWordFragment',  // [ 'oh' ]
  'play(null) > playBegin > jumpWords(-1) > stopBegin',  // NOT triggered
  'play(null) > playBegin > jumpWords(3) > stopBegin',  // triggered
  'play(null) > playBegin > jumpWords(3) > stopFinish',  // triggered
  'play(null) > playBegin > jumpWords(3) > done',  // triggered
  'play(null) > playBegin > jumpWords(3) > progress',  // Expected 1 = 0.3
  'play(null) > playBegin > jumpWords(4) > newWordFragment',
  'play(null) > playBegin > jumpWords(4) > stopBegin',
  'play(null) > playBegin > jumpWords(4) > stopFinish',
  'play(null) > playBegin > jumpWords(4) > done',
  'play(null) > playBegin > jumpWords(4) > progress',
  'play(null) > playBegin > jumpSentences(-1) > newWordFragment',
  'play(null) > playBegin > jumpSentences(1) > stopBegin',
  'play(null) > playBegin > jumpSentences(1) > stopFinish',
  'play(null) > playBegin > jumpSentences(1) > done',
  'play(null) > playBegin > jumpSentences(1) > progress',
  'play(null) > playBegin > jumpSentences(3) > newWordFragment',
  'play(null) > playBegin > jumpSentences(3) > stopBegin',
  'play(null) > playBegin > jumpSentences(3) > stopFinish',
  'play(null) > playBegin > jumpSentences(3) > done',
  'play(null) > playBegin > jumpSentences(3) > progress',
  'play(null) > playBegin > nextWord(null) > newWordFragment',
  'play(null) > playBegin > nextWord(null) > stopBegin',
  'play(null) > playBegin > nextWord(null) > stopFinish',
  'play(null) > playBegin > nextWord(null) > done',
  'play(null) > playBegin > nextWord(null) > progress',
  'play(null) > playBegin > nextSentence(null) > newWordFragment',
  'play(null) > playBegin > nextSentence(null) > stopBegin',
  'play(null) > playBegin > nextSentence(null) > stopFinish',
  'play(null) > playBegin > nextSentence(null) > done',
  'play(null) > playBegin > nextSentence(null) > progress',
  'play(null) > playBegin > prevWord(null) > newWordFragment',
  'play(null) > playBegin > prevWord(null) > stopBegin',

  ];
