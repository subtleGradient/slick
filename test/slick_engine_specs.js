
for (var name in contexts) {
	
	global.context = contexts[name];
	Describe('Slick Selector Engine ' + name, SlickSelectorEngineSpecs);

}
function SlickSelectorEngineSpecs(specs,context){

Describe('Bugs',function(specs){
	
	specs.before_each = function(){
		testNode = context.document.createElement('div');
		context.document.body.appendChild(testNode);
	};
	specs.after_each = function(){
		testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
		testNode = null;
	};
	
	it['should not return not-nodes'] = function(){
		var results = context.document.search('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_be_undefined();
		}
	};
	
	it['should not return close nodes'] = function(){
		var results = context.document.search('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^\//);
		}
	};
	
	if (context.document.querySelectorAll)
	it['should not return closed nodes with QSA'] = function(){
		testNode.innerHTML = 'foo</foo>';
		var results = context.Slick(testNode,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
	};
	
	it['should not return closed nodes without QSA'] = function(){
		context.Slick.disableQSA = true;
		testNode.innerHTML = 'foo</foo>';
		var results = context.Slick(testNode,'*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_match(/^\w+$/);
		}
		context.Slick.disableQSA = false;
	};
	
	// it['should not return closed nodes2'] = function(){
	// 	testNode.innerHTML = '<foo>foo</foo> <bar>bar</bar> <baz>baz</baz>';
	// 	
	// 	var results = context.Slick(testNode, '*');
	// 	value_of( results.length ).should_be(3);
	// };
	
	it['should not return comment nodes'] = function(){
		var results = context.document.search('*');
		
		for (var i=0; i < results.length; i++) {
			value_of( results[i].nodeName ).should_not_match(/^#/);
		}
	};
	
	it['should return an element with the second class defined to it'] = function(){
    	testNode.innerHTML = '<span class="class1 class2"></span>';
    	var results = context.Slick(testNode, '.class2');
    	value_of( results.length ).should_be(1);
	};
	
	it['should return the elements with passed class'] = function(){
    	testNode.innerHTML = '<span class="f"></span><span class="b"></span>';
    	var results = context.Slick(testNode, '.b');
    	value_of( results.length ).should_be(1);
    	testNode.firstChild.className = 'b';
    	var results = context.Slick(testNode, '.b');
    	value_of( results.length ).should_be(2);
	};

	it['should return the element with passed id even if the context is not in the DOM'] = function(){
    	var div = document.createElement('div');
    	div.innerHTML = '<input id="someuniqueid" type="text" />';
    	var results = context.Slick(div, '#someuniqueid');
    	value_of( results.length ).should_be(1);
    	value_of( results[0].tagName ).should_be('INPUT');
        value_of( results[0].type ).should_be('text');
	};
	
	it['should not return an element without the id equals to the passed id'] = function(){
    	testNode.innerHTML = '<input name="f" type="text" /><input id="f" name="e" type="password" />';
    	var results = context.Slick(context.document ,'#f');
    	value_of( results.length ).should_be( 1 );
    	value_of( results[0].type ).should_be('password');
	};
	
});


Describe('Selecting Template Mock',function(specs){
	
	it['should append results to an existing array if passed in'] = function(){
		var append = [];
		value_of( context.Slick(document, '*', append) ).should_be( append );
	};
	
	it['should append results to an existing array-like-thing if passed in'] = function(){
		var append = {
			length: 0,
			push: function(item){
				this[this.length++] = item;
			}
		};
		value_of( context.Slick(document, '*', append) ).should_be( append );
	};
	
	if (document.querySelectorAll)
	it['should not fail when using QSA is enabled'] = function(){
		value_of( context.document.search('body').length ).should_be( 1 );
	};
	
	function makeSlickTestSearch(selector, count, disableQSA) {
		// if (document.querySelectorAll)
		// return new Function(" var count; try{ count = document.querySelectorAll('"+String.escapeSingle(selector)+"').length; console.log('"+String.escapeSingle(selector)+"', count); }catch(e){ \ncount="+count+" }; value_of( context.Slick(document, '"+String.escapeSingle(selector)+"').length ).should_be( count );");
		return new Function("\
			context.Slick.disableQSA = "+!!disableQSA+";\n\
			value_of( context.document.search('"+String.escapeSingle(selector)+"').length ).should_be( "+count+" );\n\
			delete context.Slick.disableQSA;\
		");
	}
	function it_should_find(count,selector){
		if (global.document.querySelectorAll)
			specs['should find '+count+' `'+selector+'` with    QSA' ] = makeSlickTestSearch(selector, count, false);
		specs['should find '+count+' `'+selector+'` without QSA' ] = makeSlickTestSearch(selector, count, true);
	};
	
	it_should_find(1, 'html');
	it_should_find(1, 'body');
	
	it_should_find(1825, '*:not([href^=tel:])');
	it_should_find(1814, 'body *:not([href^=tel:])');
	
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
	
/*
	it["should count '.a1 !  *'"] = function(){
		
		var result = {};
		
		var ancestors = [];
		var ancestors_length = 0;
		var things = context.document.search('.a1');
		var dad;
		for (var i=0; i < things.length; i++) {
			dad = things[i];
			while ((dad = dad.parentNode) && dad != context.document) ancestors.push(dad);
		}
		
		// 
		var dupes = [];
		var uniques = [];
		var results = ancestors;
		var dupe = false;
		
		for (var i=0; i < results.length; i++) {
			for (var u=0; u < uniques.length; u++) {
				if (results[i] == uniques[u]){
					dupe = true;
					break;
				}
			}
			
			if (dupe)
				dupes.push(results[i]);
			else
				uniques.push(results[i]);
			
			dupe = false;
		}
		
		value_of( uniques.length ).should_be( 7 );
		// value_of( dupes.length ).should_be( 0 );
		// 
	};
*/
	
	it_should_find(6, '.a1 !  *');
	it_should_find(4, '.a1 !> *');
	it_should_find(2, '.a4 !+ *');
	it_should_find(4, '.a4 !~ *');
	
	it_should_find(4, '.a4');
	it_should_find(2, '.a4   .a4');
	it_should_find(2, '.a4 > .a4');
	it_should_find(0, '.a4 + .a4');
	
	
	it_should_find(324  , 'body [class]:not([href^=tel:])');
	it_should_find(13   , 'body [title]:not([href^=tel:])');
	it_should_find(1490 , 'body :not([class]):not([href^=tel:])');
	it_should_find(1801 , 'body :not([title]):not([href^=tel:])');
	;
	it_should_find(59  , 'body div');
	it['should not return duplicates for "* *"'] = function(){
		context.Slick.disableQSA = true;
		
		var dupes = [];
		var uniques = [];
		var results = context.document.search('* *');
		var dupe = false;
		
		var dupe_uids = [];
		
		for (var i=0; i < results.length; i++) {
			for (var u=0; u < uniques.length; u++) {
				if (results[i] == uniques[u]){
					dupe = true;
					break;
				}
			}
			
			if (dupe) {
				dupes.push(results[i]);
			}
			else
				uniques.push(results[i]);
			
			dupe = false;
		}
		value_of( dupes.length ).should_be( 0 );
		
		context.Slick.disableQSA = false;
	};
	it['should not return duplicates for "* *[class]"'] = function(){
		context.Slick.disableQSA = true;
		// console.log('should not return duplicates for "* *[class]"');
		// window['should not return duplicates for "* *[class]"'] = true;
		var dupes = [];
		var uniques = [];
		var results = context.document.search('* *[class]');
		var dupe = false;
		
		var dupe_uids = [];
		
		for (var i=0; i < results.length; i++) {
			for (var u=0; u < uniques.length; u++) {
				if (results[i] == uniques[u]){
					dupe = true;
					break;
				}
			}
			
			if (dupe) {
				dupes.push(results[i]);
			}
			else
				uniques.push(results[i]);
			
			dupe = false;
		}
		// value_of( dupes.length ).should_be( 0 );
		// window['should not return duplicates for "* *[class]"'] = false;
		// console.log('/should not return duplicates for "* *[class]"');
		
		context.Slick.disableQSA = false;
	};
/*
	it['should not return duplicates for "* *" manually'] = function(){
		context.Slick.disableQSA = true;
		
		var dupes = [];
		var uniques = [];
		var results0 = context.document.getElementsByTagName('*');
		var results = [];
		for (var i=0; i < results0.length; i++) {
			results.concat( Array.prototype.slice.call(results0[i].getElementsByTagName('*')) );
		}
		var dupe = false;
		
		var dupe_uids = [];
		
		for (var i=0; i < results.length; i++) {
			for (var u=0; u < uniques.length; u++) {
				if (results[i] == uniques[u]){
					dupe = true;
					break;
				}
			}
			
			if (dupe) {
				dupes.push(results[i]);
			}
			else
				uniques.push(results[i]);
			
			dupe = false;
		}
		value_of( dupes.length ).should_be( 0 );
		
		context.Slick.disableQSA = false;
	};
*/
	it['should not return duplicates for "div p"'] = function(){
		context.Slick.disableQSA = true;
		
		var dupes = [];
		var uniques = [];
		var results = context.document.search('div p');
		var dupe = false;
		
		for (var i=0; i < results.length; i++) {
			for (var u=0; u < uniques.length; u++) {
				if (results[i] == uniques[u]){
					dupe = true;
					break;
				}
			}
			
			if (dupe)
				dupes.push(results[i]);
			else
				uniques.push(results[i]);
			
			dupe = false;
		}
		
		value_of( dupes.length ).should_be( 0 );
		value_of( uniques.length ).should_be( 140 );
		
		context.Slick.disableQSA = false;
	};
	it_should_find(140 , 'div p');
	it_should_find(140 , 'div  p');
	
	it_should_find(134 , 'div > p');
	it_should_find(22  , 'div + p');
	it_should_find(183 , 'div ~ p');
	it_should_find(0   , 'div & p');
	;
	it_should_find(43  , 'div[class^=exa][class$=mple]');
	it_should_find(12  , 'div p a:not([href^=tel:])');
	it_should_find(683 , 'div,p,a:not([href^=tel:])');
	;
	it_should_find(43 , 'DIV.example');
	it_should_find(43 , 'DiV.example');
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
	it_should_find(158, 'p:nth-child(even)');
	it_should_find(158, 'p:nth-child(2n)');
	it_should_find(166, 'p:nth-child(odd)');
	it_should_find(166, 'p:nth-child(2n+1)');
	it_should_find(324, 'p:nth-child(n)');
	it_should_find(3,   'p:only-child');
	it_should_find(19,  'p:last-child');
	it_should_find(54,  'p:first-child');
	
	// specs['":contains()" elements should actually contain the word'] = function(){
	// 	var els = context.document.search(':contains(selectors)');
	// 	for (var i=0,el; el=els[i]; i++) value_of( el.innerHTML ).should_match( 'selectors' );
	// 	
	// 	els = context.document.search(':contains(Selectors)');
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

Describe('Exhaustive',function(specs){
	
	var CLASSES = "normal escaped\\,character ǝpoɔıun 瀡 with-dash with_underscore 123number MiXeDcAsE".split(' ');
	Describe('CLASS',function(specs){
		
		specs.before_each = function(){
			testNodeOrphaned = context.document.createElement('div');
			testNode = context.document.createElement('div');
			context.document.body.appendChild(testNode);
		};
		specs.after_each = function(){
			testNode && testNode.parentNode && testNode.parentNode.removeChild(testNode);
			testNode = null;
			testNodeOrphaned = null;
		};
		
		var it_should_select_classes = function(CLASSES){
			
			var testName = 'Should select "'+ CLASSES.join(' ') +'"';
			var className = CLASSES.join(' ');
			if (className.indexOf('\\')+1) className += ' ' + CLASSES.join(' ').replace('\\','');
			
			it[testName + ' from the document root'] = function(){
				testNode.innerHTML = '<div></div><div class="'+ className +'"><div></div></div><div></div>';
				result = context.Slick(testNode.ownerDocument, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( result[0].className ).should_match( CLASSES.join(' ') );
			};
			
			it[testName + ' from the parent'] = function(){
				testNode.innerHTML = '<div></div><div class="'+ className +'"><div></div></div><div></div>';
				var result = context.Slick(testNode, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( result[0].className ).should_match( CLASSES.join(' ') );
			};
			
			it[testName + ' orphaned'] = function(){
				testNodeOrphaned.innerHTML = '<div></div><div class="'+ className +'"><div></div></div><div></div>';
				result = context.Slick(testNodeOrphaned, '.' + CLASSES.join('.'));
				value_of( result.length ).should_be( 1 );
				value_of( result[0].className ).should_match( CLASSES.join(' ') );
			};
			
			// it should match this class as a second class
			if (CLASSES.length == 1) it_should_select_classes(['foo',CLASSES[0]]);
		};
		
		it_should_select_classes(CLASSES);
		for (var i=0; i < CLASSES.length; i++)
			it_should_select_classes([CLASSES[i]]);
		
	});
	
});

};

runSpecs();
