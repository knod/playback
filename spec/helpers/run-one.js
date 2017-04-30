
jasmine.runOne = function ( expected1, count ) {

	it("tests against the expected value.", function () {
		
		console.log( 'it:', count, this.test1, expected1, (this.test1 == expected1) );
		expect( this.test1 ).toEqual( expected1 );

	});

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

};
