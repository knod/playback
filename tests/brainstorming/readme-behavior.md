
Events that only get triggered internally
- `'done'` (Triggered by anything that causes the playback to finish, either going forward or back)
- `'_queue'` (Should only be used for development right now. Triggered by any expected external call or inside the loop to set up the next loop)
- `'_dequeue'` (Should only be used for development right now. Triggered either when a function is put on the queue or when a previously queued function has been completed)
- `'loopBegin/Finish'` (Triggered by anything that triggeres a loop)
- `'newWordFragment'` (Triggered by anything that triggeres a loop where the fragment is NOT skipped)
- `'loopSkip'` (Triggered by anything that triggeres a loop where the fragment IS skipped)
- `'progress'` (Triggered by anything that triggeres a loo, skipped or not)
- `'done'` (Triggered by anything that triggeres a loop that hits either the start while traveling forwards (`0` counts as forwards) or hits the start when traveling backwards)

Events that can get triggered externally, but are also sometimes triggered internally
(That is, they have directly associated functions, but other functions that are called externally can also cause these to be triggered internally)
- `'resetBegin/Finish'` (`.reset()` and `.forceReset()`)
- `'playBegin/Finish'` (`.play()` and, sometimes, `.toggle()`)
- `'restartBegin/Finish'` (`.restart()` and, when `.done` is `true`, `.play()` and `.toggle()`)
- `'pauseBegin/Finish'` (`.pause()`, `.revert()`, and someitmes `.toggle()`)
- `'onceBegin/Finish'` (`.once()`, `.current()`, and anything starting with '.jump', '.next', or '.prev')
- `'stopBegin/Finish'` (`.stop()` and anything that causes the playback to finish, either going forward or back)

Events that can only be triggered from external calls of their namesakes
- `'revertBegin/Finish'`
- `'closeBegin/Finish'`
- `'rewindBegin/Finish'`
- `'fastForwardBegin/Finish'`
