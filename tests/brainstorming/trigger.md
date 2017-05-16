not

Functions
play|togglePlayPause|restart|reset|pause|stop|close|revert|rewind|fastForward|
nextWord|nextSentence|
prevWord|prevSentence|
jumpTo(<0)|
jumpTo(>=0, < 11)|
jumpTo(>= 11)|  ([ -1, 0, 6, 11, 100 ])
jumpWords(<0)|
jumpWords(>=0, < 11)|
jumpWords(>= 11)|  ([ -1, 0, 3, 4, 11, 100 ])
jumpSentences(<0)|
jumpSentences(>=0, < 11)|
jumpSentences(>11)|  ([ -1, 0, 1, 3, 100 ])


Note: revert() does not trigger 'play' or 'pause', but maybe it should... but then some of this would have to change

### Always not triggered directly 
Events
play|reset|restart|pause|stop|close|once|revert|rewind|fast|loop|new|loopSkip|progress|done

The event 'loopSkip' (different tests for state change)

play 			+ reset|pause|close|once|revert|rewind|fast|loopSkip
togglePlayPause + reset|close|once|revert|rewind|fast|loopSkip
restart 		+ play?|reset|pause|close|rewind|fast|loopSkip
reset 			+ play|restart|pause|stop|close|once|revert|rewind|fast|loopSkip|done
pause 			+ play|reset|restart|stop|close|once|revert|rewind|fast|loop|new|loopSkip|progress|done (only itself)
stop 			+ play|reset|restart|pause|close|once|revert|rewind|fast|loop|new|loopSkip|progress|done (only itself)
close 			+ play|reset|restart|pause|stop|once|revert|rewind|fast|loop|new|loopSkip|progress|done (only itself)
revert			+ play|reset|restart|pause|stop?|close|once|rewind|fast|loopSkip|done? (maybe should trigger play/pause) ('stop' and 'done' may fire if 'play', then go to just before the end)
rewind 			+ play?|reset|restart|pause|close|once|fast|loopSkip  // play if revert? but goes to start and then done, so...
fastForward 	+ play|reset|restart|pause|close|once|revert|rewind|loopSkip  // never reverts on its own, always goes to end
next 			+ reset|restart?|pause?|close|rewind|fast|loopSkip
prev 			+ reset|restart?|pause?|close|rewind|fast|loopSkip
jump			+ reset|restart?|pause?|close|rewind|fast|loopSkip  // Should this be expected behavior, even if >0 at very end? Let's say yes for now.

Same for all left blank below
nextWord				+ 
nextSentence			+ 
prevWord				+ 
prevSentence			+ 
jumpTo(<0)				+ 
jumpTo(>=0, < 11)		+ 
jumpTo(>= 11)			+ play?
jumpWords(<0)			+ 
jumpWords(>=0, < 11) 	+ 
jumpWords(>= 11)		+ play?
jumpSentences(<0)		+ 
jumpSentences(>=0, <= 3) + 
jumpSentences(>3)		+ play?



### Not triggerd if at start (considering it could be called twice?) or after pause|stop|close|reset|rewind?|prev?|jumpW/jumpS<0|jumpTo<0?
Events
play|reset|restart|pause|stop|close|once|revert|rewind|fast|loop|new|loopSkip|progress|done

doubles: play					+ restart
doubles: togglePlayPause		+ reset|restart|pause|close|once|revert|rewind|fast|loopSkip (restart|pause)
doubles: restart				+ same
doubles: reset					+ same
doubles: pause					+ same
doubles: stop					+ same
doubles: close					+ same
doubles: revert					+ same
doubles: rewind					+ play for sure
doubles: fastForward			+ same
doubles: next					+ play|reset|restart|pause?|stop|close|rewind|fast|loopSkip|done (play|stop|done)
doubles: prev					+ play|reset|restart?|pause?|close|rewind|fast|loopSkip (play)
doubles: jump					+ (play)

