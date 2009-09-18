Function.prototype._type = "Function";

String.escapeSingle = String.escapeSingle || function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};



var specs, spec, it, its;
var descriptionParent = '';

function Describe(description,specBuilder){
	
	// Backup existing object so we don't override it
	var old_specs = specs;
	specs = spec = it = its = {};
	
	// Inherit the before and afters of your forefathers
	if (old_specs) {
		if (old_specs.before      ) specs.before      = old_specs.before;
		if (old_specs.before_all  ) specs.before_all  = old_specs.before_all;
		if (old_specs.before_each ) specs.before_each = old_specs.before_each;
		if (old_specs.after       ) specs.after       = old_specs.after;
		if (old_specs.after_all   ) specs.after_all   = old_specs.after_all;
		if (old_specs.after_each  ) specs.after_each  = old_specs.after_each;
	}
	
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
