/* all.js
* Run all the tests ever, somehow making sure they're run
* sequentially
* 
* TODO:
* - ??: Run skipping with regex replacement to check that
* 	skipping indicator works alright there?
* - ??: `.once(-1)`?
*/

var reports = [];

require( './singles' ).then( function ( report ) {
	reports.push( report )
	require( './skips' ).then( function ( report ) {
		reports.push( report )
		require( './combos' ).then( function ( report ) {
			reports.push( report )
			require( './skip-combos' ).then( function ( report ) {
				reports.push( report )

				var total = 0, passed = 0;
				for ( let reporti = 0; reporti < reports.length; reporti++ ) {
					total += reports[ reporti ].total;
					passed += reports[ reporti ].passed;
				}

				console.log( '\n===\n===\n===\n===\n=== Final Count:\n' + passed + ' out of ' + total + ' passed.\n===\n===\n===\n===\n===')
			});  // end skip-combos
		});  // end combos
	});  // end skips
});  // end singles
