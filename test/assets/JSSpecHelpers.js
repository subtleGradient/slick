var specs, spec, it, its;

function Describe(description,specBuilder){
	
	specs = spec = it = its = {};
	specBuilder(specs);
	
	return describe(description, specs);
};


var TODO = function(){ throw "TODO"; };
