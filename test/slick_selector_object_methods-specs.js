// Helpers

Function.prototype._type = "Function";

String.escapeSingle = function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};

Slick.debug = function(message){
	try{console.log(Array.prototype.slice.call(arguments));}catch(e){};
	throw new Error(message);
};


/*
	Slick Parser Specs
*/
this.PARSE = this.PARSE || Slick.parse;
var s, it, its, specs;
specs = it = its = {};


it['should exist'] = function(){
	value_of(PARSE).should_not_be_undefined();
};



// reverse combinators
// TODO: reverse combinator specs


describe('Slick Selector Object Reverse', specs);
