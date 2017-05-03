// tests-core.js
// Rude, crude testing framework

// Call done() with a non-falsy argument to cause a failure

var total = 0,
  passed  = 0;

// Colors
let colors = {
  green: '\x1B[32m', red: '\x1B[31m',
  yellow: '\x1B[33m', none: '\x1B[0m'
};

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

function it ( label, callback, timeoutLength = 1000 ) {
  let tryer;

  if ( callback.length > 0 ) {

    tryer = function () {

      return new Promise( function ( resolve, reject ) {

        let doneCalled = false;

        let done = function ( error ) {
          doneCalled = true;
          if ( error ) { reject( error ); }
          else { resolve(); }
        }
        
        setTimeout( function () {
          if ( !doneCalled ) {
            reject( new Error( 'Timeout exceeded, make sure to call `done` in your spec.' ) );
          }
        }, timeoutLength );
        
        callback( done );

      });  // End Promise

    }  // End tryer()

  }  // end if callback

  total += 1;

  let success = function () {

    var msg = colors.green + '.' + colors.none;
    // console.log( colors.green + 'Success:' + colors.none, label );
    // Print multiple successes on one line
    process.stdout.write( msg );
    passed += 1;
  }

  let failure = function ( error ) {

    console.log( '\n' + colors.red + 'Failure on test ' + total + ': ' + colors.none, label );
    console.log( '- Error:', error );
    // console.log( error.stack );

  }

  return tryPromise( tryer ).then( success, failure );

};  // End it()


// TODO:
function getReport () {
  console.log( '~~~ Report: ' + passed + ' out of ' + total + ' tests passed' );
};


module.exports = it;



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
