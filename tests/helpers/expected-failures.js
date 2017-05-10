// expected-failures.js

// true = I've looked it over
// false = I haven't looked it over

// Note: double values not caused by actual second function, just by listener that's added to the test

var expectedFailures = module.exports = {
	// --- jumpWords ---
	// jumpWords should never trigger: play, reset, restart (only a second `play()` restarts),
	// pause, rewind, fastForward, close, loopSkip
	// jumpWords(>-1 && <11) should never trigger: stop, done
	'doubles: jumpWords(-1) + onceBegin > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpWords(-1) + onceBegin > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpWords(-1) + loopBegin > jumpWords(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpWords(-1) + loopBegin > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpWords(-1) + newWordFragment > jumpWords(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]

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

	'doubles: jumpWords(0) + onceBegin > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpWords(0) + onceBegin > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpWords(0) + loopBegin > jumpWords(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpWords(0) + loopBegin > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpWords(0) + newWordFragment > jumpWords(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]

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

	'doubles: jumpWords(3) + onceBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","come"]
	'doubles: jumpWords(3) + onceBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.5833333333333334]
	'doubles: jumpWords(3) + onceFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + onceFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + resumeBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + resumeBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + resumeFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + resumeFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + loopBegin > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["flag.","come"]
	'doubles: jumpWords(3) + loopBegin > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.5833333333333334]
	'doubles: jumpWords(3) + loopFinish > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + loopFinish > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.5833333333333334]
	'doubles: jumpWords(3) + newWordFragment > jumpWords(3) + newWordFragment': false,  // frags expected ["flag."], but got ["come"]
	'doubles: jumpWords(3) + newWordFragment > jumpWords(3) + progress': false,  // 'progress' expected [0.3333333333333333], but got [0.3333333333333333,0.5833333333333334]
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

	'doubles: jumpWords(4) + onceBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","\n"]
	'doubles: jumpWords(4) + onceBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
	'doubles: jumpWords(4) + onceFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + onceFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + resumeBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + resumeBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + resumeFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + resumeFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + loopBegin > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","\n"]
	'doubles: jumpWords(4) + loopBegin > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
	'doubles: jumpWords(4) + loopFinish > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + loopFinish > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpWords(4) + newWordFragment > jumpWords(4) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpWords(4) + newWordFragment > jumpWords(4) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
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

	'doubles: jumpWords(11) + onceBegin > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpWords(11) + onceBegin > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpWords(11) + loopBegin > jumpWords(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpWords(11) + loopBegin > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpWords(11) + newWordFragment > jumpWords(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	// jump 11 + progress > jump 11 + progress/frag gets expected values because only gets it's own item (thus) [1], etc.

	'doubles: jumpWords(100) + onceBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpWords(100) + onceBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpWords(100) + loopBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpWords(100) + loopBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpWords(100) + newWordFragment > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// jump 100 + progress > jump 100 + progress/frag gets expected values because only gets it's own item (thus) [1], etc.

	// --- jumpSentences ---
	// jumpSentences should never trigger: play, reset, restart (only a second `play()` restarts),
	// pause, rewind, fastForward, close, loopSkip
	// jumpSentences(>-1 && <3) should never trigger: stop, done
	'doubles: jumpSentences(-1) + onceBegin > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpSentences(-1) + onceBegin > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpSentences(-1) + loopBegin > jumpSentences(-1) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpSentences(-1) + loopBegin > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpSentences(-1) + newWordFragment > jumpSentences(-1) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
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

	'doubles: jumpSentences(0) + onceBegin > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpSentences(0) + onceBegin > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpSentences(0) + loopBegin > jumpSentences(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpSentences(0) + loopBegin > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpSentences(0) + newWordFragment > jumpSentences(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
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

	'doubles: jumpSentences(1) + onceBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","\n"]
	'doubles: jumpSentences(1) + onceBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
	'doubles: jumpSentences(1) + onceFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + onceFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + resumeBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + resumeBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + resumeFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + resumeFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + loopBegin > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","\n"]
	'doubles: jumpSentences(1) + loopBegin > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
	'doubles: jumpSentences(1) + loopFinish > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + loopFinish > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: jumpSentences(1) + newWordFragment > jumpSentences(1) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: jumpSentences(1) + newWordFragment > jumpSentences(1) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
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
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","wattlebird?"]
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + onceBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,1]
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
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["Why,","wattlebird?"]
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopBegin > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,1]
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + loopFinish > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [1]
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + newWordFragment > jumpSentences(3) + progress': false,  // 'progress' expected [0.8333333333333334], but got [0.8333333333333334,1]
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + newWordFragment': false,  // frags expected ["Why,"], but got ["wattlebird?"]
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + stopBegin': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + stopFinish': false,  // event should not have been triggerd but WAS
	'doubles: jumpSentences(3) + progress > jumpSentences(3) + done': false,  // event should not have been triggerd but WAS
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
	// Last word
	'doubles: jumpSentences(100) + onceBegin > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpSentences(100) + onceBegin > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpSentences(100) + loopBegin > jumpSentences(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpSentences(100) + loopBegin > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpSentences(100) + newWordFragment > jumpSentences(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	// jump 100 + progress > jump 100 + progress/frag gets expected values because only gets it's own item (thus) [1], etc.

	// --- nextWord ---
	// Never triggers (as the first function): play, reset, restart, pause, stop, close, done, other stuff...?
	'doubles: nextWord(null) + onceBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","brave"]
	'doubles: nextWord(null) + onceBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.25]
	'doubles: nextWord(null) + onceFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + onceFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + resumeBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + resumeBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + resumeFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + resumeFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + loopBegin > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["you","brave"]
	'doubles: nextWord(null) + loopBegin > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.25]
	'doubles: nextWord(null) + loopFinish > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + loopFinish > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	'doubles: nextWord(null) + newWordFragment > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + newWordFragment > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.16666666666666666,0.25]
	'doubles: nextWord(null) + progress > nextWord(null) + newWordFragment': false,  // frags expected ["you"], but got ["brave"]
	'doubles: nextWord(null) + progress > nextWord(null) + progress': false,  // 'progress' expected [0.16666666666666666], but got [0.25]
	// --- nextSentence ---
	'doubles: nextSentence(null) + onceBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","\n"]
	'doubles: nextSentence(null) + onceBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
	'doubles: nextSentence(null) + onceFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + onceFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + resumeBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + resumeBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + resumeFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + resumeFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + loopBegin > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["Delirious,","\n"]
	'doubles: nextSentence(null) + loopBegin > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
	'doubles: nextSentence(null) + loopFinish > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + loopFinish > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	'doubles: nextSentence(null) + newWordFragment > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + newWordFragment > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.4166666666666667,0.75]
	'doubles: nextSentence(null) + progress > nextSentence(null) + newWordFragment': false,  // frags expected ["Delirious,"], but got ["\n"]
	'doubles: nextSentence(null) + progress > nextSentence(null) + progress': false,  // 'progress' expected [0.4166666666666667], but got [0.75]
	// --- prevWord ---
	'doubles: prevWord(null) + onceBegin > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: prevWord(null) + onceBegin > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: prevWord(null) + loopBegin > prevWord(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: prevWord(null) + loopBegin > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: prevWord(null) + newWordFragment > prevWord(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	// --- prevSentence ---
	'doubles: prevSentence(null) + onceBegin > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: prevSentence(null) + onceBegin > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: prevSentence(null) + loopBegin > prevSentence(null) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: prevSentence(null) + loopBegin > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: prevSentence(null) + newWordFragment > prevSentence(null) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
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

	'doubles: jumpTo(-1) + onceBegin > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpTo(-1) + onceBegin > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpTo(-1) + loopBegin > jumpTo(-1) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpTo(-1) + loopBegin > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpTo(-1) + newWordFragment > jumpTo(-1) + progress': false,  // 'progress' expected [1], but got [1,1]

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

	'doubles: jumpTo(0) + onceBegin > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpTo(0) + onceBegin > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpTo(0) + loopBegin > jumpTo(0) + newWordFragment': false,  // frags expected ["Victorious,"], but got ["Victorious,","Victorious,"]
	'doubles: jumpTo(0) + loopBegin > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]
	'doubles: jumpTo(0) + newWordFragment > jumpTo(0) + progress': false,  // 'progress' expected [0.08333333333333333], but got [0.08333333333333333,0.08333333333333333]

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

	'doubles: jumpTo(6) + onceBegin > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come"]
	'doubles: jumpTo(6) + onceBegin > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334]
	'doubles: jumpTo(6) + loopBegin > jumpTo(6) + newWordFragment': false,  // frags expected ["come"], but got ["come","come"]
	'doubles: jumpTo(6) + loopBegin > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334]
	'doubles: jumpTo(6) + newWordFragment > jumpTo(6) + progress': false,  // 'progress' expected [0.5833333333333334], but got [0.5833333333333334,0.5833333333333334]

	'doubles: jumpTo(6) + done > jumpTo(6) + newWordFragment': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + onceBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + onceFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + resumeBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + resumeFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + loopBegin': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + loopFinish': false,  // event should have been triggerd but was NOT
	'doubles: jumpTo(6) + done > jumpTo(6) + progress': false,  // event should have been triggerd but was NOT

	'doubles: jumpTo(11) + onceBegin > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpTo(11) + onceBegin > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpTo(11) + loopBegin > jumpTo(11) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpTo(11) + loopBegin > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpTo(11) + newWordFragment > jumpTo(11) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpTo(100) + onceBegin > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpTo(100) + onceBegin > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpTo(100) + loopBegin > jumpTo(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpTo(100) + loopBegin > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpTo(100) + newWordFragment > jumpTo(100) + progress': false,  // 'progress' expected [1], but got [1,1]


};