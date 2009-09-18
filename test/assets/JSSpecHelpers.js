Function.prototype._type = "Function";

String.escapeSingle = function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};



var specs, spec, it, its;
var descriptionParent = '';

function Describe(description,specBuilder){
	
	// Backup existing object so we don't override it
	var old_specs = specs;
	specs = spec = it = its = {};
	
	// Inherit the description of your forefathers
	description = descriptionParent + (descriptionParent ? ': ' : '') + String(description);
	var old_descriptionParent = descriptionParent;
	descriptionParent = description;
	
	// Build the spec object
	specBuilder(specs);
	
	// Create the tests and go!
	describe(description, specs);
	
	// Reset
	descriptionParent = old_descriptionParent;
	specs = spec = it = its = old_specs;
};


var TODO = function(){ throw "TODO: This test has not be written yet"; };
