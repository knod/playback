// expected-failures.js

// true = I've looked it over
// false = I haven't looked it over

var expectedFailures = module.exports = {
	// --- jumpWords ---
	// jumpWords should never trigger: play, reset, restart (only a second `play()` restarts), pause
	// jumpWords(>-1 && <11) should never trigger: stop, done
	// already taken care of elsewhere: rewind, fastForward, close, loopSkip?

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

	// jump 11 + progress > jump 11 + progress =============== 1 progress? Why not? Because not resumed yet until loop is done?

	'doubles: jumpWords(100) + onceBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpWords(100) + onceBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpWords(100) + loopBegin > jumpWords(100) + newWordFragment': false,  // frags expected ["wattlebird?"], but got ["wattlebird?","wattlebird?"]
	'doubles: jumpWords(100) + loopBegin > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]
	'doubles: jumpWords(100) + newWordFragment > jumpWords(100) + progress': false,  // 'progress' expected [1], but got [1,1]

	// jump 100 + progress > jump 100 + progress =============== 1 progress? Why not? Because not resumed yet until loop is done?

};
