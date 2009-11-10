// -*- Mode: JavaScript; tab-width: 4; -*-
var local = {};
local.collectionToArray = function(node){
   return Array.prototype.slice.call(node);
};
try{
    local.collectionToArray(root.childNodes);
}
catch(e){
	local.collectionToArray = function(node){
		if (node instanceof Array) return node;
		var i = node.length, array = new Array(i);
		while (i--) array[i] = node[i];
		return array;
	};
}


function benchmarkParser(specs,context){
	var selectors = global.selectors;
	if (global.disableQSA) {
		try{
			context.document.querySelector = null;
			context.Element.prototype.querySelectorAll = null;
			context.document.querySelector = null;
			context.Element.prototype.querySelector = null;
		}catch(e){}
	}
	
	global.SlickLast.debug = function(error){
		throw error;
	};
	global.SlickThis.debug = function(error){
		throw error;
	};
	
	it['THIS.parse'] = _benchmarkParser(function(searchContext,selector){ return global.SlickThis.parse(selector); }, context, selectors);
	it['LAST.parse'] = _benchmarkParser(function(searchContext,selector){ return global.SlickLast.parse(selector); }, context, selectors); 
}

function _benchmarkParser(SELECT,context,selectors,before,after){
	function __benchmarkParser(count){
		var document = context.document;
		var i, ii, node, l;
		var elements = SELECT(document,'*');
		before = before || function(){};
		after = after || function(){};
		before(context);
		var results = {};
		// if (global.console && global.console.profile){
		// 	global.console.profile(SELECT+disableQSA);
		// 	for (ii=0; ii < selectors.length; ii++) {
		// 		// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; };
		// 		SELECT(document, selectors[ii]);
		// 	}
		// 	global.console.profileEnd(SELECT+disableQSA);
		// }
		
		while(count--){
			for (ii=0; ii < selectors.length; ii++) if (selectors[ii]){
				
				for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; };
				try{
					results[selectors[ii]] = SELECT(document, selectors[ii]).length;
				}catch(error){
					results[selectors[ii]] = error;
				}
				
			}
		}
		after(context);
		return results;
	}
	return __benchmarkParser;
};
