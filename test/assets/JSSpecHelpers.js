Function.prototype._type = "Function";

String.escapeSingle = String.escapeSingle || function escapeSingle(string){
	return (''+string).replace(/(?=[\\\n'])/g,'\\');
};


var global = this;
global.context = this;
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
	specBuilder(specs,global.context);
	
	// Create the tests and go!
	describe(description, specs);
	
	// Reset
	descriptionParent = old_descriptionParent;
	specs = spec = it = its = old_specs;
};


global.mocks = {};
var Mock = (function(){
	
	function Mock(mockName, testBuilder){
		if (Object.prototype.toString.call(mockName) != '[object RegExp]')
			mockName = new RegExp(mockName);
		
		this.mockName = mockName;
		this.testBuilder = testBuilder;
		Mock.mocks.push(this);
	};
	
	Mock.mocks = [];
	
	Mock.prototype.run = function(){
		
		var globalContextOld = global.context;
		for (var name in global.mocks) if (this.mockName.test(name)) {
			
			global.context = global.mocks[name];
			this.testBuilder(name);
			
		}
		global.context = globalContextOld;
		
	};
	
	Mock.register = function(name, window){
		clearTimeout(Mock.register.delay);
		global.mocks[name] = window;
		Mock.register.delay = setTimeout(Mock.register.done, 1000);
	};

	Mock.register.done = function(){
		for (var i=0; i < Mock.mocks.length; i++)
			Mock.mocks[i].run();
		
		setTimeout(runSpecs, 100);
	};
	
	
	return Mock;
})();


var TODO = function(){ throw "TODO: This test has not be written yet"; };

if(typeof JSSpec == 'undefined') var JSSpec = {};
if(!JSSpec.Browser) JSSpec.Browser = {};
JSSpec.Browser.NativeConsole = !!(('console' in this) && ('log' in console) && ('toString' in console.log) && console.log.toString().match(/\[native code\]/));
JSSpec.Browser.Trident = (JSSpec.Browser.Trident && !JSSpec.Browser.NativeConsole);

// Stop the normal JSSpec onload from firing yet
var runSpecs = window.onload;
window.onload = function(){
	window.loaded = true;
};