'above' means it matches the plain 'jump' matcher
doubles: jumpTo(<0)				+ above
doubles: jumpTo(>=0, < 11)		+ reset|restart?|pause?|close|rewind|fast|loopSkip (play|done|stop)
doubles: jumpTo(>= 11)			+ above
doubles: jumpWords(<0)			+ above
doubles: jumpWords(>=0, < 11) 	+ (play|done|stop)
doubles: jumpWords(>= 11)		+ above
doubles: jumpSentences(<0)		+ above
doubles: jumpSentences(>=0, <= 3) + (play|done|stop)
doubles: jumpSentences(>3)		+ above



### Triggered/Not with other conditions?
Events
play|reset|restart|pause|stop|close|once|revert|rewind|fast|loop|new|loopSkip|progress|done

any + stop|done > play|toggle + play 		= not
any + stop|done > play|toggle + restart 	= yes

doubles: play					+  

doubles: togglePlayPause|play|restart + !stop|done > toggle + !pause 	= not
doubles: togglePlayPause|play|restart + !stop|done > toggle + pause 	= yes

doubles: restart				+ 
doubles: reset					+ 
doubles: pause					+ 
doubles: stop					+ 
doubles: close					+ 
doubles: revert					+ 
doubles: rewind					+ 
doubles: fastForward			+ 
doubles: next					+ 
doubles: prev					+ 
doubles: jumpTo(<0)				+ 
doubles: jumpTo(>=0, < 11)		+ 
doubles: jumpTo(>= 11)			+ 
doubles: jumpWords(<0)			+ 
doubles: jumpWords(>=0, < 11) 	+ 
doubles: jumpWords(>= 11)		+ 
doubles: jumpSentences(<0)		+ 
doubles: jumpSentences(>=0, <= 3) + 
doubles: jumpSentences(>3)		+ 



### Output diff than normal (expect failure)

// play
// togglePlayPause
// restart
// reset
// pause
// stop
// close
// revert
// rewind
// fastForward
// next
// prev
// jump

// _Never_ change position in text/trigger loops
pause
stop
close


// _Always_ trigger loops
play
restart
reset
rewind
fastForward
next
prev
jump

(not: toggle, revert (pause, stop, close))


// _From Pause Trigger Loop_ (not 'loopSkip', though)
play
toggle
restart
reset
rewind
fastForward
next
prev
jump

(added to _Always_: toggle)
(not: revert (pause, close, stop))


// _From Pause Change Pos_ (starting at start) change the position in the text

play
toggle
restart
fastForward
next
jumpTo -1, !0
jumpW >0
jumpS >0

(added to _Always_: toggle)
(not: reset, rewind, prev, jump0, jumpW/S -1/0, revert (pause, close, stop))


// _Not to Ends_ As single function changes position to not start or end

play
toggle
revert? If not paused
next
jumpTo !0
jumpW/S >0


// _Play-ish_ (as first function, change position and state from pause to 'play')

play
toggle
restart


// Things that, with state changed to play (started with play-ish), trigger loops

play
restart
reset
rewind
fastForward
next
prev
jump

(not: toggle, (revert (pause, close, stop)))


// todo
// _Middle_ As single function would change output if was in middle

// play
// togglePlayPause
// restart
// reset
// pause
// stop
// close
// revert
// rewind
// fastForward
// next
// prev
// jump

play
toggle
revert? If not paused
rewind
fastForward
next
prev
jumpW <11
jumpS <4
jumpTo !0




// _revert_ output changes after play-like




// todo
// xxx Things that, with state changed to play, move the position in text (xxx to something other than they would alone?)


// ========== 1 ==========
// expect failure

// todo

// not at start of text + play or toggle gets non-single function output

// Play comes second from certain ones, output different
play|toggle|restart|fastForward|next() + ... > play() + new|progress
jumpTo (<0?) && !0 && (<11?) + ... > play() + new|progress
jumpW >0 && (<11?) + ... > play() + new|progress
jumpS >0 && (<4?) + ... > play() + new|progress
... might = (!loopSkip)play|loop|new|progress|other?all?
= expect failure

// todo

