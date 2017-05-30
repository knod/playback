
Events that only get triggered internally
- `'done'`
- `'_queue'`
- `'_dequeue'`

Events that can get triggered externally, but are also sometimes triggered internally
(That is, they have directly associated functions, but other functions that are called externally can also cause these to be triggered)
- `'playBegin/Finish'`
- `'pauseBegin/Finish'`
- `'revertBegin/Finish'`
- `'restartBegin/Finish'`
- `'stopBegin/Finish'`

Events that can only be triggered from external calls
- `'closeBegin/Finish'`
- `'toggleBegin/Finish'`
- `'rewindBegin/Finish'`
- `'fastForwardBegin/Finish'`
- `'resetBegin/Finish'`
