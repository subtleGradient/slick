function setupMethods(specs, window){
	window.SELECT = function(context, selector){
		return (window.Slick || global.Slick)(context, selector);
	};
	window.MATCH = function(context, selector){
		return (window.Slick || global.Slick).match(context, selector);
	};
	window.isXML = function(document){
		return (window.Slick || global.Slick).isXML(document);
	};
}

function verifySetupMethods(specs, window){
	Describe('Verify Setup',function(){
		it['should define SELECT'] = function(){
			value_of( typeof window.SELECT ).should_be('function');
			value_of( window.SELECT(window.document, '*').length ).should_not_be(0);
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
