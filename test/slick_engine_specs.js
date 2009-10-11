this.context = this.context || this;

Describe('Slick Selector Engine Bugs',function(){
	
	it['should not return not-nodes'] = function(){
		var results = context.document.getElementsByTagName('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_be_undefined();
		}
	};
	
	it['should not return close nodes'] = function(){
		var results = context.document.getElementsByTagName('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^\//);
		}
	};
	
	
});


Describe('Slick Selector Engine',function(){
	// var template = document.getElementsByTagName('iframe')[0].contentWindow.document.body;
	
	
	if (document.querySelectorAll)
	it['should not fail when using QSA is enabled'] = function(){
		value_of( document.search('body').length ).should_be( 1 );
	};
	
	it['should get Slick from the iframe'] = function(){
		value_of( document.search('body *').length ).should_be( 1816 );
	};
	
	function makeSlickTestSearch(selector, count, disableQSA) {
		// if (document.querySelectorAll)
		// return new Function(" var count; try{ count = document.querySelectorAll('"+String.escapeSingle(selector)+"').length; console.log('"+String.escapeSingle(selector)+"', count); }catch(e){ \ncount="+count+" }; value_of( Slick(document, '"+String.escapeSingle(selector)+"').length ).should_be( count );");
		return new Function("\
			Slick.disableQSA = "+!!disableQSA+";\n\
			value_of( document.search('"+String.escapeSingle(selector)+"').length ).should_be( "+count+" );\n\
			delete Slick.disableQSA;\
		");
	}
	function it_should_find(count,selector){
		if (global.document.querySelectorAll)
			specs['should find '+count+' `'+selector+'` with    QSA' ] = makeSlickTestSearch(selector, count, false);
		specs['should find '+count+' `'+selector+'` without QSA' ] = makeSlickTestSearch(selector, count, true);
	};
	
	it_should_find(1, 'html');
	it_should_find(1, 'body');
	
	it_should_find(1828, '*');
	it_should_find(1816, 'body *');
	
	it_should_find(1, 'html');
	it_should_find(1, 'body');
	it_should_find(1, 'head');
	it_should_find(59, 'div');
	
	it_should_find(43, '.example');
	it_should_find(14, '.note');
	it_should_find(5, '.fn');
	
	it_should_find(4, '.a1');
	it_should_find(2, '.a1 .a1');
	it_should_find(2, '.a1   .a1');
	it_should_find(2, '.a1 > .a1');
	it_should_find(0, '.a1 + .a1');
	
	it_should_find(12, '.a1   *');
	it_should_find(3, '.a1 > *');
	it_should_find(2, '.a1 + *');
	it_should_find(6, '.a1 ~ *');
	
	it_should_find(6, '.a1 !  *');
	it_should_find(4, '.a1 !> *');
	it_should_find(2, '.a4 !+ *');
	it_should_find(4, '.a4 !~ *');
	
	it_should_find(4, '.a4');
	it_should_find(2, '.a4   .a4');
	it_should_find(2, '.a4 > .a4');
	it_should_find(0, '.a4 + .a4');
	
	
	it_should_find(324      , 'body [class]');
	it_should_find(13       , 'body [title]');
	it_should_find(1492 , 'body :not([class])');
	it_should_find(1803 , 'body :not([title])');
	;
	it_should_find(59  , 'body div');
	it_should_find(140 , 'div p');
	it_should_find(134 , 'div > p');
	it_should_find(22  , 'div + p');
	it_should_find(183 , 'div ~ p');
	it_should_find(0   , 'div & p');
	;
	it_should_find(43  , 'div[class^=exa][class$=mple]');
	it_should_find(12  , 'div p a');
	it_should_find(683 , 'div,p,a');
	;
	it_should_find(43 , 'DIV.example');
	it_should_find(12 , 'ul .tocline2');
	it_should_find(44 , 'div.example,div.note');
	;
	it_should_find(1 , '#title');
	it_should_find(1 , 'h1#title');
	it_should_find(1 , 'body #title');
	;
	it_should_find(12 , 'ul.toc li.tocline2');
	it_should_find(12 , 'ul.toc > li.tocline2');
	it_should_find(0  , 'h1#title + div > p');
	
	// it_should_find((function(){
	// 	var count = 0;
	// 	var elements = template.getElementsByTagName('h1');
	// 	for (var i=0; i < elements.length; i++) {
	// 		if (elements[i].id != null && elements[i].id != '')
	// 			if (/Selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
	// 	}
	// 	return count;
	// })(), 'h1[id]:contains(Selectors)');
	
	// pseudos
	it_should_find(16,  'div:not(.example)');
	it_should_find(169, 'p:nth-child(even)');
	it_should_find(169, 'p:nth-child(2n)');
	it_should_find(155, 'p:nth-child(odd)');
	it_should_find(155, 'p:nth-child(2n+1)');
	it_should_find(324, 'p:nth-child(n)');
	it_should_find(3,   'p:only-child');
	it_should_find(19,  'p:last-child');
	it_should_find(54,  'p:first-child');
	
	// specs['":contains()" elements should actually contain the word'] = function(){
	// 	var els = document.search(':contains(selectors)');
	// 	for (var i=0,el; el=els[i]; i++) value_of( el.innerHTML ).should_match( 'selectors' );
	// 	
	// 	els = document.search(':contains(Selectors)');
	// 	for (i=0; el=els[i]; i++) value_of( el.innerHTML ).should_match( 'Selectors' );
	// };
	// 
	// it_should_find((function(){
	// 	var count = 0;
	// 	var elements = template.getElementsByTagName('h1');
	// 	for (var i=0; i < elements.length; i++) {
	// 		if (elements[i].id != null && elements[i].id != '')
	// 			if (/Selectors/.test(elements[i].innerText || elements[i].textContent)) count++;
	// 	}
	// 	return count;
	// })(),'h1[id]:contains("Selectors")');
	
	it_should_find(58,':contains(Selectors)');
	it_should_find(58,":contains('Selectors')");
	it_should_find(58,':contains("Selectors")');
	
	it_should_find(1,'[href][lang][class]');
	// it_should_find((function(){
	// 	var count = 0;
	// 	var elements = template.getElementsByTagName('*');
	// 	for (var i=0; i < elements.length; i++) {
	// 		if (elements[i].className != null && elements[i].className != '') count++;
	// 	}
	// 	return count;
	// })(),'[class]');
	it_should_find(43, '[class=example]');
	it_should_find(43, '[class^=exa]');
	it_should_find(44, '[class$=mple]');
	
	// it_should_find((function(){
	// 	var count = 0;
	// 	var elements = template.getElementsByTagName('*');
	// 	for (var i=0; i < elements.length; i++) {
	// 		if (elements[i].className != null && elements[i].className.match(/e/)) count++;
	// 	}
	// 	return count;
	// })(),'[class*=e]');
	
	it_should_find(1,'[lang|=tr]');
	it_should_find(324,'[class][class!=made_up]');
	it_should_find(43,'[class~=example]');
	
});
