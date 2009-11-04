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
	
	it['THIS'] = _benchmarkSelectors(function(selector,doc){ return global.SlickThis(selector,doc); }, context, selectors, true);
	it['LAST'] = _benchmarkSelectors(function(selector,doc){ return global.SlickLast(selector,doc); }, context, selectors, true);
	if (document.querySelectorAll)
	it['THIS qsa'] = _benchmarkSelectors(function(selector,doc){ return global.SlickThis(selector,doc); }, context, selectors, false);
	if (document.querySelectorAll)
	it['LAST qsa'] = _benchmarkSelectors(function(selector,doc){ return global.SlickLast(selector,doc); }, context, selectors, false);
	
	// if (global.disableQSA) global.SlickLast.disableQSA = true;
	// if (global.Sizzle)
	// it['Sizzle'] = _benchmarkSelectors(function(selector,doc){ return global.Sizzle(doc,selector); }, context, selectors);
	
	// if (global.NW) {
	// 	global.NW.Dom.setCache(false);
	// 	it['NWm'] = _benchmarkSelectors(function(doc,selector){ return global.NW.Dom.select(selector,doc); }, context, selectors);
	// }
	
}

function _benchmarkSelectors(SELECT,context,selectors,disableQSA){
	function __benchmarkSelectors(count){
		var document = context.document;
		var i, ii, node, l;
		var elements = SELECT(document,'*');
		Slick.disableQSA = disableQSA;
		
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
		
		Slick.disableQSA = false;
	}
	return __benchmarkSelectors;
};
