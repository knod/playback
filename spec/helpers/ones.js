var count = 1;

jasmine.one = function ( val ) {

	beforeEach(function () {
		this.test1 = val
		console.log( 'beforeEach:', count, val, this.test1 );
		count++
		// jasmine.runOne( val, count );
	});

	// afterEach(function () {
	// 	this.test = null;
	// });

	jasmine.runOne( val, count );
};
