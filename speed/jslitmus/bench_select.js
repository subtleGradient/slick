function benchmarkSelectors(specs,context){
	
	if (global.disableQSA) {
		try{
			context.document.querySelector = null;
			context.Element.prototype.querySelectorAll = null;
			context.document.querySelector = null;
			context.Element.prototype.querySelector = null;
		}catch(e){}
	}
	
	// if (global.disableQSA) global.SlickThis.disableQSA = true;
	it['THIS'] = _benchmarkSelectors(function(selector,doc){ return global.SlickThis(selector,doc); }, context);
	
	// if (global.disableQSA) global.SlickLast.disableQSA = true;
	it['LAST'] = _benchmarkSelectors(function(selector,doc){ return global.SlickLast(selector,doc); }, context);
	
	// if (global.disableQSA) global.SlickLast.disableQSA = true;
	if (global.Sizzle)
	it['Sizzle'] = _benchmarkSelectors(function(selector,doc){ return global.Sizzle(doc,selector); }, context);
	
	if (global.NW) {
		global.NW.Dom.setCache(false);
		it['NWm'] = _benchmarkSelectors(function(doc,selector){ return global.NW.Dom.select(selector,doc); }, context);
	}
	
}

function _benchmarkSelectors(SELECT,context){
	return function(count){
		
		var document = context.document;
		var i=0, node;
		var elements = SELECT(document,'*');
		
		while(count--){
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'body'                        );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div'                         );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'body div'                    );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div p'                       );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div > p'                     );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div + p'                     );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div ~ p'                     );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div p a'                     );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div, p, a'                   );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class^=exa][class$=mple]');
			for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'.note'                       );
			for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div.example'                 );
			for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'ul .tocline2'                );
			for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div.example, div.note'       );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'#title'                      );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'h1#title'                    );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div #title'                  );
			for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'ul.toc li.tocline2'          );
			for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'ul.toc > li.tocline2'        );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'h1#title + div > p'          );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'h1[id]:contains(Selectors)'  );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'a[href][lang][class]'        );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class]'                  );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class=example]'          );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class^=exa]'             );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class$=mple]'            );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class*=e]'               );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class|=dialog]'          );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class!=made_up]'         );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div[class~=example]'         );
			for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'div:not(.example)'           );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:contains(selectors)'       );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:nth-child(even)'           );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:nth-child(2n)'             );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:nth-child(odd)'            );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:nth-child(2n+1)'           );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:nth-child(n)'              );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:only-child'                );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:last-child'                );
			// for (i=0; node = elements[i++];) { node._slickUID = node._cssId = null; }; SELECT(document,'p:first-child'               );
		}
		
		Slick.disableQSA = false;
	}
};
