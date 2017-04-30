
jasmine.runOne = function ( expected1, count ) {

	it("tests against the expected value.", function () {
		
		console.log( 'it:', count, this.test1, expected1, (this.test1 == expected1) );
		expect( this.test1 ).toEqual( expected1 );

	});

};