// Actually toggle is very similar. It /still/ won't get it's usual
// expected output if there's a play-like at the start because
// it will pause.
// xxxToggle is second is more complex
// second after !play-like that goes to not-start and not-end
xxx(?!play|toggle|restart)
xxxdoubles: reset|pause|stop|close|revert|
doubles: 
	next
	jumpTo(!0 <11?)
	jumpW(>0 <11?)
	jumpS(>0 <4?)

+ ... > toggle + new|progress
... might = (!loopSkip)play|loop|new|progress|other?all?
= expect failure

play-like + anyTriggered > change position to not start or end + new|progress


Ex: play + loopFinish > play + newFragment


// ========== 2 ==========

// todo

// Not at start + next
// Not at start + prev

Ex: play(null) + playBegin > nextWord + progress



// ========== 3 ==========

// revert output changes after play-like

1:
play
toggle
restart

2:
revert

Ex: play(null) + playBegin > revert(null) + progress
Ex: play(null) + playBegin > revert(null) + loopBegin

/doubles: (?:play|toggle|restart)(paren) + (?:.* >) revert(paren)


// ========== 4 ==========

1:
// _1st Func Change Pos_ (starting at start, function 1) change the position in the text (changes position from pause)

play
toggle
restart
fastForward
next
jumpTo -1, !0
jumpW >0
jumpS >0

(added to _Always_: toggle)
(not: reset, rewind, prev, jump0, jumpW/S -1/0, revert (pause, close, stop))


2:
// _Not to Ends_ As single function changes position to not start or end

play
toggle
revert? If not paused
next
jumpTo !0 < 11
jumpW/S >0



// ========== 5 ==========

(if reach end (stop|done), play and toggle restart, so not expect failure)

1:
// _1st Func Change Pos_ (starting at start, function 1) change the position in the text (changes position from pause)

play
toggle
restart
fastForward
next
jumpTo -1, !0
jumpW >0
jumpS >0

(added to _Always_: toggle)
(not: reset, rewind, prev, jump0, jumpW/S -1/0, revert (pause, close, stop))


2:
// _Middle_ as second function would change output if was in middle

play
toggle
revert? If not paused
rewind
fastForward
next
prev
// May have to do these separately
jumpTo <11 really depends where it is
jumpW <11 really depends where it is
jumpS 0 (the others might be different, but when reach the end, not at just any change) same, still depends where it is

Ex: doubles: play(null) + playBegin > play(null) + newWordFragment
Ex: doubles: play(null) + progress > play(null) + progress


/doubles: (?:play|toggle|restart|fast|next|jumpstuff).*(paren) (?:play|loopBegin|loopEnd|new|progress)(?:.* > )(?:play|toggle|fast|next|prev|jumpstuff).*(paren) (?:new|progress)/
/doubles: jumpTo\((?:-1|3|6|100)\) + triggered > (?:play)

// These may have to be individual
// as first function
jumpTo\((?:-1|6|11|100)\)
jumpWords\((?:3|4|11|100)\)
jumpSentences\((?:1|3|100)\)

// as last function
jumpTo\((?:-1|0|6)\)
jumpWords\((?:-1|0|3|4)\)  // maybe not -1 unless at end
jumpSentences\((?:0|1)\)


jumpTo(>= 11)|  ([ -1, 0, 6, 11, 100 ])
jumpWords(<0)|
jumpWords(>=0, < 11)|
jumpWords(>= 11)|  ([ -1, 0, 3, 4, 11, 100 ])
jumpSentences(<0)|
jumpSentences(>=0, < 11)|
jumpSentences(>11)|  ([ -1, 0, 1, 3, 100 ])


// ========== 6 ==========

// jump tos (may have to do these individually)

// as first function
jumpTo\((?:-1|6|11|100)\) > jumpTo(-1|0|6|11?) or jumpWords(-1|0|3|4) or ??jumpSentences(-1|0|1|3)??



// ========== 7
reset(), between resetBegin and resetFinish, clears the queue. There won't be any events firing after that.



