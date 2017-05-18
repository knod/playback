// node tests/example.js
// sync example

var tester = require('./tests-core.js');

var xs = [1, 2, 3],
    ys = [1, 2, 3],
    zs = [1, 2, 3];

function doOneThing ( x = 0, y = 0, z = 0 ) {
  const foo = xs[x];
  const bar = ys[y];
  const baz = zs[z];

  const label = foo + ' & ' + bar + ' & ' + baz;

  // First run a test
  tester.run( label, function tests ( done ) {
    // do stuff
    try {
        // There will be some failures on purpose
        if ( foo !== bar || bar !== baz || foo !== baz ) {
          done();
        } else {
          done( 'All were equal!', label );
        }
    } catch (err) {
        done(err, label);
    }  // End try
  })  // End it()
  // Then increment and run this function again, testing again
  .then(() => {
 
    let nextZ = z + 1;
    let nextY = y;
    let nextX = x;

    if (nextZ >= zs.length) {
      nextZ = 0;  // reset
      nextY++;  // increment the next array
    }
    if (nextY >= ys.length) {
      nextY = 0;  // reset
      nextX++;  // increment the next array
    }  // end increment

    if (nextX >= xs.length) {
      // tester.finish()??
      return;
    } else {
      doOneThing( nextX, nextY, nextZ )  // iterate
    }  // end maybe repeat

  });  // End .then()
};

doOneThing();
