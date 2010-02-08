function setupMethods(specs, window){
	global.cannotDisableQSA = true;
	
	var jQuery = window.jQuery || global.jQuery || function(){};
	var Sizzle = window.Sizzle || global.Sizzle || jQuery() && function(selector, context, append, seed){
		if (seed) return Array.prototype.slice.call(jQuery(seed).filter(selector).get());
		return Array.prototype.slice.call(jQuery(append || []).add(selector, context).get());
	};
	
	var isXML = jQuery.isXMLDoc || function(elem){
		return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
			!!elem.ownerDocument && isXML( elem.ownerDocument );
	};
	
	window.SELECT = function(context, selector, append){
		return Sizzle(selector, context, append);
	};
	window.SELECT1 = function(context, selector){
		return Sizzle(selector + ':first', context)[0];
	};
	window.MATCH = function(context, selector, root){
		return !!Sizzle(selector, null, null, [context]).length;
	};
	window.isXML = function(document){
		return isXML(document);
	};
}

function verifySetupMethods(specs, window){
	Describe('Verify Setup',function(){
		it['should define SELECT'] = function(){
			value_of( typeof window.SELECT ).should_be('function');
			value_of( window.SELECT(window.document, '*').length ).should_not_be(0);
		};
		it['should define SELECT1'] = function(){
			value_of( typeof window.SELECT1 ).should_be('function');
			value_of( window.SELECT1(window.document, '*') ).should_not_be_null();
		};
		it['should define MATCH'] = function(){
			value_of( typeof window.MATCH ).should_be('function');
			value_of( window.MATCH(window.document.documentElement, '*') ).should_be_true();
		};
		it['should define isXML'] = function(){
			value_of( typeof window.isXML ).should_be('function');
			value_of( typeof window.isXML(window.document) ).should_be('boolean');
		};
	});
};
function verifySetupContext(specs, context){
	Describe('Verify Context',function(){

		it['should set the context properly'] = function(){
			value_of(context.document).should_not_be_undefined();
			value_of(context.document.nodeType).should_be(9);
			
			var title = context.document.getElementsByTagName('title');
			for (var i=0, l=title.length; i < l; i++)
				if (title[i].firstChild)
					value_of(title[i].firstChild.nodeValue).should_not_match(404);
			
		};

	});
};

setupMethods({},this);
new Mock('',setupMethods);

verifySetupMethods({},this);
new Mock('',verifySetupMethods);
new Mock('',verifySetupContext);
