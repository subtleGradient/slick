function specsIsXML(){
	
	
	new Mock(/\b(xml|svg|xhtml)\b/i, function(specs,context){
		var SELECT = (context.SELECT || global.SELECT);
		Describe('is XML',function(){
			it['should be XML'] = function(){
				value_of( context.document.nodeType ).should_be(9);
				value_of( context.document ).should_not_be( global.document );
				value_of(context.isXML(context.document)).should_be_true();
			};
		});
	});
	
	new Mock(/\b(html)\b/i, function(specs,context){
		var SELECT = (context.SELECT || global.SELECT);
		Describe('is not XML',function(){
			it['should not be XML'] = function(){
				value_of( context.document.nodeType ).should_be(9);
				value_of( context.document ).should_not_be( global.document );
				value_of(context.isXML(context.document)).should_be_false();
			};
		});
	});
	
	
};
