function benchmarkSelectors(specs,context){
	var selectors = global.selectors;
	if (global.disableQSA) {
		try{
			context.document.querySelector = null;
			context.Element.prototype.querySelectorAll = null;
			context.document.querySelector = null;
			context.Element.prototype.querySelector = null;
		}catch(e){}
	}
	
	
	it['THIS'] = _benchmarkSelectors(function(selector,doc){ return global.SlickThis(selector,doc); }, context, selectors, function(){global.SlickThis.disableQSA = true;});
	it['LAST'] = _benchmarkSelectors(function(selector,doc){ return global.SlickThis(selector,doc); }, context, selectors, function(){global.SlickThis.disableQSA = true;}); 
	
	if (document.querySelectorAll) {
		it['THIS qsa'] = _benchmarkSelectors(function(selector,doc){ return global.SlickThis(selector,doc); }, context, selectors, function(){global.SlickThis.disableQSA = false;});
		it['LAST qsa'] = _benchmarkSelectors(function(selector,doc){ return global.SlickThis(selector,doc); }, context, selectors, function(){global.SlickThis.disableQSA = false;});
	}
	
	if (global.Sizzle)
	it['Sizzle'] = _benchmarkSelectors(function(selector,doc){ return global.Sizzle(doc,selector); }, context, selectors);
	
	// if (global.NW) {
	// 	global.NW.Dom.setCache(false);
	// 	it['NWm'] = _benchmarkSelectors(function(doc,selector){ return global.NW.Dom.select(selector,doc); }, context, selectors);
	// }
	
}

function _benchmarkSelectors(SELECT,context,selectors,before){
	function __benchmarkSelectors(count){
		var document = context.document;
		var i, ii, node, l;
		var elements = SELECT(document,'*');
		before && before();
		
		if (global.console && global.console.profile){
			global.console.profile("disableQSA "+disableQSA);
			for (ii=0; ii < selectors.length; ii++) {
				// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; };
				SELECT(document, selectors[ii]);
			}
			global.console.profileEnd("disableQSA "+disableQSA);
		}
		
		while(count--){
			for (ii=0; ii < selectors.length; ii++) {
				
				
				for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; };
				SELECT(document, selectors[ii]);
				
				
			}
		}
	}
	return __benchmarkSelectors;
};
