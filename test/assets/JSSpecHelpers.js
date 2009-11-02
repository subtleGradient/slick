function $try(){
	for (var i = 0, l = arguments.length; i < l; i++){
		try {
			return arguments[i]();
		} catch(e){}
	}
	return null;
};

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
	var spec_count = 0;
	for (var specname in specs){
		if (/^(before|after)[_ ](all|each)$/.test(specname)) continue;
		if (specs[specname]) spec_count++;
	}
	if (spec_count) describe(description, specs);
	
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
		for (var mockName in global.mocks) if (this.mockName.test(mockName)) {
			
			global.context = global.mocks[mockName];
			Describe(mockName,this.testBuilder);
			
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

Mock.Request = function(mockName, url){
	if (!this instanceof Mock.Request) throw new Error('Mock.Request is not callable directly. Must use `new Mock.Request`');
	
	this.mockName = mockName;
	this.url = url;
	
	var self = this;
	this.callback = function(html, xml){
		Mock.register(self.mockName +': '+ String(self.url).replace(/^.*\//,''), newSlickWinFromDoc(xml));
	};
	this.rq = new SimpleRequest();
	this.rq.send(this.url, this.callback);
};


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


// XML
// from http://www.webreference.com/programming/javascript/definitive2/
/**
 * Create a new Document object. If no arguments are specified,
 * the document will be empty. If a root tag is specified, the document
 * will contain that single root tag. If the root tag has a namespace
 * prefix, the second argument must specify the URL that identifies the
 * namespace.
 */ 
var newXMLDocument = (document.implementation && document.implementation.createDocument)
? function(rootTagName, namespaceURL){
	return document.implementation.createDocument(namespaceURL||'', rootTagName||'', null); 
}
: function(rootTagName, namespaceURL){
	if (!rootTagName) rootTagName = ""; 
	if (!namespaceURL) namespaceURL = ""; 
	// This is the IE way to do it 
	// Create an empty document as an ActiveX object 
	// If there is no root element, this is all we have to do 
	var doc = new ActiveXObject("MSXML2.DOMDocument"); 
	// If there is a root tag, initialize the document 
	if (rootTagName) { 
		// Look for a namespace prefix 
		var prefix = ""; 
		var tagname = rootTagName; 
		var p = rootTagName.indexOf(':'); 
		if (p != -1) { 
			prefix = rootTagName.substring(0, p); 
			tagname = rootTagName.substring(p+1); 
		} 
		// If we have a namespace, we must have a namespace prefix 
		// If we don't have a namespace, we discard any prefix 
		if (namespaceURL) { 
			if (!prefix) prefix = "a0"; // What Firefox uses 
		} 
		else prefix = ""; 
		// Create the root element (with optional namespace) as a 
		// string of text 
		var text = "<" + (prefix?(prefix+":"):"") +	 tagname + 
		(namespaceURL 
			?(" xmlns:" + prefix + '="' + namespaceURL +'"') 
		:"") + 
		"/>"; 
		// And parse that text into the empty document 
		doc.loadXML(text); 
	} 
	return doc; 
}; 

/**
 * Synchronously load the XML document at the specified URL and
 * return it as a Document object
 */
var loadXML = function(url) {
	// Create a new document with the previously defined function
	var xmldoc = newXMLDocument();
	xmldoc.async = false;  // We want to load synchronously
	xmldoc.load(url);	   // Load and parse
	return xmldoc;		   // Return the document
};

/**
 * Parse the XML document contained in the string argument and return
 * a Document object that represents it.
 */
var parseXML = (function(){
	
	// Mozilla, Firefox, and related browsers
	if (typeof DOMParser != "undefined")
	return function(rawXML){
		return (new DOMParser()).parseFromString(rawXML, "application/xml");
	};
	
	// Internet Explorer.
	if (typeof ActiveXObject != "undefined")
	return function(rawXML){
		var xmlDocument = new ActiveXObject("Microsoft.XMLDOM");
		xmlDocument.async = false;
		xmlDocument.loadXML(rawXML);
		
		if (xmlDocument.parseError && xmlDocument.parseError.errorCode)
			xmlDocument.loadXML(rawXML.replace(/<!DOCTYPE[^>]*?>/i,''));
		
		if (xmlDocument.parseError && xmlDocument.parseError.errorCode)
		throw new Error([''
			,("Error code: " + xmlDocument.parseError.errorCode)
			,("Error reason: " + xmlDocument.parseError.reason)
			,("Error line: " + xmlDocument.parseError.line)
			,rawXML
		].join('\n'));
		
		return xmlDocument;
	};
	
	// As a last resort, try loading the document from a data: URL
	// This is supposed to work in Safari. Thanks to Manos Batsis and
	// his Sarissa library (sarissa.sourceforge.net) for this technique.
	return function(rawXML){
		var url = "data:text/xml;charset=utf-8," + encodeURIComponent(rawXML);
		var request = new XMLHttpRequest();
		request.open("GET", url, false);
		request.send(null);
		return request.responseXML;
	};
	
})();


function getXML(url,mime){
	if (!mime && url && /\.(svg|xml|xhtml)/i.test(url))
		mime = 'text/xml';
	
	var request;
	if (XMLHttpRequest != undefined)
		request = new XMLHttpRequest();
	else
		request = new ActiveXObject("Microsoft.XMLHTTP");
	
	request.open("GET", url, false);
	if (mime && request.overrideMimeType) request.overrideMimeType(mime);
	request.send(null);
	return request;
	return request.responseXML || parseXML(request.responseText);
	
};

