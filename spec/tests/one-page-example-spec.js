
// --- in the first script ---
var run_it_ = function ( expected1, count ) {

	it("tests against the expected value.", function () {
		
		console.log( 'it:', count, this.test1, expected1, (this.test1 == expected1) );
		expect( this.test1 ).toEqual( expected1 );

	});

};



// --- in the second script ---
var count = 1  // Just to maybe help us see what's going on
var one = function ( val ) {

	beforeEach(function () {
		this.test1 = val
		console.log( 'beforeEach in other function:', count, val, this.test1 );
		count++
	});

	// afterEach(function () {
	// 	this.test = null;
	// });

	run_it_( val, count );
};



// --- in the third script ---
describe("One test", function () {

	var vals = [ 'yaaas', 'noooo' ]

	for ( let vali = 0; vali < vals.length; vali++ ) {
		one( vals[ vali ] );
	}

	// Results:
	// beforeEach: 1 yaaas yaaas
	// beforeEach: 2 noooo noooo
	// it: 1 noooo yaaas false
	// (then a "failure")
	// beforeEach: 3 yaaas yaaas
	// beforeEach: 4 noooo noooo
	// it: 1 noooo noooo true
	// (then a success)

	// Why is the `beforeEach` being called 4 times?

});