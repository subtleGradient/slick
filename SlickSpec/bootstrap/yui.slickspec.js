function setupMethods(specs, window){
	global.cannotDisableQSA = true;
	
	var YAHOO_util_Selector = (window.YAHOO || global.YAHOO).util.Selector;
	
	window.SELECT = function(context, selector, append){
		return YAHOO_util_Selector.query(selector, context);
	};
	window.SELECT1 = function(context, selector){
		console.log('SELECT1', selector, context, true);
		return YAHOO_util_Selector.query(selector, context, true);
	};
	window.MATCH = function(context, selector){
		return YAHOO_util_Selector.test(context, selector);
	};
	window.isXML = TODO;
}

function verifySetupMethods(specs, window){
	Describe('Verify Setup',function(){
		it['should define SELECT'] = function(){
			value_of( typeof window.SELECT ).should_be('function');
			value_of( window.SELECT(window.document, '*').length ).should_not_be(0);
		};
		it['should define SELECT1'] = function(){
			value_of( typeof window.SELECT1 ).should_be('function');
			value_of( window.SELECT1(window.document, '*').length ).should_not_be(0);
		};
		it['should define MATCH'] = function(){
			value_of( typeof window.MATCH ).should_be('function');
			value_of( window.MATCH(window.document.documentElement, '*') ).should_be_true();
		};
		it['should define isXML'] = function(){
			value_of( typeof window.isXML ).should_be('function');
		};
	});
};

setupMethods({},this);
new Mock('',setupMethods);

verifySetupMethods({},this);
new Mock('',verifySetupMethods);
