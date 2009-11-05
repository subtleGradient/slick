function specsGoogleClosure(specs,context){
	
	function makeSlickTestSearch(selector, count, disableQSA) {
		return function(){
			context.Slick.disableQSA = !!disableQSA;
			value_of( context.Slick(context.document, selector).length ).should_be( count );
			delete context.Slick.disableQSA;
		};
	}
	function setup_it_should_find(specs){
		return function it_should_find(count,selector){
			if (global.document.querySelectorAll)
				specs['should find '+count+' `'+selector+'` with    QSA' ] = makeSlickTestSearch(selector, count, false);
			specs['should find '+count+' `'+selector+'` without QSA' ] = makeSlickTestSearch(selector, count, true);
		};
	};
	
	Describe('testBasicSelectors',function(specs){
		var it_should_find = setup_it_should_find(specs);
		it_should_find(4, 'h3');
		it_should_find(1, 'h1:first-child');
		it_should_find(2, 'h3:first-child');
		it_should_find(1, '#t');
		it_should_find(1, '#bug');
		it_should_find(4, '#t h3');
		it_should_find(1, 'div#t');
		it_should_find(4, 'div#t h3');
		it_should_find(0, 'span#t');
		it_should_find(1, '#t div > h3');
		it_should_find(2, '.foo');
		it_should_find(1, '.foo.bar');
		it_should_find(2, '.baz');
		it_should_find(3, '#t > h3');
	});
	
	Describe('testSyntacticEquivalents',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// syntactic equivalents
		it_should_find(12, '#t > *');
		it_should_find(12, '#t >');
		it_should_find(3, '.foo > *');
		it_should_find(3, '.foo >');
	});
	
	Describe('testWithARootById',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// with a root, by ID
		it_should_find(3, '> *', 'container');
		it_should_find(3, '> h3', 't');
	});
	
	Describe('testCompoundQueries',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// compound queries
		it_should_find(2, '.foo, .bar');
		it_should_find(2, '.foo,.bar');
	});
	
	Describe('testMultipleClassAttributes',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// multiple class attribute
		it_should_find(1, '.foo.bar');
		it_should_find(2, '.foo');
		it_should_find(2, '.baz');
	});
	
	Describe('testCaseSensitivity',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// case sensitivity
		it_should_find(1, 'span.baz');
		it_should_find(1, 'sPaN.baz');
		it_should_find(1, 'SPAN.baz');
		it_should_find(1, '[class = \"foo bar\"]');
		it_should_find(2, '[foo~=\"bar\"]');
		it_should_find(2, '[ foo ~= \"bar\" ]');
	});
	
	Describe('testAttributes',function(specs){
		var it_should_find = setup_it_should_find(specs);
		it_should_find(3, '[foo]');
		it_should_find(1, '[foo$=\"thud\"]');
		it_should_find(1, '[foo$=thud]');
		it_should_find(1, '[foo$=\"thudish\"]');
		it_should_find(1, '#t [foo$=thud]');
		it_should_find(1, '#t [ title $= thud ]');
		it_should_find(0, '#t span[ title $= thud ]');
		it_should_find(2, '[foo|=\"bar\"]');
		it_should_find(1, '[foo|=\"bar-baz\"]');
		it_should_find(0, '[foo|=\"baz\"]');
	});
	
	Describe('testDescendantSelectors',function(specs){
		var it_should_find = setup_it_should_find(specs);
		it_should_find(3, '>', 'container');
		it_should_find(3, '> *', 'container');
		it_should_find(2, '> [qux]', 'container');
		// assertEquals('child1', goog.dom.query('> [qux]', 'container')[0].id);
		// assertEquals('child3', goog.dom.query('> [qux]', 'container')[1].id);
		it_should_find(3, '>', 'container');
		it_should_find(3, '> *', 'container');
	});
	
	Describe('testSiblingSelectors',function(specs){
		var it_should_find = setup_it_should_find(specs);
		it_should_find(1, '+', 'container');
		it_should_find(3, '~', 'container');
		it_should_find(1, '.foo + span');
		it_should_find(4, '.foo ~ span');
		it_should_find(1, '#foo ~ *');
		it_should_find(1, '#foo ~');
	});
	
	Describe('testSubSelectors',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// sub-selector parsing
		it_should_find(1, '#t span.foo:not(span:first-child)');
		it_should_find(1, '#t span.foo:not(:first-child)');
	});
	
	Describe('testNthChild',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// assertEquals(goog.dom.$('_foo'), goog.dom.query('.foo:nth-child(2)')[0]);
		it_should_find(2, '#t > h3:nth-child(odd)');
		it_should_find(3, '#t h3:nth-child(odd)');
		it_should_find(3, '#t h3:nth-child(2n+1)');
		it_should_find(1, '#t h3:nth-child(even)');
		it_should_find(1, '#t h3:nth-child(2n)');
		it_should_find(1, '#t h3:nth-child(2n+3)');
		it_should_find(2, '#t h3:nth-child(1)');
		it_should_find(1, '#t > h3:nth-child(1)');
		it_should_find(3, '#t :nth-child(3)');
		it_should_find(0, '#t > div:nth-child(1)');
		it_should_find(7, '#t span');
		it_should_find(3, '#t > *:nth-child(n+10)');
		it_should_find(1, '#t > *:nth-child(n+12)');
		it_should_find(10, '#t > *:nth-child(-n+10)');
		it_should_find(5, '#t > *:nth-child(-2n+10)');
		it_should_find(6, '#t > *:nth-child(2n+2)');
		it_should_find(5, '#t > *:nth-child(2n+4)');
		it_should_find(5, '#t > *:nth-child(2n+4)');
		it_should_find(12, '#t > *:nth-child(n-5)');
		it_should_find(6, '#t > *:nth-child(2n-5)');
	});
	
	Describe('testEmptyPseudoSelector',function(specs){
		var it_should_find = setup_it_should_find(specs);
		it_should_find(4, '#t > span:empty');
		it_should_find(6, '#t span:empty');
		it_should_find(0, 'h3 span:empty');
		it_should_find(1, 'h3 :not(:empty)');
	});
	
	Describe('testIdsWithColons',function(specs){
		var it_should_find = setup_it_should_find(specs);
		it_should_find(1, "#silly\\:id\\:\\:with\\:colons");
	});
	
	Describe('testOrder',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// var els = goog.dom.query('.myupperclass .myclass input');
		// assertEquals('myid1', els[0].id);
		// assertEquals('myid2', els[1].id);
	});
	
	Describe('testCorrectDocumentInFrame',function(specs){
		var it_should_find = setup_it_should_find(specs);
		// var frameDocument = window.frames['ifr'].document;
		// frameDocument.body.innerHTML =
		// document.getElementById('iframe-test').innerHTML;
		
		// var els = goog.dom.query('#if1 .if2 div', document);
		// var frameEls = goog.dom.query('#if1 .if2 div', frameDocument);
		
		// assertEquals(els.length, frameEls.length);
		// assertEquals(1, frameEls.length);
		// assertNotEquals(document.getElementById('if3'),
		// frameDocument.getElementById('if3'));
	});
	
	
};
