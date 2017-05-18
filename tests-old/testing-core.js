// tests-core.js
// Rude, crude testing framework

// Call done() with a non-falsy argument to cause a failure

var core = {};

var total = 0,
  passed  = 0;

var report = {
  total: 0,
  passed: 0
}

// Colors
let colors = {
  green: '\x1B[32m', red: '\x1B[31m',
  yellow: '\x1B[33m', none: '\x1B[0m'
};


// ======== PROPERTIES ========
core.report = report;
// core.time = {
//   start: 0,
//   end: 0,
//   total: 0
// }
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

          if ( error ) { reject( error ); }
          else { resolve(); }
        }

        let skip = function ( error ) {
          doneCalled = true;
          if ( error ) { reject( error ); }
          else { resolve( true ); }
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

    if ( !shouldSkip ) {
      report.total += 1;
      report.passed += 1;
      var msg = colors.green + '.' + colors.none;
      // console.log( colors.green + 'Success:' + colors.none, label );
      // Print multiple successes on one line
      process.stdout.write( msg );
    }

  }

  let failure = function ( error ) {

    report.total += 1;
    console.log( '\n' + colors.red + 'Failure on test ' + report.total + ': ' + colors.none, label );
    console.log( '- Error:', error );

  }

  return tryPromise( tryer ).then( success, failure );

};  // End it()


core.finish = function () {
  console.log( '\n\n~~~ Report: ' + report.passed + ' out of ' + report.total + ' tests passed' );
};


module.exports = core;



// Using it:
/*
function doOneThing ( x = 0, y = 0, z = 0 ) {
  const foo = xs[x];
  const bar = ys[y];
  const baz = zs[z];
  const label = foo + bar + baz;
  it( label, (  done  ) => {
    // do stuff
    // try {
      // if ( whatever ) {
      //   done()
      // } else {
      //   done( useful message )  // Need a message - that's what causes a failure
      // }
    // } catch ( err ) {
      // done( err )
    //}
  })
  .then( () => {
    let nextZ = z + 1;
    let nextY = y;
    let nextX = x;
    if ( nextZ >= zs.length ) {
      nextZ = 0;
      nextY++;
    }
    if ( nextY >= ys.length ) {
      nextY = 0;
      nextX++;
    }
    if ( nextX >= xs.length ) {
      return;
    } else {
      doOneThing(  nextX, nextY, nextZ  )
    }
  });
};
*/
