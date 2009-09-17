var specs, spec, it, its;
var descriptionParent = '';

function Describe(description,specBuilder){
	
	var old_specs = specs;
	specs = spec = it = its = {};
	
	description = descriptionParent + (descriptionParent ? ': ' : '') + String(description);
	var old_descriptionParent = descriptionParent;
	descriptionParent = description;
	
	specBuilder(specs);
	
	descriptionParent = old_descriptionParent;
	
	describe(description, specs);
	
	specs = spec = it = its = old_specs;
};


var TODO = function(){ throw "TODO"; };
