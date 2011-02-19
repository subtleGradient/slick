exports.Slick = (function(){
	var Parser = require('./Slick.Parser').Slick,
		Finder = require('./Slick.Finder').Slick;
	
	for (key in Parser){
		Finder[key] = Parser[key];
	}
	
	return Finder;
}());
