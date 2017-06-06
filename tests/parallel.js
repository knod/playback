// parallel.js

one = function ( tester, name ) {
	tester.run( 'bleh', function ( done ) {
		done( 'name: ' + name + ', tester.num:' + tester.num );
	});
}

var start = function () {

	for (let funci = 0; funci < 2; funci++) {
		// Do them async so they can all run in parallel
		setTimeout( function () {

			let name 	 = funci + '';
			let filePath = require('path').join( 'tests', 'results', name ) + '.txt';
			let tester 	 = require('./testing-core.js')( filePath );
			tester.num 	 = funci;

			one( tester, name );
			one( tester, name );

		}, 0);
	};

}  // End start()

start();
