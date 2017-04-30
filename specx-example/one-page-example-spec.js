
// --- 1st script ---
var run_it_ = function ( val, count ) {

	it("tests against the expected value.", function () {

		// // Won't work
		// expect( this.test1 ).toEqual( val );
		expect( val ).toEqual( vals[ count ] );


	});

};



// --- 2nd script ---
var vals = [ 'yaaas', 'noooo' ];
var count = 0;

// Can't be in a function or jasmine won't see it
describe("One test", function () {

	// Can't use beforeEach to assign values since it can only be used once
	// Can only be used to reset values in state I guess?
	// In the thing below, the count goes all the way up before
	// the `beforeEach` would be called.
	// I dunno. If you can get the thing below to work, then it might work

	// beforeEach(function () {
	// 	this.test1 = vals[ count ];
	// 	console.log( 'beforeEach in other function:', count, vals[ count ], this.test1 );
	// 	// count++
	// });
	
	for ( let vali = 0; vali < vals.length; vali++ ) {

		run_it_( vals[ vali ], count );
		count++;
	}

});
