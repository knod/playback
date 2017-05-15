// expected-failures.js

// true = I've looked it over
// false = I haven't looked it over
// 'fix' = behavior needs fixing
// 'fix?' = requires closer examination

// Note: double values not caused by actual second function, just by listener that's added to the test

var expectedFailures = module.exports = {
	// --- jumpWords ---
	// jumpWords should never trigger: play, reset, restart (only a second `play()` restarts),
	// pause, rewind, fastForward, close, loopSkip
	// jumpWords(>-1 && <11) should never trigger: stop, done
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopBegin > jumpWords(0) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + stopFinish > jumpWords(0) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(0) + done > jumpWords(0) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopBegin > jumpWords(3) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + stopFinish > jumpWords(3) + progress': true,  // event should have been triggerd but was NOT

	'doubles: jumpWords(3) + onceBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + onceBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + onceFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + onceFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + resumeBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + resumeBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + resumeFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + resumeFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + loopBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + loopBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + loopFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + loopFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + newWordFragment > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + newWordFragment > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + progress > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + progress > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]

	'doubles: jumpWords(3) + done > jumpWords(3) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + done > jumpWords(3) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + done > jumpWords(3) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + done > jumpWords(3) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + done > jumpWords(3) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + done > jumpWords(3) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + done > jumpWords(3) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(3) + done > jumpWords(3) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopBegin > jumpWords(4) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + stopFinish > jumpWords(4) + progress': true,  // event should have been triggerd but was NOT

	'doubles: jumpWords(4) + onceBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + onceBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + onceFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + onceFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + resumeBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + resumeBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + resumeFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + resumeFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + loopBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + loopBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + loopFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + loopFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + newWordFragment > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + newWordFragment > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + progress > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + progress > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]

	'doubles: jumpWords(4) + done > jumpWords(4) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + done > jumpWords(4) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + done > jumpWords(4) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + done > jumpWords(4) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + done > jumpWords(4) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + done > jumpWords(4) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + done > jumpWords(4) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpWords(4) + done > jumpWords(4) + progress': true,  // event should have been triggerd but was NOT
	// --- jumpSentences ---
	// jumpSentences should never trigger: play, reset, restart (only a second `play()` restarts),
	// pause, rewind, fastForward, close, loopSkip
	// jumpSentences(>-1 && <3) should never trigger: stop, done
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopBegin > jumpSentences(0) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + stopFinish > jumpSentences(0) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(0) + done > jumpSentences(0) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopBegin > jumpSentences(1) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + stopFinish > jumpSentences(1) + progress': true,  // event should have been triggerd but was NOT

	'doubles: jumpSentences(1) + onceBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + onceBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + onceFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + onceFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + resumeBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + resumeBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + resumeFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + resumeFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + loopBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + loopBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + loopFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + loopFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + newWordFragment > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + newWordFragment > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + progress > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + progress > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]

	'doubles: jumpSentences(1) + done > jumpSentences(1) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + done > jumpSentences(1) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + done > jumpSentences(1) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + done > jumpSentences(1) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + done > jumpSentences(1) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + done > jumpSentences(1) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + done > jumpSentences(1) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(1) + done > jumpSentences(1) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopBegin > jumpSentences(3) + progress': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + newWordFragment': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + onceBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + onceFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + resumeBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + resumeFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + loopBegin': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + loopFinish': true,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + stopFinish > jumpSentences(3) + progress': true,  // event should have been triggerd but was NOT

	// Second jump goes past end of sentence
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]
	'doubles: jumpSentences(3) + onceFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + onceFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]

	'doubles: jumpSentences(3) + resumeBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + resumeBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + resumeBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + resumeBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + resumeBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]
	'doubles: jumpSentences(3) + resumeFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + resumeFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + resumeFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + resumeFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + resumeFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]

	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]

	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + stopBegin': false,  // rror: event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + stopFinish': false,  // rror: event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + done': false,  // rror: event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]

	'doubles: jumpSentences(3) + progress > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + stopBegin': false,  // rror: event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + stopFinish': false,  // rror: event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + done': false,  // rror: event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]

	// At first jump will be at last sentence, but not last word, so no 'done'
	'doubles: jumpSentences(3) + done > jumpSentences(3) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + done > jumpSentences(3) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + done > jumpSentences(3) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + done > jumpSentences(3) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + done > jumpSentences(3) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + done > jumpSentences(3) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + done > jumpSentences(3) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpSentences(3) + done > jumpSentences(3) + progress': false,  // event should have been triggerd but was NOT

	// --- nextWord ---
	// Never triggers (as the first function): play, reset, restart, pause, stop, close, done, other stuff...?
	'doubles: nextWord(null) + onceBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + onceBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + onceFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + onceFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + resumeBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + resumeBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + resumeFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + resumeFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + loopBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + loopBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + loopFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + loopFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + newWordFragment > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + newWordFragment > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + progress > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + progress > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]

	// --- nextSentence ---
	'doubles: nextSentence(null) + onceBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + onceBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + onceFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + onceFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + resumeBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + resumeBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + resumeFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + resumeFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + loopBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + loopBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + loopFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + loopFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + newWordFragment > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + newWordFragment > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + progress > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + progress > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	// --- prevWord ---
	// --- prevSentence ---
	// --- jumpTo ---
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopBegin > jumpTo(-1) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + stopFinish > jumpTo(-1) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(-1) + done > jumpTo(-1) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopBegin > jumpTo(0) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + stopFinish > jumpTo(0) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(0) + done > jumpTo(0) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopBegin > jumpTo(6) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + stopFinish > jumpTo(6) + progress': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + progress': false,  // event should have been triggerd but was NOT


	// =============================================================================
	// =============================================================================
	// ======= Complex combos =======
	// =============================================================================
	// =============================================================================


	// // --- playBegin, 21112 tests ---
	// 'doubles: play(null) + playBegin > pause(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > pause(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > pause(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > pause(null) + progress': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > stop(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > stop(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > stop(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > stop(null) + progress': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > close(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > close(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > close(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > close(null) + progress': false,  // event should not have been triggered but WAS
	// 'doubles: play(null) + playBegin > togglePlayPause(null) + newWordFragment': false,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["Victorious,"]
	// 'doubles: play(null) + playBegin > togglePlayPause(null) + playBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > togglePlayPause(null) + pauseBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > togglePlayPause(null) + pauseFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > togglePlayPause(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > togglePlayPause(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > togglePlayPause(null) + done': false,  // event should have been triggerd but was NOT

	// // 'doubles: play(null) + playBegin > togglePlayPause(null) + progress': false,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.08333333333333333]
	// // 'doubles: play(null) + playBegin > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: play(null) + playBegin > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: play(null) + playBegin > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playBegin > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playBegin > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["Victorious,","flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.08333333333333333,0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playBegin > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: play(null) + playBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: play(null) + playBegin > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	
	// 'doubles: play(null) + playBegin > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	
	// // 'doubles: play(null) + playBegin > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playBegin > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Victorious,","Why,","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.08333333333333333,0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playBegin > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: play(null) + playBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["Victorious,","you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.08333333333333333,0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: play(null) + playBegin > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playBegin > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playBegin > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: play(null) + playBegin > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playBegin > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playBegin > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playBegin > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: play(null) + playBegin > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["Victorious,","come","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playBegin > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playBegin > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playBegin > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.08333333333333333,0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playBegin > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playBegin > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: play(null) + playBegin > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playBegin > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: togglePlayPause(null) + playBegin > play(null) + newWordFragment': false,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playBegin > play(null) + progress': false,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// 'doubles: togglePlayPause(null) + playBegin > reset(null) + playFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > restart(null) + playFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > pause(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > pause(null) + playFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > pause(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > pause(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > pause(null) + progress': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > stop(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > stop(null) + playFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > stop(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > stop(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > stop(null) + progress': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > close(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > close(null) + playFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > close(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > close(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: togglePlayPause(null) + playBegin > close(null) + progress': false,  // event should not have been triggered but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > rewind(null) + playFinish': false,  // event should not have been triggered but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// 'doubles: togglePlayPause(null) + playBegin > fastForward(null) + playFinish': false,  // event should not have been triggered but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["Victorious,","flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.08333333333333333,0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Victorious,","Why,","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.08333333333333333,0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: togglePlayPause(null) + playBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["Victorious,","you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.08333333333333333,0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playBegin > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playBegin > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["Victorious,","come","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.08333333333333333,0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playBegin > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // --- playFinish ---
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + playBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + playFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + pauseBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + pauseFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > togglePlayPause(null) + progress': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playFinish > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: play(null) + playFinish > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: play(null) + playFinish > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playFinish > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playFinish > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playFinish > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: play(null) + playFinish > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playFinish > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: play(null) + playFinish > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: play(null) + playFinish > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playFinish > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playFinish > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playFinish > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: play(null) + playFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: play(null) + playFinish > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playFinish > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playFinish > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: play(null) + playFinish > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: play(null) + playFinish > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: play(null) + playFinish > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: play(null) + playFinish > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: play(null) + playFinish > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: play(null) + playFinish > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: play(null) + playFinish > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: play(null) + playFinish > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: play(null) + playFinish > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playFinish > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: play(null) + playFinish > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: play(null) + playFinish > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: togglePlayPause(null) + playFinish > play(null) + newWordFragment': false,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playFinish > play(null) + progress': false,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playFinish > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: togglePlayPause(null) + playFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playFinish > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playFinish > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: togglePlayPause(null) + playFinish > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // --- resetBegin/Finish, restartBegin/Finish ---
	// 'doubles: reset(null) + resetBegin > play(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > play(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > play(null) + resumeBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > play(null) + resumeFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > restart(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > restart(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > restart(null) + resumeBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > restart(null) + resumeFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > pause(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > pause(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > pause(null) + resumeBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > pause(null) + resumeFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > pause(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > pause(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > stop(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > stop(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > stop(null) + resumeBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > stop(null) + resumeFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > stop(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > stop(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > close(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > close(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > close(null) + resumeBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > close(null) + resumeFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > close(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > close(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > togglePlayPause(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > togglePlayPause(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > togglePlayPause(null) + resumeBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > togglePlayPause(null) + resumeFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > rewind(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > rewind(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > fastForward(null) + onceBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > fastForward(null) + onceFinish': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > fastForward(null) + resumeBegin': false,  // event should not have been triggered but WAS
	// 'doubles: reset(null) + resetBegin > fastForward(null) + resumeFinish': false,  // event should not have been triggered but WAS
	
	// // // 'doubles: restart(null) + restartBegin > play(null) + newWordFragment'; false,  // 
	// // - Error: frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// /
	// // // 'doubles: restart(null) + restartBegin > play(null) + progress'; false,  // 
	// // - Error: 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]

	// // 'doubles: restart(null) + restartBegin > reset(null) + newWordFragment'; false,  // 
	// // - Error: Expected test to fail, but it DIDN'T FAIL.
	// // --- Unexpected success: expected and got ["Victorious,"]
	// // 'doubles: restart(null) + restartBegin > reset(null) + progress'; false,  // 
	// // - Error: Expected test to fail, but it DIDN'T FAIL.
	// // --- Unexpected success: expected and got [0.08333333333333333]
	// // 'doubles: restart(null) + restartBegin > fastForward(null) + newWordFragment'; false,  // 
	// // - Error: Expected test to fail, but it DIDN'T FAIL.
	// // --- Unexpected success: expected and got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > fastForward(null) + progress'; false,  // 
	// // - Error: Expected test to fail, but it DIDN'T FAIL.
	// // --- Unexpected success: expected and got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]

	// // 'doubles: restart(null) + restartBegin > reset(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// // 'doubles: restart(null) + restartBegin > reset(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// 'doubles: restart(null) + restartBegin > pause(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > pause(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > pause(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > pause(null) + progress': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > stop(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > stop(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > stop(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > stop(null) + progress': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > close(null) + newWordFragment': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > close(null) + loopBegin': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > close(null) + loopFinish': false,  // event should not have been triggered but WAS
	// 'doubles: restart(null) + restartBegin > close(null) + progress': false,  // event should not have been triggered but WAS
	// // 'doubles: restart(null) + restartBegin > togglePlayPause(null) + newWordFragment': false,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["Victorious,"]
	// 'doubles: restart(null) + restartBegin > togglePlayPause(null) + playBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > togglePlayPause(null) + playFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > togglePlayPause(null) + pauseBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > togglePlayPause(null) + pauseFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > togglePlayPause(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > togglePlayPause(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > togglePlayPause(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartBegin > togglePlayPause(null) + progress': false,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.08333333333333333]
	// // 'doubles: restart(null) + restartBegin > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > fastForward(null) + newWordFragment': false,  // frags expected ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > fastForward(null) + progress': false,  // 'progress' expected [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartBegin > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartBegin > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartBegin > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["Victorious,","flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.08333333333333333,0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: restart(null) + restartBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: restart(null) + restartBegin > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartBegin > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartBegin > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartBegin > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Victorious,","Why,","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.08333333333333333,0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: restart(null) + restartBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["Victorious,","you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.08333333333333333,0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Victorious,","Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.08333333333333333,0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartBegin > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartBegin > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartBegin > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartBegin > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartBegin > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartBegin > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartBegin > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: restart(null) + restartBegin > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["Victorious,","come","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartBegin > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartBegin > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartBegin > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.08333333333333333,0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartBegin > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: restart(null) + restartBegin > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["Victorious,","wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartBegin > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [0.08333333333333333,1,1]
	// // 'doubles: restart(null) + restartFinish > play(null) + newWordFragment': false,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: restart(null) + restartFinish > play(null) + progress': false,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + playBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + playFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + pauseBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + pauseFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > togglePlayPause(null) + progress': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartFinish > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// // 'doubles: restart(null) + restartFinish > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartFinish > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartFinish > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartFinish > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartFinish > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: restart(null) + restartFinish > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartFinish > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: restart(null) + restartFinish > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartFinish > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartFinish > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartFinish > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartFinish > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: restart(null) + restartFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartFinish > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartFinish > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartFinish > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// 'doubles: restart(null) + restartFinish > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: restart(null) + restartFinish > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// // 'doubles: restart(null) + restartFinish > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// // 'doubles: restart(null) + restartFinish > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: restart(null) + restartFinish > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	// 'doubles: restart(null) + restartFinish > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	// 'doubles: restart(null) + restartFinish > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	// // 'doubles: restart(null) + restartFinish > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// // 'doubles: restart(null) + restartFinish > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartFinish > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	// // 'doubles: restart(null) + restartFinish > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// // 'doubles: restart(null) + restartFinish > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + playBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + playFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > play(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + resetBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + resetFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > reset(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + restartBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + restartFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > restart(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > pause(null) + pauseBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > pause(null) + pauseFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > stop(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > stop(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > close(null) + closeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > close(null) + closeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + rewindBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + rewindFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > rewind(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + fastForwardBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + fastForwardFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > fastForward(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(-1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(0) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(3) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(4) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(11) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpWords(100) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(-1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(0) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(3) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpSentences(100) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextWord(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > nextSentence(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevWord(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > prevSentence(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(-1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(0) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(6) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(11) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartBegin > jumpTo(100) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + playBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + playFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > play(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + resetBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + resetFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > reset(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + restartBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + restartFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > restart(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > pause(null) + pauseBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > pause(null) + pauseFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > stop(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > stop(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > close(null) + closeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > close(null) + closeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + rewindBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + rewindFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > rewind(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + fastForwardBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + fastForwardFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > fastForward(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(-1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(0) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(3) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(4) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(11) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpWords(100) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(-1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(0) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(3) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpSentences(100) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextWord(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > nextSentence(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevWord(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > prevSentence(null) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(-1) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(0) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(6) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(11) + progress': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + newWordFragment': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + stopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + stopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + onceBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + onceFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + resumeBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + resumeFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + loopBegin': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + loopFinish': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + done': false,  // event should have been triggerd but was NOT
	// 'doubles: togglePlayPause(null) + restartFinish > jumpTo(100) + progress': false,  // event should have been triggerd but was NOT
	
	// Same notes as for toggle... + 'playBegin'
	'doubles: play(null) + playBegin > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playBegin > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playBegin > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playBegin > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playBegin > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playBegin > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playBegin > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playBegin > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playBegin > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playBegin > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playBegin > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playBegin > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playBegin > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playBegin > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playBegin > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playBegin > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playBegin > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playBegin > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playBegin > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playBegin > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playBegin > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// Same notes as for toggle... + 'playBegin'
	'doubles: play(null) + playFinish > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playFinish > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playFinish > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playFinish > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playFinish > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playFinish > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playFinish > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playFinish > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playFinish > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playFinish > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playFinish > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playFinish > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: play(null) + playFinish > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: play(null) + playFinish > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: play(null) + playFinish > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playFinish > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playFinish > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: play(null) + playFinish > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	'doubles: play(null) + playFinish > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: play(null) + playFinish > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playFinish > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: play(null) + playFinish > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: play(null) + playFinish > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playBegin > play(null) + newWordFragment': false,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > play(null) + progress': false,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// -1: Should this not continue on to the end?
	'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + newWordFragment': 'fix?',  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > jumpWords(-1) + progress': 'fix?',  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + done': true,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(0) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + newWordFragment': true,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + done': true,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(3) + progress': true,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// 11, 100: Should these restart? Also, why don't they restart?
	'doubles: togglePlayPause(null) + playBegin > jumpWords(11) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(11) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(100) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpWords(100) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	// -1: Should this not continue on to the end?
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// 100: Should these restart? Also, why don't they restart?
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playBegin > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playBegin > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playBegin > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playBegin > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// Same notes as for 'playBegin'
	'doubles: togglePlayPause(null) + playFinish > play(null) + newWordFragment': false,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > play(null) + progress': false,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > rewind(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > rewind(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + done': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + done': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > nextWord(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > nextWord(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > nextWord(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playFinish > prevWord(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > prevWord(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > prevWord(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + stopBegin': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + stopFinish': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + done': false,  // event should have been triggerd but was NOT
	'doubles: togglePlayPause(null) + playFinish > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + done': false,  // event should not have been triggerd but WAS
	'doubles: togglePlayPause(null) + playFinish > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: togglePlayPause(null) + playFinish > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// --- restartBegin, restartFinish --
	// (probably similar "problems" as 'playBegin/Finish' - resumes playing after jump/other action (like rewind))
	'doubles: restart(null) + restartBegin > play(null) + newWordFragment': true,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > play(null) + progress': true,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartBegin > rewind(null) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > rewind(null) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// Should stopping be triggered here?
	'doubles: restart(null) + restartBegin > jumpWords(-1) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: restart(null) + restartBegin > jumpWords(-1) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > jumpWords(-1) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > jumpWords(-1) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > jumpWords(-1) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartBegin > jumpWords(0) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpWords(0) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(0) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(0) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(0) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartBegin > jumpWords(3) + newWordFragment': true,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpWords(3) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(3) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(3) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(3) + progress': true,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartBegin > jumpWords(4) + newWordFragment': true,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpWords(4) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(4) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(4) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpWords(4) + progress': true,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// Same notes as for 'playBegin' - should restart or what?
	'doubles: restart(null) + restartBegin > jumpWords(11) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpWords(11) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartBegin > jumpWords(100) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpWords(100) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartBegin > jumpSentences(-1) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// Should trigger stopping?
	'doubles: restart(null) + restartBegin > jumpSentences(-1) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > jumpSentences(-1) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > jumpSentences(-1) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > jumpSentences(-1) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartBegin > jumpSentences(0) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpSentences(0) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(0) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(0) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(0) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartBegin > jumpSentences(1) + newWordFragment': true,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpSentences(1) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(1) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(1) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(1) + progress': true,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartBegin > jumpSentences(3) + newWordFragment': true,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpSentences(3) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(3) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(3) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpSentences(3) + progress': true,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// Same notes as for 'playBegin' - should restart or what?
	'doubles: restart(null) + restartBegin > jumpSentences(100) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpSentences(100) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartBegin > nextWord(null) + newWordFragment': true,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > nextWord(null) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > nextWord(null) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > nextWord(null) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > nextWord(null) + progress': true,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartBegin > nextSentence(null) + newWordFragment': true,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > nextSentence(null) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > nextSentence(null) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > nextSentence(null) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > nextSentence(null) + progress': true,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// Should trigger stopping or what? Continue playing?
	'doubles: restart(null) + restartBegin > prevWord(null) + newWordFragment': 'fix?',  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: restart(null) + restartBegin > prevWord(null) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > prevWord(null) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > prevWord(null) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > prevWord(null) + progress': 'fix?',  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartBegin > prevSentence(null) + newWordFragment': 'fix?',  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: restart(null) + restartBegin > prevSentence(null) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > prevSentence(null) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > prevSentence(null) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartBegin > prevSentence(null) + progress': 'fix?',  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartBegin > jumpTo(-1) + newWordFragment': true,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	// Should trigger stopping?
	'doubles: restart(null) + restartBegin > jumpTo(-1) + stopBegin': 'fix?',  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(-1) + stopFinish': 'fix?',  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(-1) + done': 'fix?',  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(-1) + progress': true,  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartBegin > jumpTo(0) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpTo(0) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(0) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(0) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(0) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartBegin > jumpTo(6) + newWordFragment': true,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpTo(6) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(6) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(6) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartBegin > jumpTo(6) + progress': true,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// Same notes as for 'playBegin' - should restart or what?
	'doubles: restart(null) + restartBegin > jumpTo(11) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpTo(11) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartBegin > jumpTo(100) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartBegin > jumpTo(100) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartFinish > play(null) + newWordFragment': true,  // frags expected ["Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"], but got ["you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > play(null) + progress': true,  // 'progress' expected [0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1], but got [0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1].
	'doubles: restart(null) + restartFinish > rewind(null) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > rewind(null) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartFinish > jumpWords(-1) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	// Should trigger stopping?
	'doubles: restart(null) + restartFinish > jumpWords(-1) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > jumpWords(-1) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > jumpWords(-1) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > jumpWords(-1) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartFinish > jumpWords(0) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpWords(0) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(0) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(0) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(0) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartFinish > jumpWords(3) + newWordFragment': true,  // frags expected ["flag."], but got ["flag.","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpWords(3) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(3) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(3) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(3) + progress': true,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartFinish > jumpWords(4) + newWordFragment': true,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpWords(4) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(4) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(4) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpWords(4) + progress': true,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// Same notes as for 'playBegin' - should restart or what?
	// (should also trigger 'done', but maybe that happens in single tests)
	'doubles: restart(null) + restartFinish > jumpWords(11) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpWords(11) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartFinish > jumpWords(100) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpWords(100) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	// Should trigger stopping? Continue playing?
	'doubles: restart(null) + restartFinish > jumpSentences(-1) + newWordFragment': 'fix?',  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: restart(null) + restartFinish > jumpSentences(-1) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > jumpSentences(-1) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > jumpSentences(-1) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > jumpSentences(-1) + progress': 'fix?',  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartFinish > jumpSentences(0) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpSentences(0) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(0) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(0) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(0) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartFinish > jumpSentences(1) + newWordFragment': true,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpSentences(1) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(1) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(1) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(1) + progress': true,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartFinish > jumpSentences(3) + newWordFragment': true,  // frags expected ["Why,"], but got ["Why,","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpSentences(3) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(3) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(3) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpSentences(3) + progress': true,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,0.8333333333333334,0.9166666666666666,1]
	// Same notes as for 'playBegin' - should restart or what?
	'doubles: restart(null) + restartFinish > jumpSentences(100) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpSentences(100) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartFinish > nextWord(null) + newWordFragment': true,  // frags expected ["you"], but got ["you","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > nextWord(null) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > nextWord(null) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > nextWord(null) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > nextWord(null) + progress': true,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartFinish > nextSentence(null) + newWordFragment': true,  // frags expected ["Delirious,"], but got ["Delirious,","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > nextSentence(null) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > nextSentence(null) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > nextSentence(null) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > nextSentence(null) + progress': true,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// Should trigger stopping? Obviously does since it doesn't resume plalying,
	// but should it do so again? Or should it actually resume playing?
	'doubles: restart(null) + restartFinish > prevWord(null) + newWordFragment': 'fix?',  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: restart(null) + restartFinish > prevWord(null) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > prevWord(null) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > prevWord(null) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > prevWord(null) + progress': 'fix?',  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartFinish > prevSentence(null) + newWordFragment': 'fix?',  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: restart(null) + restartFinish > prevSentence(null) + stopBegin': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > prevSentence(null) + stopFinish': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > prevSentence(null) + done': 'fix?',  // event should have been triggerd but was NOT
	'doubles: restart(null) + restartFinish > prevSentence(null) + progress': 'fix?',  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: restart(null) + restartFinish > jumpTo(-1) + newWordFragment': true,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpTo(-1) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(-1) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(-1) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(-1) + progress': true,  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartFinish > jumpTo(0) + newWordFragment': true,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,","you","brave","flag.","Delirious,","I","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpTo(0) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(0) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(0) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(0) + progress': true,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333,0.16666666666666666,0.25,0.3333333333333333,0.4166666666666667,0.5,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	'doubles: restart(null) + restartFinish > jumpTo(6) + newWordFragment': true,  // frags expected ["come"], but got ["come","come","back.","\n","Why,","oh","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpTo(6) + stopBegin': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(6) + stopFinish': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(6) + done': true,  // event should not have been triggerd but WAS
	'doubles: restart(null) + restartFinish > jumpTo(6) + progress': true,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334,0.6666666666666666,0.75,0.8333333333333334,0.9166666666666666,1]
	// Same notes as for 'playBegin' - should restart or what?
	'doubles: restart(null) + restartFinish > jumpTo(11) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpTo(11) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	'doubles: restart(null) + restartFinish > jumpTo(100) + newWordFragment': 'fix?',  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: restart(null) + restartFinish > jumpTo(100) + progress': 'fix?',  // 'progress' expected [1], but got [1,1]
	// --- pauseBegin/Finish
	// --- stopBegin/Finish

};