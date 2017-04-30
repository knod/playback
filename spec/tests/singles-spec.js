
var count = 1

describe("One test", function () {

	// beforeEach(function () {
	// 	this.test1 = 'noooo'
	// 	console.log( 'concurrent beforeEach:', count, this.test1, this.test1 );
	// 	count++
	// 	// jasmine.runOne( val, count );
	// });

	// jasmine.runOne( 'yaaas', 1 );
	// jasmine.runOne( 'noooo', 2 );

	// // Results:
	// // beforeEach: 1 nooooo nooooo
	// // it: 1 nooooo yaaaas false
	// // (then a "failure", of course)
	// // beforeEach: 2 nooooo nooooo
	// // it: 2 nooooo nooooo true
	// // (then a success)



	jasmine.one( 'yaaas' );
	jasmine.one( 'noooo' );

	// Results:
	// beforeEach: 1 yaaas yaaas
	// beforeEach: 2 noooo noooo
	// it: 1 noooo yaaas false
	// (then a "failure")
	// beforeEach: 3 yaaas yaaas
	// beforeEach: 4 noooo noooo
	// it: 1 noooo noooo true
	// (then a success)

});
