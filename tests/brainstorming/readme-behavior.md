
Events that only happen internally
- done
- queue
- dequeue

Events that happen no matter what, if the user called the function or if it was called internally:
- resume
- stop

Events that sometimes get triggered internally as well as externally, but not all the time internally
- play
- restart
- pause

Events that can only be triggered from external calls
- close
- toggle
- rewindBegin/Finish
- fastForwardBegin/Finish
- reset
