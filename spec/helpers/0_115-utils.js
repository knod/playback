// 0_115-parseTestName.js

var utils = {};
module.exports = utils;

utils.nameRegexp = /`\.(.+?\().+ with (.+?) then, on '(.+?)', calls `\.(.+?\().+ with (.+?) and we collect data on '(.+?)'/i;

utils.simplifyTestName = function ( name ) {
	var mch = utils.nameRegexp.exec( name );
	var str;
	if ( mch ) {
		str = mch[1] + mch[2] + ') > ' + mch[3] + ' > ' + mch[4] + mch[5] + ') > ' + mch[6];	
	}
	return str;
};  // End utils.simplifyTestName()

