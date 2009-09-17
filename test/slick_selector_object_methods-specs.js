// Helpers

Function.prototype._type = "Function";

String.escapeSingle = function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};

Slick.debug = function(message){
	try{console.log(Array.prototype.slice.call(arguments));}catch(e){};
	throw new Error(message);
};

this.PARSE = this.PARSE || Slick.parse;
var s, it, its, specs;



/*
	Slick Selector Object Methods
*/
specs = it = its = {};


// reverse
it['should have a reverse method'] = TODO;



describe('Slick Selector Object Methods', specs);
