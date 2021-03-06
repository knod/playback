// tests-core.js
// Rude, crude testing framework
// Call done() with a non-falsy argument to cause a failure

'use strict';


var fs = require('fs');

// Colors
let colors = {
  green: '\x1B[32m', red: '\x1B[31m',
  yellow: '\x1B[33m', none: '\x1B[0m'
};


const makeTestingCore = function ( filePath ) {
  const core = {};

  var report = {
    total: 0,
    passed: 0
  }

  // ======== PROPERTIES ========
  core.report = report;
  // core.time = { start: 0, end: 0, total: 0 }
  // core.started = false;

  // Functions
  function tryPromise ( fn ) {
    return new Promise( function ( resolve, reject ) {
      process.nextTick( function () {
        let result, error;
        try {
          result = fn();
        } catch ( _error ) {
          error = _error;
        }
        if ( error ) {
          reject( error );
        } else if ( result && typeof result.then === 'function' ) {
          result.then( resolve, reject );
        } else {
          resolve( result );
        }
      });
    });
  };

  var output = function ( message, toConsoleAsWell ) {
    var wentToConsole = false;
    if ( core.filePath && fs ) {
      // Colors would just be weird symbols, get rid of them.
      message = message.replace(/(?:\x1B\[32m|\x1B\[31m|\x1B\[33m|\x1B\[0m)/g, '');
      fs.appendFileSync( core.filePath, message );
    } else {
      wentToConsole = true;
      process.stdout.write( message );
    }
    if ( toConsoleAsWell && !wentToConsole ) { process.stdout.write( message ); }
  };

  core.run = function ( label, callback, timeoutLength = 1000 ) {
    let tryer;

    // if ( !core.started ) { core.time.started = Date.now(); core.started = true; }

    if ( callback.length > 0 ) {

      tryer = function () {

        return new Promise( function ( resolve, reject ) {

          let doneCalled = false;

          let done = function ( error ) {
            doneCalled = true;
            // core.time.end = Date.now();
            // core.time.total = core.time.end - core.time.start;
            if ( error ) { return reject( error ); }
            else { return resolve(); }
          }

          let skip = function ( error ) {
            doneCalled = true;
            if ( error ) { return reject( error ); }
            else { return resolve( true ); }
          }
          
          setTimeout( function () {
            if ( !doneCalled ) {
              reject( new Error( 'Timeout exceeded, make sure to call `done` in your spec.' ) );
            }
          }, timeoutLength );
          
          callback( done, skip );

        });  // End Promise

      }  // End tryer()

    }  // end if callback

    let success = function ( shouldSkip ) {
      var result = null;
      if ( !shouldSkip ) {
        report.total += 1;
        report.passed += 1;
        var msg = colors.green + '.' + colors.none;
        // Print multiple successes on one line
        output( msg );
        return msg;
      }

      return result;
    }

    let failure = function ( error ) {

      report.total += 1;
      var msg1 = '\n' + colors.red + 'Failure on test ' + report.total + ': ' + colors.none + ' ' + label,
          msg2 = '\n- Error:' + ' ' + error + '\n';
      output( msg1 );
      output( msg2 );
      return (msg1 + msg2);
    }

    return tryPromise( tryer ).then( success, failure );

  };  // End it()


  core.finish = function () {
    var msg = '\n\n~~~ Report: ' + report.passed + ' out of ' + report.total + ' tests passed\n';
    output( msg, true );
  };


  // Optional way to write results to a file
  core.filePath = null;
  core.init = function ( filePath ) {
    if ( filePath ) {
      core.filePath = filePath;
      fs.writeFileSync( filePath, '' );
    }  // Create file to be added to
    return core;
  };

  core.init( filePath );

  return core;
};  // End makeTestingCore(){}

module.exports = makeTestingCore;
